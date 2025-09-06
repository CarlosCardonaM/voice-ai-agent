import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing/Landing';
import Setup from './pages/Setup/Setup';
import Inicio from './pages/Inicio/Inicio';
import Dashboard from './pages/Dashboard/Dashboard';
import Builder from './pages/Builder/Builder';
import PhoneNumbers from './pages/PhoneNumbers/PhoneNumbers';
import Testing from './pages/Testing/Testing';
import Deploy from './pages/Deploy/Deploy';
import Monitor from './pages/Monitor/Monitor';
import Settings from './pages/Settings/Settings';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2a2a2a',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
    },
    caption: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
    overline: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(255,255,255,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/setup" element={<Setup />} />
                      <Route path="/inicio" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Inicio />
              </Layout>
            </Box>
          } />
                      <Route path="/dashboard" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Dashboard />
              </Layout>
            </Box>
          } />
          <Route path="/builder" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Builder />
              </Layout>
            </Box>
          } />
          <Route path="/phone-numbers" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <PhoneNumbers />
              </Layout>
            </Box>
          } />
          <Route path="/testing" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Testing />
              </Layout>
            </Box>
          } />
          <Route path="/deploy" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Deploy />
              </Layout>
            </Box>
          } />
          <Route path="/monitor" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Monitor />
              </Layout>
            </Box>
          } />
          <Route path="/settings" element={
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <Layout>
                <Settings />
              </Layout>
            </Box>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
