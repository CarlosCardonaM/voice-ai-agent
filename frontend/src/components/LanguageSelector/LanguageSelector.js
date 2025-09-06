import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

function LanguageSelector() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { language, changeLanguage, languages } = useLanguage();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    handleClose();
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Indicador de idioma actual */}
      <Chip
        icon={<span style={{ fontSize: '16px' }}>{currentLanguage?.flag}</span>}
        label={currentLanguage?.nativeName}
        variant="outlined"
        size="small"
        sx={{ 
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            fontSize: '16px'
          }
        }}
      />
      
      {/* Botón de selector */}
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
          }
        }}
      >
        <LanguageIcon fontSize="small" />
      </IconButton>

      {/* Menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
            Seleccionar Idioma
          </Typography>
          
          {languages.map((languageItem) => (
            <MenuItem
              key={languageItem.code}
              onClick={() => handleLanguageChange(languageItem.code)}
              selected={language === languageItem.code}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: 'transparent',
                    fontSize: '16px'
                  }}
                >
                  {languageItem.flag}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {languageItem.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {languageItem.name}
                  </Typography>
                </Box>
                
                {language === languageItem.code && (
                  <Typography variant="body2" color="primary.main">
                    ✓
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
}

export default LanguageSelector;
