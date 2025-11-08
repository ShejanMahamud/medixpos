/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close, Link, ShoppingCart } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Prescription } from '../../types/prescription'

interface SaleLinkModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: Prescription
  onSaleLinked: () => void
}

interface Sale {
  id: string
  invoiceNumber: string
  totalAmount: number
  paymentMethod: string
  status: string
  createdAt: string
}

export default function SaleLinkModal({
  isOpen,
  onClose,
  prescription,
  onSaleLinked
}: SaleLinkModalProps): React.JSX.Element {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [linking, setLinking] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && prescription.customerId) {
      loadCustomerSales()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prescription.customerId])

  const loadCustomerSales = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await window.api.sales.getByCustomer(prescription.customerId)
      setSales(data as unknown as Sale[])
    } catch (error) {
      console.error('Error loading customer sales:', error)
      toast.error('Failed to load customer sales')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkSale = async (saleId: string): Promise<void> => {
    try {
      setLinking(saleId)

      await window.api.prescriptions.update(prescription.id, {
        ...prescription,
        saleId: saleId
      })

      toast.success('Prescription linked to sale successfully')
      onSaleLinked()
      onClose()
    } catch (error) {
      console.error('Error linking prescription to sale:', error)
      toast.error('Failed to link prescription to sale')
    } finally {
      setLinking(null)
    }
  }

  const handleUnlinkSale = async (): Promise<void> => {
    try {
      setLinking('unlink')

      await window.api.prescriptions.update(prescription.id, {
        ...prescription,
        saleId: undefined
      })

      toast.success('Prescription unlinked from sale')
      onSaleLinked()
      onClose()
    } catch (error) {
      console.error('Error unlinking prescription:', error)
      toast.error('Failed to unlink prescription')
    } finally {
      setLinking(null)
    }
  }

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter out the currently linked sale from available options
  const availableSales = sales.filter((sale) => sale.id !== prescription.saleId)

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link color="primary" />
            <Typography variant="h6">Link Prescription to Sale</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Customer: {prescription.customer?.name || 'Unknown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prescription: {prescription.prescriptionNumber || `RX-${prescription.id.slice(0, 6)}`}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Currently Linked Sale */}
        {prescription.sale && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Currently Linked Sale
            </Typography>
            <Box
              sx={{
                p: 2,
                border: '2px solid',
                borderColor: 'success.main',
                borderRadius: 2,
                bgcolor: 'success.50'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ShoppingCart />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {prescription.sale.invoiceNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(prescription.sale.totalAmount)}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleUnlinkSale}
                  disabled={linking === 'unlink'}
                  sx={{ textTransform: 'none' }}
                >
                  {linking === 'unlink' ? 'Unlinking...' : 'Unlink'}
                </Button>
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
          </Box>
        )}

        {/* Available Sales */}
        <Typography variant="subtitle2" gutterBottom>
          {prescription.sale ? 'Link to Different Sale' : 'Available Sales'}
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Loading customer sales...</Typography>
          </Box>
        ) : availableSales.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              {sales.length === 0 ? 'No sales found for this customer' : 'No other sales available'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {availableSales.map((sale) => (
              <ListItem
                key={sale.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <ShoppingCart />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {sale.invoiceNumber}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: sale.status === 'completed' ? 'success.light' : 'warning.light',
                          color:
                            sale.status === 'completed'
                              ? 'success.contrastText'
                              : 'warning.contrastText'
                        }}
                      >
                        {sale.status}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {formatCurrency(sale.totalAmount)} • {sale.paymentMethod}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(sale.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleLinkSale(sale.id)}
                  disabled={!!linking}
                  sx={{ textTransform: 'none' }}
                >
                  {linking === sale.id ? 'Linking...' : 'Link'}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
