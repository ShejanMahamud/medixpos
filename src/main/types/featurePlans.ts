/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

/**
 * Feature Plans for MedixPOS License Tiers
 *
 * Using prefix-based filtering system:
 * - TRIAL: 30-day trial with limited features
 * - LITE: Basic pharmacy operations
 * - BASIC: Standard pharmacy management
 * - PRO: Advanced features and enterprise capabilities
 */

export type LicenseTier = 'TRIAL' | 'LITE' | 'BASIC' | 'PRO'

export interface FeatureConfig {
  id: string
  name: string
  description: string
  category: FeatureCategory
  requiredTier: LicenseTier
  isCore?: boolean // Core features always available
  limitations?: FeatureLimitations
}

export interface FeatureLimitations {
  maxProducts?: number
  maxCustomers?: number
  maxUsers?: number
  maxSalesPerDay?: number
  maxBankAccounts?: number
  dataRetentionDays?: number
  reportsAccess?: 'basic' | 'advanced' | 'full'
  backupFrequency?: 'none' | 'weekly' | 'daily' | 'realtime'
  supportLevel?: 'community' | 'email' | 'priority' | 'dedicated'
}

export type FeatureCategory =
  | 'core'
  | 'sales'
  | 'inventory'
  | 'customers'
  | 'reports'
  | 'advanced'
  | 'enterprise'

/**
 * Complete Feature Configuration for MedixPOS
 */
