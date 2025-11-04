import { Box, Button, Paper, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface POSSettingsProps {
  onSave: (settings: Record<string, string>) => Promise<void>
  initialValues: Record<string, string>
}

export default function POSSettings({
  onSave,
  initialValues
}: POSSettingsProps): React.JSX.Element {
  const [showProductImages, setShowProductImages] = useState(
    initialValues.pos_show_product_images === 'true'
  )
  const [enableQuickActions, setEnableQuickActions] = useState(
    initialValues.pos_enable_quick_actions === 'true'
  )
  const [allowSplitPayment, setAllowSplitPayment] = useState(
    initialValues.pos_allow_split_payment === 'true'
  )
  const [showStockQuantity, setShowStockQuantity] = useState(
    initialValues.pos_show_stock_quantity === 'true'
  )
  const [alertLowStock, setAlertLowStock] = useState(initialValues.pos_alert_low_stock === 'true')
  const [enableHoldInvoice, setEnableHoldInvoice] = useState(
    initialValues.pos_enable_hold_invoice === 'true'
  )
  const [maxHoldInvoices, setMaxHoldInvoices] = useState(
    initialValues.pos_max_hold_invoices || '10'
  )

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSave({
      pos_show_product_images: showProductImages.toString(),
      pos_enable_quick_actions: enableQuickActions.toString(),
      pos_allow_split_payment: allowSplitPayment.toString(),
      pos_show_stock_quantity: showStockQuantity.toString(),
      pos_alert_low_stock: alertLowStock.toString(),
      pos_enable_hold_invoice: enableHoldInvoice.toString(),
      pos_max_hold_invoices: maxHoldInvoices
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          POS & Sales Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure point-of-sale behavior and features
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Display Options */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Display Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Product Images
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display product images in POS interface
                  </Typography>
                </Box>
                <Switch
                  checked={showProductImages}
                  onChange={(e) => setShowProductImages(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Stock Quantity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display available stock count in POS
                  </Typography>
                </Box>
                <Switch
                  checked={showStockQuantity}
                  onChange={(e) => setShowStockQuantity(e.target.checked)}
                />
              </Box>
            </Box>
          </Box>

          {/* Features */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              POS Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Enable Quick Action Buttons
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show quick access buttons for common actions
                  </Typography>
                </Box>
                <Switch
                  checked={enableQuickActions}
                  onChange={(e) => setEnableQuickActions(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Allow Split Payment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable payment using multiple methods (cash + card)
                  </Typography>
                </Box>
                <Switch
                  checked={allowSplitPayment}
                  onChange={(e) => setAllowSplitPayment(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Enable Hold/Park Invoice
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Allow parking incomplete sales to complete later
                  </Typography>
                </Box>
                <Switch
                  checked={enableHoldInvoice}
                  onChange={(e) => setEnableHoldInvoice(e.target.checked)}
                />
              </Box>

              {enableHoldInvoice && (
                <TextField
                  label="Maximum Held Invoices"
                  type="number"
                  value={maxHoldInvoices}
                  onChange={(e) => setMaxHoldInvoices(e.target.value)}
                  placeholder="10"
                  fullWidth
                  inputProps={{ min: 1, max: 50 }}
                  helperText="Maximum number of invoices that can be held simultaneously"
                  sx={{ maxWidth: { md: '50%' }, ml: 2 }}
                />
              )}
            </Box>
          </Box>

          {/* Alerts & Warnings */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Alerts & Warnings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Alert When Low Stock During Sale
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Warn staff when adding low-stock items to cart
                  </Typography>
                </Box>
                <Switch
                  checked={alertLowStock}
                  onChange={(e) => setAlertLowStock(e.target.checked)}
                />
              </Box>
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
