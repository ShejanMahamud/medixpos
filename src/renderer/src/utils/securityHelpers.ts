import { useSettingsStore } from '../store/settingsStore'

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates password against configured security policies
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  // Get current settings
  const minLength = useSettingsStore.getState().securityPasswordMinLength
  const requireUppercase = useSettingsStore.getState().securityPasswordRequireUppercase
  const requireNumbers = useSettingsStore.getState().securityPasswordRequireNumbers
  const requireSpecialChars = useSettingsStore.getState().securityPasswordRequireSpecialChars

  // Check minimum length
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }

  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  // Check for numbers
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  // Check for special characters
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get password requirements as display text
 */
export function getPasswordRequirements(): string[] {
  const requirements: string[] = []

  const minLength = useSettingsStore.getState().securityPasswordMinLength
  const requireUppercase = useSettingsStore.getState().securityPasswordRequireUppercase
  const requireNumbers = useSettingsStore.getState().securityPasswordRequireNumbers
  const requireSpecialChars = useSettingsStore.getState().securityPasswordRequireSpecialChars

  requirements.push(`At least ${minLength} characters`)

  if (requireUppercase) {
    requirements.push('One uppercase letter')
  }

  if (requireNumbers) {
    requirements.push('One number')
  }

  if (requireSpecialChars) {
    requirements.push('One special character')
  }

  return requirements
}

/**
 * Calculate session timeout timestamp
 */
export function getSessionTimeoutTimestamp(): number {
  const timeoutMinutes = useSettingsStore.getState().securitySessionTimeoutMinutes
  return Date.now() + timeoutMinutes * 60 * 1000
}

/**
 * Check if session has expired
 */
export function isSessionExpired(lastActivityTimestamp: number): boolean {
  const timeoutMinutes = useSettingsStore.getState().securitySessionTimeoutMinutes
  const timeoutMs = timeoutMinutes * 60 * 1000
  return Date.now() - lastActivityTimestamp > timeoutMs
}
