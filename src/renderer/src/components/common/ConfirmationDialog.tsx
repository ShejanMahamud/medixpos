/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Warning } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  severity?: 'error' | 'warning' | 'info'
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning'
}: ConfirmationDialogProps): React.JSX.Element {
  const getSeverityColor = (): string => {
    switch (severity) {
      case 'error':
        return 'error.main'
      case 'warning':
        return 'warning.main'
      case 'info':
        return 'info.main'
      default:
        return 'warning.main'
    }
  }

  const handleConfirm = (): void => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: severity === 'error' ? 'error.50' : 'warning.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Warning sx={{ color: getSeverityColor(), fontSize: 24 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: 'text.primary',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={severity === 'error' ? 'error' : 'warning'}
          sx={{
            fontWeight: 600,
            '&:hover': {
              bgcolor: severity === 'error' ? 'error.dark' : 'warning.dark'
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
