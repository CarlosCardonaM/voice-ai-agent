import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneCallback as PhoneCallbackIcon,
  ThumbUp as ThumbUpIcon,
  TrendingUp as TrendingUpIcon,
  ArrowDownward as ArrowDownIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';

// Componente de paso del funnel
const FunnelStep = ({ title, value, icon, color, subtitle, percentage, total, index, loading = false }) => (
  <Grow in timeout={800 + index * 200}>
    <Box sx={{ 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 2
    }}>
      {/* Barra de progreso horizontal */}
      <Box sx={{ 
        width: '100%', 
        height: 8, 
        bgcolor: 'grey.200', 
        borderRadius: 4,
        mb: 2,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          width: `${percentage}%`,
          height: '100%',
          bgcolor: `${color}.main`,
          borderRadius: 4,
          transition: 'width 1s ease-in-out',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
            animation: 'shimmer 2s infinite',
          }
        }} />
      </Box>

      {/* Contenido del paso */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        width: '100%',
        p: 2,
        borderRadius: 2,
        bgcolor: `${color}.light`,
        border: `2px solid ${color}.main`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: `8px solid ${color}.main`,
        }
      }}>
        <Avatar sx={{ 
          bgcolor: `${color}.main`, 
          color: 'white', 
          width: 48, 
          height: 48,
          boxShadow: `0 4px 12px ${color}.main}40`
        }}>
          {icon}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
            {value}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: 'white' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
            {percentage}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            de {total}
          </Typography>
        </Box>
      </Box>

      {/* Flecha hacia abajo */}
      {index < 2 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1,
          animation: 'bounce 2s infinite'
        }}>
          <ArrowDownIcon sx={{ color: 'grey.400', fontSize: 24 }} />
        </Box>
      )}
    </Box>
  </Grow>
);

const CallStats = () => {
  const [callStats, setCallStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCallStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from backend
        const callStatsData = await apiService.getCallStatistics();
        
        setCallStats({
          totalCalls: callStatsData.total_calls,
          answeredCalls: callStatsData.answered_calls,
          positiveCalls: callStatsData.positive_calls,
          avgCallDuration: callStatsData.avg_call_duration,
          successRate: callStatsData.success_rate,
          lastUpdated: new Date(callStatsData.last_updated).toLocaleTimeString(),
        });
        
      } catch (error) {
        console.error('Error fetching call stats:', error);
        
        // Fallback to mock data
        setCallStats({
          totalCalls: 18,
          answeredCalls: 15,
          positiveCalls: 12,
          avgCallDuration: '4:32',
          successRate: 85.7,
          lastUpdated: new Date().toLocaleTimeString(),
        });
        
        setError('Using mock data - backend connection unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchCallStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchCallStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (!callStats) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Datos del funnel
  const funnelSteps = [
    {
      title: 'Llamadas Totales',
      value: callStats.totalCalls,
      icon: <PhoneIcon />,
      color: 'primary',
      subtitle: 'Hoy',
      percentage: 100,
      total: callStats.totalCalls,
    },
    {
      title: 'Llamadas Contestadas',
      value: callStats.answeredCalls,
      icon: <PhoneCallbackIcon />,
      color: 'info',
      subtitle: `${Math.round((callStats.answeredCalls / callStats.totalCalls) * 100)}% tasa`,
      percentage: Math.round((callStats.answeredCalls / callStats.totalCalls) * 100),
      total: callStats.totalCalls,
    },
    {
      title: 'Llamadas Positivas',
      value: callStats.positiveCalls,
      icon: <ThumbUpIcon />,
      color: 'success',
      subtitle: `${Math.round((callStats.positiveCalls / callStats.answeredCalls) * 100)}% éxito`,
      percentage: Math.round((callStats.positiveCalls / callStats.totalCalls) * 100),
      total: callStats.totalCalls,
    },
  ];

  return (
    <Card sx={{ 
      borderRadius: 3,
      background: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <TrendingUpIcon />
            </Avatar>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
              Funnel de Llamadas - Hoy
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`Actualizado: ${callStats.lastUpdated}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            {error && (
              <Chip 
                label="Datos de prueba" 
                size="small" 
                color="warning" 
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Funnel Steps */}
        <Box sx={{ mb: 4 }}>
          {funnelSteps.map((step, index) => (
            <FunnelStep 
              key={index}
              {...step}
              index={index}
              loading={loading}
            />
          ))}
        </Box>

        {/* Métricas adicionales */}
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'success.light',
              border: '1px solid',
              borderColor: 'success.main'
            }}>
              <AccessTimeIcon sx={{ color: 'success.main', fontSize: 32, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                280ms
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Tiempo de Respuesta
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Objetivo: &lt;500ms
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'primary.light',
              border: '1px solid',
              borderColor: 'primary.main'
            }}>
              <PhoneIcon sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                12
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Llamadas Activas
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                En progreso
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'warning.light',
              border: '1px solid',
              borderColor: 'warning.main'
            }}>
              <PhoneIcon sx={{ color: 'warning.main', fontSize: 32, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {callStats.totalCalls - callStats.answeredCalls}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Sin Contestar
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Requieren seguimiento
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CallStats;
