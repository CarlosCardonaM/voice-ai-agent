import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Mic as MicIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  Call as CallIcon,
  Build as BuildIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';

const StatCard = ({ title, value, subtitle, icon, color, progress, loading = false }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
        <Chip label="Live" color="success" size="small" />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
          {progress && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progress}% of target
              </Typography>
            </Box>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, icon, action, color }) => (
  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={action}>
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56, mx: 'auto', mb: 2 }}>
        {icon}
      </Avatar>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Mock data fallback if backend is not available
  const fallbackData = {
    stats: [
      {
        title: 'Active Calls',
        value: '12',
        subtitle: 'Currently in progress',
        icon: <CallIcon />,
        color: 'primary',
        progress: 75,
      },
      {
        title: 'Avg Response Time',
        value: '280ms',
        subtitle: 'Target: <500ms',
        icon: <SpeedIcon />,
        color: 'success',
        progress: 94,
      },
      {
        title: 'Language Switches',
        value: '8',
        subtitle: 'Spanish ↔ English',
        icon: <LanguageIcon />,
        color: 'info',
        progress: 60,
      },
      {
        title: 'Success Rate',
        value: '99.2%',
        subtitle: 'Last 24 hours',
        icon: <TrendingUpIcon />,
        color: 'success',
        progress: 99,
      },
    ],
    quickActions: [
      {
        title: 'Start New Call',
        description: 'Initiate a test call session',
        icon: <PlayIcon />,
        color: 'success',
        action: () => console.log('Start new call'),
      },
      {
        title: 'Configure Agent',
        description: 'Customize voice and behavior',
        icon: <BuildIcon />,
        color: 'primary',
        action: () => console.log('Configure agent'),
      },
      {
        title: 'View Analytics',
        description: 'Detailed performance metrics',
        icon: <TrendingUpIcon />,
        color: 'info',
        action: () => console.log('View analytics'),
      },
      {
        title: 'System Settings',
        description: 'Manage integrations and API keys',
        icon: <SettingsIcon />,
        color: 'warning',
        action: () => console.log('System settings'),
      },
    ],
    recentActivity: [
      {
        type: 'Call Started',
        description: 'Incoming call from +1 (555) 123-4567',
        time: '2 minutes ago',
        status: 'active',
      },
      {
        type: 'Language Switch',
        description: 'Switched from Spanish to English',
        time: '5 minutes ago',
        status: 'completed',
      },
      {
        type: 'Call Ended',
        description: 'Call with +1 (555) 987-6543 completed',
        time: '8 minutes ago',
        status: 'completed',
      },
      {
        type: 'Performance Alert',
        description: 'Response time exceeded 500ms threshold',
        time: '12 minutes ago',
        status: 'warning',
      },
    ],
  };

  // Use real data if available, otherwise fallback
  const stats = dashboardData?.performance?.stats || fallbackData.stats;
  const quickActions = fallbackData.quickActions;
  const recentActivity = fallbackData.recentActivity;

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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your Voice AI Agent performance and manage operations
        </Typography>
        
        {/* Backend Status */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {dashboardData ? (
            <>
              <Chip 
                label="Backend Connected" 
                color="success" 
                size="small" 
                icon={<MicIcon />}
              />
              <Typography variant="caption" color="text.secondary">
                Real-time data from Python backend
              </Typography>
            </>
          ) : (
            <>
              <Chip 
                label="Backend Disconnected" 
                color="error" 
                size="small" 
                icon={<MicIcon />}
              />
              <Typography variant="caption" color="text.secondary">
                Using fallback data
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
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <QuickActionCard {...action} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity and System Status */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Recent Activity
              </Typography>
              <Box>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < recentActivity.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: activity.status === 'active' ? 'success.light' : 
                                activity.status === 'warning' ? 'warning.light' : 'info.light',
                        color: activity.status === 'active' ? 'success.main' : 
                               activity.status === 'warning' ? 'warning.main' : 'info.main',
                      }}
                    >
                      <MicIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Typography variant="subtitle2" component="div">
                        {activity.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                System Status
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <MicIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Voice AI Agent" secondary="Online" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MicIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="STT Service" secondary="Online" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MicIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="TTS Service" secondary="Online" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MicIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="LLM Service" secondary="Online" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MicIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Twilio Integration" secondary="Online" />
                  </ListItem>
                </List>
              )}
              
              {dashboardData && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Uptime</Typography>
                      <Typography variant="body2">99.9%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={99.9} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Response Time</Typography>
                      <Typography variant="body2">280ms</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
