/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Help, Tour } from '@mui/icons-material'
import { Button, IconButton, Tooltip } from '@mui/material'
import { useLocation } from 'react-router-dom'

import tours from '../data/tours'
import useTour from '../hooks/useTour'

interface TourButtonProps {
  variant?: 'icon' | 'button'
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

function TourButton({
  variant = 'button',
  size = 'medium',
  showLabel = true
}: TourButtonProps): React.JSX.Element {
  const { startTour } = useTour()
  const location = useLocation()

  const getCurrentPageTour = (): keyof typeof tours | null => {
    const path = location.pathname
    switch (path) {
      case '/':
        return 'dashboard'
      case '/pos':
        return 'pos'
      case '/products':
        return 'products'
      case '/inventory':
        return 'inventory'
      case '/sales':
        return 'sales'
      case '/settings':
        return 'settings'
      case '/categories-units':
        return 'categoryUnit'
      case '/suppliers':
        return 'suppliers'
      case '/supplier-ledger':
        return 'supplierLedger'
      case '/purchases':
        return 'purchases'
      case '/returns':
        return 'returns'
      case '/customers':
        return 'customers'
      case '/bank-accounts':
        return 'bankAccounts'
      case '/reports':
        return 'reports'
      case '/users':
        return 'users'
      case '/audit-logs':
        return 'auditLogs'
      default:
        return null
    }
  }

  const currentPageTour = getCurrentPageTour()
  const hasTourForPage = currentPageTour !== null

  const handleTourStart = (): void => {
    if (currentPageTour) {
      startTour(currentPageTour)
    }
  }

  if (variant === 'icon') {
    return (
      <Tooltip title={hasTourForPage ? 'Tour This Page' : 'No tour available here'}>
        <span>
          <IconButton
            onClick={handleTourStart}
            size={size}
            sx={{ color: 'white' }}
            disabled={!hasTourForPage}
            data-tour="help-button"
          >
            <Help />
          </IconButton>
        </span>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={hasTourForPage ? 'Tour This Page' : 'No tour available here'}>
      <span>
        <Button
          variant="outlined"
          size={size}
          startIcon={<Tour />}
          onClick={handleTourStart}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
          disabled={!hasTourForPage}
          data-tour="help-button"
        >
          {showLabel && 'Tour This Page'}
        </Button>
      </span>
    </Tooltip>
  )
}

export default TourButton
