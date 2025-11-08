/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { CheckCircle, Close, MarkEmailRead } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, List, Paper, Popper, Typography } from '@mui/material'
import { useEffect } from 'react'

import { useAuthStore } from '../../store/authStore'
import { Notification, useNotificationStore } from '../../store/notificationStore'

// Temporary placeholder for NotificationItem
const NotificationItem = ({
  notification,
  onClose
}: {
  notification: Notification
  onClose?: () => void
}): React.JSX.Element => (
  <div>
    {notification.title}: {notification.message} {onClose && ''}
  </div>
)

interface NotificationPanelProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export default function NotificationPanel({
  anchorEl,
  open,
  onClose
}: NotificationPanelProps): React.JSX.Element {
  const user = useAuthStore((state) => state.user)
  const { notifications, isLoading, fetchNotifications, markAllAsRead, unreadCount } =
    useNotificationStore()

  useEffect(() => {
    if (open && user?.id) {
      fetchNotifications(user.id, 20) // Fetch latest 20 notifications
    }
  }, [open, user?.id, fetchNotifications])

  const handleMarkAllRead = (): void => {
    markAllAsRead()
  }

  const handleClearAll = (): void => {
    // Clear all notifications would require backend support
    // For now, just close the panel
    onClose()
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      disablePortal={false}
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'document',
            padding: 8
          }
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'document',
            padding: 8
          }
        }
      ]}
      sx={{ zIndex: 1300 }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 400,
          maxHeight: 500,
          bgcolor: 'white',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          mt: 1
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Actions */}
        {unreadCount > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 1,
              bgcolor: 'grey.50',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllRead}
              sx={{ fontSize: '0.75rem' }}
            >
              Mark All Read
            </Button>
            <Button
              size="small"
              startIcon={<CheckCircle />}
              onClick={handleClearAll}
              sx={{ fontSize: '0.75rem' }}
            >
              Clear All
            </Button>
          </Box>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List
            sx={{
              py: 0,
              maxHeight: 400,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: 6
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'grey.100'
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'grey.300',
                borderRadius: 3
              }
            }}
          >
            {notifications.map((notification: Notification, index: number) => (
              <div key={notification.id}>
                <NotificationItem notification={notification} onClose={onClose} />
                {index < notifications.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={onClose} sx={{ fontSize: '0.75rem' }}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Popper>
  )
}
