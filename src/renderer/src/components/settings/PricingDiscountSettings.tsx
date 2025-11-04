import { Box, Button, Paper, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface PricingDiscountSettingsProps {
  onSave: (settings: Record<string, string>) => Promise<void>
  initialValues: Record<string, string>
}

export default function PricingDiscountSettings({
  onSave,
  initialValues
}: PricingDiscountSettingsProps): React.JSX.Element {
  const [defaultMarkup, setDefaultMarkup] = useState(
    initialValues.pricing_default_markup_percentage || '25'
  )
  const [roundToNearest, setRoundToNearest] = useState(
    initialValues.pricing_round_to_nearest || '0.50'
  )
  const [maxDiscountCashier, setMaxDiscountCashier] = useState(
    initialValues.discount_max_percentage_cashier || '5'
  )
  const [maxDiscountManager, setMaxDiscountManager] = useState(
    initialValues.discount_max_percentage_manager || '15'
  )
  const [maxDiscountAdmin, setMaxDiscountAdmin] = useState(
    initialValues.discount_max_percentage_admin || '50'
  )
  const [requireReason, setRequireReason] = useState(
    initialValues.discount_require_reason === 'true'
  )
  const [reasonThreshold, setReasonThreshold] = useState(
    initialValues.discount_reason_threshold || '10'
  )
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(
    initialValues.loyalty_points_enabled === 'true'
  )
  const [pointsPerCurrency, setPointsPerCurrency] = useState(
    initialValues.loyalty_points_per_currency || '100'
  )
  const [redemptionRate, setRedemptionRate] = useState(
    initialValues.loyalty_points_redemption_rate || '0.01'
  )

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSave({
      pricing_default_markup_percentage: defaultMarkup,
      pricing_round_to_nearest: roundToNearest,
      discount_max_percentage_cashier: maxDiscountCashier,
      discount_max_percentage_manager: maxDiscountManager,
      discount_max_percentage_admin: maxDiscountAdmin,
      discount_require_reason: requireReason.toString(),
      discount_reason_threshold: reasonThreshold,
      loyalty_points_enabled: loyaltyEnabled.toString(),
      loyalty_points_per_currency: pointsPerCurrency,
      loyalty_points_redemption_rate: redemptionRate
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Pricing & Discounts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure pricing rules, discount limits, and loyalty program
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Pricing Rules */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Pricing Rules
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
                label="Default Markup Percentage"
                type="number"
                value={defaultMarkup}
                onChange={(e) => setDefaultMarkup(e.target.value)}
                placeholder="25"
                fullWidth
                inputProps={{ min: 0, max: 1000, step: 0.1 }}
                helperText="Default markup % applied to new products"
              />

              <TextField
                label="Round Prices To Nearest"
                type="number"
                value={roundToNearest}
                onChange={(e) => setRoundToNearest(e.target.value)}
                placeholder="0.50"
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Round final prices (e.g., 0.50 = nearest 50 cents)"
              />
            </Box>
          </Box>

          {/* Role-Based Discount Limits */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Role-Based Discount Limits
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Maximum discount percentage each role can apply
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3
              }}
            >
              <TextField
                label="Cashier Max Discount %"
                type="number"
                value={maxDiscountCashier}
                onChange={(e) => setMaxDiscountCashier(e.target.value)}
                placeholder="5"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="Manager Max Discount %"
                type="number"
                value={maxDiscountManager}
                onChange={(e) => setMaxDiscountManager(e.target.value)}
                placeholder="15"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />

              <TextField
                label="Admin Max Discount %"
                type="number"
                value={maxDiscountAdmin}
                onChange={(e) => setMaxDiscountAdmin(e.target.value)}
                placeholder="50"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
          </Box>

          {/* Discount Approval */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Discount Approval
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Require Reason for Large Discounts
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Staff must provide a reason when discount exceeds threshold
                  </Typography>
                </Box>
                <Switch
                  checked={requireReason}
                  onChange={(e) => setRequireReason(e.target.checked)}
                />
              </Box>

              {requireReason && (
                <TextField
                  label="Reason Required Above (%)"
                  type="number"
                  value={reasonThreshold}
                  onChange={(e) => setReasonThreshold(e.target.value)}
                  placeholder="10"
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                  helperText="Discount percentage that triggers reason requirement"
                  sx={{ maxWidth: { md: '50%' } }}
                />
              )}
            </Box>
          </Box>

          {/* Loyalty Points Program */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Loyalty Points Program
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Enable Loyalty Points
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Allow customers to earn and redeem loyalty points
                  </Typography>
                </Box>
                <Switch
                  checked={loyaltyEnabled}
                  onChange={(e) => setLoyaltyEnabled(e.target.checked)}
                />
              </Box>

              {loyaltyEnabled && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                    mt: 1
                  }}
                >
                  <TextField
                    label="Currency Amount Per Point"
                    type="number"
                    value={pointsPerCurrency}
                    onChange={(e) => setPointsPerCurrency(e.target.value)}
                    placeholder="100"
                    fullWidth
                    inputProps={{ min: 1 }}
                    helperText="Spend this amount to earn 1 point (e.g., $100 = 1 point)"
                  />

                  <TextField
                    label="Point Redemption Value"
                    type="number"
                    value={redemptionRate}
                    onChange={(e) => setRedemptionRate(e.target.value)}
                    placeholder="0.01"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Value of 1 point in currency (e.g., 1 point = $0.01)"
                  />
                </Box>
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
