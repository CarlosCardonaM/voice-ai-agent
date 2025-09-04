import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
} from '@mui/material';
import {
  Rocket as RocketIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

function Deploy() {
  const [deploymentConfig, setDeploymentConfig] = useState({
    environment: 'production',
    region: 'us-east-1',
    instanceType: 't3.medium',
    autoScaling: true,
    minInstances: 1,
    maxInstances: 5,
    healthCheckPath: '/health',
    sslEnabled: true,
    monitoring: true,
  });

  const [deploymentStatus, setDeploymentStatus] = useState('idle'); // idle, deploying, deployed, error
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentLogs, setDeploymentLogs] = useState([]);

  const deploymentSteps = [
    'Validating configuration...',
    'Provisioning infrastructure...',
    'Deploying application...',
    'Configuring load balancer...',
    'Setting up monitoring...',
    'Running health checks...',
    'Deployment complete!',
  ];

  const environments = [
    { id: 'development', name: 'Development', color: 'info' },
    { id: 'staging', name: 'Staging', color: 'warning' },
    { id: 'production', name: 'Production', color: 'success' },
  ];

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', latency: 'Low' },
    { id: 'us-west-2', name: 'US West (Oregon)', latency: 'Low' },
    { id: 'eu-west-1', name: 'Europe (Ireland)', latency: 'Medium' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', latency: 'High' },
  ];

  const instanceTypes = [
    { id: 't3.micro', name: 't3.micro', cpu: '2 vCPU', memory: '1 GB', cost: '$0.0104/hour' },
    { id: 't3.small', name: 't3.small', cpu: '2 vCPU', memory: '2 GB', cost: '$0.0208/hour' },
    { id: 't3.medium', name: 't3.medium', cpu: '2 vCPU', memory: '4 GB', cost: '$0.0416/hour' },
    { id: 't3.large', name: 't3.large', cpu: '2 vCPU', memory: '8 GB', cost: '$0.0832/hour' },
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setDeploymentLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const startDeployment = async () => {
    setDeploymentStatus('deploying');
    setCurrentStep(0);
    setDeploymentLogs([]);
    addLog('Starting deployment process...', 'info');

    // Simulate deployment
    for (let i = 0; i < deploymentSteps.length; i++) {
      setCurrentStep(i);
      addLog(deploymentSteps[i], 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setDeploymentStatus('deployed');
    addLog('Deployment completed successfully!', 'success');
  };

  const stopDeployment = () => {
    setDeploymentStatus('idle');
    addLog('Deployment stopped by user', 'warning');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deploying': return 'primary';
      case 'deployed': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deploying': return <RocketIcon />;
      case 'deployed': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      default: return <CloudIcon />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Deploy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deploy your Voice AI Agent to production and manage infrastructure
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Deployment Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deployment Configuration
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={deploymentConfig.environment}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, environment: e.target.value }))}
                  label="Environment"
                >
                  {environments.map((env) => (
                    <MenuItem key={env.id} value={env.id}>
                      <Chip label={env.name} color={env.color} size="small" sx={{ mr: 1 }} />
                      {env.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Region</InputLabel>
                <Select
                  value={deploymentConfig.region}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, region: e.target.value }))}
                  label="Region"
                >
                  {regions.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      <Box>
                        <Typography variant="body2">{region.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Latency: {region.latency}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Instance Type</InputLabel>
                <Select
                  value={deploymentConfig.instanceType}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, instanceType: e.target.value }))}
                  label="Instance Type"
                >
                  {instanceTypes.map((instance) => (
                    <MenuItem key={instance.id} value={instance.id}>
                      <Box>
                        <Typography variant="body2">{instance.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {instance.cpu}, {instance.memory} - {instance.cost}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Health Check Path"
                value={deploymentConfig.healthCheckPath}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, healthCheckPath: e.target.value }))}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<RocketIcon />}
                  onClick={startDeployment}
                  disabled={deploymentStatus === 'deploying'}
                  fullWidth
                >
                  Deploy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<StopIcon />}
                  onClick={stopDeployment}
                  disabled={deploymentStatus !== 'deploying'}
                  fullWidth
                >
                  Stop
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Infrastructure Status */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Infrastructure Status
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Load Balancer" secondary="Healthy" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Auto Scaling" secondary="Enabled" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="SSL Certificate" secondary="Valid" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Monitoring" secondary="Active" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Deployment Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Deployment Progress
                </Typography>
                <Chip
                  label={deploymentStatus}
                  color={getStatusColor(deploymentStatus)}
                  icon={getStatusIcon(deploymentStatus)}
                />
              </Box>

              {deploymentStatus === 'deploying' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {deploymentSteps[currentStep]}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((currentStep + 1) / deploymentSteps.length) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Step {currentStep + 1} of {deploymentSteps.length}
                  </Typography>
                </Box>
              )}

              {deploymentStatus === 'deployed' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Deployment completed successfully! Your Voice AI Agent is now live in production.
                </Alert>
              )}

              {/* Deployment Steps */}
              <Stepper orientation="vertical" activeStep={currentStep}>
                {deploymentSteps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>
                      {step}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {index === 0 && 'Validating all configuration parameters and dependencies...'}
                        {index === 1 && 'Creating and configuring cloud infrastructure...'}
                        {index === 2 && 'Deploying application code and services...'}
                        {index === 3 && 'Setting up load balancing and traffic routing...'}
                        {index === 4 && 'Configuring monitoring, logging, and alerting...'}
                        {index === 5 && 'Running comprehensive health checks...'}
                        {index === 6 && 'Finalizing deployment and enabling traffic...'}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Deployment Logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deployment Logs
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                {deploymentLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No deployment logs yet. Start a deployment to see activity.
                  </Typography>
                ) : (
                  <List dense>
                    {deploymentLogs.map((log, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {log.type === 'success' && <CheckIcon color="success" fontSize="small" />}
                          {log.type === 'error' && <ErrorIcon color="error" fontSize="small" />}
                          {log.type === 'warning' && <WarningIcon color="warning" fontSize="small" />}
                          {log.type === 'info' && <RocketIcon color="info" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={log.message}
                          secondary={log.timestamp}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Deploy;
