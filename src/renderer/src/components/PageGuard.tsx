/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { ArrowBack, Lock, Upgrade } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageAccess } from '../hooks/useFeatureLicensing'

interface PageGuardProps {
  pageId: string
  children: React.ReactNode
  redirectTo?: string // Where to redirect if access denied
  showUpgrade?: boolean
  customErrorMessage?: string
}

/**
 * PageGuard - Protects entire pages/routes based on license tiers
 *
 * This component should wrap page components to enforce license-based access control.
 * It will redirect users or show upgrade prompts for premium features.
 */
export default function PageGuard({
  pageId,
  children,
  redirectTo = '/dashboard',
  showUpgrade = true,
  customErrorMessage
}: PageGuardProps): React.JSX.Element {
  const navigate = useNavigate()
  const { isLoading, hasAccess, shouldRedirect, upgradeInfo, currentTier } = usePageAccess(pageId)

  useEffect(() => {
    if (!isLoading && shouldRedirect && !showUpgrade) {
      // Redirect immediately if not showing upgrade prompt
      navigate(redirectTo, { replace: true })
    }
  }, [isLoading, shouldRedirect, showUpgrade, navigate, redirectTo])

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Verifying access permissions...
        </Typography>
      </Box>
    )
  }

  // User has access, render the page
  if (hasAccess) {
    return <>{children}</>
  }

  // Access denied - show upgrade prompt or error
  if (showUpgrade && upgradeInfo) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <Card
          sx={{
            maxWidth: 700,
            width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${upgradeInfo.tierInfo.color}15 0%, ${upgradeInfo.tierInfo.color}25 100%)`,
              py: 4,
              textAlign: 'center',
              borderBottom: `3px solid ${upgradeInfo.tierInfo.color}`
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `${upgradeInfo.tierInfo.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <Lock sx={{ fontSize: 40, color: upgradeInfo.tierInfo.color }} />
            </Box>

            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
              Premium Feature Required
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              {customErrorMessage ||
                `Unlock this feature by upgrading to the ${upgradeInfo.requiredTier} plan`}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your current plan
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'grey.100'
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {currentTier}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plan
                </Typography>
              </Box>
            </Box>

            {upgradeInfo.benefits.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <Upgrade sx={{ color: upgradeInfo.tierInfo.color }} />
                  Upgrade to {upgradeInfo.requiredTier} to unlock:
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                    p: 3,
                    bgcolor: `${upgradeInfo.tierInfo.color}08`,
                    borderRadius: 2,
                    border: `1px solid ${upgradeInfo.tierInfo.color}30`
                  }}
                >
                  {upgradeInfo.benefits.slice(0, 5).map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: upgradeInfo.tierInfo.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.25
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
                          ✓
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                  {upgradeInfo.benefits.length > 5 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                      + {upgradeInfo.benefits.length - 5} more features
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(redirectTo)}
                sx={{
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    bgcolor: 'grey.50'
                  }
                }}
              >
                Go Back
              </Button>

              <Button
                variant="contained"
                startIcon={<Upgrade />}
                size="large"
                onClick={() => {
                  // TODO: Implement upgrade flow
                  console.log('Navigate to upgrade page')
                }}
                sx={{
                  bgcolor: upgradeInfo.tierInfo.color,
                  px: 4,
                  '&:hover': {
                    bgcolor: upgradeInfo.tierInfo.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Upgrade to {upgradeInfo.tierInfo.name}
              </Button>
            </Box>

            {upgradeInfo.tierInfo.price && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', mt: 2 }}
              >
                Starting at {upgradeInfo.tierInfo.price}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    )
  }

  // Fallback error without upgrade prompt
  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Alert
        severity="error"
        sx={{
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center'
          }
        }}
      >
        <Lock sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body2" paragraph>
          {customErrorMessage ||
            'You do not have permission to access this page. Please contact support or upgrade your plan.'}
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(redirectTo)}
          sx={{ mt: 2 }}
        >
          Return to Dashboard
        </Button>
      </Alert>
    </Box>
  )
}
