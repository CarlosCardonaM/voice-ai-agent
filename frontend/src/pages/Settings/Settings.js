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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Refresh,
  Security,
  Settings as SettingsIcon,
  Api,
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your Voice AI Agent configuration, API keys, and system preferences
      </Typography>

      <Grid container spacing={3}>
        {/* API Keys */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                  <Api />
                </Avatar>
                <Typography variant="h6">API Configuration</Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <strong>Important:</strong> Make sure your accounts have sufficient funds for testing. 
                API calls require credits in your Twilio, OpenAI, Deepgram, and ElevenLabs accounts.
              </Alert>

              <TextField
                fullWidth
label={t('settings.twilioAccountSid')}
                value={showApiKeys ? settings.twilioSid : maskApiKey(settings.twilioSid)}
                onChange={(e) => handleSettingChange('twilioSid', e.target.value)}
                margin="normal"
                variant="outlined"
helperText={t('settings.twilioAccountSidHelper')}
              />

              <TextField
                fullWidth
label={t('settings.twilioAuthToken')}
                value={showApiKeys ? settings.twilioAuthToken : maskApiKey(settings.twilioAuthToken)}
                onChange={(e) => handleSettingChange('twilioAuthToken', e.target.value)}
                margin="normal"
                variant="outlined"
                type="password"
helperText={t('settings.twilioAuthTokenHelper')}
              />

              <TextField
                fullWidth
label={t('settings.elevenLabsApiKey')}
                value={showApiKeys ? settings.elevenLabsKey : maskApiKey(settings.elevenLabsKey)}
                onChange={(e) => handleSettingChange('elevenLabsKey', e.target.value)}
                margin="normal"
                variant="outlined"
                type="password"
                helperText="Your ElevenLabs API key for text-to-speech"
              />

              <TextField
                fullWidth
label={t('settings.deepgramApiKey')}
                value={showApiKeys ? settings.deepgramKey : maskApiKey(settings.deepgramKey)}
                onChange={(e) => handleSettingChange('deepgramKey', e.target.value)}
                margin="normal"
                variant="outlined"
                type="password"
                helperText="Your Deepgram API key for speech-to-text"
              />

              <TextField
                fullWidth
label={t('settings.openaiApiKey')}
                value={showApiKeys ? settings.openaiKey : maskApiKey(settings.openaiKey)}
                onChange={(e) => handleSettingChange('openaiKey', e.target.value)}
                margin="normal"
                variant="outlined"
                type="password"
                helperText="Your OpenAI API key for GPT-4o-mini"
              />

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={toggleApiKeyVisibility}
                  startIcon={showApiKeys ? <VisibilityOff /> : <Visibility />}
                >
{showApiKeys ? t('settings.hideApiKeys') : t('settings.showApiKeys')} API Keys
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleTestConnections}
                  disabled={isTesting}
                  startIcon={isTesting ? <CircularProgress size={20} /> : <Refresh />}
                >
{isTesting ? t('settings.testing') : t('settings.testConnections')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Typography variant="h6">System Preferences</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableLogging}
                    onChange={(e) => handleSettingChange('enableLogging', e.target.checked)}
                  />
                }
                label="Enable Detailed Logging"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAnalytics}
                    onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                  />
                }
                label="Enable Performance Analytics"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  />
                }
                label="Enable System Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                }
label={t('settings.enableAutoBackup')}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>{t('settings.backupFrequency')}</InputLabel>
                <Select
                  value={settings.backupFrequency}
label={t('settings.backupFrequency')}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">{t('settings.daily')}</MenuItem>
                  <MenuItem value="weekly">{t('settings.weekly')}</MenuItem>
                  <MenuItem value="monthly">{t('settings.monthly')}</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main', mr: 2 }}>
                  <Security />
                </Avatar>
                <Typography variant="h6">Security & Privacy</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireAuth}
                    onChange={(e) => handleSettingChange('requireAuth', e.target.checked)}
                  />
                }
                label="Require Authentication"
              />

              <TextField
                fullWidth
                label="Session Timeout (seconds)"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                margin="normal"
                variant="outlined"
                type="number"
                helperText="How long before automatic logout"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAuditLog}
                    onChange={(e) => handleSettingChange('enableAuditLog', e.target.checked)}
                  />
                }
                label="Enable Audit Logging"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', mr: 2 }}>
                  <Refresh />
                </Avatar>
                <Typography variant="h6">Connection Test Results</Typography>
              </Box>

              {testResults && (
                <Box>
                  {testResults.error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {testResults.error}
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {Object.entries(testResults).map(([service, result]) => (
                        <Grid item xs={12} sm={6} md={3} key={service}>
                          <Chip
                            label={`${service}: ${result.status}`}
                            color={getTestResultColor(result.status)}
                            variant="outlined"
                            icon={result.status === 'success' ? <Refresh /> : <Refresh />}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {!testResults && (
                <Typography variant="body2" color="text.secondary">
                  Click "Test Connections" to verify your API keys are working correctly.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          startIcon={<Save />}
        >
{t('settings.saveSettings')}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
