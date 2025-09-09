import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Refresh,
  Security,
  Settings as SettingsIcon,
  Api,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  VpnKey as VpnKeyIcon,
  Cloud as CloudIcon,
  Shield as ShieldIcon,
  Notifications as NotificationsIcon,
  Backup as BackupIcon,
  Timer as TimerIcon,
  Analytics as AnalyticsIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Science as TestTubeIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  Mic as MicIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const Settings = () => {
  const { t } = useLanguage();
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [settings, setSettings] = useState({
    // API Keys
    twilioSid: 'your_twilio_account_sid_here',
    twilioAuthToken: 'your_twilio_auth_token_here',
    elevenLabsKey: 'your_elevenlabs_api_key_here',
    deepgramKey: 'your_deepgram_api_key_here',
    openaiKey: 'your_openai_api_key_here',
    
    // System Settings
    enableLogging: true,
    enableAnalytics: true,
    enableNotifications: true,
    autoBackup: true,
    backupFrequency: 'daily',
    
    // Security Settings
    requireAuth: true,
    sessionTimeout: 3600,
    enableAuditLog: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving settings:', settings);
      // TODO: Implement save functionality with backend
      // await apiService.updateAgentConfig(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleTestConnections = async () => {
    setIsTesting(true);
    setTestResults(null);
    
    try {
      const apiKeys = {
        openai: settings.openaiKey,
        elevenlabs: settings.elevenLabsKey,
        deepgram: settings.deepgramKey,
        twilio: {
          accountSid: settings.twilioSid,
          authToken: settings.twilioAuthToken,
        },
      };
      
      const results = await apiService.testApiConnections(apiKeys);
      setTestResults(results);
    } catch (error) {
      console.error('Error testing API connections:', error);
      setTestResults({
        error: 'Failed to test API connections. Please check your internet connection and try again.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKeys(!showApiKeys);
  };

  const getTestResultColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'black',
      p: 3
    }}>
      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
            50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
            100% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
          }
          .settings-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .settings-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .api-key-field {
            transition: all 0.3s ease;
          }
          .api-key-field:hover {
            transform: translateX(5px);
          }
        `}
      </style>

      {/* Header Section */}
      <Fade in timeout={800}>
        <Paper elevation={2} sx={{ 
          p: 4, 
          mb: 4, 
          bgcolor: 'grey.900',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.700'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              mr: 3, 
              width: 64, 
              height: 64
            }}>
              <SettingsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 'bold',
                color: 'white'
              }}>
                Settings
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: 'grey.300' }}>
                Manage your Voice AI Agent configuration, API keys, and system preferences
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Grid container spacing={4}>
        {/* API Keys Configuration */}
        <Grid item xs={12} lg={6}>
          <Slide direction="up" in timeout={1000}>
            <Card elevation={2} className="settings-card" sx={{ 
              bgcolor: 'grey.800',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.700'
            }}>
              <Box sx={{ 
                bgcolor: 'primary.main',
                p: 3,
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VpnKeyIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    API Configuration
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Configure your API keys for all services
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    <strong>Important:</strong> Make sure your accounts have sufficient funds for testing. 
                    API calls require credits in your Twilio, OpenAI, Deepgram, and ElevenLabs accounts.
                  </Typography>
                </Alert>

                <Stack spacing={3}>
                  {/* Twilio Account SID */}
                  <TextField
                    fullWidth
                    label="Twilio Account SID"
                    value={showApiKeys ? settings.twilioSid : maskApiKey(settings.twilioSid)}
                    onChange={(e) => handleSettingChange('twilioSid', e.target.value)}
                    variant="outlined"
                    className="api-key-field"
                    helperText="Your Twilio Account SID from the Twilio Console"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CloudIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Twilio Auth Token */}
                  <TextField
                    fullWidth
                    label="Twilio Auth Token"
                    value={showApiKeys ? settings.twilioAuthToken : maskApiKey(settings.twilioAuthToken)}
                    onChange={(e) => handleSettingChange('twilioAuthToken', e.target.value)}
                    variant="outlined"
                    type="password"
                    className="api-key-field"
                    helperText="Your Twilio Auth Token from the Twilio Console"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* ElevenLabs API Key */}
                  <TextField
                    fullWidth
                    label="ElevenLabs API Key"
                    value={showApiKeys ? settings.elevenLabsKey : maskApiKey(settings.elevenLabsKey)}
                    onChange={(e) => handleSettingChange('elevenLabsKey', e.target.value)}
                    variant="outlined"
                    type="password"
                    className="api-key-field"
                    helperText="Your ElevenLabs API key for text-to-speech"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VolumeUpIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Deepgram API Key */}
                  <TextField
                    fullWidth
                    label="Deepgram API Key"
                    value={showApiKeys ? settings.deepgramKey : maskApiKey(settings.deepgramKey)}
                    onChange={(e) => handleSettingChange('deepgramKey', e.target.value)}
                    variant="outlined"
                    type="password"
                    className="api-key-field"
                    helperText="Your Deepgram API key for speech-to-text"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MicIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* OpenAI API Key */}
                  <TextField
                    fullWidth
                    label="OpenAI API Key"
                    value={showApiKeys ? settings.openaiKey : maskApiKey(settings.openaiKey)}
                    onChange={(e) => handleSettingChange('openaiKey', e.target.value)}
                    variant="outlined"
                    type="password"
                    className="api-key-field"
                    helperText="Your OpenAI API key for GPT-4o-mini"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PsychologyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={toggleApiKeyVisibility}
                    startIcon={showApiKeys ? <VisibilityOff /> : <Visibility />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {showApiKeys ? 'Hide' : 'Show'} API Keys
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={handleTestConnections}
                    disabled={isTesting}
                    startIcon={isTesting ? <CircularProgress size={20} /> : <TestTubeIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {isTesting ? 'Testing...' : 'Test Connections'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} lg={6}>
          <Slide direction="up" in timeout={1200}>
            <Card elevation={2} className="settings-card" sx={{ 
              bgcolor: 'grey.800',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.700'
            }}>
              <Box sx={{ 
                bgcolor: 'success.main',
                p: 3,
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    System Preferences
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Configure system behavior and preferences
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLogging}
                        onChange={(e) => handleSettingChange('enableLogging', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Enable Detailed Logging
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableAnalytics}
                        onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Enable Performance Analytics
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableNotifications}
                        onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Enable System Notifications
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Enable Auto Backup
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <TimerIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} lg={6}>
          <Slide direction="up" in timeout={1400}>
            <Card elevation={2} className="settings-card" sx={{ 
              bgcolor: 'grey.800',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.700'
            }}>
              <Box sx={{ 
                bgcolor: 'warning.main',
                p: 3,
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShieldIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Security & Privacy
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Configure security settings and privacy options
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requireAuth}
                        onChange={(e) => handleSettingChange('requireAuth', e.target.checked)}
                        color="error"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {settings.requireAuth ? <LockIcon sx={{ mr: 1, color: 'error.main' }} /> : <LockOpenIcon sx={{ mr: 1, color: 'error.main' }} />}
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Require Authentication
                        </Typography>
                      </Box>
                    }
                  />

                  <TextField
                    fullWidth
                    label="Session Timeout (seconds)"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    variant="outlined"
                    type="number"
                    helperText="How long before automatic logout"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon color="error" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableAuditLog}
                        onChange={(e) => handleSettingChange('enableAuditLog', e.target.checked)}
                        color="error"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1, color: 'error.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Enable Audit Logging
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12}>
          <Slide direction="up" in timeout={1600}>
            <Card elevation={2} sx={{ 
              bgcolor: 'white',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                bgcolor: 'info.main',
                p: 3,
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TestTubeIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Connection Test Results
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Verify your API keys are working correctly
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {testResults ? (
                  <Fade in>
                    <Box>
                      {testResults.error ? (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {testResults.error}
                          </Typography>
                        </Alert>
                      ) : (
                        <Grid container spacing={2}>
                          {Object.entries(testResults).map(([service, result]) => (
                            <Grid item xs={12} sm={6} md={3} key={service}>
                              <Paper 
                                elevation={2} 
                                sx={{ 
                                  p: 2, 
                                  textAlign: 'center',
                                  borderRadius: 2,
                                  background: result.status === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                  border: `1px solid ${result.status === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                  {result.status === 'success' ? 
                                    <CheckCircleIcon color="success" /> : 
                                    <ErrorIcon color="error" />
                                  }
                                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {service}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={result.status}
                                  color={getTestResultColor(result.status)}
                                  variant="outlined"
                                  size="small"
                                />
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </Fade>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Click "Test Connections" to verify your API keys are working correctly.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Fade in timeout={1800}>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            startIcon={<Save />}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default Settings;
