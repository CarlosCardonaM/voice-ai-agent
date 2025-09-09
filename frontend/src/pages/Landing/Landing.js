import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Fade,
  Slide,
  Zoom,
  Chip,
  Stack
} from '@mui/material';
import {
  Phone as PhoneIcon,
  SmartToy as AIIcon,
  Language as LanguageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#00BCD4' }} />,
      title: 'Llamadas Inteligentes',
      description: 'Agente de IA que maneja conversaciones naturales'
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Multilingüe',
      description: 'Soporte para español e inglés automático'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Tiempo Real',
      description: 'Respuestas instantáneas y procesamiento rápido'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Seguro',
      description: 'Encriptación y protección de datos'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Escalable',
      description: 'Infraestructura en la nube confiable'
    },
    {
      icon: <AIIcon sx={{ fontSize: 40, color: '#E91E63' }} />,
      title: 'IA Avanzada',
      description: 'Tecnología de vanguardia en procesamiento de voz'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 800,
                background: 'linear-gradient(45deg, #00BCD4, #4CAF50, #FF9800)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              anthana
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 300,
                mb: 3,
                opacity: 0.9
              }}
            >
              Plataforma Profesional de IA de Voz
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 400,
                mb: 4,
                opacity: 0.8,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Transforma tu negocio con llamadas inteligentes, procesamiento de voz en tiempo real 
              y tecnología de IA multilingüe de última generación.
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Chip 
                label="IA Avanzada" 
                sx={{ 
                  backgroundColor: 'rgba(0, 188, 212, 0.2)', 
                  color: '#00BCD4',
                  border: '1px solid rgba(0, 188, 212, 0.3)'
                }} 
              />
              <Chip 
                label="Tiempo Real" 
                sx={{ 
                  backgroundColor: 'rgba(76, 175, 80, 0.2)', 
                  color: '#4CAF50',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }} 
              />
              <Chip 
                label="Multilingüe" 
                sx={{ 
                  backgroundColor: 'rgba(255, 152, 0, 0.2)', 
                  color: '#FF9800',
                  border: '1px solid rgba(255, 152, 0, 0.3)'
                }} 
              />
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/setup')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #00BCD4, #4CAF50)',
                boxShadow: '0 8px 32px rgba(0, 188, 212, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00ACC1, #45A049)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 188, 212, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Comenzar Ahora
            </Button>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Slide direction="up" in timeout={1500}>
          <Box sx={{ py: 8 }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 600,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Características Principales
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Zoom in timeout={1000 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(0, 188, 212, 0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Box sx={{ mb: 3 }}>
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            fontSize: '1.2rem'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.8,
                            lineHeight: 1.6
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>

        {/* Footer CTA */}
        <Fade in timeout={2000}>
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 4
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              ¿Listo para revolucionar tu comunicación?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.8,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Únete a miles de empresas que ya confían en anthana para sus llamadas inteligentes
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/setup')}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                borderColor: '#00BCD4',
                color: '#00BCD4',
                '&:hover': {
                  borderColor: '#00ACC1',
                  backgroundColor: 'rgba(0, 188, 212, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Configurar Ahora
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Landing;
