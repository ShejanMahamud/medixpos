/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { ipcMain } from 'electron'
import { FeatureLicensingService } from '../../services/featureLicensing'

/**
 * IPC handlers for feature licensing operations
 */

// Get licensing service instance
const featureLicensing = FeatureLicensingService.getInstance()

export function setupFeatureLicensingHandlers(): void {
  // Initialize the feature licensing service
  ipcMain.handle('feature-licensing:initialize', async () => {
    try {
      await featureLicensing.initialize()
      return { success: true }
    } catch (error) {
      console.error('Failed to initialize feature licensing:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Get current license tier
  ipcMain.handle('feature-licensing:get-tier', () => {
    try {
      return {
        success: true,
        tier: featureLicensing.getCurrentTier(),
        tierInfo: featureLicensing.getCurrentTierInfo()
      }
    } catch (error) {
      console.error('Failed to get license tier:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Check if a feature is enabled
  ipcMain.handle('feature-licensing:is-feature-enabled', (_event, featureId: string) => {
    try {
      return {
        success: true,
        enabled: featureLicensing.isFeatureEnabled(featureId)
      }
    } catch (error) {
      console.error('Failed to check feature enabled:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Check if a page is accessible
  ipcMain.handle('feature-licensing:can-access-page', (_event, route: string) => {
    try {
      return {
        success: true,
        accessible: featureLicensing.canAccessPage(route)
      }
    } catch (error) {
      console.error('Failed to check page access:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Check if a component can be rendered
  ipcMain.handle('feature-licensing:can-render-component', (_event, componentName: string) => {
    try {
      return {
        success: true,
        canRender: featureLicensing.canRenderComponent(componentName)
      }
    } catch (error) {
      console.error('Failed to check component render:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Get feature limitations
  ipcMain.handle('feature-licensing:get-feature-limitations', (_event, featureId: string) => {
    try {
      return {
        success: true,
        limitations: featureLicensing.getFeatureLimitations(featureId)
      }
    } catch (error) {
      console.error('Failed to get feature limitations:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Check feature limits
  ipcMain.handle(
    'feature-licensing:check-feature-limits',
    async (_event, featureId: string, currentUsage: number) => {
      try {
        const result = await featureLicensing.checkFeatureLimits(featureId, currentUsage)
        return {
          success: true,
          result
        }
      } catch (error) {
        console.error('Failed to check feature limits:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  )

  // Get available features
  ipcMain.handle('feature-licensing:get-available-features', () => {
    try {
      return {
        success: true,
        features: featureLicensing.getAvailableFeatures()
      }
    } catch (error) {
      console.error('Failed to get available features:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Get blocked features
  ipcMain.handle('feature-licensing:get-blocked-features', () => {
    try {
      return {
        success: true,
        features: featureLicensing.getBlockedFeatures()
      }
    } catch (error) {
      console.error('Failed to get blocked features:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Get upgrade suggestions
  ipcMain.handle('feature-licensing:get-upgrade-suggestions', (_event, featureId: string) => {
    try {
      return {
        success: true,
        suggestions: featureLicensing.getUpgradeSuggestions(featureId)
      }
    } catch (error) {
      console.error('Failed to get upgrade suggestions:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Validate page access
  ipcMain.handle('feature-licensing:validate-page-access', (_event, route: string) => {
    try {
      return {
        success: true,
        result: featureLicensing.validatePageAccess(route)
      }
    } catch (error) {
      console.error('Failed to validate page access:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Get license status
  ipcMain.handle('feature-licensing:get-license-status', () => {
    try {
      return {
        success: true,
        status: featureLicensing.getLicenseStatus()
      }
    } catch (error) {
      console.error('Failed to get license status:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Force refresh license
  ipcMain.handle('feature-licensing:force-refresh', async () => {
    try {
      await featureLicensing.forceRefresh()
      return { success: true }
    } catch (error) {
      console.error('Failed to force refresh license:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Refresh license status
  ipcMain.handle('feature-licensing:refresh-status', async () => {
    try {
      await featureLicensing.refreshLicenseStatus()
      return { success: true }
    } catch (error) {
      console.error('Failed to refresh license status:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })
}