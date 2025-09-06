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
    mode: 'light',
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
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
