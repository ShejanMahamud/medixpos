/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import { Help, PlayCircle, Stop, Tour } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography
} from '@mui/material'

import useTour from '../hooks/useTour'

function TourDemo(): React.JSX.Element {
  const { startTour, stopTour, hasActiveTour, currentTour } = useTour()

  const handleDemoTour = (): void => {
    const demoTourConfig = {
      name: 'demo-tour',
      steps: [
        {
          element: '[data-demo="welcome"]',
          title: 'Welcome to Driver.js Demo! 🎉',
          description:
            'This is a demonstration of how Driver.js works in your pharmacy management system. Driver.js helps guide users through your application features.'
        },
        {
          element: '[data-demo="controls"]',
          title: 'Tour Controls',
          description:
            'These buttons allow you to start different tours. Each tour is designed for specific areas of your application.'
        },
        {
          element: '[data-demo="features"]',
          title: 'Available Features',
          description:
            'Here you can see all the features that have guided tours. Tours are context-aware and will only show relevant information.'
        },
        {
          element: '[data-demo="status"]',
          title: 'Tour Status',
          description:
            'This area shows you the current tour status and provides quick actions to manage tours.'
        },
        {
          title: 'Demo Complete! ✨',
          description:
            'You have successfully completed the demo tour! Driver.js is now ready to help guide your users through your pharmacy management system. You can create custom tours for different user roles and workflows.'
        }
      ]
    }

    startTour(demoTourConfig)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ mb: 3 }} data-demo="welcome">
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Tour color="primary" fontSize="large" />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Driver.js Implementation Demo
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Driver.js has been successfully implemented in your MedixPOS application. This demo
            showcases the guided tour functionality that helps users navigate and understand your
            pharmacy management system.
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        {/* Tour Controls */}
        <Paper sx={{ p: 3 }} data-demo="controls">
          <Typography variant="h6" gutterBottom fontWeight="600">
            🎮 Tour Controls
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<PlayCircle />}
              onClick={handleDemoTour}
              disabled={hasActiveTour}
            >
              Start Demo Tour
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => startTour('dashboard')}
              disabled={hasActiveTour}
            >
              Dashboard Tour
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => startTour('pos')}
              disabled={hasActiveTour}
            >
              POS Tour
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Stop />}
              onClick={stopTour}
              disabled={!hasActiveTour}
            >
              Stop Tour
            </Button>
          </Stack>
        </Paper>

        {/* Features */}
        <Paper sx={{ p: 3 }} data-demo="features">
          <Typography variant="h6" gutterBottom fontWeight="600">
            🚀 Available Tour Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 2
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  📊 Dashboard Tour
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive overview of dashboard features, statistics, and quick actions for
                  pharmacy management.
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  🛒 Point of Sale Tour
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Step-by-step guide through the POS system, from product selection to payment
                  processing.
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  📦 Product Management Tour
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to add, edit, and manage products, categories, and inventory levels.
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  🚀 First-Time User Tour
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive introduction for new users covering all major system features and
                  workflows.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>

        {/* Status */}
        <Paper sx={{ p: 3 }} data-demo="status">
          <Typography variant="h6" gutterBottom fontWeight="600">
            📈 Tour Status & Information
          </Typography>
          <Stack spacing={2}>
            {hasActiveTour ? (
              <Alert severity="info" icon={<Tour />}>
                <Typography variant="body2">
                  <strong>Active Tour:</strong> {currentTour}
                  <br />A guided tour is currently running. You can navigate through the steps or
                  stop it using the controls above.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="success" icon={<Help />}>
                <Typography variant="body2">
                  <strong>No Active Tour</strong>
                  <br />
                  Ready to start a new guided tour. Choose from the available tour options above.
                </Typography>
              </Alert>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Implementation Features:</strong>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="Custom Styling" size="small" color="primary" />
                <Chip label="Context-Aware Tours" size="small" color="secondary" />
                <Chip label="Responsive Design" size="small" color="success" />
                <Chip label="Accessibility Support" size="small" color="warning" />
                <Chip label="Tour Progress Tracking" size="small" color="info" />
                <Chip label="First-Time User Experience" size="small" color="error" />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

export default TourDemo
