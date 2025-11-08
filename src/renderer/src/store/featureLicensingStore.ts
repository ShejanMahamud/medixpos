/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type LicenseTier = 'TRIAL' | 'LITE' | 'BASIC' | 'PRO'

interface FeatureConfig {
  id: string
  name: string
  description: string
  category: string
  requiredTier: LicenseTier
  isCore?: boolean
  limitations?: Record<string, unknown>
}

interface TierInfo {
  name: string
  description: string
  color: string
  features: string[]
  limitations: string[]
  price?: string
}

interface LicenseStatus {
  isActive: boolean
  tier: LicenseTier
  tierInfo: TierInfo
  expiresAt?: string
  daysRemaining?: number
}

interface FeatureLicensingState {
  // State
  isInitialized: boolean
  isLoading: boolean
  currentTier: LicenseTier
  tierInfo: TierInfo | null
  licenseStatus: LicenseStatus | null
  availableFeatures: FeatureConfig[]
  blockedFeatures: FeatureConfig[]
  error: string | null

  // Cache for performance
  featureCache: Record<string, boolean>
  pageCache: Record<string, boolean>
  componentCache: Record<string, boolean>

  // Actions
  initialize: () => Promise<void>
  refreshLicenseStatus: () => Promise<void>
  isFeatureEnabled: (featureId: string) => Promise<boolean>
  canAccessPage: (route: string) => Promise<boolean>
  canRenderComponent: (componentName: string) => Promise<boolean>
  getFeatureLimitations: (featureId: string) => Promise<Record<string, unknown> | undefined>
  checkFeatureLimits: (
    featureId: string,
    currentUsage: number
  ) => Promise<{
    withinLimits: boolean
    limit?: number
    usage: number
    message?: string
  }>
  getUpgradeSuggestions: (featureId: string) => Promise<{
    requiredTier: LicenseTier
    tierInfo: TierInfo
    benefits: string[]
  } | null>
  validatePageAccess: (route: string) => Promise<{
    allowed: boolean
    redirectTo?: string
    message?: string
    upgradeInfo?: {
      requiredTier: LicenseTier
      tierInfo: TierInfo
      benefits: string[]
    }
  }>
  clearCache: () => void
  setError: (error: string | null) => void
}

