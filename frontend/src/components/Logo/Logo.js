import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ variant = 'default', size = 'medium', sx = {} }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: '1.2rem' };
      case 'large':
        return { fontSize: '3rem' };
      case 'xlarge':
        return { fontSize: '4rem' };
      default:
        return { fontSize: '1.8rem' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return { color: '#000000' };
      case 'light':
        return { color: '#ffffff' };
      case 'primary':
        return { color: '#1976d2' };
      default:
        return { color: 'inherit' };
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 'normal',
        letterSpacing: 'normal',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...sx 
      }}
    >
      <span style={{ color: 'inherit' }}>anthan</span>
      <span style={{ color: '#1976d2' }}>a</span>
    </Box>
  );
};

export default Logo;
