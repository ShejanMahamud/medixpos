/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import { DamagedItem } from '../../types/return'
import PrintButtons from '../shared/PrintButtons'

interface DamagedItemDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item: DamagedItem | null
}

export default function DamagedItemDetailsModal({
  isOpen,
  onClose,
  item
}: DamagedItemDetailsModalProps): React.JSX.Element {
  const handlePdfPrint = (): void => {
    if (!item) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Damaged Item Report - ${item.productName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header p {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .detail-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-top: 15px;
            }
            .detail-item {
              padding: 10px;
              background: #f9f9f9;
              border-radius: 4px;
            }
            .detail-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .detail-value {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            .reason-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .reason-expired {
              background: #fff3cd;
              color: #856404;
            }
            .reason-damaged {
              background: #f8d7da;
              color: #721c24;
            }
            .reason-other {
              background: #d1ecf1;
              color: #0c5460;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Damaged/Expired Item Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <div class="section-title">Item Information</div>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${item.productName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${item.quantity}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Batch Number</div>
                <div class="detail-value">${item.batchNumber || 'N/A'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Expiry Date</div>
                <div class="detail-value">${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Report Details</div>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Reason</div>
                <div class="detail-value">
                  <span class="reason-badge reason-${item.reason}">
                    ${item.reason.charAt(0).toUpperCase() + item.reason.slice(1)}
                  </span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Reported By</div>
                <div class="detail-value">${item.reportedBy}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Date Reported</div>
                <div class="detail-value">${formatDate(item.createdAt)}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>&copy; ${new Date().getFullYear()} Pharmacy POS System</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  const handleThermalPrint = (): void => {
    if (!item) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Damaged Item - ${item.productName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              width: 80mm;
              padding: 10px;
              font-size: 12px;
              line-height: 1.4;
            }
            .center {
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            .header {
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #000;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .section {
              margin: 10px 0;
              padding: 5px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .label {
              font-weight: bold;
            }
            .separator {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .footer {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed #000;
              font-size: 10px;
            }
            @media print {
              body {
                width: 80mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header center">
            <div class="title">DAMAGED/EXPIRED ITEM</div>
            <div>${new Date().toLocaleString()}</div>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Product:</span>
            </div>
            <div>${item.productName}</div>
          </div>

          <div class="separator"></div>

          <div class="section">
            <div class="row">
              <span class="label">Quantity:</span>
              <span>${item.quantity}</span>
            </div>
            <div class="row">
              <span class="label">Reason:</span>
              <span>${item.reason.toUpperCase()}</span>
            </div>
          </div>

          <div class="separator"></div>

          <div class="section">
            <div class="row">
              <span class="label">Batch No:</span>
              <span>${item.batchNumber || 'N/A'}</span>
            </div>
            <div class="row">
              <span class="label">Expiry:</span>
              <span>${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div class="separator"></div>

          <div class="section">
            <div class="row">
              <span class="label">Reported By:</span>
            </div>
            <div>${item.reportedBy}</div>
            <div class="row">
              <span class="label">Date:</span>
            </div>
            <div>${formatDate(item.createdAt)}</div>
          </div>

          <div class="footer center">
            <div>Pharmacy POS System</div>
            <div>Thank you!</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
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

  const getReasonColor = (reason: string): 'warning' | 'error' | 'info' => {
    switch (reason) {
      case 'expired':
        return 'warning'
      case 'damaged':
        return 'error'
      default:
        return 'info'
    }
  }

  if (!item) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">Loading damaged item details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Damaged/Expired Item Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Product Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.productName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Quantity
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.quantity}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Reason
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={item.reason.charAt(0).toUpperCase() + item.reason.slice(1)}
                size="small"
                color={getReasonColor(item.reason)}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Batch Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.batchNumber || '-'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Expiry Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Reported By
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.reportedBy}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Date Reported
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatDate(item.createdAt)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <PrintButtons onPdfPrint={handlePdfPrint} onThermalPrint={handleThermalPrint} />
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
