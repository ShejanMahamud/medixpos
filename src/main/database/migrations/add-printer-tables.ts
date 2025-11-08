/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Database } from 'better-sqlite3'

export async function addPrinterTables(db: Database): Promise<void> {
  console.log('Adding printer settings and print queue tables...')

  try {
    // Create printer_settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS printer_settings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        printer_type TEXT NOT NULL,
        connection_path TEXT NOT NULL,
        paper_width INTEGER NOT NULL DEFAULT 80,
        character_width INTEGER NOT NULL DEFAULT 48,
        is_default INTEGER DEFAULT 0,
        auto_print INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1,
        show_logo INTEGER DEFAULT 1,
        logo_path TEXT,
        business_name TEXT,
        business_address TEXT,
        business_phone TEXT,
        footer_message TEXT,
        show_barcode INTEGER DEFAULT 1,
        font_size TEXT DEFAULT 'normal',
        cut_paper INTEGER DEFAULT 1,
        open_cash_drawer INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create print_queue table
    db.exec(`
      CREATE TABLE IF NOT EXISTS print_queue (
        id TEXT PRIMARY KEY,
        printer_id TEXT REFERENCES printer_settings(id),
        sale_id TEXT REFERENCES sales(id),
        receipt_data TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        attempts INTEGER DEFAULT 0,
        last_error TEXT,
        printed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_printer_settings_is_default 
      ON printer_settings(is_default, is_active)
    `)

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_print_queue_status 
      ON print_queue(status, created_at)
    `)

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_print_queue_sale_id 
      ON print_queue(sale_id)
    `)

    console.log('Printer tables created successfully')
  } catch (error) {
    console.error('Error creating printer tables:', error)
    throw error
  }
}
