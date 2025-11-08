/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { randomUUID } from 'crypto'
import { and, eq } from 'drizzle-orm'
import { ipcMain } from 'electron'
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
import { getDatabase } from '../../database'
import { printerSettings, printQueue, saleItems, sales } from '../../database/schema'

// Get list of available printers
ipcMain.handle('printer:list', async () => {
  try {
    // For USB printers, we'll detect common USB vendor IDs
    // In production, you might want to use a more sophisticated method
    const printers: Array<{
      name: string
      type: string
      path: string
      status: string
    }> = []

    // Add manual entry option
    printers.push({
      name: 'Manual USB Printer',
      type: 'usb',
      path: '/dev/usb/lp0', // Linux/Mac
      status: 'unknown'
    })

    printers.push({
      name: 'Manual Network Printer',
      type: 'network',
      path: '192.168.1.100:9100',
      status: 'unknown'
    })

    return { success: true, printers }
  } catch (error) {
    console.error('Failed to list printers:', error)
    return { success: false, error: 'Failed to list printers' }
  }
})

// Save printer configuration
ipcMain.handle('printer:save-config', async (_, config) => {
  try {
    const db = getDatabase()

    // If this is set as default, unset other defaults
    if (config.isDefault) {
      await db
        .update(printerSettings)
        .set({ isDefault: false, updatedAt: new Date().toISOString() })
        .execute()
    }

    if (config.id) {
      // Update existing
      await db
        .update(printerSettings)
        .set({
          ...config,
          updatedAt: new Date().toISOString()
        })
        .where(eq(printerSettings.id, config.id))
        .execute()
    } else {
      // Create new
      const newConfig = {
        id: randomUUID(),
        ...config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await db.insert(printerSettings).values(newConfig).execute()
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to save printer config:', error)
    return { success: false, error: 'Failed to save printer configuration' }
  }
})

// Get all printer configurations
ipcMain.handle('printer:get-configs', async () => {
  try {
    const db = getDatabase()
    const configs = await db
      .select()
      .from(printerSettings)
      .where(eq(printerSettings.isActive, true))
      .execute()
    return { success: true, configs }
  } catch (error) {
    console.error('Failed to get printer configs:', error)
    return { success: false, error: 'Failed to get printer configurations' }
  }
})

// Get default printer
ipcMain.handle('printer:get-default', async () => {
  try {
    const db = getDatabase()
    const [config] = await db
      .select()
      .from(printerSettings)
      .where(and(eq(printerSettings.isDefault, true), eq(printerSettings.isActive, true)))
      .execute()
    return { success: true, config: config || null }
  } catch (error) {
    console.error('Failed to get default printer:', error)
    return { success: false, error: 'Failed to get default printer' }
  }
})

// Delete printer configuration
ipcMain.handle('printer:delete-config', async (_, id: string) => {
  try {
    const db = getDatabase()
    await db
      .update(printerSettings)
      .set({ isActive: false })
      .where(eq(printerSettings.id, id))
      .execute()
    return { success: true }
  } catch (error) {
    console.error('Failed to delete printer config:', error)
    return { success: false, error: 'Failed to delete printer configuration' }
  }
})

// Test print
ipcMain.handle('printer:test', async (_, printerId: string) => {
  try {
    const db = getDatabase()
    const [config] = await db
      .select()
      .from(printerSettings)
      .where(eq(printerSettings.id, printerId))
      .execute()

    if (!config) {
      return { success: false, error: 'Printer configuration not found' }
    }

    const printer = createPrinter(config)

    printer.alignCenter()
    printer.setTextSize(1, 1)
    printer.bold(true)
    printer.println('TEST PRINT')
    printer.bold(false)
    printer.newLine()
    printer.println('This is a test print')
    printer.println('from MedixPOS')
    printer.newLine()
    printer.println(new Date().toLocaleString())
    printer.newLine()
    printer.newLine()

    if (config.cutPaper) {
      printer.cut()
    }

    await printer.execute()
    return { success: true }
  } catch (error) {
    console.error('Test print failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Test print failed' }
  }
})

// Print receipt
ipcMain.handle('printer:print-receipt', async (_, saleId: string, printerId?: string) => {
  try {
    const db = getDatabase()

    // Get printer config
    let config
    if (printerId) {
      ;[config] = await db
        .select()
        .from(printerSettings)
        .where(eq(printerSettings.id, printerId))
        .execute()
    } else {
      // Use default printer
      ;[config] = await db
        .select()
        .from(printerSettings)
        .where(and(eq(printerSettings.isDefault, true), eq(printerSettings.isActive, true)))
        .execute()
    }

    if (!config) {
      return { success: false, error: 'No printer configured' }
    }

    // Get sale data
    const [sale] = await db.select().from(sales).where(eq(sales.id, saleId)).execute()
    if (!sale) {
      return { success: false, error: 'Sale not found' }
    }

    const items = await db.select().from(saleItems).where(eq(saleItems.saleId, saleId)).execute()

    // Create receipt
    const printer = createPrinter(config)
    await printReceipt(printer, config, sale, items)

    // Add to print queue
    await db
      .insert(printQueue)
      .values({
        id: randomUUID(),
        printerId: config.id,
        saleId,
        receiptData: JSON.stringify({ sale, items }),
        status: 'completed',
        printedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .execute()

    return { success: true }
  } catch (error) {
    console.error('Failed to print receipt:', error)

    // Log failed print in queue
    try {
      const db = getDatabase()
      await db
        .insert(printQueue)
        .values({
          id: randomUUID(),
          printerId: printerId || null,
          saleId,
          receiptData: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          }),
          status: 'failed',
          lastError: error instanceof Error ? error.message : 'Unknown error',
          attempts: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .execute()
    } catch (queueError) {
      console.error('Failed to log print error:', queueError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to print receipt'
    }
  }
})

// Reprint last receipt
ipcMain.handle('printer:reprint-last', async () => {
  try {
    const db = getDatabase()

    // Get last successful print
    const [lastPrint] = await db
      .select()
      .from(printQueue)
      .where(eq(printQueue.status, 'completed'))
      .orderBy(printQueue.printedAt)
      .limit(1)
      .execute()

    if (!lastPrint || !lastPrint.saleId) {
      return { success: false, error: 'No previous receipt found' }
    }

    // Reprint using the same printer
    return await ipcMain.handleOnce('printer:print-receipt', async () => {
      return { saleId: lastPrint.saleId, printerId: lastPrint.printerId }
    })
  } catch (error) {
    console.error('Failed to reprint:', error)
    return { success: false, error: 'Failed to reprint receipt' }
  }
})

// Get print queue
ipcMain.handle('printer:get-queue', async (_, limit = 50) => {
  try {
    const db = getDatabase()
    const queue = await db
      .select()
      .from(printQueue)
      .orderBy(printQueue.createdAt)
      .limit(limit)
      .execute()
    return { success: true, queue }
  } catch (error) {
    console.error('Failed to get print queue:', error)
    return { success: false, error: 'Failed to get print queue' }
  }
})

// Helper function to create printer instance
function createPrinter(config: any): ThermalPrinter {
  const printerConfig = {
    type: PrinterTypes.EPSON, // Most thermal printers use ESC/POS compatible with EPSON
    interface:
      config.printerType === 'network' ? `tcp://${config.connectionPath}` : config.connectionPath,
    characterSet: 'SLOVENIA',
    removeSpecialCharacters: false,
    lineCharacter: '=',
    width: config.characterWidth || 48
  }

  return new ThermalPrinter(printerConfig as any)
}

// Helper function to print receipt
async function printReceipt(
  printer: ThermalPrinter,
  config: any,
  sale: any,
  items: any[]
): Promise<void> {
  // Header
  printer.alignCenter()

  if (config.showLogo && config.logoPath) {
    try {
      await printer.printImage(config.logoPath)
      printer.newLine()
    } catch (error) {
      console.warn('Failed to print logo:', error)
    }
  }

  printer.setTextSize(1, 1)
  printer.bold(true)
  printer.println(config.businessName || 'Pharmacy POS')
  printer.bold(false)

  if (config.businessAddress) {
    printer.setTextSize(0, 0)
    printer.println(config.businessAddress)
  }

  if (config.businessPhone) {
    printer.println(`Tel: ${config.businessPhone}`)
  }

  printer.drawLine()

  // Invoice details
  printer.alignLeft()
  printer.bold(true)
  printer.println(`Invoice: ${sale.invoiceNumber || sale.id.substring(0, 8)}`)
  printer.bold(false)
  printer.println(`Date: ${new Date(sale.createdAt).toLocaleString()}`)
  printer.println(`Cashier: ${sale.userId || 'N/A'}`)
  printer.println(`Customer: ${sale.customerId || 'Walk-in'}`)
  printer.drawLine()

  // Items
  printer.alignLeft()
  printer.bold(true)
  printer.table([
    { text: 'Item', align: 'LEFT', width: 0.5 },
    { text: 'Qty', align: 'CENTER', width: 0.15 },
    { text: 'Price', align: 'RIGHT', width: 0.35 }
  ])
  printer.bold(false)
  printer.drawLine()

  for (const item of items) {
    printer.table([
      { text: item.productName || 'Product', align: 'LEFT', width: 0.5 },
      { text: item.quantity.toString(), align: 'CENTER', width: 0.15 },
      { text: `${item.totalPrice.toFixed(2)}`, align: 'RIGHT', width: 0.35 }
    ])
  }

  printer.drawLine()

  // Totals
  printer.alignRight()
  printer.println(`Subtotal: ${sale.subtotal.toFixed(2)}`)

  if (sale.taxAmount > 0) {
    printer.println(`Tax: ${sale.taxAmount.toFixed(2)}`)
  }

  if (sale.discountAmount > 0) {
    printer.println(`Discount: -${sale.discountAmount.toFixed(2)}`)
  }

  printer.bold(true)
  printer.setTextSize(1, 1)
  printer.println(`TOTAL: ${sale.totalAmount.toFixed(2)}`)
  printer.setTextSize(0, 0)
  printer.bold(false)

  printer.println(`Paid: ${sale.paidAmount.toFixed(2)}`)
  printer.println(`Change: ${sale.changeAmount.toFixed(2)}`)
  printer.println(`Payment: ${sale.paymentMethod || 'Cash'}`)

  printer.newLine()

  // Barcode
  if (config.showBarcode) {
    printer.alignCenter()
    try {
      await printer.printBarcode(sale.id.substring(0, 12))
    } catch (error) {
      console.warn('Failed to print barcode:', error)
    }
  }

  // Footer
  printer.alignCenter()
  printer.newLine()
  if (config.footerMessage) {
    printer.println(config.footerMessage)
  } else {
    printer.println('Thank you for your business!')
    printer.println('Please come again')
  }

  printer.newLine()
  printer.newLine()

  // Cut paper
  if (config.cutPaper) {
    printer.cut()
  }

  // Open cash drawer if configured
  if (config.openCashDrawer) {
    printer.openCashDrawer()
  }

  await printer.execute()
}

export function registerPrinterHandlers(): void {
  console.log('Printer handlers registered')
}
