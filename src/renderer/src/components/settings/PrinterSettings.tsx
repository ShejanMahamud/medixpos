/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Add, Delete, Edit, Print, PrintDisabled, Refresh, Save } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface PrinterConfig {
  id?: string
  name: string
  printerType: 'usb' | 'network' | 'bluetooth'
  connectionPath: string
  paperWidth: number
  characterWidth: number
  isDefault: boolean
  autoPrint: boolean
  isActive: boolean
  showLogo: boolean
  logoPath?: string
  businessName?: string
  businessAddress?: string
  businessPhone?: string
  footerMessage?: string
  showBarcode: boolean
  fontSize: 'small' | 'normal' | 'large'
  cutPaper: boolean
  openCashDrawer: boolean
}

const defaultConfig: PrinterConfig = {
  name: 'Main Printer',
  printerType: 'usb',
  connectionPath: '',
  paperWidth: 80,
  characterWidth: 48,
  isDefault: true,
  autoPrint: true,
  isActive: true,
  showLogo: true,
  showBarcode: true,
  fontSize: 'normal',
  cutPaper: true,
  openCashDrawer: false,
  businessName: 'Pharmacy POS',
  footerMessage: 'Thank you for your business!'
}

export default function PrinterSettings(): React.ReactElement {
  const [configs, setConfigs] = useState<PrinterConfig[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingConfig, setEditingConfig] = useState<PrinterConfig>(defaultConfig)
  const [testing, setTesting] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async (): Promise<void> => {
    try {
      const result = await window.api.printer.getConfigs()
      if (result.success && result.configs) {
        setConfigs(result.configs as PrinterConfig[])
      }
    } catch (error) {
      console.error('Failed to load printer configs:', error)
      toast.error('Failed to load printer configurations')
    }
  }

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true)
      const result = await window.api.printer.saveConfig(editingConfig)
      if (result.success) {
        toast.success('Printer configuration saved')
        setShowDialog(false)
        await loadConfigs()
      } else {
        toast.error(result.error || 'Failed to save configuration')
      }
    } catch (error) {
      console.error('Failed to save printer config:', error)
      toast.error('Failed to save printer configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async (printerId: string): Promise<void> => {
    try {
      setTesting(printerId)
      const result = await window.api.printer.test(printerId)
      if (result.success) {
        toast.success('Test print sent successfully')
      } else {
        toast.error(result.error || 'Test print failed')
      }
    } catch (error) {
      console.error('Test print failed:', error)
      toast.error('Test print failed')
    } finally {
      setTesting(null)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this printer?')) return

    try {
      const result = await window.api.printer.deleteConfig(id)
      if (result.success) {
        toast.success('Printer deleted')
        await loadConfigs()
      } else {
        toast.error(result.error || 'Failed to delete printer')
      }
    } catch (error) {
      console.error('Failed to delete printer:', error)
      toast.error('Failed to delete printer')
    }
  }

  const handleEdit = (config: PrinterConfig): void => {
    setEditingConfig(config)
    setShowDialog(true)
  }

  const handleAdd = (): void => {
    setEditingConfig({ ...defaultConfig, isDefault: configs.length === 0 })
    setShowDialog(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Receipt Printer Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<Refresh />} onClick={loadConfigs} variant="outlined">
            Refresh
          </Button>
          <Button startIcon={<Add />} onClick={handleAdd} variant="contained">
            Add Printer
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure thermal receipt printers for automatic printing on sale completion. Supports
        ESC/POS compatible printers via USB or network connection.
      </Alert>

      <Grid container spacing={3}>
        {configs.map((config) => (
          <Grid item xs={12} md={6} key={config.id}>
            <Card sx={{ border: '1px solid', borderColor: 'grey.200' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 2
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {config.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {config.printerType.toUpperCase()} - {config.connectionPath}
                    </Typography>
                  </Box>
                  <Box>
                    {config.isDefault && (
                      <Chip label="Default" size="small" color="primary" sx={{ mr: 1 }} />
                    )}
                    {config.autoPrint && <Chip label="Auto Print" size="small" color="success" />}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Paper Width
                      </Typography>
                      <Typography variant="body2">{config.paperWidth}mm</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Font Size
                      </Typography>
                      <Typography variant="body2">{config.fontSize}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(config)}
                    color="primary"
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleTest(config.id!)}
                    color="info"
                    disabled={testing === config.id}
                    title="Test Print"
                  >
                    {testing === config.id ? <PrintDisabled /> : <Print />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(config.id!)}
                    color="error"
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {configs.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                No printers configured
              </Typography>
              <Button startIcon={<Add />} onClick={handleAdd} variant="contained" sx={{ mt: 2 }}>
                Add Your First Printer
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingConfig.id ? 'Edit Printer' : 'Add Printer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Printer Name"
                value={editingConfig.name}
                onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Connection Type</InputLabel>
                <Select
                  value={editingConfig.printerType}
                  label="Connection Type"
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      printerType: e.target.value as 'usb' | 'network' | 'bluetooth'
                    })
                  }
                >
                  <MenuItem value="usb">USB</MenuItem>
                  <MenuItem value="network">Network</MenuItem>
                  <MenuItem value="bluetooth">Bluetooth</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={
                  editingConfig.printerType === 'network'
                    ? 'IP Address:Port'
                    : editingConfig.printerType === 'usb'
                      ? 'USB Path'
                      : 'Bluetooth Address'
                }
                value={editingConfig.connectionPath}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, connectionPath: e.target.value })
                }
                fullWidth
                required
                placeholder={
                  editingConfig.printerType === 'network'
                    ? '192.168.1.100:9100'
                    : editingConfig.printerType === 'usb'
                      ? '/dev/usb/lp0 or COM1'
                      : 'AA:BB:CC:DD:EE:FF'
                }
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Paper Width</InputLabel>
                <Select
                  value={editingConfig.paperWidth}
                  label="Paper Width"
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, paperWidth: Number(e.target.value) })
                  }
                >
                  <MenuItem value={58}>58mm</MenuItem>
                  <MenuItem value={80}>80mm</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={editingConfig.fontSize}
                  label="Font Size"
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      fontSize: e.target.value as 'small' | 'normal' | 'large'
                    })
                  }
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Business Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Business Name"
                value={editingConfig.businessName || ''}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, businessName: e.target.value })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Business Address"
                value={editingConfig.businessAddress || ''}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, businessAddress: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Business Phone"
                value={editingConfig.businessPhone || ''}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, businessPhone: e.target.value })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Logo Path (Optional)"
                value={editingConfig.logoPath || ''}
                onChange={(e) => setEditingConfig({ ...editingConfig, logoPath: e.target.value })}
                fullWidth
                placeholder="/path/to/logo.png"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Footer Message"
                value={editingConfig.footerMessage || ''}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, footerMessage: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Print Options
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.isDefault}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, isDefault: e.target.checked })
                    }
                  />
                }
                label="Set as Default Printer"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.autoPrint}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, autoPrint: e.target.checked })
                    }
                  />
                }
                label="Auto Print on Sale"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.showLogo}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, showLogo: e.target.checked })
                    }
                  />
                }
                label="Show Logo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.showBarcode}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, showBarcode: e.target.checked })
                    }
                  />
                }
                label="Show Barcode"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.cutPaper}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, cutPaper: e.target.checked })
                    }
                  />
                }
                label="Cut Paper After Print"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingConfig.openCashDrawer}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, openCashDrawer: e.target.checked })
                    }
                  />
                }
                label="Open Cash Drawer"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading} startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