export const FEATURE_PLANS: FeatureConfig[] = [
  // ==================== CORE FEATURES (Always Available) ====================
  {
    id: 'auth',
    name: 'User Authentication',
    description: 'Login and basic user management',
    category: 'core',
    requiredTier: 'TRIAL',
    isCore: true
  },
  {
    id: 'dashboard',
    name: 'Basic Dashboard',
    description: 'Overview of business metrics',
    category: 'core',
    requiredTier: 'TRIAL',
    isCore: true
  },

  // ==================== TRIAL TIER FEATURES ====================
  {
    id: 'pos_basic',
    name: 'Basic Point of Sale',
    description: 'Simple sales transactions with basic receipt printing',
    category: 'sales',
    requiredTier: 'TRIAL',
    limitations: {
      maxSalesPerDay: 20,
      maxProducts: 100,
      maxCustomers: 50
    }
  },
  {
    id: 'products_basic',
    name: 'Basic Product Management',
    description: 'Add/edit products with basic information',
    category: 'inventory',
    requiredTier: 'TRIAL',
    limitations: {
      maxProducts: 100
    }
  },
  {
    id: 'inventory_basic',
    name: 'Basic Inventory Tracking',
    description: 'Track stock quantities and low stock alerts',
    category: 'inventory',
    requiredTier: 'TRIAL'
  },
  {
    id: 'sales_view',
    name: 'Sales History View',
    description: 'View recent sales transactions',
    category: 'sales',
    requiredTier: 'TRIAL',
    limitations: {
      dataRetentionDays: 7
    }
  },

  // ==================== LITE TIER FEATURES ====================
  {
    id: 'customers_management',
    name: 'Customer Management',
    description: 'Add/edit customers and track purchase history',
    category: 'customers',
    requiredTier: 'LITE',
    limitations: {
      maxCustomers: 500
    }
  },
  {
    id: 'categories_units',
    name: 'Categories & Units',
    description: 'Organize products by categories and measurement units',
    category: 'inventory',
    requiredTier: 'LITE'
  },
  {
    id: 'basic_reports',
    name: 'Basic Reports',
    description: 'Daily sales and inventory reports',
    category: 'reports',
    requiredTier: 'LITE',
    limitations: {
      reportsAccess: 'basic',
      dataRetentionDays: 30
    }
  },
  {
    id: 'receipt_customization',
    name: 'Receipt Customization',
    description: 'Customize receipt format and business info',
    category: 'sales',
    requiredTier: 'LITE'
  },
  {
    id: 'settings_basic',
    name: 'Basic Settings',
    description: 'Store settings, pricing, and notifications',
    category: 'core',
    requiredTier: 'LITE'
  },

  // ==================== BASIC TIER FEATURES ====================
  {
    id: 'purchases_management',
    name: 'Purchase Management',
    description: 'Manage supplier purchases and purchase orders',
    category: 'inventory',
    requiredTier: 'BASIC'
  },
  {
    id: 'suppliers_management',
    name: 'Supplier Management',
    description: 'Add/edit suppliers and track payment history',
    category: 'inventory',
    requiredTier: 'BASIC'
  },
  {
    id: 'returns_handling',
    name: 'Returns & Refunds',
    description: 'Handle product returns and customer refunds',
    category: 'sales',
    requiredTier: 'BASIC'
  },
  {
    id: 'prescriptions',
    name: 'Prescription Management',
    description: 'Track prescriptions and medication dispensing',
    category: 'customers',
    requiredTier: 'BASIC'
  },
  {
    id: 'bank_accounts',
    name: 'Account Management',
    description: 'Manage bank accounts and cash flow',
    category: 'reports',
    requiredTier: 'BASIC',
    limitations: {
      maxBankAccounts: 5
    }
  },
  {
    id: 'advanced_reports',
    name: 'Advanced Reports',
    description: 'Profit/loss, sales trends, and inventory reports',
    category: 'reports',
    requiredTier: 'BASIC',
    limitations: {
      reportsAccess: 'advanced',
      dataRetentionDays: 90
    }
  },
  {
    id: 'multi_users',
    name: 'Multi-User Support',
    description: 'Add multiple users with basic role management',
    category: 'enterprise',
    requiredTier: 'BASIC',
    limitations: {
      maxUsers: 5
    }
  },
  {
    id: 'backup_weekly',
    name: 'Weekly Backups',
    description: 'Automated weekly database backups',
    category: 'enterprise',
    requiredTier: 'BASIC',
    limitations: {
      backupFrequency: 'weekly'
    }
  },

  // ==================== PRO TIER FEATURES ====================
  {
    id: 'audit_logs',
    name: 'Audit Logs',
    description: 'Comprehensive activity logging and audit trails',
    category: 'enterprise',
    requiredTier: 'PRO'
  },
  {
    id: 'advanced_users',
    name: 'Advanced User Management',
    description: 'Role-based permissions and user activity tracking',
    category: 'enterprise',
    requiredTier: 'PRO',
    limitations: {
      maxUsers: 25
    }
  },
  {
    id: 'attendance_salary',
    name: 'HR Management',
    description: 'Employee attendance tracking and salary management',
    category: 'enterprise',
    requiredTier: 'PRO'
  },
  {
    id: 'comprehensive_reports',
    name: 'Comprehensive Reporting',
    description: 'Full analytics, custom reports, and data insights',
    category: 'reports',
    requiredTier: 'PRO',
    limitations: {
      reportsAccess: 'full',
      dataRetentionDays: 365
    }
  },
  {
    id: 'advanced_inventory',
    name: 'Advanced Inventory',
    description: 'Batch tracking, expiry management, and damage tracking',
    category: 'inventory',
    requiredTier: 'PRO'
  },
  {
    id: 'pos_advanced',
    name: 'Advanced POS Features',
    description: 'Barcode scanning, custom shortcuts, and advanced payment options',
    category: 'sales',
    requiredTier: 'PRO'
  },
  {
    id: 'bulk_operations',
    name: 'Bulk Operations',
    description: 'Bulk import/export and batch processing',
    category: 'advanced',
    requiredTier: 'PRO'
  },
  {
    id: 'hardware_integration',
    name: 'Hardware Integration',
    description: 'Receipt printers, barcode scanners, and POS hardware',
    category: 'advanced',
    requiredTier: 'PRO'
  },
  {
    id: 'backup_daily',
    name: 'Daily Backups',
    description: 'Automated daily database backups with cloud storage',
    category: 'enterprise',
    requiredTier: 'PRO',
    limitations: {
      backupFrequency: 'daily'
    }
  },
  {
    id: 'notifications_advanced',
    name: 'Advanced Notifications',
    description: 'Real-time alerts, email notifications, and custom triggers',
    category: 'advanced',
    requiredTier: 'PRO'
  },
  {
    id: 'api_access',
    name: 'API Access',
    description: 'REST API for third-party integrations',
    category: 'enterprise',
    requiredTier: 'PRO'
  },
  {
    id: 'priority_support',
    name: 'Priority Support',
    description: 'Priority technical support and dedicated assistance',
    category: 'enterprise',
    requiredTier: 'PRO',
    limitations: {
      supportLevel: 'priority'
    }
  }
]

