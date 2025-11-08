/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { create } from 'zustand'

export interface Notification {
  id: string
  userId?: string | null
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'low_stock' | 'expiry' | 'sale' | 'purchase'
  category: 'system' | 'inventory' | 'sales' | 'general' | 'alert'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  readAt?: string | null
  actionUrl?: string | null
  actionText?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  expiresAt?: string | null
}

interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  actionText?: string
  onAction?: () => void
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  toasts: ToastNotification[]
  isLoading: boolean
  // Core notification functions
  fetchNotifications: (userId: string | null, limit?: number, offset?: number) => Promise<void>
  fetchUnreadCount: (userId: string | null) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  createNotification: (input: {
    userId?: string | null
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'low_stock' | 'expiry' | 'sale' | 'purchase'
    category?: 'system' | 'inventory' | 'sales' | 'general' | 'alert'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    actionUrl?: string
    actionText?: string
    metadata?: Record<string, unknown>
    expiresAt?: string
  }) => Promise<void>
  createSystemNotification: (
    title: string,
    message: string,
    type?: string,
    priority?: string
  ) => Promise<void>
  // Toast notification functions
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  removeToast: (toastId: string) => void
  clearAllToasts: () => void
  // Utility functions
  markAllAsRead: () => Promise<void>
  clearNotifications: () => void
}

let toastIdCounter = 0

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  isLoading: false,

  fetchNotifications: async (userId: string | null, limit = 50, offset = 0) => {
    try {
      set({ isLoading: true })
      if (!window.api) {
        console.error('window.api not available in fetchNotifications')
        return
      }

      const response = await window.api.notifications.getByUser(userId, limit, offset)
      if (response.success && response.data) {
        set({ notifications: response.data as unknown as Notification[] })
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to fetch notifications',
        type: 'error'
      })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUnreadCount: async (userId: string | null) => {
    try {
      if (!window.api) {
        console.error('window.api not available in fetchUnreadCount')
        return
      }

      const response = await window.api.notifications.getUnreadCount(userId)
      if (response.success && typeof response.data === 'number') {
        set({ unreadCount: response.data })
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      if (!window.api) {
        console.error('window.api not available in markAsRead')
        return
      }

      const response = await window.api.notifications.markAsRead(notificationId)
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId
              ? { ...notif, isRead: true, readAt: new Date().toISOString() }
              : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to mark notification as read',
        type: 'error'
      })
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      if (!window.api) {
        console.error('window.api not available in deleteNotification')
        return
      }

      const response = await window.api.notifications.delete(notificationId)
      if (response.success) {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === notificationId)
          const wasUnread = notification && !notification.isRead
          return {
            notifications: state.notifications.filter((notif) => notif.id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          }
        })
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to delete notification',
        type: 'error'
      })
    }
  },

  createNotification: async (input) => {
    try {
      if (!window.api) {
        console.error('window.api not available in createNotification')
        return
      }

      const response = await window.api.notifications.create(input)
      if (response.success) {
        // Refresh notifications after creating a new one
        const currentState = get()
        if (input.userId) {
          await currentState.fetchNotifications(input.userId)
          await currentState.fetchUnreadCount(input.userId)
        }
      }
    } catch (error) {
      console.error('Failed to create notification:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to create notification',
        type: 'error'
      })
    }
  },

  createSystemNotification: async (title, message, type = 'info', priority = 'medium') => {
    try {
      if (!window.api) {
        console.error('window.api not available in createSystemNotification')
        return
      }

      const response = await window.api.notifications.createSystem(title, message, type, priority)
      if (response.success) {
        // Show a toast for system notifications
        get().showToast({
          title,
          message,
          type: (type as 'info' | 'success' | 'warning' | 'error') || 'info',
          duration: priority === 'urgent' ? 10000 : 5000
        })
      }
    } catch (error) {
      console.error('Failed to create system notification:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to create system notification',
        type: 'error'
      })
    }
  },

  markAllAsRead: async () => {
    try {
      const state = get()
      const unreadNotifications = state.notifications.filter((n) => !n.isRead)

      // Mark all unread notifications as read
      for (const notification of unreadNotifications) {
        await state.markAsRead(notification.id)
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      get().showToast({
        title: 'Error',
        message: 'Failed to mark all notifications as read',
        type: 'error'
      })
    }
  },

  showToast: (toast) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: ToastNotification = { ...toast, id }

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto-remove toast after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      get().removeToast(id)
    }, duration)
  },

  removeToast: (toastId) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId)
    }))
  },

  clearAllToasts: () => {
    set({ toasts: [] })
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 })
  }
}))
