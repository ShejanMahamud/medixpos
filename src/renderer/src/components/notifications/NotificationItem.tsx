/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import {
  CheckCircle,
  Delete,
  Error,
  Info,
  Inventory,
  OpenInNew,
  ShoppingCart,
  Warning
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

import { Notification, useNotificationStore } from '../../store/notificationStore'

interface NotificationItemProps {
  notification: Notification
  onClose?: () => void
}

const getNotificationIcon = (type: Notification['type']): React.ReactNode => {
  switch (type) {
    case 'success':
      return <CheckCircle sx={{ color: 'success.main' }} />
    case 'warning':
      return <Warning sx={{ color: 'warning.main' }} />
    case 'error':
      return <Error sx={{ color: 'error.main' }} />
    case 'low_stock':
    case 'expiry':
      return <Inventory sx={{ color: 'warning.main' }} />
    case 'sale':
    case 'purchase':
      return <ShoppingCart sx={{ color: 'primary.main' }} />
    default:
      return <Info sx={{ color: 'info.main' }} />
  }
}

const getPriorityColor = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'urgent':
      return 'error'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    default:
      return 'default'
  }
}

export default function NotificationItem({
  notification,
  onClose
}: NotificationItemProps): React.JSX.Element {
  const { markAsRead, deleteNotification } = useNotificationStore()

  const handleMarkAsRead = async (): Promise<void> => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }
  }

  const handleDelete = async (): Promise<void> => {
    await deleteNotification(notification.id)
  }

  const handleAction = (): void => {
    if (notification.actionUrl) {
      // Handle navigation based on actionUrl
      // This would typically use React Router navigation
      console.log('Navigate to:', notification.actionUrl)
    }
    handleMarkAsRead()
    if (onClose) onClose()
  }

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
        borderLeft: notification.isRead ? 'none' : '4px solid',
        borderLeftColor: notification.isRead ? 'none' : 'primary.main',
        '&:hover': {
          bgcolor: 'grey.50',
          '& .notification-actions': {
            opacity: 1
          }
        }
      }}
    >
      <ListItemAvatar sx={{ minWidth: 48 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'transparent'
          }}
        >
          {getNotificationIcon(notification.type)}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        sx={{ margin: 0, pr: 1 }}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: notification.isRead ? 400 : 600,
                color: notification.isRead ? 'text.secondary' : 'text.primary',
                flex: 1
              }}
            >
              {notification.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={notification.priority}
                size="small"
                color={
                  getPriorityColor(notification.priority) as
                    | 'default'
                    | 'primary'
                    | 'secondary'
                    | 'error'
                    | 'info'
                    | 'success'
                    | 'warning'
                }
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  '& .MuiChip-label': { px: 0.5 }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
              {notification.message}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {notification.actionText && notification.actionUrl && (
                <Button
                  size="small"
                  variant="text"
                  startIcon={<OpenInNew />}
                  onClick={handleAction}
                  sx={{ fontSize: '0.75rem', minHeight: 24, py: 0.25 }}
                >
                  {notification.actionText}
                </Button>
              )}

              <Box
                className="notification-actions"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  gap: 0.5,
                  ml: 'auto'
                }}
              >
                {!notification.isRead && (
                  <Tooltip title="Mark as read">
                    <IconButton size="small" onClick={handleMarkAsRead} sx={{ p: 0.25 }}>
                      <CheckCircle sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    sx={{ p: 0.25, color: 'error.main' }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        }
      />
    </ListItem>
  )
}
