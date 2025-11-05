/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

export interface Category {
  id: number
  name: string
  description: string
}

export interface CategoryFormData {
  name: string
  description: string
}

export interface Unit {
  id: number
  name: string
  abbreviation: string
  type: 'base' | 'package'
  description: string
}

export interface UnitFormData {
  name: string
  abbreviation: string
  type: 'base' | 'package'
  description: string
}
