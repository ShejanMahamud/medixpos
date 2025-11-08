/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { CheckCircle, Close, Error, Info, Warning } from '@mui/icons-material'
import { Alert, AlertTitle, Box, Button, IconButton, Slide, Stack } from '@mui/material'
import { useNotificationStore } from '../../store/notificationStore'

const getIcon = (type: 'info' | 'success' | 'warning' | 'error'): React.ReactNode => {
  switch (type) {
    case 'success':
      return <CheckCircle />
    case 'warning':
      return <Warning />
    case 'error':
      return <Error />
    default:
      return <Info />
  }
}

export default function ToastContainer(): React.JSX.Element {
  const { toasts, removeToast } = useNotificationStore()

  if (toasts.length === 0) {
    return <div />
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 400
      }}
    >
      <Stack spacing={1}>
        {toasts.map((toast, index) => (
          <Slide
            key={toast.id}
            direction="left"
            in={true}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <Alert
              severity={toast.type}
              icon={getIcon(toast.type)}
              variant="filled"
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {toast.actionText && toast.onAction && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={toast.onAction}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      {toast.actionText}
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => removeToast(toast.id)}
                    sx={{ color: 'white' }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <AlertTitle sx={{ mb: 0.5, fontWeight: 600 }}>{toast.title}</AlertTitle>
              {toast.message}
            </Alert>
          </Slide>
        ))}
      </Stack>
    </Box>
  )
}
