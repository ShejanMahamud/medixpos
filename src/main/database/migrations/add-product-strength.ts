/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import * as Database from 'better-sqlite3'

export function addProductStrength(db: Database.Database): void {
  try {
    // Add strength column to products table
    db.exec(`
      ALTER TABLE products ADD COLUMN strength TEXT;
    `)
    console.log('✅ Successfully added strength column to products table')
  } catch (error) {
    // Column might already exist
    if (error instanceof Error && !error.message.includes('duplicate column name')) {
      console.error('❌ Error adding strength column:', error.message)
      throw error
    } else {
      console.log('ℹ️  Strength column already exists, skipping...')
    }
  }
}
