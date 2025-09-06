import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Call as CallIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/api';

function PhoneNumbers() {
  const { t } = useLanguage();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNumber, setEditingNumber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    type: 'personal',
    location: '',
    notes: '',
    tags: [],
  });

  // Cargar números telefónicos al montar el componente
  useEffect(() => {
    loadPhoneNumbers();
  }, []);

  const loadPhoneNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPhoneNumbers();
      setPhoneNumbers(response.phoneNumbers || []);
    } catch (err) {
      setError('Error al cargar los números telefónicos');
      console.error('Error loading phone numbers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (number = null) => {
    if (number) {
      setEditingNumber(number);
      setFormData({
        name: number.name,
        phoneNumber: number.phoneNumber,
        type: number.type,
        location: number.location,
        notes: number.notes,
        tags: number.tags,
      });
    } else {
      setEditingNumber(null);
      setFormData({
        name: '',
        phoneNumber: '',
        type: 'personal',
        location: '',
        notes: '',
        tags: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNumber(null);
    setFormData({
      name: '',
      phoneNumber: '',
      type: 'personal',
      location: '',
      notes: '',
      tags: [],
    });
  };

  const handleSave = async () => {
    try {
      if (editingNumber) {
        // Actualizar número existente
        await apiService.updatePhoneNumber(editingNumber.id, formData);
        // Recargar la lista después de la actualización
        loadPhoneNumbers();
      } else {
        // Agregar nuevo número
        await apiService.createPhoneNumber(formData);
        // Recargar la lista después de la creación
        loadPhoneNumbers();
      }
      handleCloseDialog();
    } catch (err) {
      setError('Error al guardar el número telefónico');
      console.error('Error saving phone number:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este número?')) {
      try {
        await apiService.deletePhoneNumber(id);
        // Recargar la lista después de la eliminación
        loadPhoneNumbers();
      } catch (err) {
        setError('Error al eliminar el número telefónico');
        console.error('Error deleting phone number:', err);
      }
    }
  };

  const handleCall = async (numberId, phoneNumber) => {
    try {
      const response = await apiService.initiateCall(numberId);
      console.log('Llamada iniciada:', response);
      alert(`Llamada iniciada a ${phoneNumber}. ID de llamada: ${response.callId}`);
      // Recargar la lista para actualizar el estado
      loadPhoneNumbers();
    } catch (err) {
      setError('Error al iniciar la llamada');
      console.error('Error starting call:', err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'personal':
        return 'primary';
      case 'business':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'personal':
        return <PersonIcon />;
      case 'business':
        return <BusinessIcon />;
      default:
        return <PhoneIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        📞 {t('phoneNumbers.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('phoneNumbers.subtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header con botones de acción */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {t('phoneNumbers.totalNumbers')}: {phoneNumbers.length}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadPhoneNumbers}
            disabled={loading}
          >
            {t('phoneNumbers.refresh')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('phoneNumbers.addNumber')}
          </Button>
        </Box>
      </Box>

      {/* Tabla de números telefónicos */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('phoneNumbers.name')}</TableCell>
                  <TableCell>{t('phoneNumbers.phoneNumber')}</TableCell>
                  <TableCell>{t('phoneNumbers.type')}</TableCell>
                  <TableCell>{t('phoneNumbers.location')}</TableCell>
                  <TableCell>{t('phoneNumbers.tags')}</TableCell>
                  <TableCell>{t('phoneNumbers.lastCalled')}</TableCell>
                  <TableCell>{t('phoneNumbers.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : phoneNumbers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('phoneNumbers.noNumbers')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  phoneNumbers.map((number) => (
                    <TableRow key={number.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(number.type)}
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {number.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {number.phoneNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`phoneNumbers.${number.type}`)}
                          color={getTypeColor(number.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {number.location}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {number.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {number.lastCalled || t('phoneNumbers.neverCalled')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t('phoneNumbers.call')}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleCall(number.id, number.phoneNumber)}
                            >
                              <CallIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('phoneNumbers.edit')}>
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleOpenDialog(number)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('phoneNumbers.delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(number.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para agregar/editar número */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNumber ? t('phoneNumbers.editNumber') : t('phoneNumbers.addNumber')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('phoneNumbers.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('phoneNumbers.phoneNumber')}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('phoneNumbers.type')}</InputLabel>
                <Select
                  value={formData.type}
                  label={t('phoneNumbers.type')}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="personal">{t('phoneNumbers.personal')}</MenuItem>
                  <MenuItem value="business">{t('phoneNumbers.business')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('phoneNumbers.location')}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('phoneNumbers.notes')}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('phoneNumbers.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {t('phoneNumbers.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PhoneNumbers;
