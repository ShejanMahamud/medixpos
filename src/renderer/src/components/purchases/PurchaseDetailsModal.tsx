/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close } from '@mui/icons-material'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Purchase, PurchaseItem } from '../../types/purchase'
import PrintButtons from '../shared/PrintButtons'

interface PurchaseDetailsModalProps {
  isOpen: boolean
  purchase: Purchase | null
  items: PurchaseItem[]
  currencySymbol: string
  onClose: () => void
}

export default function PurchaseDetailsModal({
  isOpen,
  purchase,
  items,
  currencySymbol,
  onClose
}: PurchaseDetailsModalProps): React.JSX.Element | null {
  if (!purchase) return null

  const handlePdfPrint = (): void => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.batchNumber || 'N/A'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currencySymbol}${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currencySymbol}${item.subtotal.toFixed(2)}</td>
      </tr>
    `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Details - ${purchase.invoiceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .label {
              color: #666;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .value {
              font-weight: bold;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #f5f5f5;
              padding: 12px 8px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              border-bottom: 2px solid #333;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .grand-total {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              font-size: 18px;
              font-weight: bold;
              border-top: 2px solid #333;
              margin-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Purchase Order</h1>
              <p style="margin: 5px 0; color: #666;">Invoice #${purchase.invoiceNumber}</p>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="label">Date & Time</div>
                <div class="value">${new Date(purchase.createdAt).toLocaleString()}</div>
              </div>
              <div class="info-item">
                <div class="label">Supplier</div>
                <div class="value">${purchase.supplierName || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">Payment Status</div>
                <div class="value" style="text-transform: capitalize;">${purchase.paymentStatus}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Batch</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Total Amount:</span>
                <span><strong>${currencySymbol}${purchase.totalAmount.toFixed(2)}</strong></span>
              </div>
              <div class="total-row">
                <span>Paid:</span>
                <span style="color: green;"><strong>${currencySymbol}${purchase.paidAmount.toFixed(2)}</strong></span>
              </div>
              <div class="grand-total">
                <span>Due Amount:</span>
                <span style="color: red;">${currencySymbol}${purchase.dueAmount.toFixed(2)}</span>
              </div>
            </div>
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
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const itemsHtml = items
      .map(
        (item) => `
      <div class="item">
        <div class="item-name">${item.productName}</div>
        <div class="item-details">
          <span>Batch: ${item.batchNumber || 'N/A'}</span>
          <span>${item.quantity} x ${currencySymbol}${item.unitPrice.toFixed(2)}</span>
        </div>
        <div class="item-total">${currencySymbol}${item.subtotal.toFixed(2)}</div>
      </div>
    `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase - ${purchase.invoiceNumber}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.4;
              max-width: 80mm;
              margin: 0 auto;
              padding: 5mm;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .header h2 {
              margin: 0 0 5px 0;
              font-size: 16px;
            }
            .info {
              margin-bottom: 10px;
              font-size: 10px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            .separator {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              margin-bottom: 8px;
            }
            .item-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #333;
            }
            .item-total {
              text-align: right;
              font-weight: bold;
              margin-top: 2px;
            }
            .totals {
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .grand-total {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed #000;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PURCHASE ORDER</h2>
            <div>Invoice: ${purchase.invoiceNumber}</div>
          </div>

          <div class="info">
            <div class="info-row">
              <span>Date:</span>
              <span>${new Date(purchase.createdAt).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span>Supplier:</span>
              <span>${purchase.supplierName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span>Status:</span>
              <span style="text-transform: capitalize;">${purchase.paymentStatus}</span>
            </div>
          </div>

          <div class="separator"></div>

          <div class="items">
            ${itemsHtml}
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Total Amount:</span>
              <span>${currencySymbol}${purchase.totalAmount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Paid:</span>
              <span>${currencySymbol}${purchase.paidAmount.toFixed(2)}</span>
            </div>
            <div class="grand-total">
              <span>Due Amount:</span>
              <span>${currencySymbol}${purchase.dueAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <div>Thank you for your business!</div>
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.secondary,
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.5px'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }))

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Purchase Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Invoice Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {purchase.invoiceNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {new Date(purchase.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Supplier
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {purchase.supplierName || 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Payment Status
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {purchase.paymentStatus}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Items
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell>Batch</StyledTableCell>
                <StyledTableCell>Qty</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell align="right">Subtotal</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.batchNumber || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {currencySymbol}
                    {item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {currencySymbol}
                    {item.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Amount:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencySymbol}
              {purchase.totalAmount.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Paid:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
              {currencySymbol}
              {purchase.paidAmount.toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Due Amount:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              {currencySymbol}
              {purchase.dueAmount.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <PrintButtons
            onPdfPrint={handlePdfPrint}
            onThermalPrint={handleThermalPrint}
            disabled={false}
          />
        </Box>
      </DialogActions>
    </Dialog>
  )
}
