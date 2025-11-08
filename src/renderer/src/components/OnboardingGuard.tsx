/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Box, CircularProgress } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import OnboardingWizard from './OnboardingWizard'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps): React.JSX.Element {
  const [loading, setLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  // Check if onboarding is complete or skipped
  const checkOnboardingStatus = useCallback(async () => {
    try {
      const isComplete = useSettingsStore.getState().getSetting('onboarding_complete')
      const isSkipped = useSettingsStore.getState().getSetting('onboarding_skipped')

      if (isComplete === 'true' || isSkipped === 'true') {
        setNeedsOnboarding(false)
      } else {
        setNeedsOnboarding(true)
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
      // On error, assume onboarding is not needed to avoid blocking user
      setNeedsOnboarding(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkOnboardingStatus()
  }, [checkOnboardingStatus])

  const handleOnboardingComplete = (): void => {
    setNeedsOnboarding(false)
  }

  const handleOnboardingSkip = (): void => {
    setNeedsOnboarding(false)
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50'
        }}
      >
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (needsOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
  }

  return <>{children}</>
}
