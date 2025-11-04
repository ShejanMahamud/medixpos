import Database from 'better-sqlite3'

export function addComprehensiveSettings(db: Database.Database): void {
  ;('Adding comprehensive pharmacy settings...')

  // Add new settings with default values
  const settings = [
    // Business Information (enhanced)
    {
      key: 'business_license_number',
      value: '',
      description: 'Pharmacy license/registration number'
    },
    { key: 'business_tax_id', value: '', description: 'Tax identification number' },
    { key: 'business_established_year', value: '', description: 'Year business was established' },
    { key: 'business_website', value: '', description: 'Business website URL' },
    { key: 'business_facebook', value: '', description: 'Facebook page URL' },
    { key: 'business_instagram', value: '', description: 'Instagram handle' },

    // Invoice & Receipt (expanded)
    { key: 'invoice_prefix', value: 'INV', description: 'Invoice number prefix' },
    {
      key: 'invoice_number_format',
      value: 'INV-{YYYY}{MM}{DD}-{####}',
      description: 'Invoice numbering format'
    },
    { key: 'receipt_show_logo', value: 'true', description: 'Show logo on receipt' },
    { key: 'receipt_show_barcode', value: 'true', description: 'Show barcode on receipt' },
    {
      key: 'receipt_show_tax_breakdown',
      value: 'true',
      description: 'Show tax breakdown on receipt'
    },
    {
      key: 'receipt_show_discount_details',
      value: 'true',
      description: 'Show discount details on receipt'
    },
    { key: 'receipt_font_size', value: '12', description: 'Receipt font size in points' },
    { key: 'receipt_paper_size', value: '80mm', description: 'Receipt paper size (58mm, 80mm)' },
    { key: 'receipt_header_text', value: '', description: 'Custom header text for receipts' },
    {
      key: 'receipt_terms_conditions',
      value: 'Thank you for your purchase! All sales are final. Please check items before leaving.',
      description: 'Terms and conditions on receipt'
    },
    {
      key: 'receipt_return_policy',
      value: 'Returns accepted within 7 days with original receipt.',
      description: 'Return policy text'
    },
    {
      key: 'receipt_auto_print',
      value: 'true',
      description: 'Automatically print receipt after sale'
    },

    // Inventory & Stock Management
    {
      key: 'stock_enable_batch_tracking',
      value: 'true',
      description: 'Enable batch/lot number tracking'
    },
    {
      key: 'stock_expiry_alert_days',
      value: '90,60,30',
      description: 'Days before expiry to trigger alerts (comma-separated)'
    },
    { key: 'stock_critical_level', value: '5', description: 'Critical stock level (red alert)' },
    {
      key: 'stock_enable_auto_reorder',
      value: 'false',
      description: 'Enable automatic reorder suggestions'
    },
    {
      key: 'stock_reorder_lead_time_days',
      value: '7',
      description: 'Average lead time for supplier orders'
    },
    {
      key: 'stock_show_expiry_on_sale',
      value: 'true',
      description: 'Show expiry date during sale'
    },
    {
      key: 'stock_alert_near_expiry',
      value: 'true',
      description: 'Alert when selling near-expiry items'
    },
    {
      key: 'stock_negative_stock_allowed',
      value: 'false',
      description: 'Allow negative stock (overselling)'
    },

    // Pricing & Discounts
    {
      key: 'pricing_default_markup_percentage',
      value: '25',
      description: 'Default markup percentage for new products'
    },
    {
      key: 'pricing_enable_dynamic_pricing',
      value: 'false',
      description: 'Enable dynamic pricing based on demand'
    },
    {
      key: 'pricing_round_to_nearest',
      value: '0.50',
      description: 'Round prices to nearest value'
    },
    {
      key: 'discount_max_percentage_cashier',
      value: '5',
      description: 'Maximum discount % cashier can apply'
    },
    {
      key: 'discount_max_percentage_manager',
      value: '15',
      description: 'Maximum discount % manager can apply'
    },
    {
      key: 'discount_max_percentage_admin',
      value: '50',
      description: 'Maximum discount % admin can apply'
    },
    {
      key: 'discount_require_reason',
      value: 'true',
      description: 'Require reason for discounts above threshold'
    },
    {
      key: 'discount_reason_threshold',
      value: '10',
      description: 'Discount % threshold requiring reason'
    },
    {
      key: 'loyalty_points_enabled',
      value: 'false',
      description: 'Enable customer loyalty points program'
    },
    {
      key: 'loyalty_points_per_currency',
      value: '100',
      description: 'Currency amount to earn 1 point'
    },
    {
      key: 'loyalty_points_redemption_rate',
      value: '0.01',
      description: 'Value of 1 point in currency'
    },

    // Notifications & Alerts
    {
      key: 'notification_low_stock_enabled',
      value: 'true',
      description: 'Enable low stock notifications'
    },
    {
      key: 'notification_expiry_enabled',
      value: 'true',
      description: 'Enable expiry notifications'
    },
    {
      key: 'notification_daily_sales_report',
      value: 'true',
      description: 'Send daily sales summary'
    },
    {
      key: 'notification_email_recipients',
      value: '',
      description: 'Email addresses for notifications (comma-separated)'
    },
    { key: 'notification_sms_enabled', value: 'false', description: 'Enable SMS notifications' },
    {
      key: 'notification_sms_recipients',
      value: '',
      description: 'Phone numbers for SMS (comma-separated)'
    },
    {
      key: 'notification_sound_enabled',
      value: 'true',
      description: 'Enable notification sounds in app'
    },
    {
      key: 'notification_desktop_alerts',
      value: 'true',
      description: 'Enable desktop push notifications'
    },

    // Security & Access Control
    {
      key: 'security_session_timeout_minutes',
      value: '30',
      description: 'Auto-logout after inactivity (minutes)'
    },
    { key: 'security_password_min_length', value: '8', description: 'Minimum password length' },
    {
      key: 'security_password_require_uppercase',
      value: 'true',
      description: 'Require uppercase in password'
    },
    {
      key: 'security_password_require_numbers',
      value: 'true',
      description: 'Require numbers in password'
    },
    {
      key: 'security_password_require_special',
      value: 'false',
      description: 'Require special characters in password'
    },
    {
      key: 'security_max_login_attempts',
      value: '5',
      description: 'Max failed login attempts before lockout'
    },
    {
      key: 'security_lockout_duration_minutes',
      value: '15',
      description: 'Account lockout duration (minutes)'
    },
    {
      key: 'security_require_deletion_reason',
      value: 'true',
      description: 'Require reason when deleting records'
    },
    {
      key: 'security_enable_audit_log',
      value: 'true',
      description: 'Enable comprehensive audit logging'
    },
    {
      key: 'security_audit_retention_days',
      value: '365',
      description: 'Days to retain audit logs'
    },

    // Reporting & Analytics
    {
      key: 'reports_default_date_range',
      value: 'last_30_days',
      description: 'Default report date range'
    },
    {
      key: 'reports_auto_export_enabled',
      value: 'false',
      description: 'Auto-export reports to file'
    },
    {
      key: 'reports_auto_export_format',
      value: 'pdf',
      description: 'Auto-export format (pdf, excel, csv)'
    },
    {
      key: 'reports_auto_export_schedule',
      value: 'daily',
      description: 'Export schedule (daily, weekly, monthly)'
    },
    { key: 'reports_include_charts', value: 'true', description: 'Include charts in reports' },
    { key: 'reports_email_enabled', value: 'false', description: 'Email reports automatically' },
    { key: 'reports_email_recipients', value: '', description: 'Email addresses for reports' },

    // Integrations & Hardware
    {
      key: 'hardware_barcode_scanner_enabled',
      value: 'true',
      description: 'Enable barcode scanner support'
    },
    {
      key: 'hardware_barcode_scanner_type',
      value: 'usb',
      description: 'Scanner type (usb, bluetooth, wedge)'
    },
    {
      key: 'hardware_receipt_printer_enabled',
      value: 'true',
      description: 'Enable receipt printer'
    },
    {
      key: 'hardware_receipt_printer_type',
      value: 'thermal',
      description: 'Printer type (thermal, inkjet)'
    },
    {
      key: 'hardware_cash_drawer_enabled',
      value: 'false',
      description: 'Enable cash drawer integration'
    },
    {
      key: 'hardware_cash_drawer_trigger',
      value: 'receipt',
      description: 'Cash drawer trigger (receipt, manual)'
    },
    {
      key: 'hardware_scale_enabled',
      value: 'false',
      description: 'Enable weighing scale integration'
    },

    // Backup & Maintenance
    { key: 'backup_auto_enabled', value: 'true', description: 'Enable automatic backups' },
    {
      key: 'backup_auto_frequency',
      value: 'daily',
      description: 'Backup frequency (hourly, daily, weekly)'
    },
    { key: 'backup_auto_time', value: '02:00', description: 'Backup time (HH:MM 24-hour format)' },
    { key: 'backup_retention_days', value: '30', description: 'Days to retain automatic backups' },
    { key: 'backup_cloud_enabled', value: 'false', description: 'Enable cloud backup' },
    {
      key: 'backup_cloud_provider',
      value: '',
      description: 'Cloud provider (gdrive, dropbox, onedrive)'
    },

    // POS & Sales
    { key: 'pos_show_product_images', value: 'true', description: 'Show product images in POS' },
    { key: 'pos_enable_quick_actions', value: 'true', description: 'Enable quick action buttons' },
    { key: 'pos_default_payment_method', value: 'cash', description: 'Default payment method' },
    { key: 'pos_allow_split_payment', value: 'true', description: 'Allow split payment methods' },
    { key: 'pos_show_stock_quantity', value: 'true', description: 'Show stock quantity in POS' },
    {
      key: 'pos_alert_low_stock',
      value: 'true',
      description: 'Alert when item is low stock during sale'
    },
    {
      key: 'pos_enable_hold_invoice',
      value: 'true',
      description: 'Enable hold/park invoice feature'
    },
    { key: 'pos_max_hold_invoices', value: '10', description: 'Maximum number of held invoices' },

    // Customer Management
    {
      key: 'customer_require_for_sale',
      value: 'false',
      description: 'Require customer selection for every sale'
    },
    { key: 'customer_enable_credit_sales', value: 'true', description: 'Enable credit/due sales' },
    {
      key: 'customer_max_credit_limit_default',
      value: '5000',
      description: 'Default customer credit limit'
    },
    {
      key: 'customer_enable_prescription_tracking',
      value: 'true',
      description: 'Track customer prescriptions'
    },
    { key: 'customer_birthday_alerts', value: 'true', description: 'Alert for customer birthdays' }
  ]

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO settings (id, key, value, description, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)

  for (const setting of settings) {
    const id = `setting_${setting.key}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    insertStmt.run(id, setting.key, setting.value, setting.description)
  }

  ;`Added ${settings.length} new pharmacy settings`
}
