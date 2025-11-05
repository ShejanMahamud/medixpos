/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { ipcMain } from 'electron'
import { initDatabase } from '../../database'
import { LicenseService } from '../../services/license'
import { registerDatabaseHandlers } from '../database-handlers'

export function registerLicenseHandlers(): void {
  const licenseService = LicenseService.getInstance()

  // Validate license
  ipcMain.handle('license:validate', async (_, licenseKey?: string, activationId?: string) => {
    try {
      const result = await licenseService.validateLicense(licenseKey, activationId)

      // If validation successful and database not initialized yet, initialize it now
      if (result.valid) {
        try {
          console.log('License validated successfully. Initializing backend...')
          await initDatabase()
          registerDatabaseHandlers()
          console.log('Backend initialized successfully')
        } catch (dbError) {
          console.error('Failed to initialize backend after license validation:', dbError)
          // Backend initialization failed, but license is valid
          // The app can still show the UI but database operations will fail
        }
      }

      return result
    } catch (error) {
      console.error('Error validating license:', error)
      return {
        valid: false,
        status: 'invalid',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Activate license
  ipcMain.handle('license:activate', async (_, licenseKey: string, label?: string) => {
    try {
      return await licenseService.activateLicense(licenseKey, label)
    } catch (error) {
      console.error('Error activating license:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Deactivate license
  ipcMain.handle('license:deactivate', async () => {
    try {
      return await licenseService.deactivateLicense()
    } catch (error) {
      console.error('Error deactivating license:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Get license info
  ipcMain.handle('license:getInfo', () => {
    try {
      return licenseService.getLicenseInfo()
    } catch (error) {
      console.error('Error getting license info:', error)
      return {
        isLicensed: false
      }
    }
  })

  // Check if needs revalidation
  ipcMain.handle('license:needsRevalidation', () => {
    try {
      return licenseService.needsRevalidation()
    } catch (error) {
      console.error('Error checking revalidation:', error)
      return true
    }
  })

  // Clear license
  ipcMain.handle('license:clear', () => {
    try {
      licenseService.clearLicense()
      return { success: true }
    } catch (error) {
      console.error('Error clearing license:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Get machine ID for display
  ipcMain.handle('license:getMachineId', async () => {
    try {
      return await licenseService.getMachineIdForDisplay()
    } catch (error) {
      console.error('Error getting machine ID:', error)
      return 'UNKNOWN'
    }
  })
}
