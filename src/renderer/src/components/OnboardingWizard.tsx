/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import {
  ArrowBack,
  ArrowForward,
  Business,
  Check,
  CurrencyExchange,
  Receipt,
  Settings,
  Store
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  styled
} from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import { useSettingsStore } from '../store/settingsStore'

interface OnboardingData {
  // Basic Info (Step 1)
  storeName: string
  storeAddress: string
  storePhone: string
  storeEmail: string

  // Business Details (Step 2)
  businessLicenseNumber: string
  businessTaxId: string
  businessYearEstablished: string
  businessWebsite: string

  // Financial Settings (Step 3)
  currency: string
  taxRate: number
  lowStockThreshold: number
  pricingDefaultMarkupPercentage: number

  // Receipt Settings (Step 4)
  receiptHeaderText: string
  receiptFooter: string
  receiptTermsConditions: string
  receiptReturnPolicy: string
  enableReceiptPrinter: boolean
}

interface OnboardingWizardProps {
  onComplete: () => void
  onSkip?: () => void
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रु' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' }
]

const STEPS = [
  {
    label: 'Basic Information',
    description: 'Store name, contact details',
    icon: <Store />
  },
  {
    label: 'Business Details',
    description: 'License, tax information',
    icon: <Business />
  },
  {
    label: 'Financial Settings',
    description: 'Currency, pricing, taxes',
    icon: <CurrencyExchange />
  },
  {
    label: 'Receipt Settings',
    description: 'Print settings, terms',
    icon: <Receipt />
  }
]

const StyledStepIcon = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: ownerState.completed
      ? theme.palette.success.main
      : ownerState.active
        ? theme.palette.primary.main
        : theme.palette.grey[300],
    color: theme.palette.common.white,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 600
  })
)

function CustomStepIcon(props: StepIconProps): React.JSX.Element {
  const { active, completed } = props

  return (
    <StyledStepIcon ownerState={{ active, completed }}>
      {completed ? <Check /> : props.icon}
    </StyledStepIcon>
  )
}

