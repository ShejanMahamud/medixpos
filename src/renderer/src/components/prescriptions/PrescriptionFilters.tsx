/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Add, Search } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField
} from '@mui/material'

interface PrescriptionFiltersProps {
  searchTerm: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onAddClick: () => void
}

export default function PrescriptionFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onAddClick
}: PrescriptionFiltersProps): React.JSX.Element {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flex: 1
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search by prescription #, customer, doctor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ flex: 1, maxWidth: { sm: 400 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'grey.400' }} />
                </InputAdornment>
              )
            }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Filter"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Prescriptions</MenuItem>
              <MenuItem value="with_image">With Documents</MenuItem>
              <MenuItem value="without_image">Without Documents</MenuItem>
              <MenuItem value="linked">Linked to Sales</MenuItem>
              <MenuItem value="unlinked">Not Linked</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Add Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddClick}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add Prescription
        </Button>
      </Box>
    </Paper>
  )
}
