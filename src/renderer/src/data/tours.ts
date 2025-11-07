/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import type { TourConfig } from '../services/tourService'

// Dashboard Tour
export const dashboardTour: TourConfig = {
  name: 'dashboard',
  steps: [
    {
      element: '[data-tour="dashboard-stats"]',
      title: 'Dashboard Statistics',
      description: 'View key performance metrics like daily sales, total products, and revenue.'
    },
    {
      element: '[data-tour="sales-chart"]',
      title: 'Sales Analytics',
      description: 'Monitor sales trends and revenue distribution with interactive charts.'
    },
    {
      element: '[data-tour="recent-sales"]',
      title: 'Recent Sales',
      description: 'Quick view of your latest transactions and their details.'
    },
    {
      element: '[data-tour="low-stock-alerts"]',
      title: 'Low Stock Alerts',
      description: 'Monitor products running low on inventory to avoid stockouts.'
    },
    {
      element: '[data-tour="quick-actions"]',
      title: 'Quick Actions',
      description:
        'Access frequently used features like creating new sales, adding products, and more.'
    }
  ]
}

// POS Tour
export const posTour: TourConfig = {
  name: 'pos',
  steps: [
    {
      element: '[data-tour="product-search"]',
      title: 'Product Search',
      description:
        'Search for products by name, barcode, or category. You can also scan barcodes directly.'
    },
    {
      element: '[data-tour="customer-select"]',
      title: 'Customer Selection',
      description: 'Select an existing customer or create a new one for the sale.'
    },
    {
      element: '[data-tour="cart-items"]',
      title: 'Shopping Cart',
      description: 'Selected products appear here. You can modify quantities or remove items.'
    },
    {
      element: '[data-tour="discount-points"]',
      title: 'Discounts & Points',
      description: 'Apply discounts or redeem customer loyalty points here.'
    },
    {
      element: '[data-tour="payment-section"]',
      title: 'Payment Processing',
      description: 'Choose payment method (cash, card, or partial) and process the transaction.'
    }
  ]
}

// Products Tour
export const productsTour: TourConfig = {
  name: 'products',
  steps: [
    {
      element: '[data-tour="add-product"]',
      title: 'Add New Product',
      description:
        'Click here to add a new product to your inventory with details like name, price, and category.'
    },
    {
      element: '[data-tour="product-filters"]',
      title: 'Product Filters',
      description:
        'Filter products by category, low stock, or search by name to find items quickly.'
    },
    {
      element: '[data-tour="product-list"]',
      title: 'Product List',
      description:
        'View all your products with their current stock, prices, and status. Click to edit or view details.'
    },
    {
      element: '[data-tour="bulk-actions"]',
      title: 'Bulk Actions',
      description:
        'Select multiple products to perform bulk operations like price updates or category changes.'
    },
    {
      element: '[data-tour="export-import"]',
      title: 'Export/Import',
      description: 'Export product data or import products in bulk using CSV files.'
    }
  ]
}

// Inventory Tour
export const inventoryTour: TourConfig = {
  name: 'inventory',
  steps: [
    {
      element: '[data-tour="inventory-stats"]',
      title: 'Inventory Statistics',
      description: 'Overview of total items, low stock count, and inventory value.'
    },
    {
      element: '[data-tour="inventory-filters"]',
      title: 'Inventory Filters',
      description: 'Filter inventory by stock status and search for specific products.'
    },
    {
      element: '[data-tour="inventory-table"]',
      title: 'Inventory Table',
      description: 'View detailed inventory information and make stock adjustments.'
    }
  ]
}

// Sales Tour
export const salesTour: TourConfig = {
  name: 'sales',
  steps: [
    {
      element: '[data-tour="sales-stats"]',
      title: 'Sales Statistics',
      description: 'Overview of sales performance and transaction summaries.'
    },
    {
      element: '[data-tour="sales-filters"]',
      title: 'Sales Filters',
      description: 'Filter sales by status, payment method, or search for specific transactions.'
    },
    {
      element: '[data-tour="sales-table"]',
      title: 'Sales Table',
      description: 'View all sales transactions with options to view details or print receipts.'
    }
  ]
}

// Settings Tour
export const settingsTour: TourConfig = {
  name: 'settings',
  steps: [
    {
      element: '[data-tour="store-info"]',
      title: 'Store Information',
      description:
        'Configure your pharmacy details like name, address, contact information, and logo.'
    },
    {
      element: '[data-tour="receipt-settings"]',
      title: 'Receipt Settings',
      description: 'Customize receipt format, header/footer text, and printing preferences.'
    },
    {
      element: '[data-tour="tax-settings"]',
      title: 'Tax Configuration',
      description: 'Set up tax rates and rules applicable to your products and services.'
    },
    {
      element: '[data-tour="notification-settings"]',
      title: 'Notifications',
      description: 'Configure alerts for low stock, expiry dates, and other important events.'
    },
    {
      element: '[data-tour="backup-settings"]',
      title: 'Data Backup',
      description: 'Set up automatic data backups to protect your business information.'
    }
  ]
}

