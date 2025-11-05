/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Box, Typography } from '@mui/material'

interface ReportHeaderProps {
  title: string
  description: string
}

export default function ReportHeader({ title, description }: ReportHeaderProps): React.JSX.Element {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  )
}
