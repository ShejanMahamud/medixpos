/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import tours from '../data/tours'
import type { TourConfig } from '../services/tourService'
import { tourService } from '../services/tourService'

interface UseTourOptions {
  autoStart?: boolean
  storageKey?: string
}

interface UseTourReturn {
  startTour: (tourName: keyof typeof tours | TourConfig) => void
  stopTour: () => void
  hasActiveTour: boolean
  currentTour: string | null
  canStartTour: (tourName?: string) => boolean
}

export function useTour(options: UseTourOptions = {}): UseTourReturn {
  const { autoStart = false, storageKey = 'medixpos-tours-completed' } = options
  const location = useLocation()
  const mounted = useRef(true)

  // Check if a tour has been completed
  const isTourCompleted = useCallback(
    (tourName: string): boolean => {
      try {
        const completedTours = JSON.parse(localStorage.getItem(storageKey) || '[]')
        return completedTours.includes(tourName)
      } catch {
        return false
      }
    },
    [storageKey]
  )

  // Mark a tour as completed
  const markTourCompleted = useCallback(
    (tourName: string): void => {
      try {
        const completedTours = JSON.parse(localStorage.getItem(storageKey) || '[]')
        if (!completedTours.includes(tourName)) {
          completedTours.push(tourName)
          localStorage.setItem(storageKey, JSON.stringify(completedTours))
        }
      } catch {
        // Handle localStorage errors gracefully
      }
    },
    [storageKey]
  )

  // Start a tour by name or config
  const startTour = useCallback(
    (tourNameOrConfig: keyof typeof tours | TourConfig): void => {
      if (typeof tourNameOrConfig === 'string') {
        const tourConfig = tours[tourNameOrConfig]
        if (tourConfig) {
          tourService.startTour({
            ...tourConfig,
            onDestroyed: () => {
              markTourCompleted(tourConfig.name)
              tourConfig.onDestroyed?.()
            }
          })
        }
      } else {
        tourService.startTour({
          ...tourNameOrConfig,
          onDestroyed: () => {
            markTourCompleted(tourNameOrConfig.name)
            tourNameOrConfig.onDestroyed?.()
          }
        })
      }
    },
    [markTourCompleted]
  )

  // Stop the current tour
  const stopTour = useCallback((): void => {
    tourService.destroyTour()
  }, [])

  // Check if a tour can be started (not already completed)
  const canStartTour = useCallback(
    (tourName?: string): boolean => {
      if (!tourName) return true
      return !isTourCompleted(tourName)
    },
    [isTourCompleted]
  )

  // Auto-start tours based on route
  useEffect(() => {
    if (!autoStart || !mounted.current) return

    const path = location.pathname
    let tourName: keyof typeof tours | null = null

    // Map routes to tours
    switch (path) {
      case '/':
        tourName = 'dashboard'
        break
      case '/pos':
        tourName = 'pos'
        break
      case '/products':
        tourName = 'products'
        break
      case '/inventory':
        tourName = 'inventory'
        break
      case '/sales':
        tourName = 'sales'
        break
      case '/settings':
        tourName = 'settings'
        break
      case '/categories-units':
        tourName = 'categoryUnit'
        break
      case '/suppliers':
        tourName = 'suppliers'
        break
      case '/supplier-ledger':
        tourName = 'supplierLedger'
        break
      case '/purchases':
        tourName = 'purchases'
        break
      case '/returns':
        tourName = 'returns'
        break
      case '/customers':
        tourName = 'customers'
        break
      case '/bank-accounts':
        tourName = 'bankAccounts'
        break
      case '/reports':
        tourName = 'reports'
        break
      case '/users':
        tourName = 'users'
        break
      case '/audit-logs':
        tourName = 'auditLogs'
        break
    }

    // Start tour if it hasn't been completed
    if (tourName && canStartTour(tourName)) {
      // Add a small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        if (mounted.current) {
          startTour(tourName!)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [location.pathname, autoStart, canStartTour, startTour])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false
      // Don't destroy tour on unmount to allow navigation between pages
    }
  }, [])

  return {
    startTour,
    stopTour,
    hasActiveTour: tourService.hasActiveTour(),
    currentTour: tourService.getCurrentTour(),
    canStartTour
  }
}

// Hook for first-time user experience
export function useFirstTimeUser(): {
  isFirstTime: boolean
  markAsExperienced: () => void
  startFirstTimeTour: () => void
} {
  const storageKey = 'medixpos-first-time-completed'
  const { startTour } = useTour()

  const isFirstTime = !localStorage.getItem(storageKey)

  const markAsExperienced = useCallback((): void => {
    localStorage.setItem(storageKey, 'true')
  }, [storageKey])

  const startFirstTimeTour = useCallback((): void => {
    startTour('firstTimeUser')
  }, [startTour])

  return {
    isFirstTime,
    markAsExperienced,
    startFirstTimeTour
  }
}

export default useTour