// First Time User Tour
export const firstTimeUserTour: TourConfig = {
  name: 'firstTimeUser',
  showProgress: true,
  steps: [
    {
      title: 'Welcome to MedixPOS!',
      description:
        "Congratulations! You've successfully set up your pharmacy management system. Let's walk through the key features to get you started."
    },
    {
      element: '[data-tour="navigation"]',
      title: 'Navigation Overview',
      description:
        'This sidebar contains all the main sections of your pharmacy system. Each icon represents a different area of functionality.'
    },
    {
      element: '[data-tour="pos-nav"]',
      title: 'Point of Sale (POS)',
      description:
        'Your main selling interface. Use this for daily transactions, scanning products, and processing payments.'
    },
    {
      element: '[data-tour="products-nav"]',
      title: 'Product Management',
      description:
        'Add, edit, and organize your pharmacy products. Set prices, track inventory, and manage categories.'
    },
    {
      element: '[data-tour="inventory-nav"]',
      title: 'Inventory Control',
      description:
        "Monitor stock levels, track expiry dates, and manage your pharmacy's inventory efficiently."
    },
    {
      element: '[data-tour="sales-nav"]',
      title: 'Sales Reports',
      description: 'Analyze your business performance with detailed sales reports and analytics.'
    },
    {
      element: '[data-tour="settings-nav"]',
      title: 'Settings',
      description:
        'Configure your store details, receipt formats, taxes, and other system preferences.'
    },
    {
      title: "You're All Set!",
      description:
        "You've completed the tour! You can access this guide anytime from the help menu. Start by adding your first product or making a sale."
    }
  ]
}

// Category & Units Tour
export const categoryUnitTour: TourConfig = {
  name: 'categoryUnit',
  steps: [
    {
      element: '[data-tour="category-header"]',
      title: 'Manage Categories & Units',
      description: 'Review categories and manage the measurement units library.'
    },
    {
      element: '[data-tour="category-tabs"]',
      title: 'Switch Between Views',
      description: 'Use these tabs to toggle between category settings and the units library.'
    },
    {
      element: '[data-tour="categories-table"]',
      title: 'Edit Categories',
      description: 'Add, edit, or remove product categories to keep your catalog organized.'
    }
  ]
}

// Suppliers Tour
export const suppliersTour: TourConfig = {
  name: 'suppliers',
  steps: [
    {
      element: '[data-tour="suppliers-header"]',
      title: 'Supplier Management',
      description: 'Track supplier contacts and manage purchasing relationships from this hub.'
    },
    {
      element: '[data-tour="suppliers-stats"]',
      title: 'Supplier Insights',
      description: 'Check supplier balances, vendor counts, and recent purchasing activity.'
    },
    {
      element: '[data-tour="suppliers-search"]',
      title: 'Search & Add Suppliers',
      description: 'Filter suppliers or add new partners using these controls.'
    },
    {
      element: '[data-tour="suppliers-table"]',
      title: 'Supplier Directory',
      description: 'View supplier details, edit records, and record payments from the table.'
    }
  ]
}

// Supplier Ledger Tour
export const supplierLedgerTour: TourConfig = {
  name: 'supplierLedger',
  steps: [
    {
      element: '[data-tour="supplier-ledger-header"]',
      title: 'Supplier Ledger Overview',
      description: 'Generate PDF statements or analyze balances for any supplier.'
    },
    {
      element: '[data-tour="supplier-ledger-filters"]',
      title: 'Filter Ledger Entries',
      description: 'Choose a supplier and date range to focus the ledger on specific transactions.'
    },
    {
      element: '[data-tour="supplier-ledger-summary"]',
      title: 'Balance Summary',
      description: 'Review total debit, credit, and balance for the selected supplier.'
    },
    {
      element: '[data-tour="supplier-ledger-table"]',
      title: 'Ledger Entries',
      description: 'Drill into purchases, payments, and adjustments recorded for this supplier.'
    }
  ]
}

// Purchases Tour
export const purchasesTour: TourConfig = {
  name: 'purchases',
  steps: [
    {
      element: '[data-tour="purchases-header"]',
      title: 'Purchase Management',
      description: 'Monitor your procurement workflow and keep supplier orders up to date.'
    },
    {
      element: '[data-tour="purchases-stats"]',
      title: 'Purchasing KPIs',
      description: 'Track totals, payments, and outstanding amounts at a glance.'
    },
    {
      element: '[data-tour="purchases-filters"]',
      title: 'Filter & Actions',
      description: 'Search invoices, filter by status, or create new purchase and return records.'
    },
    {
      element: '[data-tour="purchases-table"]',
      title: 'Purchase History',
      description: 'Review purchase orders, inspect details, or remove incorrect entries.'
    }
  ]
}

