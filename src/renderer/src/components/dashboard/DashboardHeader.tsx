/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Box, Typography } from '@mui/material'

interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps): React.JSX.Element {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
      >
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Welcome back, {userName}! Here&apos;s what&apos;s happening today.
      </Typography>
    </Box>
  )
}
