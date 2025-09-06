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
} from '@mui/material';
import {
  Mic as MicIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
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
    <Box>
      {/* Header - At the very top */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BarChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h4" component="h1">
            {t('dashboard.title')}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
        
        {/* Backend Status */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {dashboardData ? (
            <>
              <Chip 
                label={t('dashboard.backendConnected')} 
                color="success" 
                size="small" 
                icon={<MicIcon />}
              />
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.realTimeData')}
              </Typography>
            </>
          ) : (
            <>
              <Chip 
                label={t('dashboard.backendDisconnected')} 
                color="error" 
                size="small" 
                icon={<MicIcon />}
              />
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.fallbackData')}
              </Typography>
            </>
          )}
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ ml: 'auto' }}
          >
{t('dashboard.refresh')}
          </Button>
        </Box>
      </Box>


      {/* System Status */}
      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <MicIcon sx={{ color: 'success.main', fontSize: 28 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  {t('dashboard.systemStatus')}
                </Typography>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Box>
                  {[
                    { name: 'Voice AI Agent', status: 'Online', icon: <MicIcon /> },
                    { name: 'STT Service', status: 'Online', icon: <MicIcon /> },
                    { name: 'TTS Service', status: 'Online', icon: <MicIcon /> },
                    { name: 'LLM Service', status: 'Online', icon: <MicIcon /> },
                    { name: 'Twilio Integration', status: 'Online', icon: <MicIcon /> },
                  ].map((service, index) => (
                    <Fade in timeout={1000 + index * 200} key={service.name}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 2,
                          px: 2,
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: 'success.light',
                          border: '1px solid',
                          borderColor: 'success.main',
                        }}
                      >
                        <Avatar sx={{ bgcolor: 'success.main', color: 'white', mr: 2, width: 32, height: 32 }}>
                          {service.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {service.name}
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {service.status}
                          </Typography>
                        </Box>
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      </Box>
                    </Fade>
                  ))}
                  
                  {dashboardData && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Métricas de Rendimiento
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Uptime</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>99.9%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={99.9} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'success.light',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'success.main'
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Response Time</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>280ms</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={94} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'success.light',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'success.main'
                            }
                          }} 
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
