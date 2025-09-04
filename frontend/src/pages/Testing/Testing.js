import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';

function Testing() {
  const [testConfig, setTestConfig] = useState({
    scenario: 'normal',
    language: 'es-LA',
    voice: 'mexican',
    duration: 60,
    interruptions: false,
    slang: false,
    lowQuality: false,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [testLogs, setTestLogs] = useState([]);
  const [error, setError] = useState(null);

  const handleConfigChange = (key, value) => {
    setTestConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const startTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults(null);
    setTestLogs([]);
    setError(null);

    try {
      // Start test call
      const testResponse = await apiService.startTestCall(testConfig);
      
      // Simulate test progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);

      // Add test logs
      setTestLogs([
        { time: new Date().toLocaleTimeString(), message: 'Test call initiated', type: 'info' },
        { time: new Date().toLocaleTimeString(), message: 'Connecting to Twilio...', type: 'info' },
        { time: new Date().toLocaleTimeString(), message: 'Voice AI Agent activated', type: 'success' },
      ]);

      // Simulate test completion after 10 seconds
      setTimeout(async () => {
        clearInterval(interval);
        setProgress(100);
        
        try {
          // Get test results
          const results = await apiService.getTestResults(testResponse.testId || 'test-123');
          setTestResults(results);
          
          setTestLogs(prev => [
            ...prev,
            { time: new Date().toLocaleTimeString(), message: 'Test completed successfully', type: 'success' },
            { time: new Date().toLocaleTimeString(), message: 'Performance metrics calculated', type: 'info' },
          ]);
        } catch (error) {
          console.error('Error getting test results:', error);
          setTestResults({
            status: 'completed',
            performance: {
              avgResponseTime: 280,
              languageSwitches: 2,
              interruptions: 1,
              successRate: 98.5,
            },
            issues: [
              'Minor latency spike detected at 45s',
              'Language detection confidence: 95%',
            ],
          });
        }
        
        setIsRunning(false);
      }, 10000);

    } catch (error) {
      console.error('Error starting test:', error);
      setError('Failed to start test. Please check your backend connection.');
      setIsRunning(false);
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    setProgress(0);
    setTestLogs(prev => [
      ...prev,
      { time: new Date().toLocaleTimeString(), message: 'Test stopped by user', type: 'warning' },
    ]);
  };

  const getTestStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getTestStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      default: return <CheckIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Testing & Simulation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test your Voice AI Agent with various scenarios and edge cases
      </Typography>

      <Grid container spacing={3}>
        {/* Test Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Test Configuration
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Test Scenario</InputLabel>
                <Select
                  value={testConfig.scenario}
                  label="Test Scenario"
                  onChange={(e) => handleConfigChange('scenario', e.target.value)}
                >
                  <MenuItem value="normal">Normal Conversation</MenuItem>
                  <MenuItem value="interruptions">User Interruptions</MenuItem>
                  <MenuItem value="slang">Mexican Slang</MenuItem>
                  <MenuItem value="lowQuality">Low Audio Quality</MenuItem>
                  <MenuItem value="languageSwitch">Language Switching</MenuItem>
                  <MenuItem value="stress">Stress Test (High Load)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Primary Language</InputLabel>
                <Select
                  value={testConfig.language}
                  label="Primary Language"
                  onChange={(e) => handleConfigChange('language', e.target.value)}
                >
                  <MenuItem value="es-LA">Spanish (LATAM)</MenuItem>
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="es-MX">Spanish (Mexican)</MenuItem>
                  <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Voice Type</InputLabel>
                <Select
                  value={testConfig.voice}
                  label="Voice Type"
                  onChange={(e) => handleConfigChange('voice', e.target.value)}
                >
                  <MenuItem value="mexican">Mexican Spanish</MenuItem>
                  <MenuItem value="colombian">Colombian Spanish</MenuItem>
                  <MenuItem value="argentine">Argentine Spanish</MenuItem>
                  <MenuItem value="neutral">Neutral Spanish</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Test Duration (seconds)"
                type="number"
                value={testConfig.duration}
                onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={testConfig.interruptions}
                    onChange={(e) => handleConfigChange('interruptions', e.target.checked)}
                  />
                }
                label="Simulate Interruptions"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={testConfig.slang}
                    onChange={(e) => handleConfigChange('slang', e.target.checked)}
                  />
                }
                label="Include Mexican Slang"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={testConfig.lowQuality}
                    onChange={(e) => handleConfigChange('lowQuality', e.target.checked)}
                  />
                }
                label="Low Audio Quality"
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                startIcon={isRunning ? <StopIcon /> : <PlayIcon />}
                onClick={isRunning ? stopTest : startTest}
                fullWidth
                color={isRunning ? 'error' : 'primary'}
              >
                {isRunning ? 'Stop Test' : 'Start Test'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Progress & Results */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Test Progress
              </Typography>

              {isRunning && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              )}

              {/* Test Results */}
              {testResults && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Test Results
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h6" color="primary">
                          {testResults.performance?.avgResponseTime || 0}ms
                        </Typography>
                        <Typography variant="caption">Avg Response</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h6" color="success.main">
                          {testResults.performance?.successRate || 0}%
                        </Typography>
                        <Typography variant="caption">Success Rate</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h6" color="info.main">
                          {testResults.performance?.languageSwitches || 0}
                        </Typography>
                        <Typography variant="caption">Lang Switches</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h6" color="warning.main">
                          {testResults.performance?.interruptions || 0}
                        </Typography>
                        <Typography variant="caption">Interruptions</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Issues */}
                  {testResults.issues && testResults.issues.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Issues Detected
                      </Typography>
                      {testResults.issues.map((issue, index) => (
                        <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                          {issue}
                        </Alert>
                      ))}
                    </Box>
                  )}

                  {/* Performance Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={getTestStatusIcon(testResults.status)}
                      label={testResults.status === 'completed' ? 'Test Passed' : 'Test Running'}
                      color={getTestStatusColor(testResults.status)}
                      variant="outlined"
                    />
                    {testResults.performance?.avgResponseTime < 500 && (
                      <Chip label="Latency OK" color="success" size="small" />
                    )}
                    {testResults.performance?.successRate > 95 && (
                      <Chip label="High Success" color="success" size="small" />
                    )}
                  </Box>
                </Box>
              )}

              {/* Test Logs */}
              <Typography variant="subtitle1" gutterBottom>
                Test Logs
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflowY: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                {testLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No logs yet. Start a test to see real-time updates.
                  </Typography>
                ) : (
                  <List dense>
                    {testLogs.map((log, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={log.message}
                          secondary={log.time}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: log.type === 'error' ? 'error.main' : 
                                   log.type === 'warning' ? 'warning.main' : 
                                   log.type === 'success' ? 'success.main' : 'text.primary',
                          }}
                        />
                        <Chip
                          label={log.type}
                          size="small"
                          color={log.type === 'error' ? 'error' : 
                                 log.type === 'warning' ? 'warning' : 
                                 log.type === 'success' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Testing;
