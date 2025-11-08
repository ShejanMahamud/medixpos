/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Close, CloudUpload, Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Prescription, PrescriptionFormData } from '../../types/prescription'

interface PrescriptionFormModalWithUploadProps {
  isOpen: boolean
  onClose: (reload?: boolean) => void
  prescription: Prescription | null
  preSelectedCustomerId?: string
  preSelectedCustomerName?: string
}

export default function PrescriptionFormModalWithUpload({
  isOpen,
  onClose,
  prescription,
  preSelectedCustomerId,
  preSelectedCustomerName
}: PrescriptionFormModalWithUploadProps): React.JSX.Element {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    customerId: prescription?.customerId || preSelectedCustomerId || '',
    saleId: prescription?.saleId || '',
    doctorName: prescription?.doctorName || '',
    doctorPhone: prescription?.doctorPhone || '',
    prescriptionNumber: prescription?.prescriptionNumber || '',
    prescriptionDate: prescription?.prescriptionDate
      ? new Date(prescription.prescriptionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    diagnosis: prescription?.diagnosis || '',
    notes: prescription?.notes || '',
    imageUrl: prescription?.imageUrl || ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; phone: string }>>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  useEffect(() => {
    if (isOpen && !preSelectedCustomerId) {
      loadCustomers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (prescription?.imageUrl) {
      setFilePreview(prescription.imageUrl)
    }
  }, [prescription])

  const loadCustomers = async (): Promise<void> => {
    try {
      setLoadingCustomers(true)
      const data = await window.api.customers.getAll()
      setCustomers(
        (data as Array<Record<string, unknown>>).map((c) => ({
          id: c.id as string,
          name: c.name as string,
          phone: c.phone as string
        }))
      )
    } catch (error) {
      console.error('Error loading customers:', error)
      toast.error('Failed to load customers')
    } finally {
      setLoadingCustomers(false)
    }
  }

  const handleChange = (field: keyof PrescriptionFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only images (JPG, PNG, GIF) and PDF files are allowed')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview('') // PDF doesn't need preview
    }
  }

  const handleRemoveFile = (): void => {
    setSelectedFile(null)
    setFilePreview('')
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!formData.customerId) {
      toast.error('Please select a customer')
      return
    }

    if (!formData.prescriptionDate) {
      toast.error('Prescription date is required')
      return
    }

    try {
      setSubmitting(true)

      let imageData = formData.imageUrl

      // Convert file to base64 if a new file was selected
      if (selectedFile) {
        imageData = await convertFileToBase64(selectedFile)
      }

      const dataToSubmit = {
        ...formData,
        imageUrl: imageData
      }

      if (prescription) {
        await window.api.prescriptions.update(
          prescription.id,
          dataToSubmit as unknown as Record<string, unknown>
        )
        toast.success('Prescription updated successfully')
      } else {
        await window.api.prescriptions.create(dataToSubmit as unknown as Record<string, unknown>)
        toast.success('Prescription added successfully')
      }

      onClose(true)
    } catch (error) {
      console.error('Error saving prescription:', error)
      toast.error(prescription ? 'Failed to update prescription' : 'Failed to add prescription')
    } finally {
      setSubmitting(false)
    }
  }

  const getCustomerDisplay = (): string => {
    if (preSelectedCustomerName) return preSelectedCustomerName
    const customer = customers.find((c) => c.id === formData.customerId)
    return customer ? `${customer.name} (${customer.phone})` : ''
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose()} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {prescription ? 'Edit Prescription' : 'Add New Prescription'}
            </Typography>
            <IconButton onClick={() => onClose()} size="small">
              <Close />
            </IconButton>
          </Box>
          {preSelectedCustomerName && (
            <Typography variant="body2" color="text.secondary">
              Customer: {preSelectedCustomerName}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!preSelectedCustomerId && (
              <FormControl fullWidth required>
                <InputLabel>Customer</InputLabel>
                <Select
                  value={formData.customerId}
                  label="Customer"
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  disabled={loadingCustomers}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {preSelectedCustomerId && (
              <TextField
                label="Customer"
                value={getCustomerDisplay()}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
              />
            )}

            <TextField
              label="Prescription Date"
              type="date"
              value={formData.prescriptionDate}
              onChange={(e) => handleChange('prescriptionDate', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Prescription Number"
              value={formData.prescriptionNumber}
              onChange={(e) => handleChange('prescriptionNumber', e.target.value)}
              fullWidth
              placeholder="RX-12345"
            />

            <TextField
              label="Doctor Name"
              value={formData.doctorName}
              onChange={(e) => handleChange('doctorName', e.target.value)}
              fullWidth
              placeholder="Dr. John Smith"
            />

            <TextField
              label="Doctor Phone"
              value={formData.doctorPhone}
              onChange={(e) => handleChange('doctorPhone', e.target.value)}
              fullWidth
              placeholder="+1234567890"
            />

            <TextField
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Brief diagnosis or condition"
            />

            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Additional notes or instructions"
            />

            {/* File Upload Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Prescription Document
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'grey.50'
                }}
              >
                {!filePreview && !selectedFile ? (
                  <>
                    <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Upload prescription image or PDF
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      Supported: JPG, PNG, GIF, PDF (Max 5MB)
                    </Typography>
                    <Button variant="outlined" component="label">
                      Choose File
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                      />
                    </Button>
                  </>
                ) : (
                  <Box>
                    {filePreview && filePreview.startsWith('data:image/') && (
                      <Box
                        component="img"
                        src={filePreview}
                        alt="Prescription preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          mb: 2,
                          borderRadius: 1
                        }}
                      />
                    )}
                    {selectedFile && selectedFile.type === 'application/pdf' && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        📄 {selectedFile.name}
                      </Typography>
                    )}
                    {filePreview && filePreview.startsWith('data:application/pdf') && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        📄 PDF Document Attached
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                        Change File
                        <input
                          type="file"
                          hidden
                          accept="image/*,application/pdf"
                          onChange={handleFileSelect}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleRemoveFile}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose()} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : prescription ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
