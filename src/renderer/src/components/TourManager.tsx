/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useFirstTimeUser } from '../hooks/useTour'
import { useAuthStore } from '../store/authStore'

/**
 * TourManager handles first-time user tours and automatic tour triggering.
 * This component must be inside the Router context.
 */
function TourManager(): null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()
  const { isFirstTime, startFirstTimeTour, markAsExperienced } = useFirstTimeUser()

  useEffect(() => {
    if (isAuthenticated && isFirstTime && location.pathname === '/') {
      // Start first-time tour if it's the user's first login and they're on dashboard
      const timer = setTimeout(() => {
        startFirstTimeTour()
        markAsExperienced()
      }, 2000)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [isAuthenticated, isFirstTime, location.pathname, startFirstTimeTour, markAsExperienced])

  // This component doesn't render anything
  return null
}

export default TourManager
