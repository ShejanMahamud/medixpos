/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useNotificationStore } from '../store/notificationStore'
import { useSettingsStore } from '../store/settingsStore'

interface Product {
  id: string
  name: string
  quantity: number
  expiryDate?: string
  barcode?: string
  sku?: string
}

interface SaleData {
  id: string
  saleNumber: string
  totalAmount: number
  createdBy?: string
  customerId?: string
}

interface PurchaseData {
  id: string
  purchaseNumber: string
  totalAmount: number
  createdBy?: string
  supplierId?: string
}

interface WindowWithIntervals extends Window {
  notificationIntervals?: {
    inventory: NodeJS.Timeout
    backupReminder: NodeJS.Timeout
  }
}

export class NotificationService {
  private static instance: NotificationService

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Check for low stock and out of stock items
   */
  public async checkInventoryLevels(): Promise<void> {
    try {
      if (!window.api) return

      const lowStockThreshold = useSettingsStore.getState().lowStockThreshold || 10
      const products = (await window.api.products.getAll()) as unknown as Product[]

      if (!products || !Array.isArray(products)) return

      const { createNotification } = useNotificationStore.getState()

      for (const product of products) {
        const currentStock = product.quantity || 0

        // Out of stock notification
        if (currentStock === 0) {
          await createNotification({
            userId: null, // System-wide notification
            title: 'Out of Stock Alert',
            message: `${product.name} is completely out of stock!`,
            type: 'error',
            category: 'inventory',
            priority: 'urgent',
            actionUrl: '/inventory',
            actionText: 'View Inventory',
            metadata: { productId: product.id, productName: product.name }
          })
        }
        // Low stock notification
        else if (currentStock <= lowStockThreshold) {
          await createNotification({
            userId: null,
            title: 'Low Stock Warning',
            message: `${product.name} is running low (${currentStock} remaining)`,
            type: 'warning',
            category: 'inventory',
            priority: 'high',
            actionUrl: '/inventory',
            actionText: 'Restock Now',
            metadata: {
              productId: product.id,
              productName: product.name,
              quantity: currentStock
            }
          })
        }
      }
    } catch (error) {
      console.error('Error checking inventory levels:', error)
    }
  }

  /**
   * Check for expiring products
   */
  public async checkExpiringProducts(): Promise<void> {
    try {
      if (!window.api) return

      const products = (await window.api.products.getAll()) as unknown as Product[]
      if (!products || !Array.isArray(products)) return

      const { createNotification } = useNotificationStore.getState()
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

      for (const product of products) {
        if (product.expiryDate) {
          const expiryDate = new Date(product.expiryDate)

          // Product expired
          if (expiryDate < today) {
            await createNotification({
              userId: null,
              title: 'Expired Product Alert',
              message: `${product.name} has expired on ${expiryDate.toLocaleDateString()}`,
              type: 'error',
              category: 'inventory',
              priority: 'urgent',
              actionUrl: '/inventory',
              actionText: 'Remove Product',
              metadata: {
                productId: product.id,
                productName: product.name,
                expiryDate: product.expiryDate
              }
            })
          }
          // Product expiring within 30 days
          else if (expiryDate <= thirtyDaysFromNow) {
            const daysUntilExpiry = Math.ceil(
              (expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
            )
            await createNotification({
              userId: null,
              title: 'Product Expiring Soon',
              message: `${product.name} expires in ${daysUntilExpiry} days`,
              type: 'warning',
              category: 'inventory',
              priority: 'high',
              actionUrl: '/inventory',
              actionText: 'View Details',
              metadata: { productId: product.id, productName: product.name, daysUntilExpiry }
            })
          }
        }
      }
    } catch (error) {
      console.error('Error checking expiring products:', error)
    }
  }

  /**
   * Create notification for successful sale
   */
  public async notifySaleCompleted(saleData: SaleData): Promise<void> {
    try {
      const { createNotification } = useNotificationStore.getState()

      await createNotification({
        userId: saleData.createdBy || null,
        title: 'Sale Completed',
        message: `Sale #${saleData.saleNumber} completed - Total: $${saleData.totalAmount}`,
        type: 'success',
        category: 'sales',
        priority: 'medium',
        actionUrl: '/sales',
        actionText: 'View Sale',
        metadata: {
          saleId: saleData.id,
          saleNumber: saleData.saleNumber,
          totalAmount: saleData.totalAmount,
          customerId: saleData.customerId
        }
      })
    } catch (error) {
      console.error('Error creating sale notification:', error)
    }
  }

  /**
   * Create notification for purchase order
   */
  public async notifyPurchaseCreated(purchaseData: PurchaseData): Promise<void> {
    try {
      const { createNotification } = useNotificationStore.getState()

      await createNotification({
        userId: purchaseData.createdBy || null,
        title: 'Purchase Order Created',
        message: `Purchase #${purchaseData.purchaseNumber} created - Total: $${purchaseData.totalAmount}`,
        type: 'info',
        category: 'sales',
        priority: 'medium',
        actionUrl: '/purchases',
        actionText: 'View Purchase',
        metadata: {
          purchaseId: purchaseData.id,
          purchaseNumber: purchaseData.purchaseNumber,
          totalAmount: purchaseData.totalAmount,
          supplierId: purchaseData.supplierId
        }
      })
    } catch (error) {
      console.error('Error creating purchase notification:', error)
    }
  }

  /**
   * Create daily backup reminder
   */
  public async createBackupReminder(): Promise<void> {
    try {
      const { createSystemNotification } = useNotificationStore.getState()

      await createSystemNotification(
        'Daily Backup Reminder',
        "Don't forget to backup your database to protect your business data.",
        'info',
        'medium'
      )
    } catch (error) {
      console.error('Error creating backup reminder:', error)
    }
  }

  /**
   * Create system maintenance notification
   */
  public async notifySystemMaintenance(message: string): Promise<void> {
    try {
      const { createSystemNotification } = useNotificationStore.getState()

      await createSystemNotification('System Maintenance', message, 'warning', 'high')
    } catch (error) {
      console.error('Error creating system maintenance notification:', error)
    }
  }

  /**
   * Start periodic checks for inventory and other automated notifications
   */
  public startPeriodicChecks(): void {
    // Check inventory levels every 30 minutes
    const inventoryCheckInterval = setInterval(
      () => {
        this.checkInventoryLevels()
        this.checkExpiringProducts()
      },
      30 * 60 * 1000
    )

    // Daily backup reminder at 9 AM (if it's 9 AM and we haven't sent one today)
    const backupReminderInterval = setInterval(
      () => {
        const now = new Date()
        const hour = now.getHours()
        const lastBackupReminder = localStorage.getItem('lastBackupReminder')
        const today = now.toDateString()

        if (hour === 9 && lastBackupReminder !== today) {
          this.createBackupReminder()
          localStorage.setItem('lastBackupReminder', today)
        }
      },
      60 * 60 * 1000
    ) // Check every hour

    // Store intervals for cleanup if needed
    ;(window as WindowWithIntervals).notificationIntervals = {
      inventory: inventoryCheckInterval,
      backupReminder: backupReminderInterval
    }
  }

  /**
   * Stop all periodic checks
   */
  public stopPeriodicChecks(): void {
    const intervals = (window as WindowWithIntervals).notificationIntervals
    if (intervals) {
      Object.values(intervals).forEach((interval: NodeJS.Timeout) => clearInterval(interval))
      delete (window as WindowWithIntervals).notificationIntervals
    }
  }
}

export const notificationService = NotificationService.getInstance()