/**
 * Feature mapping for route/page access control
 */
export const PAGE_FEATURE_MAP: Record<string, string[]> = {
  '/': ['dashboard'],
  '/pos': ['pos_basic', 'pos_advanced'],
  '/products': ['products_basic'],
  '/inventory': ['inventory_basic', 'advanced_inventory'],
  '/sales': ['sales_view'],
  '/purchases': ['purchases_management'],
  '/returns': ['returns_handling'],
  '/suppliers': ['suppliers_management'],
  '/customers': ['customers_management'],
  '/prescriptions': ['prescriptions'],
  '/bank-accounts': ['bank_accounts'],
  '/reports': ['basic_reports', 'advanced_reports', 'comprehensive_reports'],
  '/users': ['multi_users', 'advanced_users'],
  '/audit-logs': ['audit_logs'],
  '/settings': ['settings_basic'],
  '/categories-units': ['categories_units'],
  '/supplier-ledger': ['suppliers_management']
}

/**
 * Component feature mapping for granular control
 */
export const COMPONENT_FEATURE_MAP: Record<string, string[]> = {
  // POS Components
  BarcodeScanner: ['pos_advanced'],
  AdvancedPaymentMethods: ['pos_advanced'],
  CustomShortcuts: ['pos_advanced'],

  // Product Components
  BulkImport: ['bulk_operations'],
  ProductExport: ['bulk_operations'],
  BarcodeGeneration: ['pos_advanced'],

  // Inventory Components
  BatchTracking: ['advanced_inventory'],
  ExpiryManagement: ['advanced_inventory'],
  DamageTracking: ['advanced_inventory'],

  // Reports Components
  AdvancedAnalytics: ['comprehensive_reports'],
  CustomReports: ['comprehensive_reports'],
  DataInsights: ['comprehensive_reports'],

  // Settings Components
  HardwareSettings: ['hardware_integration'],
  AdvancedNotifications: ['notifications_advanced'],
  BackupSettings: ['backup_weekly', 'backup_daily'],

  // User Components
  PermissionMatrix: ['advanced_users'],
  AttendanceTracking: ['attendance_salary'],
  SalaryManagement: ['attendance_salary']
}

function getRouteLookupKeys(route: string): string[] {
  const trimmed = route.trim() || '/'
  const keys = new Set<string>()

  keys.add(trimmed)

  if (trimmed.startsWith('/')) {
    const withoutSlash = trimmed.slice(1)
    if (withoutSlash.length > 0) {
      keys.add(withoutSlash)
    }
  } else {
    keys.add(`/${trimmed}`)
  }

  if (trimmed === '/' || trimmed === '') {
    keys.add('dashboard')
    keys.add('/dashboard')
  }

  if (trimmed === 'dashboard' || trimmed === '/dashboard') {
    keys.add('/')
  }

  return Array.from(keys)
}

export function getFeaturesForRoute(route: string): string[] {
  const lookupKeys = getRouteLookupKeys(route)
  const features = new Set<string>()

  for (const key of lookupKeys) {
    const routeFeatures = PAGE_FEATURE_MAP[key]
    if (routeFeatures) {
      for (const feature of routeFeatures) {
        features.add(feature)
      }
    }
  }

  return Array.from(features)
}

/**
 * Get features available for a specific license tier
 */
