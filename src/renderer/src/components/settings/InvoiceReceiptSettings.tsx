/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'

interface InvoiceReceiptSettingsProps {
  onSave: (settings: Record<string, string>) => Promise<void>
  initialValues: Record<string, string>
}

export default function InvoiceReceiptSettings({
  onSave,
  initialValues
}: InvoiceReceiptSettingsProps): React.JSX.Element {
  const [invoicePrefix, setInvoicePrefix] = useState(initialValues.invoice_prefix || 'INV')
  const [showLogo, setShowLogo] = useState(initialValues.receipt_show_logo === 'true')
  const [showBarcode, setShowBarcode] = useState(initialValues.receipt_show_barcode === 'true')
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(
    initialValues.receipt_show_tax_breakdown === 'true'
  )
  const [showDiscountDetails, setShowDiscountDetails] = useState(
    initialValues.receipt_show_discount_details === 'true'
  )
  const [fontSize, setFontSize] = useState(initialValues.receipt_font_size || '12')
  const [paperSize, setPaperSize] = useState(initialValues.receipt_paper_size || '80mm')
  const [headerText, setHeaderText] = useState(initialValues.receipt_header_text || '')
  const [termsConditions, setTermsConditions] = useState(
    initialValues.receipt_terms_conditions ||
      'Thank you for your purchase! All sales are final. Please check items before leaving.'
  )
  const [returnPolicy, setReturnPolicy] = useState(
    initialValues.receipt_return_policy || 'Returns accepted within 7 days with original receipt.'
  )
  const [autoPrint, setAutoPrint] = useState(initialValues.receipt_auto_print === 'true')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSave({
      invoice_prefix: invoicePrefix,
      receipt_show_logo: showLogo.toString(),
      receipt_show_barcode: showBarcode.toString(),
      receipt_show_tax_breakdown: showTaxBreakdown.toString(),
      receipt_show_discount_details: showDiscountDetails.toString(),
      receipt_font_size: fontSize,
      receipt_paper_size: paperSize,
      receipt_header_text: headerText,
      receipt_terms_conditions: termsConditions,
      receipt_return_policy: returnPolicy,
      receipt_auto_print: autoPrint.toString()
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Invoice & Receipt Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize invoice numbers, receipt appearance, and printing options
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Invoice Settings */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Invoice Settings
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
                label="Invoice Prefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="INV"
                fullWidth
                helperText="Prefix for invoice numbers (e.g., INV, SALE)"
              />
            </Box>
          </Box>

          {/* Receipt Display Options */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Receipt Display Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Logo on Receipt
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display store logo at the top of receipts
                  </Typography>
                </Box>
                <Switch checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Barcode
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display barcode for invoice tracking
                  </Typography>
                </Box>
                <Switch checked={showBarcode} onChange={(e) => setShowBarcode(e.target.checked)} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Tax Breakdown
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display detailed tax calculations
                  </Typography>
                </Box>
                <Switch
                  checked={showTaxBreakdown}
                  onChange={(e) => setShowTaxBreakdown(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Show Discount Details
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display item-wise discount information
                  </Typography>
                </Box>
                <Switch
                  checked={showDiscountDetails}
                  onChange={(e) => setShowDiscountDetails(e.target.checked)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Auto-Print Receipt
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically print receipt after completing sale
                  </Typography>
                </Box>
                <Switch checked={autoPrint} onChange={(e) => setAutoPrint(e.target.checked)} />
              </Box>
            </Box>
          </Box>

          {/* Receipt Format */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Receipt Format
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                mt: 2
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  label="Font Size"
                >
                  <MenuItem value="10">10pt - Small</MenuItem>
                  <MenuItem value="12">12pt - Medium (Default)</MenuItem>
                  <MenuItem value="14">14pt - Large</MenuItem>
                  <MenuItem value="16">16pt - Extra Large</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Paper Size</InputLabel>
                <Select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  label="Paper Size"
                >
                  <MenuItem value="58mm">58mm - Compact</MenuItem>
                  <MenuItem value="80mm">80mm - Standard</MenuItem>
                  <MenuItem value="A4">A4 - Letter Size</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Custom Text */}
          <Box>
            <Typography variant="subtitle2" fontWeight="semibold" gutterBottom>
              Custom Text
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Receipt Header Text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Optional header text above store details"
                fullWidth
                helperText="Displayed at the very top of the receipt"
              />

              <TextField
                label="Terms & Conditions"
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                placeholder="Enter terms and conditions"
                multiline
                rows={3}
                fullWidth
                helperText="Legal terms displayed on receipt"
              />

              <TextField
                label="Return Policy"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder="Enter return policy"
                multiline
                rows={2}
                fullWidth
                helperText="Return policy information for customers"
              />
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
