import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { Role } from '../../utils/permissions'
import { getPasswordRequirements, validatePassword } from '../../utils/securityHelpers'

interface User {
  id: string
  username: string
  fullName: string
  role: Role
}

interface ResetPasswordModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onSubmit: (password: string) => Promise<void>
}

export default function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onSubmit
}: ResetPasswordModalProps): React.JSX.Element | null {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)

  const passwordValidation = passwordTouched ? validatePassword(newPassword) : null
  const passwordRequirements = getPasswordRequirements()
  const passwordsMatch = !confirmNewPassword || newPassword === confirmNewPassword

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!newPassword || !confirmNewPassword) {
      return
    }

    // Validate password
    setPasswordTouched(true)
    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      return
    }

    if (newPassword !== confirmNewPassword) {
      return
    }

    await onSubmit(newPassword)
    setNewPassword('')
    setConfirmNewPassword('')
    setPasswordTouched(false)
  }

  const handleClose = (): void => {
    setNewPassword('')
    setConfirmNewPassword('')
    setPasswordTouched(false)
    onClose()
  }

  return (
    <Dialog open={isOpen && !!user} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Reset password for <strong>{user?.fullName}</strong>
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Important
            </Typography>
            <Typography variant="body2">
              The user will be required to change this password on their next login.
            </Typography>
          </Alert>

          {/* Password Requirements */}
          {passwordRequirements.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Password Requirements:
              </Typography>
              <List dense disablePadding>
                {passwordRequirements.map((req, idx) => (
                  <ListItem key={idx} dense disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {passwordTouched && passwordValidation ? (
                        passwordValidation.isValid ? (
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        )
                      ) : (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'text.secondary'
                          }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={req}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Enter new password"
            required
            fullWidth
            error={Boolean(passwordTouched && passwordValidation && !passwordValidation.isValid)}
            helperText={
              passwordTouched &&
              passwordValidation &&
              !passwordValidation.isValid &&
              passwordValidation.errors[0]
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            fullWidth
            error={Boolean(confirmNewPassword && !passwordsMatch)}
            helperText={confirmNewPassword && !passwordsMatch ? 'Passwords do not match' : ''}
          />
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="warning">
            Reset Password
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
