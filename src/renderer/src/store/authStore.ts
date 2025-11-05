/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from './settingsStore'

interface User {
  id: string
  username: string
  fullName: string
  email?: string
  role: 'super_admin' | 'admin' | 'manager' | 'cashier' | 'pharmacist'
  createdBy?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  lastActivity: number
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
  updateActivity: () => void
  checkSessionTimeout: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastActivity: Date.now(),
      login: async (username: string, password: string) => {
        try {
          if (!window.api) {
            console.error('window.api not available in login')
            return false
          }
          const user = await window.api.users.authenticate(username, password)
          if (user) {
            set({ user, isAuthenticated: true, lastActivity: Date.now() })
            try {
              await window.api.auditLogs.create({
                userId: user.id,
                action: 'login',
                entityType: 'user',
                entityId: user.id
              })
            } catch (auditError) {
              console.error('Failed to create audit log:', auditError)
            }
            return true
          }
          return false
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },
      logout: () => {
        try {
          const currentUser = useAuthStore.getState().user
          if (currentUser && window.api) {
            window.api.auditLogs
              .create({
                userId: currentUser.id,
                username: currentUser.username,
                action: 'logout',
                entityType: 'auth',
                entityName: currentUser.fullName
              })
              .catch((error) => {
                console.error('Failed to create logout audit log:', error)
              })
          }
          set({ user: null, isAuthenticated: false })
        } catch (error) {
          console.error('Logout error:', error)
          set({ user: null, isAuthenticated: false })
        }
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true, lastActivity: Date.now() })
      },
      updateActivity: () => {
        set({ lastActivity: Date.now() })
      },
      checkSessionTimeout: () => {
        const state = get()
        if (!state.isAuthenticated) return false

        // Get session timeout from settings
        const settingsState = useSettingsStore.getState()
        const timeoutMinutes = settingsState.securitySessionTimeoutMinutes
        const timeoutMs = timeoutMinutes * 60 * 1000

        const elapsed = Date.now() - state.lastActivity
        if (elapsed > timeoutMs) {
          // Session expired, logout
          state.logout()
          return true
        }
        return false
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
