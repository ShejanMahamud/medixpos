import { Alert, Box, Button, Paper, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface InventoryStockSettingsProps {
  initialValues: Record<string, string>
  onSave: (settings: Record<string, string>) => Promise<void>
}

export default function InventoryStockSettings({
  initialValues,
  onSave
}: InventoryStockSettingsProps): React.JSX.Element {
  const [enableBatchTracking, setEnableBatchTracking] = useState(
    initialValues.stock_enable_batch_tracking === 'true'
  )
  const [showExpiryOnSale, setShowExpiryOnSale] = useState(
    initialValues.stock_show_expiry_on_sale === 'true'
  )
  const [alertNearExpiry, setAlertNearExpiry] = useState(
    initialValues.stock_alert_near_expiry === 'true'
  )
  const [negativeStockAllowed, setNegativeStockAllowed] = useState(
    initialValues.stock_negative_stock_allowed === 'true'
  )
  const [enableAutoReorder, setEnableAutoReorder] = useState(
    initialValues.stock_enable_auto_reorder === 'true'
  )
  const [expiryAlertDays, setExpiryAlertDays] = useState(
    initialValues.stock_expiry_alert_days || '90,60,30'
  )
  const [criticalLevel, setCriticalLevel] = useState(initialValues.stock_critical_level || '5')
  const [reorderLeadTime, setReorderLeadTime] = useState(
    initialValues.stock_reorder_lead_time_days || '7'
  )

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      await onSave({
        stock_enable_batch_tracking: String(enableBatchTracking),
        stock_show_expiry_on_sale: String(showExpiryOnSale),
        stock_alert_near_expiry: String(alertNearExpiry),
        stock_negative_stock_allowed: String(negativeStockAllowed),
        stock_enable_auto_reorder: String(enableAutoReorder),
        stock_expiry_alert_days: expiryAlertDays,
        stock_critical_level: criticalLevel,
        stock_reorder_lead_time_days: reorderLeadTime
      })
      setMessage({ type: 'success', text: 'Inventory settings saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save inventory settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Inventory & Stock Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure batch tracking, expiry alerts, and automatic reorder suggestions
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}>
          {/* Batch Tracking */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Enable Batch/Lot Tracking
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Track products by batch numbers and manufacture dates
              </Typography>
            </Box>
            <Switch
              checked={enableBatchTracking}
              onChange={(e) => setEnableBatchTracking(e.target.checked)}
            />
          </Box>

          {/* Show Expiry on Sale */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Show Expiry During Sale
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Display expiry dates when making sales
              </Typography>
            </Box>
            <Switch
              checked={showExpiryOnSale}
              onChange={(e) => setShowExpiryOnSale(e.target.checked)}
            />
          </Box>

          {/* Alert Near Expiry */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Alert When Selling Near-Expiry Items
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Warn staff when selling items close to expiry
              </Typography>
            </Box>
            <Switch
              checked={alertNearExpiry}
              onChange={(e) => setAlertNearExpiry(e.target.checked)}
            />
          </Box>

          {/* Negative Stock */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Allow Negative Stock (Overselling)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Permit sales even when stock is zero
              </Typography>
            </Box>
            <Switch
              checked={negativeStockAllowed}
              onChange={(e) => setNegativeStockAllowed(e.target.checked)}
            />
          </Box>

          {/* Auto Reorder */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Enable Auto-Reorder Suggestions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Automatically suggest products to reorder
              </Typography>
            </Box>
            <Switch
              checked={enableAutoReorder}
              onChange={(e) => setEnableAutoReorder(e.target.checked)}
            />
          </Box>

          {/* Expiry Alert Days */}
          <TextField
            label="Expiry Alert Days"
            value={expiryAlertDays}
            onChange={(e) => setExpiryAlertDays(e.target.value)}
            placeholder="90,60,30"
            fullWidth
            helperText="Comma-separated days before expiry to trigger alerts (e.g., 90,60,30)"
          />

          {/* Critical Level */}
          <TextField
            label="Critical Stock Level"
            type="number"
            value={criticalLevel}
            onChange={(e) => setCriticalLevel(e.target.value)}
            placeholder="5"
            fullWidth
            helperText="Stock quantity that triggers critical (red) alerts"
            inputProps={{ min: 0 }}
          />

          {/* Reorder Lead Time */}
          <TextField
            label="Reorder Lead Time (Days)"
            type="number"
            value={reorderLeadTime}
            onChange={(e) => setReorderLeadTime(e.target.value)}
            placeholder="7"
            fullWidth
            helperText="Average days for supplier to deliver orders"
            inputProps={{ min: 1 }}
          />
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
          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
