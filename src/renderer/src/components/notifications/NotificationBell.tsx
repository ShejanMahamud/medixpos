/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Notifications } from '@mui/icons-material'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'

import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import NotificationPanel from './NotificationPanel'

export default function NotificationBell(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const user = useAuthStore((state) => state.user)
  const { unreadCount, fetchUnreadCount } = useNotificationStore()

  const open = Boolean(anchorEl)

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount(user.id)
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount(user.id)
      }, 30000)
      return () => clearInterval(interval)
    }
    return
  }, [user?.id, fetchUnreadCount])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Badge
            badgeContent={unreadCount > 99 ? '99+' : unreadCount}
            color="error"
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: unreadCount > 9 ? 20 : 16,
                height: 16,
                top: 2,
                right: 2
              }
            }}
          >
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationPanel anchorEl={anchorEl} open={open} onClose={handleClose} />
    </>
  )
}
