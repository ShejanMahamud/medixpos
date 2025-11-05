/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Tab, Tabs } from '@mui/material'

interface CategoryUnitTabsProps {
  activeTab: 'categories' | 'units'
  onTabChange: (tab: 'categories' | 'units') => void
}

export default function CategoryUnitTabs({ activeTab, onTabChange }: CategoryUnitTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => onTabChange(newValue)}
      sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab label="Categories" value="categories" />
      <Tab label="Units" value="units" />
    </Tabs>
  )
}
