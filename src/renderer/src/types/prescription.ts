/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

export interface Prescription {
  id: string
  customerId: string
  saleId?: string
  doctorName?: string
  doctorPhone?: string
  prescriptionNumber?: string
  prescriptionDate: string
  diagnosis?: string
  notes?: string
  imageUrl?: string
  createdAt: string
  customer?: {
    id: string
    name: string
    phone: string
    email?: string
  }
  sale?: {
    id: string
    invoiceNumber: string
    totalAmount: number
    createdAt: string
  }
}

export interface PrescriptionFormData {
  customerId: string
  saleId?: string
  doctorName: string
  doctorPhone: string
  prescriptionNumber: string
  prescriptionDate: string
  diagnosis: string
  notes: string
  imageUrl: string
}

export interface PrescriptionStats {
  total: number
  thisMonth: number
  withSales: number
}
