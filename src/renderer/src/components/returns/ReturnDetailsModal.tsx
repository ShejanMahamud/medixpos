import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
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
import { PurchaseReturn, SalesReturn } from '../../types/return'
import PrintButtons from '../shared/PrintButtons'

interface ReturnDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  returnItem: SalesReturn | PurchaseReturn | null
}

export default function ReturnDetailsModal({
  isOpen,
  onClose,
  returnItem
}: ReturnDetailsModalProps): React.JSX.Element {
  const handlePdfPrint = (): void => {
    if (!returnItem) return

    const isSalesReturn = 'customerName' in returnItem
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const itemsRows = returnItem.items
      ?.map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.unitPrice)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.subtotal)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.reason || '-'}</td>
        </tr>
      `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isSalesReturn ? 'Sales' : 'Purchase'} Return - ${returnItem.returnNumber}</title>
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
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .info-item {
              padding: 10px;
              background: #f9f9f9;
              border-radius: 4px;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-pending {
              background: #fff3cd;
              color: #856404;
            }
            .status-partial {
              background: #d1ecf1;
              color: #0c5460;
            }
            .status-refunded {
              background: #d4edda;
              color: #155724;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin: 20px 0 15px 0;
              color: #333;
              border-bottom: 2px solid #333;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #333;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            .total-row {
              font-weight: bold;
              background: #f9f9f9;
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
            <h1>${isSalesReturn ? 'Sales' : 'Purchase'} Return</h1>
            <p>Return Number: ${returnItem.returnNumber}</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">${isSalesReturn ? 'Customer' : 'Supplier'}</div>
              <div class="info-value">
                ${isSalesReturn ? (returnItem as SalesReturn).customerName || 'Walk-in' : (returnItem as PurchaseReturn).supplierName}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Amount</div>
              <div class="info-value">${formatCurrency(returnItem.totalAmount)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Refund Status</div>
              <div class="info-value">
                <span class="status-badge status-${returnItem.refundStatus}">
                  ${returnItem.refundStatus.charAt(0).toUpperCase() + returnItem.refundStatus.slice(1)}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Return Date</div>
              <div class="info-value">${new Date(returnItem.createdAt).toLocaleString()}</div>
            </div>
            ${
              returnItem.reason
                ? `
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">Reason</div>
              <div class="info-value">${returnItem.reason}</div>
            </div>
            `
                : ''
            }
            ${
              returnItem.notes
                ? `
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">Notes</div>
              <div class="info-value">${returnItem.notes}</div>
            </div>
            `
                : ''
            }
          </div>

          <div class="section-title">Return Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Subtotal</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; padding: 12px 8px;">Total Amount:</td>
                <td style="text-align: right; padding: 12px 8px;">${formatCurrency(returnItem.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

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
    if (!returnItem) return

    const isSalesReturn = 'customerName' in returnItem
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const itemsRows = returnItem.items
      ?.map(
        (item) => `
        <div class="item-row">
          <div class="item-name">${item.productName}</div>
          <div class="row">
            <span>${item.quantity} x ${formatCurrency(item.unitPrice)}</span>
            <span class="bold">${formatCurrency(item.subtotal)}</span>
          </div>
          ${item.reason ? `<div class="item-reason">Reason: ${item.reason}</div>` : ''}
        </div>
      `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isSalesReturn ? 'Sales' : 'Purchase'} Return - ${returnItem.returnNumber}</title>
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
            .info-section {
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
            .item-row {
              margin: 8px 0;
            }
            .item-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            .item-reason {
              font-size: 10px;
              font-style: italic;
              margin-top: 2px;
            }
            .total-section {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 14px;
              margin: 5px 0;
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
            <div class="title">${isSalesReturn ? 'SALES' : 'PURCHASE'} RETURN</div>
            <div>${returnItem.returnNumber}</div>
            <div>${new Date().toLocaleString()}</div>
          </div>

          <div class="info-section">
            <div class="row">
              <span class="label">${isSalesReturn ? 'Customer:' : 'Supplier:'}</span>
            </div>
            <div>${isSalesReturn ? (returnItem as SalesReturn).customerName || 'Walk-in' : (returnItem as PurchaseReturn).supplierName}</div>
          </div>

          ${
            returnItem.reason
              ? `
          <div class="info-section">
            <div class="label">Reason:</div>
            <div>${returnItem.reason}</div>
          </div>
          `
              : ''
          }

          ${
            returnItem.notes
              ? `
          <div class="info-section">
            <div class="label">Notes:</div>
            <div>${returnItem.notes}</div>
          </div>
          `
              : ''
          }

          <div class="separator"></div>

          <div class="label">RETURNED ITEMS</div>
          ${itemsRows}

          <div class="total-section">
            <div class="row">
              <span class="label">Refund Status:</span>
              <span>${returnItem.refundStatus.toUpperCase()}</span>
            </div>
            <div class="total-row">
              <span>TOTAL:</span>
              <span>${formatCurrency(returnItem.totalAmount)}</span>
            </div>
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getRefundStatusColor = (status: string): 'warning' | 'info' | 'success' | 'default' => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'partial':
        return 'info'
      case 'refunded':
        return 'success'
      default:
        return 'default'
    }
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

  if (!returnItem) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">Loading return details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  const isSalesReturn = 'customerName' in returnItem

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isSalesReturn ? 'Sales Return Details' : 'Purchase Return Details'}
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
              Return Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {returnItem.returnNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {isSalesReturn ? 'Customer' : 'Supplier'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {isSalesReturn
                ? (returnItem as SalesReturn).customerName || 'Walk-in'
                : (returnItem as PurchaseReturn).supplierName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Total Amount
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatCurrency(returnItem.totalAmount)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Refund Status
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={
                  returnItem.refundStatus.charAt(0).toUpperCase() + returnItem.refundStatus.slice(1)
                }
                size="small"
                color={getRefundStatusColor(returnItem.refundStatus)}
              />
            </Box>
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Reason
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {returnItem.reason || '-'}
            </Typography>
          </Box>
          {returnItem.notes && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Notes
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {returnItem.notes}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Return Items
        </Typography>
        {returnItem.items && returnItem.items.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Unit Price</StyledTableCell>
                  <StyledTableCell>Subtotal</StyledTableCell>
                  <StyledTableCell>Reason</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnItem.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                    <TableCell>{item.reason || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No items found for this return
            </Typography>
          </Box>
        )}
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
