/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Box, Typography } from '@mui/material'

export default function BankAccountHeader(): React.JSX.Element {
  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Accounts Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage cash, bank accounts, and mobile banking accounts
        </Typography>
      </Box>
    </Box>
  )
}
