import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Call as CallIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

function Monitor() {
  const activeCalls = [
    { id: 'call_001', from: '+1 (555) 123-4567', duration: '2:34', language: 'es-LA', status: 'active' },
    { id: 'call_002', from: '+1 (555) 987-6543', duration: '1:45', language: 'en-US', status: 'active' },
    { id: 'call_003', from: '+1 (555) 456-7890', duration: '0:23', language: 'es-LA', status: 'connecting' },
  ];

  const performanceMetrics = {
    avgResponseTime: 280,
    successRate: 99.2,
    activeCalls: 3,
    totalCallsToday: 47,
    languageSwitches: 8,
    interruptions: 3,
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Monitor
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time monitoring of your Voice AI Agent performance and active calls
      </Typography>

      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {performanceMetrics.avgResponseTime}ms
                    </Typography>
                    <Typography variant="caption">Avg Response Time</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={94} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {performanceMetrics.successRate}%
                    </Typography>
                    <Typography variant="caption">Success Rate</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={99.2} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {performanceMetrics.activeCalls}
                    </Typography>
                    <Typography variant="caption">Active Calls</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {performanceMetrics.totalCallsToday}
                    </Typography>
                    <Typography variant="caption">Total Calls Today</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Voice AI Agent" secondary="Online" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="STT Service" secondary="Online" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="TTS Service" secondary="Online" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="LLM Service" secondary="Online" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Twilio Integration" secondary="Online" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Calls */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Calls
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Call ID</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>{call.id}</TableCell>
                        <TableCell>{call.from}</TableCell>
                        <TableCell>{call.duration}</TableCell>
                        <TableCell>
                          <Chip 
                            label={call.language === 'es-LA' ? 'Spanish' : 'English'} 
                            color={call.language === 'es-LA' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={call.status} 
                            color={call.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label="Monitor" color="info" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Monitor;