export const useFeatureLicensingStore = create<FeatureLicensingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      isLoading: false,
      currentTier: 'TRIAL',
      tierInfo: null,
      licenseStatus: null,
      availableFeatures: [],
      blockedFeatures: [],
      error: null,
      featureCache: {},
      pageCache: {},
      componentCache: {},

      // Initialize the feature licensing system
      initialize: async () => {
        const state = get()
        if (state.isInitialized) return

        set({ isLoading: true, error: null })

        try {
          // Initialize the backend service
          const initResult = await window.api.featureLicensing.initialize()
          if (!initResult.success) {
            throw new Error(initResult.error || 'Failed to initialize feature licensing')
          }

          // Get initial license status
          const statusResult = await window.api.featureLicensing.getLicenseStatus()
          if (!statusResult.success) {
            throw new Error(statusResult.error || 'Failed to get license status')
          }

          const status = statusResult.status
          if (!status) {
            throw new Error('Invalid license status response')
          }

          // Get tier info
          const tierResult = await window.api.featureLicensing.getTier()
          if (!tierResult.success) {
            throw new Error(tierResult.error || 'Failed to get tier info')
          }

          // Get available and blocked features
          const [availableResult, blockedResult] = await Promise.all([
            window.api.featureLicensing.getAvailableFeatures(),
            window.api.featureLicensing.getBlockedFeatures()
          ])

          if (!availableResult.success) {
            throw new Error(availableResult.error || 'Failed to get available features')
          }
          if (!blockedResult.success) {
            throw new Error(blockedResult.error || 'Failed to get blocked features')
          }

          set({
            isInitialized: true,
            isLoading: false,
            currentTier: status.tier as LicenseTier,
            tierInfo: status.tierInfo,
            licenseStatus: status as LicenseStatus,
            availableFeatures: (availableResult.features || []) as FeatureConfig[],
            blockedFeatures: (blockedResult.features || []) as FeatureConfig[],
            featureCache: {},
            pageCache: {},
            componentCache: {}
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      // Refresh license status
      refreshLicenseStatus: async () => {
        set({ isLoading: true, error: null })

        try {
          await window.api.featureLicensing.refreshStatus()

          const statusResult = await window.api.featureLicensing.getLicenseStatus()
          if (!statusResult.success) {
            throw new Error(statusResult.error || 'Failed to get license status')
          }

          const status = statusResult.status
          if (!status) {
            throw new Error('Invalid license status response')
          }

          // Get updated features
          const [availableResult, blockedResult] = await Promise.all([
            window.api.featureLicensing.getAvailableFeatures(),
            window.api.featureLicensing.getBlockedFeatures()
          ])

          if (!availableResult.success) {
            throw new Error(availableResult.error || 'Failed to get available features')
          }
          if (!blockedResult.success) {
            throw new Error(blockedResult.error || 'Failed to get blocked features')
          }

          set({
            isLoading: false,
            currentTier: status.tier as LicenseTier,
            tierInfo: status.tierInfo,
            licenseStatus: status as LicenseStatus,
            availableFeatures: (availableResult.features || []) as FeatureConfig[],
            blockedFeatures: (blockedResult.features || []) as FeatureConfig[],
            featureCache: {}, // Clear cache on refresh
            pageCache: {},
            componentCache: {}
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      // Check if a feature is enabled (with caching)
      isFeatureEnabled: async (featureId: string) => {
        const state = get()
        if (featureId in state.featureCache) {
          return state.featureCache[featureId]
        }

        try {
          const result = await window.api.featureLicensing.isFeatureEnabled(featureId)
          if (!result.success) {
            throw new Error(result.error || 'Failed to check feature')
          }

          const enabled = result.enabled || false
          set((state) => ({
            featureCache: { ...state.featureCache, [featureId]: enabled }
          }))

          return enabled
        } catch (error) {
          console.error('Error checking feature enabled:', error)
          return false
        }
      },

      // Check if a page can be accessed (with caching)
      canAccessPage: async (route: string) => {
        const state = get()
        if (route in state.pageCache) {
          return state.pageCache[route]
        }

        try {
          const result = await window.api.featureLicensing.canAccessPage(route)
          if (!result.success) {
            throw new Error(result.error || 'Failed to check page access')
          }

          const accessible = result.accessible || false
          set((state) => ({
            pageCache: { ...state.pageCache, [route]: accessible }
          }))

          return accessible
        } catch (error) {
          console.error('Error checking page access:', error)
          return false
        }
      },

      // Check if a component can be rendered (with caching)
      canRenderComponent: async (componentName: string) => {
        const state = get()
        if (componentName in state.componentCache) {
          return state.componentCache[componentName]
        }

        try {
          const result = await window.api.featureLicensing.canRenderComponent(componentName)
          if (!result.success) {
            throw new Error(result.error || 'Failed to check component render')
          }

          const canRender = result.canRender || false
          set((state) => ({
            componentCache: { ...state.componentCache, [componentName]: canRender }
          }))

          return canRender
        } catch (error) {
          console.error('Error checking component render:', error)
          return true // Default to allowing render on error
        }
      },

      // Get feature limitations
      getFeatureLimitations: async (featureId: string) => {
        try {
          const result = await window.api.featureLicensing.getFeatureLimitations(featureId)
          if (!result.success) {
            throw new Error(result.error || 'Failed to get feature limitations')
          }

          return result.limitations
        } catch (error) {
          console.error('Error getting feature limitations:', error)
          return undefined
        }
      },

      // Check feature limits
      checkFeatureLimits: async (featureId: string, currentUsage: number) => {
        try {
          const result = await window.api.featureLicensing.checkFeatureLimits(
            featureId,
            currentUsage
          )
          if (!result.success) {
            throw new Error(result.error || 'Failed to check feature limits')
          }

          return (
            result.result || {
              withinLimits: true,
              usage: currentUsage
            }
          )
        } catch (error) {
          console.error('Error checking feature limits:', error)
          return {
            withinLimits: true,
            usage: currentUsage
          }
        }
      },

      // Get upgrade suggestions
      getUpgradeSuggestions: async (featureId: string) => {
        try {
          const result = await window.api.featureLicensing.getUpgradeSuggestions(featureId)
          if (!result.success) {
            throw new Error(result.error || 'Failed to get upgrade suggestions')
          }

          return result.suggestions || null
        } catch (error) {
          console.error('Error getting upgrade suggestions:', error)
          return null
        }
      },

      // Validate page access with detailed info
      validatePageAccess: async (route: string) => {
        try {
          const result = await window.api.featureLicensing.validatePageAccess(route)
          if (!result.success) {
            throw new Error(result.error || 'Failed to validate page access')
          }

          return (
            result.result || {
              allowed: true
            }
          )
        } catch (error) {
          console.error('Error validating page access:', error)
          return {
            allowed: true
          }
        }
      },

      // Clear all caches
      clearCache: () => {
        set({
          featureCache: {},
          pageCache: {},
          componentCache: {}
        })
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'feature-licensing-store'
    }
  )
)

// Helper hooks for common operations
export const useFeatureEnabled = (featureId: string): { enabled: boolean; loading: boolean } => {
  const store = useFeatureLicensingStore()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFeature = async (): Promise<void> => {
      try {
        setLoading(true)
        const result = await store.isFeatureEnabled(featureId)
        setEnabled(result)
      } catch (error) {
        console.error('Error checking feature:', error)
        setEnabled(false)
      } finally {
        setLoading(false)
      }
    }

    checkFeature()
  }, [featureId, store])

  return { enabled, loading }
}

export const usePageAccess = (route: string): { canAccess: boolean; loading: boolean } => {
  const store = useFeatureLicensingStore()
  const [canAccess, setCanAccess] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async (): Promise<void> => {
      try {
        setLoading(true)
        const result = await store.canAccessPage(route)
        setCanAccess(result)
      } catch (error) {
        console.error('Error checking page access:', error)
        setCanAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [route, store])

  return { canAccess, loading }
}
