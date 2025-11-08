/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useEffect, useState } from 'react'
import { useFeatureLicensingStore } from '../store/featureLicensingStore'

interface TierInfo {
  name: string
  description: string
  color: string
  features: string[]
  limitations: string[]
  price?: string
}

interface FeatureConfig {
  id: string
  name: string
  description: string
  category: string
  requiredTier: string
  isCore?: boolean
  limitations?: Record<string, unknown>
}

interface UpgradeInfo {
  requiredTier: string
  tierInfo: {
    name: string
    description: string
    color: string
    features: string[]
    limitations: string[]
    price?: string
  }
  benefits: string[]
}

interface FeatureAccessResult {
  isLoading: boolean
  isEnabled: boolean
  error: string | null
  currentTier: string
  refresh: () => Promise<void>
}

interface PageAccessResult {
  isLoading: boolean
  hasAccess: boolean
  shouldRedirect: boolean
  upgradeInfo: UpgradeInfo | null
  currentTier: string
}

interface LicenseInfoResult {
  currentTier: string
  tierInfo: TierInfo | null
  isInitialized: boolean
  availableFeatures: FeatureConfig[]
  limitations: string[]
  refresh: () => Promise<void>
}

interface MultipleFeatureAccessResult {
  isLoading: boolean
  features: Record<string, boolean>
  hasAny: boolean
  hasAll: boolean
  currentTier: string
}

/**
 * Hook to check if a specific feature is enabled for the current license
 * @param featureId - The feature ID to check (e.g., 'users.multiUser', 'reports.advanced')
 * @returns Object with loading state, enabled status, and license info
 */
export function useFeatureAccess(featureId: string): FeatureAccessResult {
  const [isLoading, setIsLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const store = useFeatureLicensingStore()

  useEffect(() => {
    const checkAccess = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        const enabled = await store.isFeatureEnabled(featureId)
        setIsEnabled(enabled)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Feature check failed')
        setIsEnabled(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (store.isInitialized) {
      checkAccess()
    }
  }, [featureId, store])

  return {
    isLoading,
    isEnabled,
    error,
    currentTier: store.currentTier,
    refresh: () => store.refreshLicenseStatus()
  }
}

/**
 * Hook to check if the current user can access a specific page
 * @param pageId - The page identifier (e.g., 'users', 'reports', 'settings')
 * @returns Object with access status and redirect info
 */
export function usePageAccess(pageId: string): PageAccessResult {
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo | null>(null)

  const store = useFeatureLicensingStore()

  useEffect(() => {
    const checkPageAccess = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const result = await store.validatePageAccess(pageId)
        const allowed = result.allowed ?? false
        setHasAccess(allowed)
        setShouldRedirect(!allowed)
        setUpgradeInfo((result.upgradeInfo || null) as UpgradeInfo | null)
      } catch (err) {
        console.error(`Page access check failed for ${pageId}:`, err)
        setHasAccess(false)
        setShouldRedirect(true)
        setUpgradeInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (store.isInitialized) {
      checkPageAccess()
    }
  }, [pageId, store])

  return {
    isLoading,
    hasAccess,
    shouldRedirect,
    upgradeInfo,
    currentTier: store.currentTier
  }
}

/**
 * Hook to get all available features for the current license tier
 * @returns Object with available features, limitations, and tier info
 */
export function useLicenseInfo(): LicenseInfoResult {
  const store = useFeatureLicensingStore()
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null)

  useEffect(() => {
    const loadTierInfo = async (): Promise<void> => {
      if (store.isInitialized && store.currentTier) {
        try {
          // Use the current tier info from store
          setTierInfo(store.tierInfo)
        } catch (err) {
          console.error('Failed to load tier info:', err)
        }
      }
    }

    loadTierInfo()
  }, [store.currentTier, store.isInitialized, store.tierInfo])

  return {
    currentTier: store.currentTier,
    tierInfo,
    isInitialized: store.isInitialized,
    availableFeatures: store.availableFeatures,
    limitations: tierInfo?.limitations || [],
    refresh: () => store.refreshLicenseStatus()
  }
}

/**
 * Hook to check multiple features at once
 * @param featureIds - Array of feature IDs to check
 * @returns Object with feature access map and loading state
 */
export function useMultipleFeatureAccess(featureIds: string[]): MultipleFeatureAccessResult {
  const [isLoading, setIsLoading] = useState(true)
  const [features, setFeatures] = useState<Record<string, boolean>>({})

  const store = useFeatureLicensingStore()
  const featureIdString = featureIds.join(',')

  useEffect(() => {
    const checkMultipleFeatures = async (): Promise<void> => {
      try {
        setIsLoading(true)

        const results: Record<string, boolean> = {}

        // Check all features in parallel
        await Promise.all(
          featureIds.map(async (featureId) => {
            try {
              results[featureId] = await store.isFeatureEnabled(featureId)
            } catch {
              results[featureId] = false
            }
          })
        )

        setFeatures(results)
      } catch (err) {
        console.error('Multi-feature check failed:', err)
        // Set all to false on error
        const fallback = featureIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
        setFeatures(fallback)
      } finally {
        setIsLoading(false)
      }
    }

    if (store.isInitialized && featureIds.length > 0) {
      checkMultipleFeatures()
    }
  }, [featureIdString, featureIds, store])

  return {
    isLoading,
    features,
    hasAny: Object.values(features).some(Boolean),
    hasAll: Object.values(features).every(Boolean),
    currentTier: store.currentTier
  }
}
