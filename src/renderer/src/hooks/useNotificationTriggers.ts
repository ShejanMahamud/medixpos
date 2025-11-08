/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { useCallback } from 'react'

import { notificationService } from '../services/notificationService'

interface SaleNotificationData {
  id: string
  invoiceNumber?: string
  saleNumber?: string
  totalAmount: number
  userId?: string
  customerId?: string
}

interface PurchaseNotificationData {
  id: string
  invoiceNumber?: string
  purchaseNumber?: string
  totalAmount: number
  userId?: string
  supplierId?: string
}

export const useNotificationTriggers = (): {
  triggerSaleNotification: (saleData: SaleNotificationData) => Promise<void>
  triggerPurchaseNotification: (purchaseData: PurchaseNotificationData) => Promise<void>
  triggerInventoryCheck: () => Promise<void>
  triggerBackupReminder: () => Promise<void>
} => {
  const triggerSaleNotification = useCallback(async (saleData: SaleNotificationData) => {
    try {
      await notificationService.notifySaleCompleted({
        id: saleData.id,
        saleNumber: saleData.invoiceNumber || saleData.saleNumber || saleData.id,
        totalAmount: saleData.totalAmount,
        createdBy: saleData.userId,
        customerId: saleData.customerId
      })
    } catch (error) {
      console.error('Failed to trigger sale notification:', error)
    }
  }, [])

  const triggerPurchaseNotification = useCallback(
    async (purchaseData: PurchaseNotificationData) => {
      try {
        await notificationService.notifyPurchaseCreated({
          id: purchaseData.id,
          purchaseNumber:
            purchaseData.invoiceNumber || purchaseData.purchaseNumber || purchaseData.id,
          totalAmount: purchaseData.totalAmount,
          createdBy: purchaseData.userId,
          supplierId: purchaseData.supplierId
        })
      } catch (error) {
        console.error('Failed to trigger purchase notification:', error)
      }
    },
    []
  )

  const triggerInventoryCheck = useCallback(async () => {
    try {
      await notificationService.checkInventoryLevels()
      await notificationService.checkExpiringProducts()
    } catch (error) {
      console.error('Failed to trigger inventory check:', error)
    }
  }, [])

  const triggerBackupReminder = useCallback(async () => {
    try {
      await notificationService.createBackupReminder()
    } catch (error) {
      console.error('Failed to trigger backup reminder:', error)
    }
  }, [])

  return {
    triggerSaleNotification,
    triggerPurchaseNotification,
    triggerInventoryCheck,
    triggerBackupReminder
  }
}