export default function OnboardingWizard({
  onComplete,
  onSkip
}: OnboardingWizardProps): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    // Basic Info
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',

    // Business Details
    businessLicenseNumber: '',
    businessTaxId: '',
    businessYearEstablished: '',
    businessWebsite: '',

    // Financial Settings
    currency: 'USD',
    taxRate: 0,
    lowStockThreshold: 10,
    pricingDefaultMarkupPercentage: 25,

    // Receipt Settings
    receiptHeaderText: '',
    receiptFooter: 'Thank you for your business!',
    receiptTermsConditions: '',
    receiptReturnPolicy: '',
    enableReceiptPrinter: true
  })

  const loadSettings = useSettingsStore((state) => state.loadSettings)

  const handleInputChange =
    (field: keyof OnboardingData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: string | number | boolean } }
    ): void => {
      setData((prev) => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleNext = (): void => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1)
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(data.storeName && data.storeAddress)
      case 1:
        return true // Business details are optional
      case 2:
        return data.taxRate >= 0 && data.lowStockThreshold > 0
      case 3:
        return true // Receipt settings are optional
      default:
        return false
    }
  }

  const handleSkip = async (): Promise<void> => {
    try {
      // Mark onboarding as skipped, allowing access but showing reminder
      await window.api.settings.update('onboarding_skipped', 'true')

      toast('Setup skipped. You can complete it anytime in Settings.', {
        icon: 'ℹ️',
        duration: 4000
      })

      if (onSkip) {
        onSkip()
      } else {
        onComplete() // Fallback to complete if no skip handler
      }
    } catch (error) {
      console.error('Failed to skip onboarding:', error)
      toast.error('Failed to skip setup. Please try again.')
    }
  }

  const handleComplete = async (): Promise<void> => {
    if (!isStepValid(activeStep)) {
      toast.error('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      // Save all settings to the database
      const settingsToSave = [
        // Basic Info
        { key: 'store_name', value: data.storeName },
        { key: 'store_address', value: data.storeAddress },
        { key: 'store_phone', value: data.storePhone },
        { key: 'store_email', value: data.storeEmail },

        // Business Details
        { key: 'business_license_number', value: data.businessLicenseNumber },
        { key: 'business_tax_id', value: data.businessTaxId },
        { key: 'business_year_established', value: data.businessYearEstablished },
        { key: 'business_website', value: data.businessWebsite },

        // Financial Settings
        { key: 'currency', value: data.currency },
        { key: 'tax_rate', value: data.taxRate.toString() },
        { key: 'low_stock_threshold', value: data.lowStockThreshold.toString() },
        {
          key: 'pricing_default_markup_percentage',
          value: data.pricingDefaultMarkupPercentage.toString()
        },

        // Receipt Settings
        { key: 'receipt_header_text', value: data.receiptHeaderText || data.storeName },
        { key: 'receipt_footer', value: data.receiptFooter },
        { key: 'receipt_terms_conditions', value: data.receiptTermsConditions },
        { key: 'receipt_return_policy', value: data.receiptReturnPolicy },
        { key: 'enable_receipt_printer', value: data.enableReceiptPrinter ? 'true' : 'false' }
      ]

      // Save each setting
      for (const setting of settingsToSave) {
        if (setting.value) {
          await window.api.settings.update(setting.key, setting.value)
        }
      }

      // Mark onboarding as complete
      await window.api.settings.update('onboarding_complete', 'true')

      // Refresh settings in store
      await loadSettings()

      toast.success('Setup completed successfully! Welcome to MedixPOS!')
      onComplete()
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      toast.error('Failed to save configuration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (): React.JSX.Element => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Let&apos;s start with your store&apos;s basic information. This will be used
              throughout the system.
            </Typography>

            <TextField
              fullWidth
              required
              label="Store Name"
              value={data.storeName}
              onChange={handleInputChange('storeName')}
              placeholder="e.g., City Pharmacy, MediCare Plus"
              helperText="This will appear on receipts and reports"
            />

            <TextField
              fullWidth
              required
              label="Store Address"
              value={data.storeAddress}
              onChange={handleInputChange('storeAddress')}
              placeholder="Full store address"
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={data.storePhone}
                onChange={handleInputChange('storePhone')}
                placeholder="+1 (555) 123-4567"
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={data.storeEmail}
                onChange={handleInputChange('storeEmail')}
                placeholder="contact@yourstore.com"
              />
            </Box>
          </Box>
        )

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Optional business information for compliance and professional reporting.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Business License Number"
                value={data.businessLicenseNumber}
                onChange={handleInputChange('businessLicenseNumber')}
                placeholder="License number"
              />
              <TextField
                fullWidth
                label="Tax ID / VAT Number"
                value={data.businessTaxId}
                onChange={handleInputChange('businessTaxId')}
                placeholder="Tax identification number"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Year Established"
                value={data.businessYearEstablished}
                onChange={handleInputChange('businessYearEstablished')}
                placeholder="2020"
              />
              <TextField
                fullWidth
                label="Website"
                value={data.businessWebsite}
                onChange={handleInputChange('businessWebsite')}
                placeholder="https://yourstore.com"
              />
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure currency, tax rates, and default pricing for your pharmacy.
            </Typography>

            <FormControl fullWidth required>
              <InputLabel>Currency</InputLabel>
              <Select
                value={data.currency}
                label="Currency"
                onChange={(e) => handleInputChange('currency')(e)}
              >
                {CURRENCIES.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Default Tax Rate (%)"
                type="number"
                value={data.taxRate}
                onChange={handleInputChange('taxRate')}
                inputProps={{ min: 0, max: 100, step: 0.5 }}
                helperText="Applied to all products by default"
              />
              <TextField
                fullWidth
                required
                label="Low Stock Alert Threshold"
                type="number"
                value={data.lowStockThreshold}
                onChange={handleInputChange('lowStockThreshold')}
                inputProps={{ min: 1, max: 1000 }}
                helperText="Alert when stock falls below this"
              />
            </Box>

            <TextField
              fullWidth
              label="Default Markup Percentage (%)"
              type="number"
              value={data.pricingDefaultMarkupPercentage}
              onChange={handleInputChange('pricingDefaultMarkupPercentage')}
              inputProps={{ min: 0, max: 500, step: 5 }}
              helperText="Default profit margin for new products"
            />
          </Box>
        )

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Receipt Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customize how your receipts look and what information they contain.
            </Typography>

            <TextField
              fullWidth
              label="Receipt Header Text"
              value={data.receiptHeaderText}
              onChange={handleInputChange('receiptHeaderText')}
              placeholder={`${data.storeName || 'Your Store Name'}`}
              helperText="Leave empty to use store name"
            />

            <TextField
              fullWidth
              label="Receipt Footer Message"
              value={data.receiptFooter}
              onChange={handleInputChange('receiptFooter')}
              placeholder="Thank you for your business!"
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="Terms & Conditions"
              value={data.receiptTermsConditions}
              onChange={handleInputChange('receiptTermsConditions')}
              placeholder="Optional terms and conditions text"
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="Return Policy"
              value={data.receiptReturnPolicy}
              onChange={handleInputChange('receiptReturnPolicy')}
              placeholder="e.g., Returns accepted within 30 days with receipt"
              multiline
              rows={2}
            />

            <Alert severity="info">
              <Typography variant="body2">
                You can customize these settings later in the Settings section.
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  const progress = ((activeStep + 1) / STEPS.length) * 100

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 4
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: 2,
              mb: 2,
              overflow: 'hidden'
            }}
          >
            <img
              src={logo}
              alt="MedixPOS Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
            Welcome to MedixPOS
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let&apos;s set up your pharmacy management system
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Step {activeStep + 1} of {STEPS.length}
            </Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Card elevation={0} sx={{ mb: 4, border: 1, borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((step) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {step.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent()}

            <Divider sx={{ my: 4 }} />

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading}
                >
                  Back
                </Button>

                {/* Skip Button - only show on first step */}
                {activeStep === 0 && (
                  <Button
                    variant="text"
                    onClick={handleSkip}
                    disabled={loading}
                    sx={{ ml: 1, color: 'text.secondary' }}
                  >
                    Skip for Now
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {activeStep < STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    disabled={!isStepValid(activeStep) || loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={
                      loading ? <CircularProgress size={20} color="inherit" /> : <Settings />
                    }
                    onClick={handleComplete}
                    disabled={!isStepValid(activeStep) || loading}
                    size="large"
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Johuniq. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
