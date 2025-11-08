/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import { Prescription } from '../../types/prescription'

interface PrescriptionViewModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: Prescription
}

export default function PrescriptionViewModal({
  isOpen,
  onClose,
  prescription
}: PrescriptionViewModalProps): React.JSX.Element {
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not specified'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const InfoRow = ({
    label,
    value
  }: {
    label: string
    value: string | undefined
  }): React.JSX.Element => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">{value || <em>Not specified</em>}</Typography>
    </Box>
  )

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Prescription Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <InfoRow
                label="Prescription Date"
                value={formatDate(prescription.prescriptionDate)}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoRow label="Prescription Number" value={prescription.prescriptionNumber} />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <InfoRow label="Customer Name" value={prescription.customer?.name} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoRow label="Customer Phone" value={prescription.customer?.phone} />
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <InfoRow label="Doctor Name" value={prescription.doctorName} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoRow label="Doctor Phone" value={prescription.doctorPhone} />
            </Box>
          </Box>

          <Divider />

          <InfoRow label="Diagnosis" value={prescription.diagnosis} />

          <InfoRow label="Notes" value={prescription.notes} />

          {prescription.sale && (
            <>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Linked Sale
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.200'
                  }}
                >
                  <Typography variant="body2">
                    Invoice: <strong>{prescription.sale.invoiceNumber}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Amount: <strong>${prescription.sale.totalAmount.toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {prescription.imageUrl && prescription.imageUrl.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Prescription Document
                </Typography>
                {prescription.imageUrl.startsWith('data:image/') ? (
                  <Box
                    component="img"
                    src={prescription.imageUrl}
                    alt="Prescription"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 400,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) {
                        const errorMsg = document.createElement('p')
                        errorMsg.textContent = 'Failed to load image'
                        errorMsg.style.color = 'red'
                        parent.appendChild(errorMsg)
                      }
                    }}
                  />
                ) : prescription.imageUrl.startsWith('data:application/pdf') ? (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2">📄 PDF Document Attached</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => window.open(prescription.imageUrl, '_blank')}
                    >
                      Open PDF
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Document attached
                  </Typography>
                )}
              </Box>
            </>
          )}

          <Divider />
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(prescription.createdAt)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
