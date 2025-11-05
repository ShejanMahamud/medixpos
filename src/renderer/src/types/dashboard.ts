/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

export interface RecentSale {
  id: string
  invoiceNumber: string
  customerName?: string
  totalAmount: number
  paymentMethod: string
  status: string
  createdAt: string
}

export interface LowStockItem {
  id: string
  productName: string
  currentStock: number
  minimumStock: number
  unitPrice: number
}

export interface DashboardStats {
  todaySales: number
  todayRevenue: number
  lowStockCount: number
  totalProducts: number
  totalCustomers: number
  monthlyRevenue: number
}
