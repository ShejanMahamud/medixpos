; Custom NSIS script for MedixPOS installer
; Simplified to avoid conflicts with electron-builder

!include "FileFunc.nsh"
!include "installer-macros.nsh"

; Custom installer attributes
BrandingText "MedixPOS Professional Pharmacy Management System"

; Show installation details
ShowInstDetails show
ShowUnInstDetails show


