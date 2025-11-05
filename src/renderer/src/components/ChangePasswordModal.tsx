/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ChangePasswordModalProps {
  userId: string
  username: string
  onSuccess: () => void
  onCancel?: () => void
  isFirstLogin?: boolean
}

export default function ChangePasswordModal({
  userId,
  username,
  onSuccess,
  onCancel,
  isFirstLogin = false
}: ChangePasswordModalProps): React.JSX.Element {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password')
      return
    }

    setLoading(true)
    try {
      await window.api.users.changePassword(userId, currentPassword, newPassword)
      toast.success('Password changed successfully!')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {!isFirstLogin && onCancel && (
          <IconButton
            onClick={onCancel}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="close"
          >
            <Close />
          </IconButton>
        )}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            borderRadius: '50%',
            mb: 2,
            mt: 1
          }}
        >
          <Lock sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {isFirstLogin ? 'Change Your Password' : 'Update Password'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isFirstLogin
            ? 'For security reasons, please change your password before continuing'
            : `Update password for ${username}`}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Current Password */}
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
              inputProps={{ minLength: 6 }}
              helperText="Minimum 6 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          {!isFirstLogin && onCancel && (
            <Button onClick={onCancel} variant="outlined" disabled={loading} sx={{ flex: 1 }}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
              }
            }}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
