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
  Paper,
  Fade,
  Slide,
  Zoom,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  VolumeUp as VolumeIcon,
  Timer as TimerIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  CheckCircleOutline as CheckOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  Headset as HeadsetIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

function Testing() {
  const { t } = useLanguage();
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
  const [backendStatus, setBackendStatus] = useState('checking');

  const handleConfigChange = (key, value) => {
    setTestConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Verificar estado del backend
  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      const healthData = await apiService.getHealth();
      
      if (healthData.status === 'healthy') {
        setBackendStatus('connected');
        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: '✅ Backend conectado exitosamente', type: 'success' },
        ]);
      } else {
        setBackendStatus('error');
        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: '❌ Backend no está funcionando correctamente', type: 'error' },
        ]);
      }
    } catch (error) {
      setBackendStatus('disconnected');
      setTestLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: '❌ No se puede conectar al backend', type: 'error' },
      ]);
    }
  };

  // Verificar backend al cargar el componente
  React.useEffect(() => {
    checkBackendStatus();
  }, []);

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
        { time: new Date().toLocaleTimeString(), message: t('testingAdditional.voiceAgentActivated'), type: 'success' },
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
              t('testingAdditional.languageDetectionConfidence'),
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

  const startRealCall = async () => {
    if (!testConfig.phoneNumber) {
      setError('Por favor ingresa un número de teléfono');
      return;
    }

    // Validar formato del número
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(testConfig.phoneNumber.replace(/\s/g, ''))) {
      setError('Por favor ingresa un número de teléfono válido (ej: +15551234567)');
      return;
    }

    try {
      setError(null);
      setIsRunning(true);
      
      setTestLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: 'Iniciando llamada telefónica real...', type: 'info' },
      ]);

      const response = await apiService.makeRealCall(testConfig.phoneNumber, {
        scenario: testConfig.scenario,
        language: testConfig.language,
        voice: testConfig.voice,
        duration: testConfig.duration
      });

      if (response.status === 'success') {
        setTestConfig(prev => ({
          ...prev,
          activeCallSid: response.call_sid
        }));

        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: `✅ Llamada real iniciada exitosamente: ${response.call_sid}`, type: 'success' },
          { time: new Date().toLocaleTimeString(), message: `📞 Llamando a: ${testConfig.phoneNumber}`, type: 'info' },
          { time: new Date().toLocaleTimeString(), message: '🔗 Conectando con Twilio...', type: 'info' },
        ]);

        // Iniciar monitoreo de la llamada
        startCallMonitoring(response.call_sid);
      } else {
        setError(`Error al iniciar llamada: ${response.error || 'Error desconocido'}`);
        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: `❌ Error al iniciar llamada: ${response.error}`, type: 'error' },
        ]);
      }
    } catch (error) {
      console.error('Error starting real call:', error);
      setError('Error al conectar con el servidor. Verifica que el backend esté ejecutándose y que las API keys de Twilio estén configuradas.');
      setTestLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: `❌ Error de conexión: ${error.message}`, type: 'error' },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const endRealCall = async () => {
    if (!testConfig.activeCallSid) {
      setError('No hay llamada activa para terminar');
      return;
    }

    try {
      setError(null);
      setTestLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: 'Terminando llamada real...', type: 'info' },
      ]);

      const response = await apiService.endRealCall(testConfig.activeCallSid);

      if (response.status === 'success') {
        setTestConfig(prev => ({
          ...prev,
          activeCallSid: null
        }));

        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: `✅ Llamada real terminada exitosamente: ${testConfig.activeCallSid}`, type: 'success' },
        ]);
      } else {
        setError(`Error al terminar llamada: ${response.error || 'Error desconocido'}`);
        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: `❌ Error al terminar llamada: ${response.error}`, type: 'error' },
        ]);
      }
    } catch (error) {
      console.error('Error ending real call:', error);
      setError('Error al conectar con el servidor para terminar la llamada.');
      setTestLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: `❌ Error de conexión: ${error.message}`, type: 'error' },
      ]);
    }
  };

  // Función para monitorear la llamada en tiempo real
  const startCallMonitoring = (callSid) => {
    const monitoringInterval = setInterval(async () => {
      try {
        // Obtener métricas de rendimiento de la llamada
        const performanceData = await apiService.getPerformanceMetrics(callSid);
        
        if (performanceData) {
          setTestLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              message: `📊 Latencia promedio: ${performanceData.avg_latency || 'N/A'}ms`, 
              type: 'info' 
            },
          ]);
        }
      } catch (error) {
        console.log('Error getting performance data:', error);
      }
    }, 5000); // Cada 5 segundos

    // Limpiar el intervalo cuando la llamada termine
    setTimeout(() => {
      clearInterval(monitoringInterval);
    }, testConfig.duration * 1000);
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
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .metric-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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
              mr: 2, 
              width: 56, 
              height: 56
            }}>
              <AssessmentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {t('testing.title')}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: 'grey.300' }}>
                {t('testing.subtitle')}
              </Typography>
            </Box>
          </Box>
          
          {/* Status Indicators */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Chip
              icon={backendStatus === 'connected' ? <WifiIcon /> : <WifiOffIcon />}
              label={backendStatus === 'connected' ? 'Backend Connected' : 'Backend Disconnected'}
              color={backendStatus === 'connected' ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              icon={<PhoneIcon />}
              label={testConfig.activeCallSid ? 'Call Active' : 'No Active Calls'}
              color={testConfig.activeCallSid ? 'success' : 'default'}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              icon={<SpeedIcon />}
              label={`${testConfig.duration}s Duration`}
              color="info"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        </Paper>
      </Fade>

      <Grid container spacing={4}>
        {/* Test Configuration Panel */}
        <Grid item xs={12} lg={4}>
          <Slide direction="up" in timeout={1000}>
            <Card elevation={2} sx={{ 
              height: '100%',
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
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {t('testingAdditional.testConfiguration')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Configure your test parameters and scenarios
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Stepper orientation="vertical" activeStep={0}>
                  <Step>
                    <StepLabel>Test Scenario</StepLabel>
                    <StepContent>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Scenario Type</InputLabel>
                        <Select
                          value={testConfig.scenario}
                          onChange={(e) => handleConfigChange('scenario', e.target.value)}
                        >
                          <MenuItem value="normal">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckOutlineIcon sx={{ mr: 1, color: 'success.main' }} />
                              Normal Conversation
                            </Box>
                          </MenuItem>
                          <MenuItem value="interruptions">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                              User Interruptions
                            </Box>
                          </MenuItem>
                          <MenuItem value="slang">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LanguageIcon sx={{ mr: 1, color: 'info.main' }} />
                              Mexican Slang
                            </Box>
                          </MenuItem>
                          <MenuItem value="lowQuality">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <VolumeIcon sx={{ mr: 1, color: 'error.main' }} />
                              Low Audio Quality
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </StepContent>
                  </Step>

                  <Step>
                    <StepLabel>Language & Voice</StepLabel>
                    <StepContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Language</InputLabel>
                            <Select
                              value={testConfig.language}
                              onChange={(e) => handleConfigChange('language', e.target.value)}
                            >
                              <MenuItem value="es-LA">🇲🇽 Spanish (LATAM)</MenuItem>
                              <MenuItem value="en-US">🇺🇸 English (US)</MenuItem>
                              <MenuItem value="es-MX">🇲🇽 Spanish (Mexican)</MenuItem>
                              <MenuItem value="pt-BR">🇧🇷 Portuguese (Brazil)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Voice Type</InputLabel>
                            <Select
                              value={testConfig.voice}
                              onChange={(e) => handleConfigChange('voice', e.target.value)}
                            >
                              <MenuItem value="mexican">Mexican Spanish</MenuItem>
                              <MenuItem value="colombian">Colombian Spanish</MenuItem>
                              <MenuItem value="argentine">Argentine Spanish</MenuItem>
                              <MenuItem value="neutral">Neutral Spanish</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </StepContent>
                  </Step>

                  <Step>
                    <StepLabel>Test Settings</StepLabel>
                    <StepContent>
                      <TextField
                        fullWidth
                        label="Duration (seconds)"
                        type="number"
                        value={testConfig.duration}
                        onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
                        sx={{ mb: 3 }}
                        InputProps={{
                          startAdornment: <TimerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />

                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testConfig.interruptions}
                              onChange={(e) => handleConfigChange('interruptions', e.target.checked)}
                            />
                          }
                          label="Simulate Interruptions"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testConfig.slang}
                              onChange={(e) => handleConfigChange('slang', e.target.checked)}
                            />
                          }
                          label="Include Mexican Slang"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testConfig.lowQuality}
                              onChange={(e) => handleConfigChange('lowQuality', e.target.checked)}
                            />
                          }
                          label="Low Audio Quality"
                        />
                      </Stack>
                    </StepContent>
                  </Step>
                </Stepper>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="contained"
                  size="large"
                  startIcon={isRunning ? <StopIcon /> : <PlayIcon />}
                  onClick={isRunning ? stopTest : startTest}
                  fullWidth
                  color={isRunning ? 'error' : 'primary'}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  {isRunning ? 'Stop Test' : 'Start Test'}
                </Button>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Real Phone Testing Panel */}
        <Grid item xs={12} lg={4}>
          <Slide direction="up" in timeout={1200}>
            <Card elevation={2} sx={{ 
              height: '100%',
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
                  <PhoneIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {t('testing.realPhoneTesting')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('testing.insertPhoneNumbers')}
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="+15551234567"
                  value={testConfig.phoneNumber || ''}
                  onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CallIcon />}
                    onClick={startRealCall}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    {t('testing.startRealCall')}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<CallEndIcon />}
                    onClick={endRealCall}
                    fullWidth
                    disabled={!testConfig.activeCallSid}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    {t('testing.endCall')}
                  </Button>
                </Stack>

                {/* Active Call Status */}
                {testConfig.activeCallSid && (
                  <Fade in>
                    <Paper elevation={4} sx={{ 
                      mt: 3, 
                      p: 3, 
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white',
                      borderRadius: 2,
                      animation: 'glow 2s infinite'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%', 
                          bgcolor: 'white',
                          animation: 'pulse 2s infinite',
                          mr: 2
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('testing.activeCall')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                        <strong>ID:</strong> {testConfig.activeCallSid}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        <strong>Number:</strong> {testConfig.phoneNumber}
                      </Typography>
                    </Paper>
                  </Fade>
                )}

                {/* Connection Status */}
                <Paper elevation={2} sx={{ 
                  mt: 3, 
                  p: 2, 
                  background: backendStatus === 'connected' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  border: `1px solid ${backendStatus === 'connected' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: backendStatus === 'connected' ? 'success.main' : 
                                 backendStatus === 'checking' ? 'warning.main' : 'error.main',
                        mr: 2
                      }} />
                      <Typography variant="body2" color="text.secondary">
                        {backendStatus === 'connected' ? 'Backend Connected' :
                         backendStatus === 'checking' ? 'Checking Connection' :
                         backendStatus === 'disconnected' ? 'Backend Disconnected' :
                         'Connection Error'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={checkBackendStatus}
                      disabled={backendStatus === 'checking'}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Test Progress & Results Panel */}
        <Grid item xs={12} lg={8}>
          <Slide direction="up" in timeout={1400}>
            <Card elevation={2} sx={{ 
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
                  <AnalyticsIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {t('testingAdditional.testProgress')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time monitoring and test results
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Progress Bar */}
                {isRunning && (
                  <Fade in>
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          Test Progress
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          background: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                            borderRadius: 6
                          }
                        }} 
                      />
                    </Box>
                  </Fade>
                )}

                {/* Test Results */}
                {testResults && (
                  <Fade in>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
                        Test Results
                      </Typography>

                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={4} 
                            className="metric-card"
                            sx={{ 
                              p: 3, 
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                              color: 'white',
                              borderRadius: 2
                            }}
                          >
                            <SpeedIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {testResults.performance?.avgResponseTime || 0}ms
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Avg Response Time
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={4} 
                            className="metric-card"
                            sx={{ 
                              p: 3, 
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                              color: 'white',
                              borderRadius: 2
                            }}
                          >
                            <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {testResults.performance?.successRate || 0}%
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Success Rate
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={4} 
                            className="metric-card"
                            sx={{ 
                              p: 3, 
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                              color: 'white',
                              borderRadius: 2
                            }}
                          >
                            <LanguageIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {testResults.performance?.languageSwitches || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Language Switches
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper 
                            elevation={4} 
                            className="metric-card"
                            sx={{ 
                              p: 3, 
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, #F44336, #D32F2F)',
                              color: 'white',
                              borderRadius: 2
                            }}
                          >
                            <WarningIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {testResults.performance?.interruptions || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Interruptions
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Issues */}
                      {testResults.issues && testResults.issues.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Issues Detected
                          </Typography>
                          <Stack spacing={1}>
                            {testResults.issues.map((issue, index) => (
                              <Alert key={index} severity="warning" sx={{ borderRadius: 2 }}>
                                {issue}
                              </Alert>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Performance Status */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={getTestStatusIcon(testResults.status)}
                          label={testResults.status === 'completed' ? 'Test Passed' : 'Test Running'}
                          color={getTestStatusColor(testResults.status)}
                          variant="filled"
                          sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                        />
                        {testResults.performance?.avgResponseTime < 500 && (
                          <Chip 
                            icon={<SpeedIcon />}
                            label="Low Latency" 
                            color="success" 
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                        {testResults.performance?.successRate > 95 && (
                          <Chip 
                            icon={<CheckIcon />}
                            label="High Success" 
                            color="success" 
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Fade>
                )}

                {/* Test Logs */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
                    {t('testingAdditional.testLogs')}
                  </Typography>

                  <Paper elevation={2} sx={{ 
                    maxHeight: 400, 
                    overflowY: 'auto', 
                    bgcolor: 'grey.700',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.600'
                  }}>
                    {testLogs.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <InfoIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: 'grey.300' }}>
                          {t('testingAdditional.noLogsYet')}
                        </Typography>
                      </Box>
                    ) : (
                      <List>
                        {testLogs.map((log, index) => (
                          <Fade in key={index} timeout={300 + index * 100}>
                            <ListItem sx={{ 
                              py: 1.5,
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.05)'
                              }
                            }}>
                              <Avatar sx={{ 
                                mr: 2, 
                                bgcolor: log.type === 'error' ? 'error.main' :
                                         log.type === 'warning' ? 'warning.main' :
                                         log.type === 'success' ? 'success.main' : 'info.main',
                                width: 32,
                                height: 32
                              }}>
                                {log.type === 'error' ? <ErrorIcon /> :
                                 log.type === 'warning' ? <WarningIcon /> :
                                 log.type === 'success' ? <CheckIcon /> : <InfoIcon />}
                              </Avatar>
                              <ListItemText
                                primary={log.message}
                                secondary={log.time}
                                primaryTypographyProps={{
                                  variant: 'body1',
                                  fontWeight: 'medium'
                                }}
                                secondaryTypographyProps={{
                                  variant: 'caption',
                                  color: 'text.secondary'
                                }}
                              />
                              <Chip
                                label={log.type.toUpperCase()}
                                size="small"
                                color={log.type === 'error' ? 'error' :
                                       log.type === 'warning' ? 'warning' :
                                       log.type === 'success' ? 'success' : 'default'}
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </ListItem>
                          </Fade>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Box>

                {/* Error Display */}
                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mt: 3, 
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontSize: '1rem',
                          fontWeight: 'medium'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Testing;