// Returns Tour
export const returnsTour: TourConfig = {
  name: 'returns',
  steps: [
    {
      element: '[data-tour="returns-header"]',
      title: 'Returns & Damages',
      description: 'Handle customer returns, supplier returns, and damaged stock in one place.'
    },
    {
      element: '[data-tour="returns-tabs"]',
      title: 'Tabbed Views',
      description: 'Switch between sales returns, purchase returns, and damaged items tracking.'
    },
    {
      element: '[data-tour="sales-returns-table"]',
      title: 'Sales Returns List',
      description: 'Inspect customer returns, view details, and validate refund requests.'
    }
  ]
}

// Customers Tour
export const customersTour: TourConfig = {
  name: 'customers',
  steps: [
    {
      element: '[data-tour="customers-header"]',
      title: 'Customer Management',
      description: 'Maintain your patient and customer directory from this page.'
    },
    {
      element: '[data-tour="customers-stats"]',
      title: 'Customer Insights',
      description: 'Review loyalty performance, total customers, and lifetime value.'
    },
    {
      element: '[data-tour="customers-filters"]',
      title: 'Find Customers Quickly',
      description: 'Search or filter customers, and add new records when needed.'
    },
    {
      element: '[data-tour="customers-table"]',
      title: 'Customer List',
      description: 'View customer profiles and update contact or loyalty details.'
    }
  ]
}

// Bank Accounts Tour
export const bankAccountsTour: TourConfig = {
  name: 'bankAccounts',
  steps: [
    {
      element: '[data-tour="bank-accounts-header"]',
      title: 'Financial Accounts',
      description: 'Oversee cash drawers and bank accounts tied to your pharmacy.'
    },
    {
      element: '[data-tour="bank-accounts-stats"]',
      title: 'Balance Overview',
      description: 'Monitor balances and account distribution across all institutions.'
    },
    {
      element: '[data-tour="bank-accounts-search"]',
      title: 'Account Controls',
      description: 'Search accounts or create new financial records.'
    },
    {
      element: '[data-tour="bank-accounts-table"]',
      title: 'Accounts Table',
      description: 'Edit, delete, or adjust balances directly from the ledger view.'
    }
  ]
}

// Reports Tour
export const reportsTour: TourConfig = {
  name: 'reports',
  steps: [
    {
      element: '[data-tour="reports-header"]',
      title: 'Analytics Dashboard',
      description: 'Review business performance with flexible pharmacy reports.'
    },
    {
      element: '[data-tour="reports-filters"]',
      title: 'Configure Reports',
      description: 'Change the report type, adjust the date range, or export data.'
    },
    {
      element: '[data-tour="reports-overview"]',
      title: 'Overview Widgets',
      description: 'Analyze key indicators like revenue, inventory status, and top products.'
    }
  ]
}

// Users Tour
export const usersTour: TourConfig = {
  name: 'users',
  steps: [
    {
      element: '[data-tour="users-header"]',
      title: 'User Administration',
      description: 'Control access to the system and manage staff accounts.'
    },
    {
      element: '[data-tour="users-tabs"]',
      title: 'Management Tabs',
      description: 'Navigate between user management, attendance, salary, and permission matrix.'
    },
    {
      element: '[data-tour="users-actions"]',
      title: 'User Actions Bar',
      description: 'Search users, filter by role, or create new accounts.'
    },
    {
      element: '[data-tour="users-table"]',
      title: 'User List',
      description: 'View accounts, adjust roles, or activate and deactivate staff.'
    },
    {
      element: '[data-tour="users-details"]',
      title: 'User Details',
      description: 'Inspect a selected user and reset their password when authorized.'
    }
  ]
}

// Audit Logs Tour
export const auditLogsTour: TourConfig = {
  name: 'auditLogs',
  steps: [
    {
      element: '[data-tour="audit-header"]',
      title: 'Audit Trail',
      description: 'Review every critical action performed in the system.'
    },
    {
      element: '[data-tour="audit-stats"]',
      title: 'Activity Highlights',
      description: 'See recent activity and user actions summarized here.'
    },
    {
      element: '[data-tour="audit-filters"]',
      title: 'Filter Logs',
      description: 'Filter by date, action, or user to find specific events quickly.'
    },
    {
      element: '[data-tour="audit-table"]',
      title: 'Audit Entries',
      description: 'Dive into detailed log records and open entries for more information.'
    }
  ]
}

// Export all tours
export const tours = {
  dashboard: dashboardTour,
  pos: posTour,
  products: productsTour,
  inventory: inventoryTour,
  sales: salesTour,
  settings: settingsTour,
  firstTimeUser: firstTimeUserTour,
  categoryUnit: categoryUnitTour,
  suppliers: suppliersTour,
  supplierLedger: supplierLedgerTour,
  purchases: purchasesTour,
  returns: returnsTour,
  customers: customersTour,
  bankAccounts: bankAccountsTour,
  reports: reportsTour,
  users: usersTour,
  auditLogs: auditLogsTour
}

export default tours
