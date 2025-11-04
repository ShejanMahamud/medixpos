import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'

interface ReportsSettingsProps {
  settings: Record<string, string>
  onSave: (updates: Record<string, string>) => Promise<void>
}

export default function ReportsSettings({
  settings,
  onSave
}: ReportsSettingsProps): React.ReactElement {
  const [localSettings, setLocalSettings] = useState({
    enableAutoReports: settings.enableAutoReports === 'true',
    autoReportFrequency: settings.autoReportFrequency || 'daily',
    autoReportEmail: settings.autoReportEmail || '',
    autoReportTypes: settings.autoReportTypes || 'sales,inventory',
    enableReportExport: settings.enableReportExport === 'true',
    defaultReportFormat: settings.defaultReportFormat || 'pdf',
    reportRetentionDays: settings.reportRetentionDays || '90'
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
        enableAutoReports: String(localSettings.enableAutoReports),
        autoReportFrequency: localSettings.autoReportFrequency,
        autoReportEmail: localSettings.autoReportEmail,
        autoReportTypes: localSettings.autoReportTypes,
        enableReportExport: String(localSettings.enableReportExport),
        defaultReportFormat: localSettings.defaultReportFormat,
        reportRetentionDays: localSettings.reportRetentionDays
      })
      setMessage({ type: 'success', text: 'Reports settings saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save reports settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Reports Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure automatic report generation and export preferences
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Auto Reports */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Automatic Reports
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enableAutoReports}
                onChange={(e) => handleChange('enableAutoReports', e.target.checked)}
              />
            }
            label="Enable Automatic Report Generation"
          />
          {localSettings.enableAutoReports && (
            <>
              <TextField
                select
                label="Report Frequency"
                value={localSettings.autoReportFrequency}
                onChange={(e) => handleChange('autoReportFrequency', e.target.value)}
                fullWidth
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </TextField>
              <TextField
                label="Email Address for Auto Reports"
                type="email"
                value={localSettings.autoReportEmail}
                onChange={(e) => handleChange('autoReportEmail', e.target.value)}
                fullWidth
                helperText="Multiple emails separated by comma"
              />
              <TextField
                label="Report Types"
                value={localSettings.autoReportTypes}
                onChange={(e) => handleChange('autoReportTypes', e.target.value)}
                fullWidth
                helperText="Comma-separated: sales, inventory, purchases, expenses"
              />
            </>
          )}
        </Box>

        {/* Export Settings */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Export Settings
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enableReportExport}
                onChange={(e) => handleChange('enableReportExport', e.target.checked)}
              />
            }
            label="Enable Report Export"
          />
          <TextField
            select
            label="Default Export Format"
            value={localSettings.defaultReportFormat}
            onChange={(e) => handleChange('defaultReportFormat', e.target.value)}
            fullWidth
          >
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="excel">Excel</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </TextField>
        </Box>

        {/* Data Retention */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Data Retention
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <TextField
            label="Report Retention Period (Days)"
            type="number"
            value={localSettings.reportRetentionDays}
            onChange={(e) => handleChange('reportRetentionDays', e.target.value)}
            fullWidth
            helperText="How long to keep generated reports (0 = keep forever)"
            inputProps={{ min: 0 }}
          />
        </Box>

        <Button type="submit" variant="contained" disabled={saving} sx={{ mt: 2 }}>
          {saving ? 'Saving...' : 'Save Reports Settings'}
        </Button>
      </Box>
    </Paper>
  )
}
