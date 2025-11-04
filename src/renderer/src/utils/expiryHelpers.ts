import { useSettingsStore } from '../store/settingsStore'

export interface ExpiryStatus {
  daysUntilExpiry: number
  status: 'expired' | 'critical' | 'warning' | 'near-expiry' | 'good'
  color: 'error' | 'warning' | 'info' | 'success'
  label: string
  shouldAlert: boolean
}

/**
 * Calculate expiry status based on settings
 */
export function getExpiryStatus(expiryDate: string | null | undefined): ExpiryStatus | null {
  if (!expiryDate) return null

  const expiry = new Date(expiryDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)

  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Get alert thresholds from settings
  const alertDaysString = useSettingsStore.getState().stockExpiryAlertDays || '90,60,30'
  const alertDays = alertDaysString
    .split(',')
    .map((d) => parseInt(d.trim()))
    .sort((a, b) => b - a)

  const [highThreshold = 90, midThreshold = 60, lowThreshold = 30] = alertDays

  if (daysUntilExpiry < 0) {
    return {
      daysUntilExpiry,
      status: 'expired',
      color: 'error',
      label: `Expired ${Math.abs(daysUntilExpiry)} days ago`,
      shouldAlert: true
    }
  } else if (daysUntilExpiry === 0) {
    return {
      daysUntilExpiry,
      status: 'critical',
      color: 'error',
      label: 'Expires today',
      shouldAlert: true
    }
  } else if (daysUntilExpiry <= lowThreshold) {
    return {
      daysUntilExpiry,
      status: 'critical',
      color: 'error',
      label: `${daysUntilExpiry} days until expiry`,
      shouldAlert: true
    }
  } else if (daysUntilExpiry <= midThreshold) {
    return {
      daysUntilExpiry,
      status: 'warning',
      color: 'warning',
      label: `${daysUntilExpiry} days until expiry`,
      shouldAlert: true
    }
  } else if (daysUntilExpiry <= highThreshold) {
    return {
      daysUntilExpiry,
      status: 'near-expiry',
      color: 'info',
      label: `${daysUntilExpiry} days until expiry`,
      shouldAlert: false
    }
  } else {
    return {
      daysUntilExpiry,
      status: 'good',
      color: 'success',
      label: `${daysUntilExpiry} days until expiry`,
      shouldAlert: false
    }
  }
}

/**
 * Check if should alert when selling near-expiry items
 */
export function shouldAlertOnSale(expiryDate: string | null | undefined): boolean {
  const alertEnabled = useSettingsStore.getState().stockAlertNearExpiry
  if (!alertEnabled || !expiryDate) return false

  const status = getExpiryStatus(expiryDate)
  return status ? status.shouldAlert : false
}

/**
 * Get expiry alert configuration
 */
export function getExpiryAlertConfig(): { days: number[]; enabled: boolean } {
  const alertDaysString = useSettingsStore.getState().stockExpiryAlertDays || '90,60,30'
  const days = alertDaysString
    .split(',')
    .map((d) => parseInt(d.trim()))
    .sort((a, b) => b - a)

  return {
    days,
    enabled: true
  }
}

/**
 * Format expiry date for display
 */
export function formatExpiryDate(expiryDate: string | null | undefined): string {
  if (!expiryDate) return 'No expiry date'

  const date = new Date(expiryDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
