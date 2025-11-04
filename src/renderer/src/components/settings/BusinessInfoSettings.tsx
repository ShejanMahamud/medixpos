import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface BusinessInfoSettingsProps {
  onSave: (settings: Record<string, string>) => Promise<void>
  initialValues: Record<string, string>
}

export default function BusinessInfoSettings({
  onSave,
  initialValues
}: BusinessInfoSettingsProps): React.JSX.Element {
  const [licenseNumber, setLicenseNumber] = useState(initialValues.business_license_number || '')
  const [taxId, setTaxId] = useState(initialValues.business_tax_id || '')
  const [establishedYear, setEstablishedYear] = useState(
    initialValues.business_established_year || ''
  )
  const [website, setWebsite] = useState(initialValues.business_website || '')
  const [facebook, setFacebook] = useState(initialValues.business_facebook || '')
  const [instagram, setInstagram] = useState(initialValues.business_instagram || '')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSave({
      business_license_number: licenseNumber,
      business_tax_id: taxId,
      business_established_year: establishedYear,
      business_website: website,
      business_facebook: facebook,
      business_instagram: instagram
    })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Business Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Legal and compliance information for your pharmacy
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3
          }}
        >
          <TextField
            label="Pharmacy License Number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Enter your pharmacy license/registration number"
            fullWidth
            helperText="Official pharmacy license or registration number"
          />

          <TextField
            label="Tax ID / GST Number"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Enter tax identification number"
            fullWidth
            helperText="Business tax identification number"
          />

          <TextField
            label="Established Year"
            type="number"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(e.target.value)}
            placeholder="YYYY"
            fullWidth
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            helperText="Year your pharmacy was established"
          />

          <TextField
            label="Website URL"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.yourpharmacy.com"
            fullWidth
            helperText="Your pharmacy website (optional)"
          />

          <TextField
            label="Facebook Page"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/yourpharmacy"
            fullWidth
            helperText="Facebook page URL (optional)"
          />

          <TextField
            label="Instagram Handle"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@yourpharmacy"
            fullWidth
            helperText="Instagram username (optional)"
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
          <Button type="submit" variant="contained" size="large">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
