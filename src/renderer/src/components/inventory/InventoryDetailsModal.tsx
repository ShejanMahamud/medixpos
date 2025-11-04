import { Close } from '@mui/icons-material'
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import medicinePlaceholder from '../../assets/medicine.png'
import { Category, InventoryWithProduct } from '../../types/inventory'
import PrintButtons from '../shared/PrintButtons'

interface InventoryDetailsModalProps {
  isOpen: boolean
  item: InventoryWithProduct | null
  category: Category | null
  currencySymbol: string
  onClose: () => void
}

export default function InventoryDetailsModal({
  isOpen,
  item,
  category,
  currencySymbol,
  onClose
}: InventoryDetailsModalProps): React.JSX.Element | null {
  if (!item || !item.product) return null

  const product = item.product
  const isLowStock = item.quantity > 0 && item.quantity <= product.reorderLevel
  const isOutOfStock = item.quantity === 0
  const stockValue = item.quantity * product.costPrice
  const potentialRevenue = item.quantity * product.sellingPrice
  const potentialProfit = potentialRevenue - stockValue

  const handlePdfPrint = (): void => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory Details - ${product.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .field { margin-bottom: 10px; }
            .label { font-size: 12px; color: #666; }
            .value { font-size: 14px; font-weight: 600; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .status-out { background: #ffebee; color: #c62828; }
            .status-low { background: #fff3e0; color: #e65100; }
            .status-in { background: #e8f5e9; color: #2e7d32; }
            .pricing { border-top: 1px solid #ddd; padding-top: 10px; }
            .pricing-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total-row { font-weight: bold; font-size: 16px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Inventory Details</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>${product.name}</h2>
            ${product.genericName ? `<p style="color: #666;">${product.genericName}</p>` : ''}
            <span class="status ${isOutOfStock ? 'status-out' : isLowStock ? 'status-low' : 'status-in'}">
              ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
            </span>
            ${category ? `<span class="status" style="background: #e3f2fd; color: #1976d2; margin-left: 10px;">${category.name}</span>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Product Information</div>
            <div class="grid">
              <div class="field">
                <div class="label">SKU</div>
                <div class="value">${product.sku}</div>
              </div>
              ${
                product.barcode
                  ? `
                <div class="field">
                  <div class="label">Barcode</div>
                  <div class="value">${product.barcode}</div>
                </div>
              `
                  : ''
              }
              <div class="field">
                <div class="label">Unit</div>
                <div class="value">${product.unit}</div>
              </div>
              <div class="field">
                <div class="label">Reorder Level</div>
                <div class="value">${product.reorderLevel} ${product.unit}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Stock Information</div>
            <div class="grid">
              <div class="field">
                <div class="label">Current Stock</div>
                <div class="value" style="color: ${isOutOfStock ? '#c62828' : isLowStock ? '#e65100' : '#2e7d32'}; font-size: 18px;">
                  ${item.quantity} ${product.unit}
                </div>
              </div>
              ${
                item.batchNumber
                  ? `
                <div class="field">
                  <div class="label">Batch Number</div>
                  <div class="value">${item.batchNumber}</div>
                </div>
              `
                  : ''
              }
              ${
                item.expiryDate
                  ? `
                <div class="field">
                  <div class="label">Expiry Date</div>
                  <div class="value">${new Date(item.expiryDate).toLocaleDateString()}</div>
                </div>
              `
                  : ''
              }
            </div>
          </div>

          <div class="section">
            <div class="section-title">Pricing & Value</div>
            <div class="pricing">
              <div class="pricing-row">
                <span>Cost Price (per unit):</span>
                <span class="value">${currencySymbol}${product.costPrice.toFixed(2)}</span>
              </div>
              <div class="pricing-row">
                <span>Selling Price (per unit):</span>
                <span class="value">${currencySymbol}${product.sellingPrice.toFixed(2)}</span>
              </div>
              <div class="pricing-row total-row" style="border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px;">
                <span>Total Stock Value:</span>
                <span style="color: #1976d2;">${currencySymbol}${stockValue.toFixed(2)}</span>
              </div>
              <div class="pricing-row">
                <span>Potential Revenue:</span>
                <span style="color: #2e7d32;">${currencySymbol}${potentialRevenue.toFixed(2)}</span>
              </div>
              <div class="pricing-row">
                <span>Potential Profit:</span>
                <span style="color: #2e7d32;">${currencySymbol}${potentialProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          ${
            item.createdAt || item.updatedAt
              ? `
            <div class="section">
              <div class="section-title">Timestamps</div>
              <div class="grid">
                ${
                  item.createdAt
                    ? `
                  <div class="field">
                    <div class="label">Created At</div>
                    <div class="value">${new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                `
                    : ''
                }
                ${
                  item.updatedAt
                    ? `
                  <div class="field">
                    <div class="label">Last Updated</div>
                    <div class="value">${new Date(item.updatedAt).toLocaleString()}</div>
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `
              : ''
          }

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

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory - ${product.name}</title>
          <style>
            @media print {
              @page { margin: 0; size: 80mm auto; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 80mm;
              margin: 0;
              padding: 5mm;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .section { margin: 10px 0; }
            .status { display: inline-block; padding: 2px 8px; border: 1px solid #000; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 14px;">INVENTORY DETAILS</div>
          <div class="center" style="font-size: 10px;">${new Date().toLocaleString()}</div>
          <div class="line"></div>
          
          <div class="section">
            <div class="bold">${product.name}</div>
            ${product.genericName ? `<div style="font-size: 10px;">${product.genericName}</div>` : ''}
            <div style="margin-top: 5px;">
              <span class="status">${isOutOfStock ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : 'IN STOCK'}</span>
            </div>
          </div>

          <div class="line"></div>
          
          <div class="section">
            <div class="bold">Product Info</div>
            <div class="row">
              <span>SKU:</span>
              <span>${product.sku}</span>
            </div>
            ${
              product.barcode
                ? `
              <div class="row">
                <span>Barcode:</span>
                <span>${product.barcode}</span>
              </div>
            `
                : ''
            }
            <div class="row">
              <span>Unit:</span>
              <span>${product.unit}</span>
            </div>
          </div>

          <div class="line"></div>
          
          <div class="section">
            <div class="bold">Stock Info</div>
            <div class="row">
              <span>Current Stock:</span>
              <span class="bold">${item.quantity} ${product.unit}</span>
            </div>
            <div class="row">
              <span>Reorder Level:</span>
              <span>${product.reorderLevel} ${product.unit}</span>
            </div>
            ${
              item.batchNumber
                ? `
              <div class="row">
                <span>Batch:</span>
                <span>${item.batchNumber}</span>
              </div>
            `
                : ''
            }
            ${
              item.expiryDate
                ? `
              <div class="row">
                <span>Expiry:</span>
                <span>${new Date(item.expiryDate).toLocaleDateString()}</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="line"></div>
          
          <div class="section">
            <div class="bold">Pricing</div>
            <div class="row">
              <span>Cost Price:</span>
              <span>${currencySymbol}${product.costPrice.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Selling Price:</span>
              <span>${currencySymbol}${product.sellingPrice.toFixed(2)}</span>
            </div>
            <div class="line"></div>
            <div class="row bold">
              <span>Stock Value:</span>
              <span>${currencySymbol}${stockValue.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Potential Revenue:</span>
              <span>${currencySymbol}${potentialRevenue.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Potential Profit:</span>
              <span>${currencySymbol}${potentialProfit.toFixed(2)}</span>
            </div>
          </div>

          <div class="line"></div>
          <div class="center" style="font-size: 10px; margin-top: 10px;">
            Thank you for using our system
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Inventory Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Product Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              component="img"
              src={product.imageUrl || medicinePlaceholder}
              alt={product.name}
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                objectFit: 'contain',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
                p: 0.5
              }}
            />
            <Box sx={{ display: 'none' }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              {product.genericName && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.genericName}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Status Chip */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOutOfStock ? (
              <Chip label="Out of Stock" size="small" color="error" />
            ) : isLowStock ? (
              <Chip label="Low Stock" size="small" color="warning" />
            ) : (
              <Chip label="In Stock" size="small" color="success" />
            )}
            {category && (
              <Chip label={category.name} size="small" color="primary" variant="outlined" />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Product Information */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Product Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              SKU
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.sku}
            </Typography>
          </Box>
          {product.barcode && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Barcode
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {product.barcode}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Unit
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.unit}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Reorder Level
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {product.reorderLevel} {product.unit}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Stock Information */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Stock Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Current Stock
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isOutOfStock ? 'error.main' : isLowStock ? 'warning.main' : 'success.main'
              }}
            >
              {item.quantity} {product.unit}
            </Typography>
          </Box>
          {item.batchNumber && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Batch Number
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.batchNumber}
              </Typography>
            </Box>
          )}
          {item.expiryDate && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Expiry Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {new Date(item.expiryDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Pricing & Value */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Pricing & Value
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cost Price (per unit):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencySymbol}
              {product.costPrice.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Selling Price (per unit):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencySymbol}
              {product.sellingPrice.toFixed(2)}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Total Stock Value:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {currencySymbol}
              {stockValue.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Potential Revenue:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
              {currencySymbol}
              {potentialRevenue.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Potential Profit:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
              {currencySymbol}
              {potentialProfit.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {(item.createdAt || item.updatedAt) && (
          <>
            <Divider sx={{ my: 2 }} />

            {/* Timestamps */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {item.createdAt && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
              {item.updatedAt && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(item.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
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
