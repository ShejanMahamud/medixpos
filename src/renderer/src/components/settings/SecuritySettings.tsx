import { Box, Button, Paper, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface SecuritySettingsProps {
  onSave: (settings: Record<string, string>) => Promise<void>
  initialValues: Record<string, string>
}

export default function SecuritySettings({
  onSave,
  initialValues
}: SecuritySettingsProps): React.JSX.Element {
  const [sessionTimeout, setSessionTimeout] = useState(
    initialValues.security_session_timeout_minutes || '30'
  )
  const [passwordMinLength, setPasswordMinLength] = useState(
    initialValues.security_password_min_length || '8'
  )
  const [requireUppercase, setRequireUppercase] = useState(
    initialValues.security_password_require_uppercase === 'true'
  )
  const [requireNumbers, setRequireNumbers] = useState(
    initialValues.security_password_require_numbers === 'true'
  )
  const [requireSpecial, setRequireSpecial] = useState(
    initialValues.security_password_require_special === 'true'
  )
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(
    initialValues.security_max_login_attempts || '5'
  )
  const [lockoutDuration, setLockoutDuration] = useState(
    initialValues.security_lockout_duration_minutes || '15'
  )
  const [requireDeletionReason, setRequireDeletionReason] = useState(
    initialValues.security_require_deletion_reason === 'true'
  )
  const [enableAuditLog, setEnableAuditLog] = useState(
    initialValues.security_enable_audit_log === 'true'
  )
  const [auditRetention, setAuditRetention] = useState(
    initialValues.security_audit_retention_days || '365'
  )

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSave({
      security_session_timeout_minutes: sessionTimeout,
      security_password_min_length: passwordMinLength,
      security_password_require_uppercase: requireUppercase.toString(),
      security_password_require_numbers: requireNumbers.toString(),
      security_password_require_special: requireSpecial.toString(),
      security_max_login_attempts: maxLoginAttempts,
      security_lockout_duration_minutes: lockoutDuration,
      security_require_deletion_reason: requireDeletionReason.toString(),
      security_enable_audit_log: enableAuditLog.toString(),
      security_audit_retention_days: auditRetention
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Security & Access Control
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure password policies, session management, and audit logging
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Session Management */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Session Management
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Auto-Logout After Inactivity (minutes)"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                placeholder="30"
                fullWidth
                inputProps={{ min: 5, max: 480 }}
                helperText="Users will be logged out after this period of inactivity"
                sx={{ maxWidth: { md: '50%' } }}
              />
            </Box>
          </Box>

          {/* Password Policy */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Password Policy
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Minimum Password Length"
                type="number"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(e.target.value)}
                placeholder="8"
                fullWidth
                inputProps={{ min: 6, max: 32 }}
                helperText="Minimum number of characters required"
                sx={{ maxWidth: { md: '50%' } }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Require Uppercase Letters
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Password must contain at least one uppercase letter (A-Z)
                  </Typography>
                </Box>
                <Switch
                  checked={requireUppercase}
                  onChange={(e) => setRequireUppercase(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Require Numbers
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Password must contain at least one number (0-9)
                  </Typography>
                </Box>
                <Switch
                  checked={requireNumbers}
                  onChange={(e) => setRequireNumbers(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Require Special Characters
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Password must contain at least one special character (!@#$%^&*)
                  </Typography>
                </Box>
                <Switch
                  checked={requireSpecial}
                  onChange={(e) => setRequireSpecial(e.target.checked)}
                />
              </Box>
            </Box>
          </Box>

          {/* Login Security */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Login Security
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                mt: 2
              }}
            >
              <TextField
                label="Max Failed Login Attempts"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                placeholder="5"
                fullWidth
                inputProps={{ min: 3, max: 20 }}
                helperText="Account locked after this many failed attempts"
              />

              <TextField
                label="Lockout Duration (minutes)"
                type="number"
                value={lockoutDuration}
                onChange={(e) => setLockoutDuration(e.target.value)}
                placeholder="15"
                fullWidth
                inputProps={{ min: 5, max: 1440 }}
                helperText="How long account remains locked"
              />
            </Box>
          </Box>

          {/* Data Protection */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Data Protection
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Require Reason for Deletions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Staff must provide a reason when deleting records
                  </Typography>
                </Box>
                <Switch
                  checked={requireDeletionReason}
                  onChange={(e) => setRequireDeletionReason(e.target.checked)}
                />
              </Box>
            </Box>
          </Box>

          {/* Audit Logging */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Audit Logging
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Enable Comprehensive Audit Logging
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Track all user actions and data changes
                  </Typography>
                </Box>
                <Switch
                  checked={enableAuditLog}
                  onChange={(e) => setEnableAuditLog(e.target.checked)}
                />
              </Box>

              {enableAuditLog && (
                <TextField
                  label="Audit Log Retention (days)"
                  type="number"
                  value={auditRetention}
                  onChange={(e) => setAuditRetention(e.target.value)}
                  placeholder="365"
                  fullWidth
                  inputProps={{ min: 30, max: 3650 }}
                  helperText="Days to keep audit logs before automatic deletion"
                  sx={{ maxWidth: { md: '50%' } }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button type="submit" variant="contained" size="large">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
