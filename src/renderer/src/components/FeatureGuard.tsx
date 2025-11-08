/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Lock, Upgrade } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useFeatureLicensingStore } from '../store/featureLicensingStore'

interface TierInfo {
  name: string
  description: string
  color: string
  features: string[]
  limitations: string[]
  price?: string
}

interface FeatureGuardProps {
  featureId: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
  silent?: boolean // If true, don't show upgrade prompts
}

/**
 * FeatureGuard - Conditionally renders children based on feature licensing
 *
 * This component wraps content that should only be available for certain license tiers.
 * If the feature is not available, it can show an upgrade prompt or custom fallback.
 */
export default function FeatureGuard({
  featureId,
  children,
  fallback,
  showUpgrade = true,
  silent = false
}: FeatureGuardProps): React.JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [upgradeInfo, setUpgradeInfo] = useState<{
    requiredTier: string
    tierInfo: TierInfo
    benefits: string[]
  } | null>(null)
  
  const featureLicensing = useFeatureLicensingStore()

  useEffect(() => {
    const checkFeature = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const enabled = await featureLicensing.isFeatureEnabled(featureId)
        setIsEnabled(enabled)

        // If not enabled and we want to show upgrade info, get it
        if (!enabled && showUpgrade && !silent) {
          const suggestions = await featureLicensing.getUpgradeSuggestions(featureId)
          setUpgradeInfo(suggestions)
        }
      } catch (error) {
        console.error('Error checking feature in FeatureGuard:', error)
        setIsEnabled(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (featureLicensing.isInitialized) {
      checkFeature()
    }
  }, [featureId, featureLicensing, showUpgrade, silent])

  // Show loading state
  if (isLoading) {
    return <Box sx={{ opacity: 0.7 }}>{children}</Box>
  }

  // Feature is enabled, render children
  if (isEnabled) {
    return <>{children}</>
  }

  // Feature is disabled
  if (silent) {
    return <></>
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>
  }

  // Show upgrade prompt
  if (showUpgrade && upgradeInfo) {
    return (
      <Card
        sx={{
          border: '2px dashed',
          borderColor: 'warning.main',
          backgroundColor: 'warning.50',
          opacity: 0.8
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Lock sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Feature Requires Upgrade
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This feature requires the <strong>{upgradeInfo.requiredTier}</strong> plan.
          </Typography>

          {upgradeInfo.benefits.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Upgrade to get:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {upgradeInfo.benefits.slice(0, 3).join(', ')}
                {upgradeInfo.benefits.length > 3 &&
                  ` and ${upgradeInfo.benefits.length - 3} more features`}
              </Typography>
            </Box>
          )}

          <Button variant="contained" color="warning" startIcon={<Upgrade />} sx={{ mt: 1 }}>
            Upgrade to {upgradeInfo.tierInfo.name}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Default blocked state
  return (
    <Alert
      severity="warning"
      sx={{ '& .MuiAlert-message': { display: 'flex', alignItems: 'center', gap: 1 } }}
    >
      <Lock fontSize="small" />
      This feature requires a higher license tier.
    </Alert>
  )
}