export function getFeaturesForTier(tier: LicenseTier): FeatureConfig[] {
  const tierOrder: LicenseTier[] = ['TRIAL', 'LITE', 'BASIC', 'PRO']
  const tierIndex = tierOrder.indexOf(tier)

  return FEATURE_PLANS.filter((feature) => {
    const requiredIndex = tierOrder.indexOf(feature.requiredTier)
    return requiredIndex <= tierIndex
  })
}

/**
 * Check if a feature is available for a specific license tier
 */
export function isFeatureAvailable(featureId: string, tier: LicenseTier): boolean {
  const feature = FEATURE_PLANS.find((f) => f.id === featureId)
  if (!feature) return false

  const tierOrder: LicenseTier[] = ['TRIAL', 'LITE', 'BASIC', 'PRO']
  const tierIndex = tierOrder.indexOf(tier)
  const requiredIndex = tierOrder.indexOf(feature.requiredTier)

  return requiredIndex <= tierIndex
}

/**
 * Get feature limitations for a specific tier
 */
export function getFeatureLimitations(
  featureId: string,
  tier: LicenseTier
): FeatureLimitations | undefined {
  const availableFeatures = getFeaturesForTier(tier)
  const feature = availableFeatures.find((f) => f.id === featureId)
  return feature?.limitations
}

/**
 * Check if a page/route is accessible for a specific license tier
 */
export function isPageAccessible(route: string, tier: LicenseTier): boolean {
  const requiredFeatures = getFeaturesForRoute(route)
  if (requiredFeatures.length === 0) return true // No specific requirements

  // Check if at least one required feature is available
  return requiredFeatures.some((featureId) => isFeatureAvailable(featureId, tier))
}

/**
 * Check if a component should be rendered for a specific license tier
 */
export function isComponentEnabled(componentName: string, tier: LicenseTier): boolean {
  const requiredFeatures = COMPONENT_FEATURE_MAP[componentName] || []
  if (requiredFeatures.length === 0) return true // No specific requirements

  // Check if at least one required feature is available
  return requiredFeatures.some((featureId) => isFeatureAvailable(featureId, tier))
}

/**
 * License tier information for UI display
 */
export const LICENSE_TIER_INFO: Record<
  LicenseTier,
  {
    name: string
    description: string
    color: string
    features: string[]
    limitations: string[]
    price?: string
  }
> = {
  TRIAL: {
    name: 'Trial',
    description: '30-day trial with basic features',
    color: '#9e9e9e',
    features: [
      'Basic POS (20 sales/day)',
      'Up to 100 products',
      'Up to 50 customers',
      'Basic inventory tracking',
      '7-day data retention'
    ],
    limitations: [
      '30-day time limit',
      'Limited transactions',
      'No advanced features',
      'Community support only'
    ]
  },
  LITE: {
    name: 'Lite',
    description: 'Perfect for small pharmacies',
    color: '#4caf50',
    features: [
      'Customer management (500 customers)',
      'Categories & units organization',
      'Basic reports (30-day retention)',
      'Receipt customization',
      'Basic settings configuration'
    ],
    limitations: ['No purchase management', 'Basic reporting only', 'No multi-user support'],
    price: '$29/month'
  },
  BASIC: {
    name: 'Basic',
    description: 'Standard pharmacy management',
    color: '#2196f3',
    features: [
      'Purchase & supplier management',
      'Returns & refunds handling',
      'Prescription management',
      'Multi-user support (5 users)',
      'Advanced reports (90-day retention)',
      'Weekly automated backups'
    ],
    limitations: [
      'Limited to 5 users',
      'No audit logs',
      'No HR management',
      'Basic backup frequency'
    ],
    price: '$59/month'
  },
  PRO: {
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    color: '#ff9800',
    features: [
      'Complete audit trails',
      'Advanced user management (25 users)',
      'HR & attendance management',
      'Comprehensive reporting (365-day retention)',
      'Hardware integration support',
      'Daily automated backups',
      'API access for integrations',
      'Priority support'
    ],
    limitations: ['Maximum 25 users'],
    price: '$99/month'
  }
}
