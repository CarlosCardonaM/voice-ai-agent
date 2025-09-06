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
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Avatar,
  Alert,
  Slider,
  InputAdornment,
} from '@mui/material';
import {
  Mic as MicIcon,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  VolumeUp as VolumeUpIcon,
  Speed as SpeedIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

function Builder() {
  const { t } = useLanguage();
  const [config, setConfig] = useState({
    // Basic Settings
    agentName: 'LATAM Customer Service Agent',
    description: 'Professional customer service agent for Latin American markets',
    
    // Language Settings
    primaryLanguage: 'es-LA',
    secondaryLanguage: 'en-US',
    autoLanguageDetection: true,
    languageSwitchThreshold: 0.8,
    
    // Voice Settings
    ttsVoice: '21m00Tcm4TlvDq8ikWAM',
    ttsModel: 'eleven_multilingual_v2',
    speechRate: 1.0,
    voiceClarity: 0.8,
    
    // STT Settings
    sttLanguage: 'es-LA',
    sttModel: 'nova-2',
    enablePunctuation: true,
    enableProfanityFilter: false,
    
    // LLM Settings
    llmModel: 'gpt-4o-mini',
    systemPrompt: 'Eres un agente de servicio al cliente útil, responde en español mexicano, maneja casos como reservas o soporte. Sé amigable, profesional y eficiente.',
    maxTokens: 150,
    temperature: 0.7,
    
    // Performance Settings
    targetLatency: 500,
    enableInterruptionHandling: true,
    enableVoicemailDetection: true,
    voicemailThreshold: 3.0,
    
    // Advanced Settings
    enableSlangDetection: true,
    enableAudioQualityAnalysis: true,
    enablePerformanceMonitoring: true,
    enableCallRecording: false,
  });

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving configuration:', config);
    // TODO: Implement save functionality
  };

  const handleTest = () => {
    console.log('Testing configuration:', config);
    // TODO: Implement test functionality
  };

  const voiceOptions = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Mexican Spanish (Female)', language: 'es-MX' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'American English (Male)', language: 'en-US' },
    { id: 'ThT5KcBeYPX3keUQqHPh', name: 'British English (Female)', language: 'en-GB' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Spanish (Female)', language: 'es-ES' },
  ];

  const sttModels = [
    { id: 'nova-2', name: 'Nova 2 (Latest)', accuracy: '99.2%' },
    { id: 'nova', name: 'Nova (Previous)', accuracy: '98.8%' },
    { id: 'enhanced', name: 'Enhanced', accuracy: '97.5%' },
    { id: 'base', name: 'Base', accuracy: '96.2%' },
  ];

  const llmModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', cost: 'Low', speed: 'Fast' },
    { id: 'gpt-4o', name: 'GPT-4o', cost: 'Medium', speed: 'Medium' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', cost: 'High', speed: 'Slow' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', cost: 'Low', speed: 'Fast' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
{t('builder.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
{t('builder.subtitle')}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
        >
{t('builder.saveConfiguration')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<PlayIcon />}
          onClick={handleTest}
          size="large"
        >
{t('builder.testConfiguration')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Typography variant="h6">{t('builder.basicSettings')}</Typography>
              </Box>
              
              <TextField
                fullWidth
label={t('builder.agentName')}
                value={config.agentName}
                onChange={(e) => handleConfigChange('agentName', e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
label={t('builder.description')}
                value={config.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('builder.primaryLanguage')}</InputLabel>
                <Select
                  value={config.primaryLanguage}
                  onChange={(e) => handleConfigChange('primaryLanguage', e.target.value)}
label={t('builder.primaryLanguage')}
                >
                  <MenuItem value="es-LA">Spanish (LATAM)</MenuItem>
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>{t('builder.secondaryLanguage')}</InputLabel>
                <Select
                  value={config.secondaryLanguage}
                  onChange={(e) => handleConfigChange('secondaryLanguage', e.target.value)}
label={t('builder.secondaryLanguage')}
                >
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="es-LA">Spanish (LATAM)</MenuItem>
                  <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', mr: 2 }}>
                  <LanguageIcon />
                </Avatar>
                <Typography variant="h6">{t('builder.languageSettings')}</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.autoLanguageDetection}
                    onChange={(e) => handleConfigChange('autoLanguageDetection', e.target.checked)}
                  />
                }
label={t('builder.autoLanguageDetection')}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
{t('builder.languageSwitchThreshold')}: {config.languageSwitchThreshold}
              </Typography>
              <Slider
                value={config.languageSwitchThreshold}
                onChange={(e, value) => handleConfigChange('languageSwitchThreshold', value)}
                min={0.5}
                max={1.0}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Higher threshold requires more confidence to switch languages
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Spanish (es-LA)" color="primary" />
                <Chip label="English (en-US)" color="secondary" />
                <Chip label="Auto-switch" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Voice Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', mr: 2 }}>
                  <VolumeUpIcon />
                </Avatar>
                <Typography variant="h6">{t('builder.voiceSettings')}</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('builder.ttsVoice')}</InputLabel>
                <Select
                  value={config.ttsVoice}
                  onChange={(e) => handleConfigChange('ttsVoice', e.target.value)}
label={t('builder.ttsVoice')}
                >
                  {voiceOptions.map((voice) => (
                    <MenuItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Speech Rate: {config.speechRate}x
              </Typography>
              <Slider
                value={config.speechRate}
                onChange={(e, value) => handleConfigChange('speechRate', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Voice Clarity: {config.voiceClarity}
              </Typography>
              <Slider
                value={config.voiceClarity}
                onChange={(e, value) => handleConfigChange('voiceClarity', value)}
                min={0.1}
                max={1.0}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* STT Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', mr: 2 }}>
                  <MicIcon />
                </Avatar>
                <Typography variant="h6">Speech-to-Text Settings</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>STT Model</InputLabel>
                <Select
                  value={config.sttModel}
                  onChange={(e) => handleConfigChange('sttModel', e.target.value)}
                  label="STT Model"
                >
                  {sttModels.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name} - {model.accuracy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enablePunctuation}
                    onChange={(e) => handleConfigChange('enablePunctuation', e.target.checked)}
                  />
                }
                label="Enable Punctuation"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enableProfanityFilter}
                    onChange={(e) => handleConfigChange('enableProfanityFilter', e.target.checked)}
                  />
                }
                label="Profanity Filter"
                sx={{ mb: 2 }}
              />
              
              <Alert severity="warning">
                Higher accuracy models may increase latency
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* LLM Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2 }}>
                  <PsychologyIcon />
                </Avatar>
                <Typography variant="h6">AI Language Model Settings</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>LLM Model</InputLabel>
                    <Select
                      value={config.llmModel}
                      onChange={(e) => handleConfigChange('llmModel', e.target.value)}
                      label="LLM Model"
                    >
                      {llmModels.map((model) => (
                        <MenuItem key={model.id} value={model.id}>
                          {model.name} - {model.cost} cost, {model.speed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Max Tokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">tokens</InputAdornment>,
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Temperature: {config.temperature}
                  </Typography>
                  <Slider
                    value={config.temperature}
                    onChange={(e, value) => handleConfigChange('temperature', value)}
                    min={0.0}
                    max={1.0}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="System Prompt"
                    value={config.systemPrompt}
                    onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                    multiline
                    rows={8}
                    helperText="Define the AI agent's personality and behavior"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', mr: 2 }}>
                  <SpeedIcon />
                </Avatar>
                <Typography variant="h6">Performance Settings</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Target Latency: {config.targetLatency}ms
                  </Typography>
                  <Slider
                    value={config.targetLatency}
                    onChange={(e, value) => handleConfigChange('targetLatency', value)}
                    min={200}
                    max={1000}
                    step={50}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableInterruptionHandling}
                        onChange={(e) => handleConfigChange('enableInterruptionHandling', e.target.checked)}
                      />
                    }
                    label="Enable Interruption Handling"
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableVoicemailDetection}
                        onChange={(e) => handleConfigChange('enableVoicemailDetection', e.target.checked)}
                      />
                    }
                    label="Voicemail Detection"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Voicemail Threshold: {config.voicemailThreshold}s
                  </Typography>
                  <Slider
                    value={config.voicemailThreshold}
                    onChange={(e, value) => handleConfigChange('voicemailThreshold', value)}
                    min={1.0}
                    max={10.0}
                    step={0.5}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableSlangDetection}
                        onChange={(e) => handleConfigChange('enableSlangDetection', e.target.checked)}
                      />
                    }
                    label="Mexican Slang Detection"
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableAudioQualityAnalysis}
                        onChange={(e) => handleConfigChange('enableAudioQualityAnalysis', e.target.checked)}
                      />
                    }
                    label="Audio Quality Analysis"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Builder;
