import React, { useState, useEffect } from 'react';
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
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/api';

function Builder() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [testStatus, setTestStatus] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callSid, setCallSid] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
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
    speechRate: 1.2, // Aumentado para hablar más rápido
    voiceClarity: 0.9, // Aumentado para mejor claridad
    
    // STT Settings
    sttLanguage: 'es-LA',
    sttModel: 'nova-2',
    enablePunctuation: true,
    enableProfanityFilter: false,
    
    // LLM Settings
    llmModel: 'gpt-4o-mini',
    systemPrompt: 'Eres un agente de servicio al cliente útil, responde en español mexicano, maneja casos como reservas o soporte. Sé amigable, profesional y eficiente. Responde de forma concisa y directa para mantener conversaciones fluidas.',
    maxTokens: 100, // Reducido para respuestas más rápidas
    temperature: 0.6, // Reducido para respuestas más consistentes y rápidas
    
    // Performance Settings
    targetLatency: 200, // Reducido para respuesta más rápida
    enableInterruptionHandling: true,
    enableVoicemailDetection: true,
    voicemailThreshold: 2.0, // Reducido para detección más rápida
    
    // Advanced Settings
    enableSlangDetection: true,
    enableAudioQualityAnalysis: true,
    enablePerformanceMonitoring: true,
    enableCallRecording: false,
  });

  // Cargar configuración guardada al montar el componente
  useEffect(() => {
    const savedConfig = localStorage.getItem('agentConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      }
    }
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      // Guardar en localStorage
      localStorage.setItem('agentConfig', JSON.stringify(config));
      
      // Enviar configuración al backend
      await apiService.updateAgentConfig({
        agentName: config.agentName,
        systemPrompt: config.systemPrompt,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
        description: config.description,
        primaryLanguage: config.primaryLanguage,
        secondaryLanguage: config.secondaryLanguage,
        ttsVoice: config.ttsVoice,
        ttsModel: config.ttsModel,
        speechRate: config.speechRate,
        voiceClarity: config.voiceClarity,
        sttLanguage: config.sttLanguage,
        sttModel: config.sttModel,
        llmModel: config.llmModel,
        targetLatency: config.targetLatency,
        enableInterruptionHandling: config.enableInterruptionHandling,
        enableVoicemailDetection: config.enableVoicemailDetection,
        enableSlangDetection: config.enableSlangDetection,
        enableAudioQualityAnalysis: config.enableAudioQualityAnalysis,
        enablePerformanceMonitoring: config.enablePerformanceMonitoring,
        enableCallRecording: config.enableCallRecording
      });
      
      setSaveStatus({
        type: 'success',
        message: 'Configuración guardada y aplicada al agente exitosamente'
      });
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setSaveStatus(null), 3000);
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus({
        type: 'error',
        message: 'Error al guardar la configuración: ' + (error.message || 'Error desconocido')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setTestStatus(null);
    
    try {
      // Simular prueba de configuración
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validar configuración
      const validationResults = validateConfiguration(config);
      
      if (validationResults.isValid) {
        setTestStatus({
          type: 'success',
          message: 'Configuración validada exitosamente. El agente está listo para usar.'
        });
      } else {
        setTestStatus({
          type: 'warning',
          message: `Configuración válida con advertencias: ${validationResults.warnings.join(', ')}`
        });
      }
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setTestStatus(null), 5000);
      
    } catch (error) {
      setTestStatus({
        type: 'error',
        message: 'Error al probar la configuración'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `agent-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          setConfig(importedConfig);
          setSaveStatus({
            type: 'success',
            message: 'Configuración importada exitosamente'
          });
          setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
          setSaveStatus({
            type: 'error',
            message: 'Error al importar la configuración. Verifica que el archivo sea válido.'
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRealCall = async () => {
    if (!phoneNumber.trim()) {
      setCallStatus({
        type: 'error',
        message: 'Por favor ingresa un número telefónico'
      });
      return;
    }

    setLoading(true);
    setCallStatus(null);
    
    try {
      // Primero guardar TODA la configuración
      await apiService.updateAgentConfig({
        agentName: config.agentName,
        systemPrompt: config.systemPrompt,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
        description: config.description,
        primaryLanguage: config.primaryLanguage,
        secondaryLanguage: config.secondaryLanguage,
        autoLanguageDetection: config.autoLanguageDetection,
        languageSwitchThreshold: config.languageSwitchThreshold,
        ttsVoice: config.ttsVoice,
        ttsModel: config.ttsModel,
        speechRate: config.speechRate,
        voiceClarity: config.voiceClarity,
        sttLanguage: config.sttLanguage,
        sttModel: config.sttModel,
        enablePunctuation: config.enablePunctuation,
        enableProfanityFilter: config.enableProfanityFilter,
        llmModel: config.llmModel,
        targetLatency: config.targetLatency,
        voicemailThreshold: config.voicemailThreshold,
        enableInterruptionHandling: config.enableInterruptionHandling,
        enableVoicemailDetection: config.enableVoicemailDetection,
        enableSlangDetection: config.enableSlangDetection,
        enableAudioQualityAnalysis: config.enableAudioQualityAnalysis,
        enablePerformanceMonitoring: config.enablePerformanceMonitoring,
        enableCallRecording: config.enableCallRecording
      });

      // Luego hacer la llamada con TODA la configuración
      const response = await apiService.makeRealCall(phoneNumber, {
        agent_name: config.agentName,
        system_prompt: config.systemPrompt,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        description: config.description,
        primary_language: config.primaryLanguage,
        secondary_language: config.secondaryLanguage,
        auto_language_detection: config.autoLanguageDetection,
        language_switch_threshold: config.languageSwitchThreshold,
        tts_voice: config.ttsVoice,
        tts_model: config.ttsModel,
        speech_rate: config.speechRate,
        voice_clarity: config.voiceClarity,
        stt_language: config.sttLanguage,
        stt_model: config.sttModel,
        enable_punctuation: config.enablePunctuation,
        enable_profanity_filter: config.enableProfanityFilter,
        llm_model: config.llmModel,
        target_latency: config.targetLatency,
        voicemail_threshold: config.voicemailThreshold,
        enable_interruption_handling: config.enableInterruptionHandling,
        enable_voicemail_detection: config.enableVoicemailDetection,
        enable_slang_detection: config.enableSlangDetection,
        enable_audio_quality_analysis: config.enableAudioQualityAnalysis,
        enable_performance_monitoring: config.enablePerformanceMonitoring,
        enable_call_recording: config.enableCallRecording
      });

      setCallStatus({
        type: 'success',
        message: `Llamada iniciada exitosamente a ${phoneNumber}. Call SID: ${response.call_sid}`
      });

      // Activar estado de llamada
      setIsCallActive(true);
      setCallSid(response.call_sid);
      setCallDuration(0);

      // Limpiar el mensaje después de 10 segundos
      setTimeout(() => setCallStatus(null), 10000);
      
    } catch (error) {
      console.error('Error making real call:', error);
      setCallStatus({
        type: 'error',
        message: 'Error al realizar la llamada: ' + (error.message || 'Error desconocido')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    if (!callSid) return;
    
    setLoading(true);
    try {
      await apiService.endRealCall(callSid);
      setIsCallActive(false);
      setCallSid(null);
      setCallDuration(0);
      setCallStatus({
        type: 'info',
        message: 'Llamada terminada exitosamente'
      });
      setTimeout(() => setCallStatus(null), 5000);
    } catch (error) {
      console.error('Error ending call:', error);
      setCallStatus({
        type: 'error',
        message: 'Error al terminar la llamada: ' + (error.message || 'Error desconocido')
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para validar la configuración
  const validateConfiguration = (config) => {
    const warnings = [];
    
    // Validar nombre del agente
    if (!config.agentName || config.agentName.length < 3) {
      warnings.push('El nombre del agente debe tener al menos 3 caracteres');
    }
    
    // Validar descripción
    if (!config.description || config.description.length < 10) {
      warnings.push('La descripción debe tener al menos 10 caracteres');
    }
    
    // Validar prompt del sistema
    if (!config.systemPrompt || config.systemPrompt.length < 20) {
      warnings.push('El prompt del sistema debe ser más detallado');
    }
    
    // Validar tokens máximos
    if (config.maxTokens < 50 || config.maxTokens > 500) {
      warnings.push('Los tokens máximos deben estar entre 50 y 500');
    }
    
    // Validar temperatura
    if (config.temperature < 0.1 || config.temperature > 1.0) {
      warnings.push('La temperatura debe estar entre 0.1 y 1.0');
    }
    
    // Validar latencia objetivo
    if (config.targetLatency < 100 || config.targetLatency > 2000) {
      warnings.push('La latencia objetivo debe estar entre 100ms y 2000ms');
    }
    
    return {
      isValid: warnings.length === 0,
      warnings: warnings
    };
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'black',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
{t('builder.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.300' }}>
{t('builder.subtitle')}
        </Typography>
      </Box>

      {/* Status Messages */}
      {saveStatus && (
        <Alert 
          severity={saveStatus.type} 
          sx={{ mb: 2 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus.message}
        </Alert>
      )}
      
      {testStatus && (
        <Alert 
          severity={testStatus.type} 
          sx={{ mb: 2 }}
          onClose={() => setTestStatus(null)}
        >
          {testStatus.message}
        </Alert>
      )}

      {callStatus && (
        <Alert 
          severity={callStatus.type} 
          sx={{ mb: 2 }}
          onClose={() => setCallStatus(null)}
        >
          {callStatus.message}
        </Alert>
      )}

      {/* Call Status Display */}
      {isCallActive && (
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          bgcolor: 'success.dark', 
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'success.main',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shimmer 2s infinite',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                  }
                }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  🔴 LLAMADA ACTIVA
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'white', fontFamily: 'monospace' }}>
                {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                <strong>Número:</strong> {phoneNumber}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <strong>SID:</strong> {callSid}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<CallEndIcon />}
                onClick={handleEndCall}
                disabled={loading}
                sx={{ 
                  bgcolor: 'error.main',
                  '&:hover': { bgcolor: 'error.dark' }
                }}
              >
                Terminar Llamada
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Phone Number Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Número Telefónico para Llamada Real"
          placeholder="+524779083304"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          variant="outlined"
          helperText="Ingresa el número telefónico al que quieres hacer la llamada de prueba"
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
          disabled={loading}
        >
          {loading ? 'Guardando...' : t('builder.saveConfiguration')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<PlayIcon />}
          onClick={handleTest}
          size="large"
          disabled={loading}
        >
          {loading ? 'Probando...' : t('builder.testConfiguration')}
        </Button>
        <Button
          variant="outlined"
          onClick={handleExport}
          size="large"
          disabled={loading}
        >
          Exportar
        </Button>
        <Button
          variant="outlined"
          component="label"
          size="large"
          disabled={loading}
        >
          Importar
          <input
            type="file"
            hidden
            accept=".json"
            onChange={handleImport}
          />
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<PhoneIcon />}
          onClick={handleRealCall}
          size="large"
          disabled={loading || isCallActive}
        >
          {isCallActive ? 'Llamada en Progreso' : 'Llamada Real'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
          <Card sx={{ 
            bgcolor: 'grey.800',
            border: '1px solid',
            borderColor: 'grey.700'
          }}>
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
