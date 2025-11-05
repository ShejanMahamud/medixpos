/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

export interface Product {
  id: string
  name: string
  genericName?: string
  strength?: string
  barcode?: string
  sku: string
  sellingPrice: number
  costPrice: number
  taxRate: number
  discountPercent: number
  reorderLevel: number
  quantity?: number
  imageUrl?: string
}

export interface InventoryItem {
  id: string
  productId: string
  quantity: number
  reorderLevel: number
  expiryDate?: string | null
  batchNumber?: string | null
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  loyaltyPoints: number
}

export interface BankAccount {
  id: string
  name: string
  accountType: string
  currentBalance: number
  isActive: boolean
}

export interface CartItem {
  id: string
  barcode: string
  productId: string
  name: string
  price: number
  quantity: number
  discount: number
  taxRate: number
}
