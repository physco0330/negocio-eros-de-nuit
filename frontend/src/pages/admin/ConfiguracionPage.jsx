import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  Alert, Snackbar, Avatar, Divider, Paper, Skeleton
} from '@mui/material';
import { Save, Store, Phone, Image as ImageIcon, ViewCarousel } from '@mui/icons-material';
import { configuracionAPI } from '../../services/api';

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    whatsappNegocio: '', nombreTienda: '', logo: '', bannerPrincipal: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    try {
      const res = await configuracionAPI.obtener();
      setConfig(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al cargar configuración', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await configuracionAPI.actualizar(config);
      setSnackbar({ open: true, message: 'Configuración guardada correctamente', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={36} width={200} sx={{ mb: 3, borderRadius: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
        Configuración
      </Typography>

      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(201,168,76,0.1)' }}>
                  <Store sx={{ color: 'primary.main', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                  Información de la Tienda
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth label="Nombre de la Tienda" value={config.nombreTienda}
                  onChange={(e) => setConfig({ ...config, nombreTienda: e.target.value })}
                />
                <TextField
                  fullWidth label="Número de WhatsApp" value={config.whatsappNegocio}
                  onChange={(e) => setConfig({ ...config, whatsappNegocio: e.target.value })}
                  placeholder="573001234567"
                  helperText="Formato: código país + número (ej: 573001234567)"
                />

                <Divider sx={{ my: 0.5 }} />

                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  Imágenes
                </Typography>

                <TextField
                  fullWidth label="URL del Logo" value={config.logo}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <TextField
                  fullWidth label="URL del Banner Principal" value={config.bannerPrincipal}
                  onChange={(e) => setConfig({ ...config, bannerPrincipal: e.target.value })}
                  placeholder="https://ejemplo.com/banner.jpg"
                />

                <Button
                  variant="contained" startIcon={<Save />}
                  onClick={handleSave} disabled={saving}
                  sx={{ mt: 1, py: 1.5 }}
                >
                  {saving ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vista Previa */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(201,168,76,0.1)' }}>
                  <ImageIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                  Vista Previa
                </Typography>
              </Box>

              {config.bannerPrincipal ? (
                <Box sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
                  <img
                    src={config.bannerPrincipal}
                    alt="Banner"
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 4, mb: 3, borderRadius: 3, textAlign: 'center' }}>
                  <ViewCarousel sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Sin banner configurado</Typography>
                </Paper>
              )}

              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {config.logo ? (
                    <Avatar src={config.logo} sx={{ width: 56, height: 56, bgcolor: 'grey.100' }} />
                  ) : (
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'grey.200' }}>
                      <Store sx={{ color: 'text.secondary' }} />
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                      {config.nombreTienda || 'Nombre de Tienda'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      WhatsApp: {config.whatsappNegocio || 'No configurado'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
