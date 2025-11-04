import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

export default function SessionChecker(): null {
  const { user, logout, isAuthenticated } = useAuthStore()
  const updateActivity = useAuthStore((state) => state.updateActivity)
  const checkSessionTimeout = useAuthStore((state) => state.checkSessionTimeout)
  const navigate = useNavigate()

  // Track user activity for session timeout
  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = (): void => {
      updateActivity()
    }

    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, updateActivity])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    // Check user session every 30 seconds
    const checkSession = async (): Promise<void> => {
      try {
        // Check for session timeout
        const timedOut = checkSessionTimeout()
        if (timedOut) {
          toast.error('Your session has expired due to inactivity. Please login again.')
          navigate('/login', { replace: true })
          return
        }

        // Check if user account is still active
        const currentUser = await window.api.users.getById(user.id)

        // If user is deactivated or not found, logout
        if (!currentUser || !currentUser.isActive) {
          toast.error('Your account has been deactivated. Please contact an administrator.')
          logout()
          navigate('/login', { replace: true })
        }
      } catch {
        // If there's an error getting user info, logout for security
        logout()
        navigate('/login', { replace: true })
      }
    }

    // Initial check
    checkSession()

    // Set up interval to check every 30 seconds
    const intervalId = setInterval(checkSession, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [user, isAuthenticated, logout, navigate, checkSessionTimeout])

  return null
}
