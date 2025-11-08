/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close, Email, Person, Phone, Star } from '@mui/icons-material'
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import { Customer } from '../../types/customer'

interface CustomerViewModalProps {
  open: boolean
  onClose: () => void
  customer: Customer | null
  currencySymbol: string
}

export default function CustomerViewModal({
  open,
  onClose,
  customer,
  currencySymbol
}: CustomerViewModalProps): React.JSX.Element {
  if (!customer) {
    return <></>
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Customer Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Customer Info Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.5rem'
            }}
          >
            {customer.name.charAt(0).toUpperCase()}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {customer.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Customer ID: #{customer.id.slice(0, 8)}
            </Typography>
            <Chip
              label={customer.status === 'active' ? 'Active' : 'Inactive'}
              size="small"
              color={customer.status === 'active' ? 'success' : 'default'}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Contact Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Contact Information
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Phone
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {customer.phone}
              </Typography>
            </Box>
          </Box>

          {customer.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {customer.email}
                </Typography>
              </Box>
            </Box>
          )}

          {customer.address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Person sx={{ color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {customer.address}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Account Stats */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Account Statistics
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 120,
                p: 2,
                borderRadius: 2,
                bgcolor: 'warning.50',
                border: 1,
                borderColor: 'warning.200'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'warning.dark' }}>
                  Loyalty Points
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                {customer.loyaltyPoints}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 120,
                p: 2,
                borderRadius: 2,
                bgcolor: 'success.50',
                border: 1,
                borderColor: 'success.200'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.dark' }}>
                  Total Purchases
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark' }}>
                {currencySymbol}
                {customer.totalPurchases.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Account Details */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Account Details
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                Member Since
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {new Date(customer.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            {customer.dateOfBirth && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}
                >
                  Date of Birth
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {new Date(customer.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
