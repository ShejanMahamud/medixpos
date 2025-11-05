/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

export interface Supplier {
  id: string
  name: string
  code: string
  contactPerson?: string
  phone?: string
  email?: string
  openingBalance?: number
  currentBalance?: number
  totalPurchases?: number
  totalPayments?: number
  creditLimit?: number
  creditDays?: number
}

export interface LedgerEntry {
  id: string
  supplierId: string
  transactionDate: string
  type: 'purchase' | 'payment' | 'return' | 'adjustment' | 'opening_balance'
  referenceNumber: string
  description: string
  debit: number
  credit: number
  balance: number
  createdBy?: string
}
