import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Container,
  Grow,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import CallStats from '../../components/CallStats/CallStats';

// Componente de acción rápida compacto para header
const QuickActionButton = ({ title, icon, action, color }) => (
  <Grow in timeout={800}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        bgcolor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: 120,
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.1)',
          transform: 'translateY(-2px)',
          border: `1px solid ${color}.main`,
          '& .action-icon': {
            transform: 'scale(1.1)',
          }
        }
      }}
      onClick={action}
    >
      <Avatar 
        className="action-icon"
        sx={{ 
          bgcolor: `${color}.main`, 
          color: 'white', 
          width: 40, 
          height: 40, 
          mb: 1,
          transition: 'all 0.3s ease',
          boxShadow: `0 4px 12px ${color}.main}40`
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
        {title}
      </Typography>
    </Box>
  </Grow>
);

function Inicio() {
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
  
  // Crear acciones rápidas con traducciones dinámicas
  const quickActions = [
    {
      title: t('dashboard.startNewCall'),
      description: t('dashboard.startNewCallDesc'),
      icon: <PlayIcon />,
      color: 'success',
      action: () => console.log('Start new call'),
    },
    {
      title: t('dashboard.configureAgent'),
      description: t('dashboard.configureAgentDesc'),
      icon: <BuildIcon />,
      color: 'primary',
      action: () => console.log('Configure agent'),
    },
    {
      title: t('dashboard.viewAnalytics'),
      description: t('dashboard.viewAnalyticsDesc'),
      icon: <SettingsIcon />,
      color: 'info',
      action: () => console.log('View analytics'),
    },
    {
      title: t('dashboard.systemSettings'),
      description: t('dashboard.systemSettingsDesc'),
      icon: <SettingsIcon />,
      color: 'warning',
      action: () => console.log('System settings'),
    },
  ];

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con Acciones Rápidas */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <RocketIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
            {t('dashboard.quickActions')}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {quickActions.map((action, index) => (
            <QuickActionButton 
              key={index}
              title={action.title}
              icon={action.icon}
              action={action.action}
              color={action.color}
            />
          ))}
        </Box>
      </Box>

      {/* Estadísticas de Llamadas */}
      <Box sx={{ mb: 4 }}>
        <CallStats />
      </Box>


    </Container>
  );
}

export default Inicio;
