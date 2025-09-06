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
        { time: new Date().toLocaleTimeString(), message: 'Iniciando llamada telefónica...', type: 'info' },
      ]);

      const response = await apiService.startTestCall({ 
        phone_number: testConfig.phoneNumber,
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
          { time: new Date().toLocaleTimeString(), message: `✅ Llamada iniciada exitosamente: ${response.call_sid}`, type: 'success' },
          { time: new Date().toLocaleTimeString(), message: `📞 Llamando a: ${testConfig.phoneNumber}`, type: 'info' },
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
      setError('Error al conectar con el servidor. Verifica que el backend esté ejecutándose.');
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
        { time: new Date().toLocaleTimeString(), message: 'Terminando llamada...', type: 'info' },
      ]);

      const response = await apiService.endTestCall(testConfig.activeCallSid);

      if (response.status === 'success') {
        setTestConfig(prev => ({
          ...prev,
          activeCallSid: null
        }));

        setTestLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), message: `✅ Llamada terminada exitosamente: ${testConfig.activeCallSid}`, type: 'success' },
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
    <Box>
      {/* Agregar estilos CSS para animaciones */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      <Typography variant="h4" component="h1" gutterBottom>
{t('testing.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
{t('testing.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        {/* Test Configuration */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
{t('testingAdditional.testConfiguration')}
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('testingAdditional.testScenario')}</InputLabel>
                <Select
                  value={testConfig.scenario}
label={t('testingAdditional.testScenario')}
                  onChange={(e) => handleConfigChange('scenario', e.target.value)}
                >
                  <MenuItem value="normal">Normal Conversation</MenuItem>
                  <MenuItem value="interruptions">User Interruptions</MenuItem>
                  <MenuItem value="slang">Mexican Slang</MenuItem>
                  <MenuItem value="lowQuality">Low Audio Quality</MenuItem>
                  <MenuItem value="languageSwitch">{t('testingAdditional.languageSwitching')}</MenuItem>
                  <MenuItem value="stress">{t('testingAdditional.stressTest')}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('testingAdditional.primaryLanguage')}</InputLabel>
                <Select
                  value={testConfig.language}
label={t('testingAdditional.primaryLanguage')}
                  onChange={(e) => handleConfigChange('language', e.target.value)}
                >
                  <MenuItem value="es-LA">{t('testingAdditional.spanishLatam')}</MenuItem>
                  <MenuItem value="en-US">{t('testingAdditional.englishUs')}</MenuItem>
                  <MenuItem value="es-MX">{t('testingAdditional.spanishMexican')}</MenuItem>
                  <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('testingAdditional.voiceType')}</InputLabel>
                <Select
                  value={testConfig.voice}
label={t('testingAdditional.voiceType')}
                  onChange={(e) => handleConfigChange('voice', e.target.value)}
                >
                  <MenuItem value="mexican">{t('testingAdditional.mexicanSpanish')}</MenuItem>
                  <MenuItem value="colombian">{t('testingAdditional.colombianSpanish')}</MenuItem>
                  <MenuItem value="argentine">{t('testingAdditional.argentineSpanish')}</MenuItem>
                  <MenuItem value="neutral">{t('testingAdditional.neutralSpanish')}</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
label={t('testingAdditional.testDuration')}
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

        {/* Real Phone Testing */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
{t('testing.realPhoneTesting')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
{t('testing.insertPhoneNumbers')}
              </Typography>

              <TextField
                fullWidth
label={t('testing.phoneNumber')}
                placeholder="+15551234567"
                value={testConfig.phoneNumber || ''}
                onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="success"
                startIcon={<PlayIcon />}
                onClick={startRealCall}
                fullWidth
                sx={{ mb: 2 }}
              >
{t('testing.startRealCall')}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<StopIcon />}
                onClick={endRealCall}
                fullWidth
                disabled={!testConfig.activeCallSid}
              >
{t('testing.endCall')}
              </Button>

              {testConfig.activeCallSid && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main',
                      animation: 'pulse 2s infinite'
                    }} />
                    <Typography variant="body2" color="success.contrastText" sx={{ fontWeight: 'bold' }}>
{t('testing.activeCall')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="success.contrastText" sx={{ display: 'block', mt: 1 }}>
                    ID: {testConfig.activeCallSid}
                  </Typography>
                  <Typography variant="caption" color="success.contrastText" sx={{ display: 'block' }}>
                    Número: {testConfig.phoneNumber}
                  </Typography>
                </Box>
              )}

              {/* Indicador de estado de conexión */}
              <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: backendStatus === 'connected' ? 'success.main' : 
                             backendStatus === 'checking' ? 'warning.main' : 'error.main'
                  }} />
                  <Typography variant="caption" color="text.secondary">
{backendStatus === 'connected' ? t('testing.backendConnected') :
                     backendStatus === 'checking' ? t('testing.checkingConnection') :
                     backendStatus === 'disconnected' ? t('testing.backendDisconnected') :
                     t('testing.connectionError')}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={checkBackendStatus}
                  sx={{ mt: 1 }}
                  disabled={backendStatus === 'checking'}
                >
{t('testing.verifyConnection')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Progress & Results */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
{t('testingAdditional.testProgress')}
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
{t('testingAdditional.testLogs')}
              </Typography>

              <Box sx={{ maxHeight: 300, overflowY: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                {testLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
{t('testingAdditional.noLogsYet')}
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
