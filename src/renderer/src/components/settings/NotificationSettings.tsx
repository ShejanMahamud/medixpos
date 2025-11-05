/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useState, type ReactElement } from 'react'

interface NotificationSettingsProps {
  settings: Record<string, string>
  onSave: (updates: Record<string, string>) => Promise<void>
}

export default function NotificationSettings({
  settings,
  onSave
}: NotificationSettingsProps): ReactElement {
  const [localSettings, setLocalSettings] = useState({
    enableEmailNotifications: settings.enableEmailNotifications === 'true',
    emailHost: settings.emailHost || '',
    emailPort: settings.emailPort || '587',
    emailUsername: settings.emailUsername || '',
    emailFrom: settings.emailFrom || '',
    enableSmsNotifications: settings.enableSmsNotifications === 'false' ? false : false,
    smsProvider: settings.smsProvider || '',
    smsApiKey: settings.smsApiKey || '',
    enableDesktopNotifications: settings.enableDesktopNotifications === 'true'
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (field: string, value: string | boolean): void => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      await onSave({
        enableEmailNotifications: String(localSettings.enableEmailNotifications),
        emailHost: localSettings.emailHost,
        emailPort: localSettings.emailPort,
        emailUsername: localSettings.emailUsername,
        emailFrom: localSettings.emailFrom,
        enableSmsNotifications: String(localSettings.enableSmsNotifications),
        smsProvider: localSettings.smsProvider,
        smsApiKey: localSettings.smsApiKey,
        enableDesktopNotifications: String(localSettings.enableDesktopNotifications)
      })
      setMessage({ type: 'success', text: 'Notification settings saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save notification settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notification Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure email, SMS, and desktop notification preferences for alerts and reports
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Email Notifications */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Email Notifications
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enableEmailNotifications}
                onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
              />
            }
            label="Enable Email Notifications"
          />
          {localSettings.enableEmailNotifications && (
            <>
              <TextField
                label="SMTP Host"
                value={localSettings.emailHost}
                onChange={(e) => handleChange('emailHost', e.target.value)}
                fullWidth
                helperText="e.g., smtp.gmail.com"
              />
              <TextField
                label="SMTP Port"
                type="number"
                value={localSettings.emailPort}
                onChange={(e) => handleChange('emailPort', e.target.value)}
                fullWidth
                helperText="Default: 587 (TLS) or 465 (SSL)"
              />
              <TextField
                label="Email Username"
                value={localSettings.emailUsername}
                onChange={(e) => handleChange('emailUsername', e.target.value)}
                fullWidth
              />
              <TextField
                label="From Email Address"
                type="email"
                value={localSettings.emailFrom}
                onChange={(e) => handleChange('emailFrom', e.target.value)}
                fullWidth
                helperText="Email address that will appear as sender"
              />
            </>
          )}
        </Box>

        {/* SMS Notifications */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          SMS Notifications
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enableSmsNotifications}
                onChange={(e) => handleChange('enableSmsNotifications', e.target.checked)}
              />
            }
            label="Enable SMS Notifications"
          />
          {localSettings.enableSmsNotifications && (
            <>
              <TextField
                label="SMS Provider"
                value={localSettings.smsProvider}
                onChange={(e) => handleChange('smsProvider', e.target.value)}
                fullWidth
                helperText="e.g., Twilio, Vonage, etc."
              />
              <TextField
                label="SMS API Key"
                type="password"
                value={localSettings.smsApiKey}
                onChange={(e) => handleChange('smsApiKey', e.target.value)}
                fullWidth
              />
            </>
          )}
        </Box>

        {/* Desktop Notifications */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Desktop Notifications
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enableDesktopNotifications}
                onChange={(e) => handleChange('enableDesktopNotifications', e.target.checked)}
              />
            }
            label="Enable Desktop Notifications"
          />
          <Typography variant="caption" color="text.secondary">
            Show system notifications for low stock, expiring items, and other important alerts
          </Typography>
        </Box>

        <Button type="submit" variant="contained" disabled={saving} sx={{ mt: 2 }}>
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </Box>
    </Paper>
  )
}
