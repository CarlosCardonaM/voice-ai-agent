import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Componente de acción rápida compacto para header
const QuickActionButton = ({ title, icon, action, color }) => (
  <Grow in timeout={800}>
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          bgcolor: 'grey.800',
          border: '1px solid',
          borderColor: 'grey.600',
          minWidth: 140,
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'grey.700',
            transform: 'translateY(-2px)',
            boxShadow: 3,
            '& .action-icon': {
              transform: 'scale(1.05)',
            }
          }
        }}
      onClick={action}
    >
      <Avatar 
        className="action-icon"
        sx={{ 
          bgcolor: color, 
          color: 'white', 
          width: 48, 
          height: 48, 
          mb: 2,
          transition: 'all 0.3s ease'
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="body1" sx={{ 
        fontWeight: 600, 
        textAlign: 'center', 
        color: 'white',
        fontSize: '0.9rem'
      }}>
        {title}
      </Typography>
    </Box>
  </Grow>
);

function Inicio() {
  const navigate = useNavigate();
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
      color: 'success.main',
      action: () => navigate('/testing'),
    },
    {
      title: t('dashboard.configureAgent'),
      description: t('dashboard.configureAgentDesc'),
      icon: <BuildIcon />,
      color: 'primary.main',
      action: () => navigate('/builder'),
    },
    {
      title: t('dashboard.viewAnalytics'),
      description: t('dashboard.viewAnalyticsDesc'),
      icon: <SettingsIcon />,
      color: 'warning.main',
      action: () => navigate('/monitor'),
    },
    {
      title: t('dashboard.systemSettings'),
      description: t('dashboard.systemSettingsDesc'),
      icon: <SettingsIcon />,
      color: 'info.main',
      action: () => navigate('/settings'),
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'black',
      p: 3
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con Acciones Rápidas */}
      <Box sx={{ 
        mb: 4, 
        p: 4, 
        borderRadius: 2,
        bgcolor: 'grey.900',
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'grey.700'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <RocketIcon sx={{ 
            color: 'primary.main', 
            fontSize: 32
          }} />
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            color: 'white'
          }}>
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

      </Container>
    </Box>
  );
}

export default Inicio;
