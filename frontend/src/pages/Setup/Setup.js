import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  Slider,
  Container,
  Fade,
  Slide,
  Zoom,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Language as LanguageIcon,
  Mic as MicIcon,
  Psychology as PsychologyIcon,
  VolumeUp as VolumeUpIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  SmartToy as AIIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Setup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState({
    // Información básica
    companyName: '',
    industry: '',
    useCase: '',
    
    // Configuración de idioma
    primaryLanguage: 'es-LA',
    secondaryLanguage: 'en-US',
    autoLanguageDetection: true,
    languageSwitchThreshold: 0.8,
    
    // Configuración de voz
    ttsVoice: '21m00Tcm4TlvDq8ikWAM',
    speechRate: 1.0,
    voiceClarity: 0.8,
    
    // Configuración de IA
    llmModel: 'gpt-4o-mini',
    systemPrompt: 'Eres un agente de servicio al cliente útil, responde en español mexicano, maneja casos como reservas o soporte. Sé amigable, profesional y eficiente.',
    maxTokens: 150,
    temperature: 0.7,
    
    // Configuración de rendimiento
    targetLatency: 500,
    enableInterruptionHandling: true,
    enableVoicemailDetection: true,
    voicemailThreshold: 3.0,
  });

  const steps = [
    'Información Básica',
    'Configuración de Idioma',
    'Configuración de Voz',
    'Configuración de IA',
    'Rendimiento',
    'Revisión'
  ];

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleFinish = () => {
    // Guardar configuración (aquí podrías enviar a una API)
    console.log('Configuración guardada:', config);
    
    // Navegar al dashboard
    navigate('/dashboard');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              📋 Información Básica
            </Typography>
            
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              value={config.companyName}
              onChange={(e) => handleConfigChange('companyName', e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Ej: Mi Empresa LATAM"
            />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Industria</InputLabel>
              <Select
                value={config.industry}
                onChange={(e) => handleConfigChange('industry', e.target.value)}
                label="Industria"
              >
                <MenuItem value="retail">Retail / Comercio</MenuItem>
                <MenuItem value="healthcare">Salud</MenuItem>
                <MenuItem value="finance">Finanzas</MenuItem>
                <MenuItem value="hospitality">Hotelería</MenuItem>
                <MenuItem value="education">Educación</MenuItem>
                <MenuItem value="technology">Tecnología</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Caso de Uso Principal</InputLabel>
              <Select
                value={config.useCase}
                onChange={(e) => handleConfigChange('useCase', e.target.value)}
                label="Caso de Uso Principal"
              >
                <MenuItem value="customer-service">Servicio al Cliente</MenuItem>
                <MenuItem value="sales">Ventas</MenuItem>
                <MenuItem value="support">Soporte Técnico</MenuItem>
                <MenuItem value="appointments">Agendamiento</MenuItem>
                <MenuItem value="surveys">Encuestas</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              🌍 Configuración de Idioma
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Idioma Principal</InputLabel>
                  <Select
                    value={config.primaryLanguage}
                    onChange={(e) => handleConfigChange('primaryLanguage', e.target.value)}
                    label="Idioma Principal"
                  >
                    <MenuItem value="es-LA">Español (LATAM)</MenuItem>
                    <MenuItem value="es-MX">Español (México)</MenuItem>
                    <MenuItem value="en-US">Inglés (US)</MenuItem>
                    <MenuItem value="pt-BR">Portugués (Brasil)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Idioma Secundario</InputLabel>
                  <Select
                    value={config.secondaryLanguage}
                    onChange={(e) => handleConfigChange('secondaryLanguage', e.target.value)}
                    label="Idioma Secundario"
                  >
                    <MenuItem value="en-US">Inglés (US)</MenuItem>
                    <MenuItem value="es-LA">Español (LATAM)</MenuItem>
                    <MenuItem value="pt-BR">Portugués (Brasil)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.autoLanguageDetection}
                  onChange={(e) => handleConfigChange('autoLanguageDetection', e.target.checked)}
                />
              }
              label="Detección Automática de Idioma"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Umbral de Cambio de Idioma: {config.languageSwitchThreshold}
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
            
            <Alert severity="info">
              Un umbral más alto requiere más confianza para cambiar idiomas automáticamente
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              🎤 Configuración de Voz
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Voz TTS</InputLabel>
              <Select
                value={config.ttsVoice}
                onChange={(e) => handleConfigChange('ttsVoice', e.target.value)}
                label="Voz TTS"
              >
                <MenuItem value="21m00Tcm4TlvDq8ikWAM">Español Mexicano (Femenina)</MenuItem>
                <MenuItem value="pNInz6obpgDQGcFmaJgB">Inglés Americano (Masculina)</MenuItem>
                <MenuItem value="ThT5KcBeYPX3keUQqHPh">Inglés Británico (Femenina)</MenuItem>
                <MenuItem value="VR6AewLTigWG4xSOukaG">Español (Femenina)</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Velocidad del Habla: {config.speechRate}x
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
              Claridad de Voz: {config.voiceClarity}
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
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              🤖 Configuración de IA
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Modelo de IA</InputLabel>
              <Select
                value={config.llmModel}
                onChange={(e) => handleConfigChange('llmModel', e.target.value)}
                label="Modelo de IA"
              >
                <MenuItem value="gpt-4o-mini">GPT-4o Mini (Rápido, Económico)</MenuItem>
                <MenuItem value="gpt-4o">GPT-4o (Balanceado)</MenuItem>
                <MenuItem value="gpt-4-turbo">GPT-4 Turbo (Avanzado)</MenuItem>
                <MenuItem value="claude-3-haiku">Claude 3 Haiku (Alternativo)</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Prompt del Sistema"
              value={config.systemPrompt}
              onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 3 }}
              helperText="Define la personalidad y comportamiento del agente AI"
            />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Máximo de Tokens"
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Temperatura: {config.temperature}
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
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              ⚡ Configuración de Rendimiento
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Latencia Objetivo: {config.targetLatency}ms
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
              label="Manejo de Interrupciones"
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.enableVoicemailDetection}
                  onChange={(e) => handleConfigChange('enableVoicemailDetection', e.target.checked)}
                />
              }
              label="Detección de Buzón de Voz"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Umbral de Buzón de Voz: {config.voicemailThreshold}s
            </Typography>
            <Slider
              value={config.voicemailThreshold}
              onChange={(e, value) => handleConfigChange('voicemailThreshold', value)}
              min={1.0}
              max={10.0}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              ✅ Revisión de Configuración
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      📋 Información Básica
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Empresa: {config.companyName || 'No especificada'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Industria: {config.industry || 'No especificada'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Caso de Uso: {config.useCase || 'No especificado'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      🌍 Idioma
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Principal: {config.primaryLanguage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Secundario: {config.secondaryLanguage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Auto-detección: {config.autoLanguageDetection ? 'Sí' : 'No'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      🎤 Voz
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Velocidad: {config.speechRate}x
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Claridad: {config.voiceClarity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      🤖 IA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Modelo: {config.llmModel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tokens: {config.maxTokens}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temperatura: {config.temperature}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                ✅ Tu configuración está lista. Puedes cambiar estos parámetros más tarde desde el Dashboard.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(0, 188, 212, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 152, 0, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />
      
      <Fade in timeout={1000}>
        <Card sx={{ 
          maxWidth: 900, 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          <CardContent sx={{ p: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #00BCD4, #4CAF50, #FF9800)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                Configuración Inicial
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.8,
                  fontWeight: 300,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Configura tu Voice AI Agent en unos simples pasos
              </Typography>
            </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ mb: 4, minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  borderColor: '#00BCD4',
                  backgroundColor: 'rgba(0, 188, 212, 0.1)',
                  color: '#00BCD4'
                },
                '&:disabled': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Anterior
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleFinish}
                  endIcon={<CheckIcon />}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #4CAF50, #45A049)',
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45A049, #3D8B40)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Completar Configuración
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #00BCD4, #00ACC1)',
                    boxShadow: '0 8px 32px rgba(0, 188, 212, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00ACC1, #0097A7)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0, 188, 212, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      </Fade>
    </Box>
  );
}

export default Setup;
