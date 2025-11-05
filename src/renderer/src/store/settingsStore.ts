/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Existing basic settings
  storeName: string
  storePhone: string
  storeEmail: string
  storeAddress: string
  taxRate: number
  currency: string
  receiptFooter: string
  lowStockThreshold: number

  // Business Info
  businessLicenseNumber: string
  businessTaxId: string
  businessYearEstablished: string
  businessWebsite: string
  businessFacebook: string
  businessInstagram: string

  // Invoice/Receipt Settings
  invoiceNumberFormat: string
  receiptShowTaxBreakdown: boolean
  receiptShowDiscountDetails: boolean
  receiptPaperSize: string
  receiptFontSize: string
  receiptTermsConditions: string
  receiptReturnPolicy: string
  receiptAutoPrint: boolean

  // Inventory & Stock
  stockEnableBatchTracking: boolean
  stockExpiryAlertDays: string
  stockCriticalLevel: number
  stockEnableAutoReorder: boolean
  stockReorderLeadTimeDays: number
  stockShowExpiryOnSale: boolean
  stockAlertNearExpiry: boolean
  stockNegativeStockAllowed: boolean

  // Pricing & Discounts
  pricingDefaultMarkupPercentage: number
  discountMaxPercentageCashier: number
  discountMaxPercentageManager: number
  discountMaxPercentageAdmin: number
  loyaltyPointsEnabled: boolean
  loyaltyPointsPerCurrency: number
  loyaltyPointsRedemptionValue: number

  // Security
  securitySessionTimeoutMinutes: number
  securityPasswordMinLength: number
  securityPasswordRequireUppercase: boolean
  securityPasswordRequireNumbers: boolean
  securityPasswordRequireSpecialChars: boolean
  securityMaxFailedLogins: number
  securityLockoutDurationMinutes: number
  securityAuditLogRetentionDays: number

  // POS Settings
  posShowProductImages: boolean
  posEnableQuickActions: boolean
  posAllowSplitPayment: boolean
  posAlertLowStock: boolean
  posEnableHoldInvoice: boolean
  posMaxHoldInvoices: number

  // Customer Settings
  enableCustomerCreditSales: boolean
  maxCreditLimit: number
  creditDueDays: number
  enablePrescriptionTracking: boolean
  enableBirthdayReminders: boolean

  // Notification Settings
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  enableDesktopNotifications: boolean

  // Hardware Settings
  enableBarcodeScanner: boolean
  enableReceiptPrinter: boolean
  enableCashDrawer: boolean

  loadSettings: () => Promise<void>
  updateSetting: (key: string, value: string) => void
  getSetting: (key: string) => string | number | boolean | undefined
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Basic settings
      storeName: '',
      storePhone: '',
      storeEmail: '',
      storeAddress: '',
      taxRate: 0,
      currency: 'USD',
      receiptFooter: '',
      lowStockThreshold: 10,

      // Business Info
      businessLicenseNumber: '',
      businessTaxId: '',
      businessYearEstablished: '',
      businessWebsite: '',
      businessFacebook: '',
      businessInstagram: '',

      // Invoice/Receipt
      invoiceNumberFormat: 'INV-{YYYY}{MM}{DD}-{####}',
      receiptShowTaxBreakdown: true,
      receiptShowDiscountDetails: true,
      receiptPaperSize: '80mm',
      receiptFontSize: 'medium',
      receiptTermsConditions: '',
      receiptReturnPolicy: '',
      receiptAutoPrint: true,

      // Inventory & Stock
      stockEnableBatchTracking: true,
      stockExpiryAlertDays: '90,60,30',
      stockCriticalLevel: 5,
      stockEnableAutoReorder: false,
      stockReorderLeadTimeDays: 7,
      stockShowExpiryOnSale: true,
      stockAlertNearExpiry: true,
      stockNegativeStockAllowed: false,

      // Pricing & Discounts
      pricingDefaultMarkupPercentage: 25,
      discountMaxPercentageCashier: 5,
      discountMaxPercentageManager: 15,
      discountMaxPercentageAdmin: 25,
      loyaltyPointsEnabled: true,
      loyaltyPointsPerCurrency: 1,
      loyaltyPointsRedemptionValue: 0.1,

      // Security
      securitySessionTimeoutMinutes: 30,
      securityPasswordMinLength: 8,
      securityPasswordRequireUppercase: true,
      securityPasswordRequireNumbers: true,
      securityPasswordRequireSpecialChars: false,
      securityMaxFailedLogins: 5,
      securityLockoutDurationMinutes: 15,
      securityAuditLogRetentionDays: 90,

      // POS Settings
      posShowProductImages: true,
      posEnableQuickActions: true,
      posAllowSplitPayment: false,
      posAlertLowStock: true,
      posEnableHoldInvoice: true,
      posMaxHoldInvoices: 5,

      // Customer Settings
      enableCustomerCreditSales: true,
      maxCreditLimit: 50000,
      creditDueDays: 30,
      enablePrescriptionTracking: true,
      enableBirthdayReminders: true,

      // Notification Settings
      enableEmailNotifications: false,
      enableSmsNotifications: false,
      enableDesktopNotifications: true,

      // Hardware Settings
      enableBarcodeScanner: false,
      enableReceiptPrinter: true,
      enableCashDrawer: false,
      loadSettings: async () => {
        try {
          if (!window.api) {
            console.error('window.api not available in loadSettings')
            return
          }
          const settings = await window.api.settings.getAll()
          const typedSettings = settings as unknown as Array<{ key: string; value: string }>
          const settingsMap: { [key: string]: string } = {}
          typedSettings.forEach((setting) => {
            settingsMap[setting.key] = setting.value
          })

          set({
            // Basic settings
            storeName: settingsMap['store_name'] || '',
            storePhone: settingsMap['store_phone'] || '',
            storeEmail: settingsMap['store_email'] || '',
            storeAddress: settingsMap['store_address'] || '',
            taxRate: parseFloat(settingsMap['tax_rate'] || '0'),
            currency: settingsMap['currency'] || 'USD',
            receiptFooter: settingsMap['receipt_footer'] || '',
            lowStockThreshold: parseInt(settingsMap['low_stock_threshold'] || '10'),

            // Business Info
            businessLicenseNumber: settingsMap['business_license_number'] || '',
            businessTaxId: settingsMap['business_tax_id'] || '',
            businessYearEstablished: settingsMap['business_year_established'] || '',
            businessWebsite: settingsMap['business_website'] || '',
            businessFacebook: settingsMap['business_facebook'] || '',
            businessInstagram: settingsMap['business_instagram'] || '',

            // Invoice/Receipt
            invoiceNumberFormat:
              settingsMap['invoice_number_format'] || 'INV-{YYYY}{MM}{DD}-{####}',
            receiptShowTaxBreakdown: settingsMap['receipt_show_tax_breakdown'] === 'true',
            receiptShowDiscountDetails: settingsMap['receipt_show_discount_details'] === 'true',
            receiptPaperSize: settingsMap['receipt_paper_size'] || '80mm',
            receiptFontSize: settingsMap['receipt_font_size'] || 'medium',
            receiptTermsConditions: settingsMap['receipt_terms_conditions'] || '',
            receiptReturnPolicy: settingsMap['receipt_return_policy'] || '',
            receiptAutoPrint: settingsMap['receipt_auto_print'] !== 'false',

            // Inventory & Stock
            stockEnableBatchTracking: settingsMap['stock_enable_batch_tracking'] === 'true',
            stockExpiryAlertDays: settingsMap['stock_expiry_alert_days'] || '90,60,30',
            stockCriticalLevel: parseInt(settingsMap['stock_critical_level'] || '5'),
            stockEnableAutoReorder: settingsMap['stock_enable_auto_reorder'] === 'true',
            stockReorderLeadTimeDays: parseInt(settingsMap['stock_reorder_lead_time_days'] || '7'),
            stockShowExpiryOnSale: settingsMap['stock_show_expiry_on_sale'] === 'true',
            stockAlertNearExpiry: settingsMap['stock_alert_near_expiry'] === 'true',
            stockNegativeStockAllowed: settingsMap['stock_negative_stock_allowed'] === 'true',

            // Pricing & Discounts
            pricingDefaultMarkupPercentage: parseFloat(
              settingsMap['pricing_default_markup_percentage'] || '25'
            ),
            discountMaxPercentageCashier: parseFloat(
              settingsMap['discount_max_percentage_cashier'] || '5'
            ),
            discountMaxPercentageManager: parseFloat(
              settingsMap['discount_max_percentage_manager'] || '15'
            ),
            discountMaxPercentageAdmin: parseFloat(
              settingsMap['discount_max_percentage_admin'] || '25'
            ),
            loyaltyPointsEnabled: settingsMap['loyalty_points_enabled'] === 'true',
            loyaltyPointsPerCurrency: parseFloat(settingsMap['loyalty_points_per_currency'] || '1'),
            loyaltyPointsRedemptionValue: parseFloat(
              settingsMap['loyalty_points_redemption_value'] || '0.1'
            ),

            // Security
            securitySessionTimeoutMinutes: parseInt(
              settingsMap['security_session_timeout_minutes'] || '30'
            ),
            securityPasswordMinLength: parseInt(settingsMap['security_password_min_length'] || '8'),
            securityPasswordRequireUppercase:
              settingsMap['security_password_require_uppercase'] === 'true',
            securityPasswordRequireNumbers:
              settingsMap['security_password_require_numbers'] === 'true',
            securityPasswordRequireSpecialChars:
              settingsMap['security_password_require_special_chars'] === 'true',
            securityMaxFailedLogins: parseInt(settingsMap['security_max_failed_logins'] || '5'),
            securityLockoutDurationMinutes: parseInt(
              settingsMap['security_lockout_duration_minutes'] || '15'
            ),
            securityAuditLogRetentionDays: parseInt(
              settingsMap['security_audit_log_retention_days'] || '90'
            ),

            // POS Settings
            posShowProductImages: settingsMap['pos_show_product_images'] === 'true',
            posEnableQuickActions: settingsMap['pos_enable_quick_actions'] === 'true',
            posAllowSplitPayment: settingsMap['pos_allow_split_payment'] === 'true',
            posAlertLowStock: settingsMap['pos_alert_low_stock'] === 'true',
            posEnableHoldInvoice: settingsMap['pos_enable_hold_invoice'] === 'true',
            posMaxHoldInvoices: parseInt(settingsMap['pos_max_hold_invoices'] || '5'),

            // Customer Settings
            enableCustomerCreditSales: settingsMap['enable_customer_credit_sales'] === 'true',
            maxCreditLimit: parseFloat(settingsMap['max_credit_limit'] || '50000'),
            creditDueDays: parseInt(settingsMap['credit_due_days'] || '30'),
            enablePrescriptionTracking: settingsMap['enable_prescription_tracking'] === 'true',
            enableBirthdayReminders: settingsMap['enable_birthday_reminders'] === 'true',

            // Notification Settings
            enableEmailNotifications: settingsMap['enable_email_notifications'] === 'true',
            enableSmsNotifications: settingsMap['enable_sms_notifications'] === 'true',
            enableDesktopNotifications: settingsMap['enable_desktop_notifications'] === 'true',

            // Hardware Settings
            enableBarcodeScanner: settingsMap['enable_barcode_scanner'] === 'true',
            enableReceiptPrinter: settingsMap['enable_receipt_printer'] === 'true',
            enableCashDrawer: settingsMap['enable_cash_drawer'] === 'true'
          })
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      },
      updateSetting: (key: string, value: string) => {
        const updates: { [key: string]: string | number | boolean } = {}
        switch (key) {
          // Basic settings
          case 'store_name':
            updates.storeName = value
            break
          case 'store_phone':
            updates.storePhone = value
            break
          case 'store_email':
            updates.storeEmail = value
            break
          case 'store_address':
            updates.storeAddress = value
            break
          case 'tax_rate':
            updates.taxRate = parseFloat(value)
            break
          case 'currency':
            updates.currency = value
            break
          case 'receipt_footer':
            updates.receiptFooter = value
            break
          case 'low_stock_threshold':
            updates.lowStockThreshold = parseInt(value)
            break

          // Discount limits
          case 'discount_max_percentage_cashier':
            updates.discountMaxPercentageCashier = parseFloat(value)
            break
          case 'discount_max_percentage_manager':
            updates.discountMaxPercentageManager = parseFloat(value)
            break
          case 'discount_max_percentage_admin':
            updates.discountMaxPercentageAdmin = parseFloat(value)
            break

          // Loyalty points
          case 'loyalty_points_enabled':
            updates.loyaltyPointsEnabled = value === 'true'
            break
          case 'loyalty_points_per_currency':
            updates.loyaltyPointsPerCurrency = parseFloat(value)
            break
          case 'loyalty_points_redemption_value':
            updates.loyaltyPointsRedemptionValue = parseFloat(value)
            break

          // Stock settings
          case 'stock_enable_batch_tracking':
            updates.stockEnableBatchTracking = value === 'true'
            break
          case 'stock_alert_near_expiry':
            updates.stockAlertNearExpiry = value === 'true'
            break
          case 'stock_show_expiry_on_sale':
            updates.stockShowExpiryOnSale = value === 'true'
            break
          case 'stock_negative_stock_allowed':
            updates.stockNegativeStockAllowed = value === 'true'
            break

          // POS settings
          case 'pos_alert_low_stock':
            updates.posAlertLowStock = value === 'true'
            break
          case 'pos_show_product_images':
            updates.posShowProductImages = value === 'true'
            break

          // Security
          case 'security_session_timeout_minutes':
            updates.securitySessionTimeoutMinutes = parseInt(value)
            break
        }
        set(updates)
      },
      getSetting: (key: string) => {
        const state = get() as unknown as Record<string, string | number | boolean>
        const keyToCamelCase = key
          .split('_')
          .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
          .join('')
        return state[keyToCamelCase]
      }
    }),
    {
      name: 'settings-storage'
    }
  )
)
