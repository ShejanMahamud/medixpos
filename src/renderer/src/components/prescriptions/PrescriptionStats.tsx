/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { CheckCircle, LocalHospital, Pending, TrendingUp } from '@mui/icons-material'
import { Avatar, Box, Paper, Typography } from '@mui/material'

interface PrescriptionStatsProps {
  totalPrescriptions: number
  thisMonthPrescriptions: number
  withImages: number
  linkedToSales: number
}

export default function PrescriptionStats({
  totalPrescriptions,
  thisMonthPrescriptions,
  withImages,
  linkedToSales
}: PrescriptionStatsProps): React.JSX.Element {
  const stats = [
    {
      title: 'Total Prescriptions',
      value: totalPrescriptions.toString(),
      subtitle: 'All prescriptions',
      icon: <LocalHospital sx={{ color: 'white' }} />,
      color: 'primary.main',
      bgColor: 'primary.main'
    },
    {
      title: 'This Month',
      value: thisMonthPrescriptions.toString(),
      subtitle: 'New prescriptions',
      icon: <Pending sx={{ color: 'white' }} />,
      color: 'primary.light',
      bgColor: 'primary.light'
    },
    {
      title: 'With Documents',
      value: withImages.toString(),
      subtitle: 'Have attachments',
      icon: <CheckCircle sx={{ color: 'white' }} />,
      color: 'secondary.main',
      bgColor: 'secondary.light'
    },
    {
      title: 'Linked to Sales',
      value: linkedToSales.toString(),
      subtitle: 'Connected to sales',
      icon: <TrendingUp sx={{ color: 'white' }} />,
      color: 'warning.main',
      bgColor: 'warning.light'
    }
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 3
      }}
    >
      {stats.map((stat, index) => (
        <Paper key={index} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {stat.subtitle}
              </Typography>
            </Box>
            <Avatar sx={{ width: 48, height: 48, bgcolor: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </Avatar>
          </Box>
        </Paper>
      ))}
    </Box>
  )
}
