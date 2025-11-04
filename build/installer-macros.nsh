; Additional NSIS macros for custom installer pages

!macro customHeader
!macroend

!macro preInit
!macroend

!macro customInit
  ; Check if older version is installed
  ReadRegStr $0 SHCTX "Software\MedixPOS" "InstallPath"
  ${If} $0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION "A previous version of MedixPOS is installed. Would you like to uninstall it first?" IDNO skipUninstall
      ; Uninstall previous version
      ExecWait '"$0\Uninstall MedixPOS.exe" /S'
    skipUninstall:
  ${EndIf}
!macroend

!macro customInstall
  ; Custom installation steps
  
  ; Create application data directory
  ; Note: Permissions are automatically set correctly for AppData folders
  CreateDirectory "$APPDATA\medixpos"
  CreateDirectory "$APPDATA\medixpos\database"
  CreateDirectory "$APPDATA\medixpos\logs"
  CreateDirectory "$APPDATA\medixpos\backups"
  
  ; Create Start Menu folder
  CreateDirectory "$SMPROGRAMS\MedixPOS"
  ; Create shortcuts with proper icon from the executable
  CreateShortCut "$SMPROGRAMS\MedixPOS\MedixPOS.lnk" "$INSTDIR\${PRODUCT_FILENAME}" "" "$INSTDIR\${PRODUCT_FILENAME}" 0 SW_SHOWNORMAL "" "MedixPOS - Professional Pharmacy Management System"
  CreateShortCut "$SMPROGRAMS\MedixPOS\Uninstall MedixPOS.lnk" "$INSTDIR\Uninstall MedixPOS.exe" "" "$INSTDIR\Uninstall MedixPOS.exe" 0 SW_SHOWNORMAL "" "Uninstall MedixPOS"
  
  ; Create desktop shortcut with explicit icon path
  ; Copy icon to installation directory for easier access
  ${If} ${FileExists} "$INSTDIR\resources\icon.ico"
    CopyFiles "$INSTDIR\resources\icon.ico" "$INSTDIR\icon.ico"
    ; Use explicit icon path
    CreateShortCut "$DESKTOP\MedixPOS.lnk" "$INSTDIR\${PRODUCT_FILENAME}" "" "$INSTDIR\icon.ico" 0 SW_SHOWNORMAL "" "MedixPOS - Professional Pharmacy Management System"
  ${ElseIf} ${FileExists} "$INSTDIR\icon.ico"
    ; Icon already in installation directory
    CreateShortCut "$DESKTOP\MedixPOS.lnk" "$INSTDIR\${PRODUCT_FILENAME}" "" "$INSTDIR\icon.ico" 0 SW_SHOWNORMAL "" "MedixPOS - Professional Pharmacy Management System"
  ${Else}
    ; Fallback to executable icon
    CreateShortCut "$DESKTOP\MedixPOS.lnk" "$INSTDIR\${PRODUCT_FILENAME}" "" "$INSTDIR\${PRODUCT_FILENAME}" 0 SW_SHOWNORMAL "" "MedixPOS - Professional Pharmacy Management System"
  ${EndIf}
  
  ; Write installation info
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD SHCTX "Software\Microsoft\Windows\CurrentVersion\Uninstall\MedixPOS" "EstimatedSize" "$0"
!macroend

!macro customInstallMode
  ; Custom install mode handling
  
  ; Set default installation mode
  StrCpy $isForceCurrentInstall "0"
  
  ; Check for command line parameters
  ${GetParameters} $0
  ${GetOptions} $0 "/CurrentUser" $1
  ${IfNot} ${Errors}
    StrCpy $isForceCurrentInstall "1"
  ${EndIf}
!macroend

!macro customUnInit
  ; Custom uninstaller initialization
  
  ; Check if app is running before uninstall
  System::Call 'kernel32::OpenMutex(i 0x100000, b 0, t "MedixPOS") i .R0'
  IntCmp $R0 0 notRunning
    System::Call 'kernel32::CloseHandle(i $R0)'
    MessageBox MB_OK|MB_ICONEXCLAMATION "MedixPOS is currently running. Please close it before uninstalling."
    Abort
  notRunning:
!macroend

!macro customUnInstall
  ; Custom uninstallation steps
  
  ; Remove registry entries
  DeleteRegKey SHCTX "Software\MedixPOS"
  DeleteRegKey SHCTX "Software\Microsoft\Windows\CurrentVersion\Uninstall\MedixPOS"
  
  ; Remove application paths
  DeleteRegKey SHCTX "Software\Microsoft\Windows\CurrentVersion\App Paths\${PRODUCT_FILENAME}"
  
  ; Remove Start Menu items
  Delete "$SMPROGRAMS\MedixPOS\MedixPOS.lnk"
  Delete "$SMPROGRAMS\MedixPOS\Uninstall MedixPOS.lnk"
  RMDir "$SMPROGRAMS\MedixPOS"
  
  ; Remove desktop shortcut
  Delete "$DESKTOP\MedixPOS.lnk"
  
  ; Remove copied icon file
  Delete "$INSTDIR\icon.ico"
!macroend

!macro customRemoveFiles
  ; Remove additional files
  RMDir /r "$INSTDIR\locales"
  RMDir /r "$INSTDIR\resources"
  Delete "$INSTDIR\*.dll"
  Delete "$INSTDIR\*.pak"
  Delete "$INSTDIR\*.bin"
  Delete "$INSTDIR\*.dat"
!macroend
