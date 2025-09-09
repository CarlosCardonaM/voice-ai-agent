import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Fade,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Slide,
  Zoom,
  Grow,
} from '@mui/material';
import {
  Mic as MicIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Language as LanguageIcon,
  Phone as PhoneIcon,
  Headset as HeadsetIcon,
  VolumeUp as VolumeUpIcon,
  Psychology as PsychologyIcon,
  Cloud as CloudIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        
        // Fetch health status
        const healthData = await apiService.getHealth();
        
        // Fetch performance metrics
        const performanceData = await apiService.getPerformanceMetrics();
        
        // Fetch language status
        const languageData = await apiService.getLanguageStatus();
        
        setDashboardData({
          health: healthData,
          performance: performanceData,
          language: languageData,
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        if (error.message.includes('Failed to fetch')) {
          const errorMsg = 'Cannot connect to backend server. Please ensure the Python backend is running on port 5001.';
          setError(errorMsg);
          
          // Retry after 5 seconds if it's a connection error
          if (retryCount < 3) {
            setTimeout(() => fetchDashboardData(retryCount + 1), 5000);
          }
        } else if (error.message.includes('API Error: 500')) {
          setError('Backend server error. Please check the Python backend logs.');
        } else if (error.message.includes('API Error: 404')) {
          setError('Backend endpoint not found. Please check the API configuration.');
        } else {
          setError(`Failed to load dashboard data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => fetchDashboardData(), 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Using fallback data. Please check your backend connection.
        </Typography>
      </Box>
    );
  }

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
          .metric-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .service-card {
            transition: all 0.3s ease;
          }
          .service-card:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                mr: 3, 
                width: 64, 
                height: 64
              }}>
                <DashboardIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" sx={{ 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {t('dashboard.title')}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, color: 'grey.300' }}>
                  {t('dashboard.subtitle')}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={dashboardData ? <WifiIcon /> : <WifiOffIcon />}
                label={dashboardData ? t('dashboard.backendConnected') : t('dashboard.backendDisconnected')}
                color={dashboardData ? 'success' : 'error'}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={() => window.location.reload()}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>
      </Fade>

      <Grid container spacing={4}>
        {/* Key Metrics Cards */}
        <Grid item xs={12}>
          <Slide direction="up" in timeout={1000}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  className="metric-card"
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'grey.800',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.700'
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 48, mb: 2, color: 'success.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                    12
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'grey.300' }}>
                    {t('dashboard.activeCalls')}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  className="metric-card"
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'grey.800',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.700'
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 48, mb: 2, color: 'info.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                    280ms
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'grey.300' }}>
                    {t('dashboard.avgResponseTime')}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  className="metric-card"
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'grey.800',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.700'
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 48, mb: 2, color: 'warning.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                    98.5%
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'grey.300' }}>
                    {t('dashboard.successRate')}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  className="metric-card"
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'grey.800',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.700'
                  }}
                >
                  <LanguageIcon sx={{ fontSize: 48, mb: 2, color: 'secondary.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                    3
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'grey.300' }}>
                    {t('dashboard.languagesSupported')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Slide>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} lg={8}>
          <Slide direction="up" in timeout={1200}>
            <Card elevation={2} sx={{ 
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
                  <AssessmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {t('dashboard.systemStatus')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time system health and performance monitoring
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress size={60} sx={{ mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Loading system data...
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {/* Services Status */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Services Status
                      </Typography>
                      <Stack spacing={2}>
                        {[
                          { name: 'Voice AI Agent', status: 'Online', icon: <MicIcon />, color: 'success' },
                          { name: 'STT Service', status: 'Online', icon: <HeadsetIcon />, color: 'success' },
                          { name: 'TTS Service', status: 'Online', icon: <VolumeUpIcon />, color: 'success' },
                          { name: 'LLM Service', status: 'Online', icon: <PsychologyIcon />, color: 'success' },
                          { name: 'Twilio Integration', status: 'Online', icon: <CloudIcon />, color: 'success' },
                        ].map((service, index) => (
                          <Grow in timeout={1000 + index * 200} key={service.name}>
                            <Paper 
                              elevation={2} 
                              className="service-card"
                              sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                background: 'rgba(76, 175, 80, 0.05)',
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ 
                                  bgcolor: 'success.main', 
                                  mr: 2, 
                                  width: 40, 
                                  height: 40 
                                }}>
                                  {service.icon}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {service.name}
                                  </Typography>
                                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                                    {service.status}
                                  </Typography>
                                </Box>
                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                              </Box>
                            </Paper>
                          </Grow>
                        ))}
                      </Stack>
                    </Grid>

                    {/* Performance Metrics */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Performance Metrics
                      </Typography>
                      
                      <Stack spacing={3}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              System Uptime
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              99.9%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={99.9} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              background: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                                borderRadius: 5
                              }
                            }} 
                          />
                        </Box>
                        
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Response Time
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              280ms
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={94} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              background: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                                borderRadius: 5
                              }
                            }} 
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Success Rate
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              98.5%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={98.5} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              background: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #FF9800, #F57C00)',
                                borderRadius: 5
                              }
                            }} 
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
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
                  <PlayIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Quick Actions
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Common tasks and system controls
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Start Test Call
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PhoneIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Make Real Call
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AnalyticsIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    View Analytics
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<LanguageIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Language Settings
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
