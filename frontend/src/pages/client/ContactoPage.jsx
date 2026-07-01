import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, TextField,
  Button, IconButton, Paper
} from '@mui/material';
import { WhatsApp, Email, LocationOn, AccessTime, Send } from '@mui/icons-material';
import { configuracionAPI } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';

const gold = '#C9A84C';

export default function ContactoPage() {
  const [config, setConfig] = useState(null);
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    configuracionAPI.obtener().then((res) => setConfig(res.data)).catch(() => {});
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box sx={{
        py: { xs: 6, md: 10 }, textAlign: 'center',
        background: isDark
          ? 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(10,10,15,0) 100%)'
          : 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, rgba(248,246,240,0) 100%)',
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Contáctanos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Estamos aquí para ayudarte. Escríbenos y te responderemos pronto.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Información de contacto</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {[
                { icon: <WhatsApp />, label: 'WhatsApp', value: `+${config?.whatsappNegocio || '573012558773'}`, href: `https://wa.me/${config?.whatsappNegocio || '573012558773'}` },
                { icon: <Email />, label: 'Email', value: 'contacto@luxuryperfumes.com' },
                { icon: <LocationOn />, label: 'Dirección', value: 'Calle Principal #123, Ciudad' },
                { icon: <AccessTime />, label: 'Horario', value: 'Lun - Sáb: 9:00 AM - 7:00 PM' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)',
                    color: 'primary.main', flexShrink: 0,
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2 }}>
                      {item.label}
                    </Typography>
                    {item.href ? (
                      <Typography component="a" href={item.href} target="_blank"
                        sx={{ color: 'text.primary', fontWeight: 500, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                        {item.value}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontWeight: 500 }}>{item.value}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card elevation={0} sx={{
              p: { xs: 3, md: 4 }, borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
            }}>
              <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
                Envíanos un mensaje
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField fullWidth label="Tu nombre" size="small" />
                <TextField fullWidth label="Tu correo" type="email" size="small" />
                <TextField fullWidth label="Asunto" size="small" />
                <TextField fullWidth multiline rows={4} label="Mensaje" />
                <Button variant="contained" startIcon={<Send />} size="large" sx={{ py: 1.3 }}>
                  Enviar Mensaje
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* WhatsApp CTA */}
        <Paper elevation={0} sx={{
          mt: 6, p: { xs: 4, md: 5 }, textAlign: 'center', borderRadius: 5,
          background: isDark
            ? 'linear-gradient(135deg, #141420 0%, #1A1A2E 100%)'
            : 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)',
          border: `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)'}`,
        }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 1, color: 'white' }}>
            ¿Prefieres WhatsApp?
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
            Respuesta inmediata para tus consultas
          </Typography>
          <Button variant="contained" size="large" startIcon={<WhatsApp />}
            href={`https://wa.me/${config?.whatsappNegocio || '573012558773'}`} target="_blank"
            sx={{
              px: 5, py: 1.4, bgcolor: '#25D366',
              '&:hover': { bgcolor: '#20BD5A', boxShadow: '0 8px 30px rgba(37,211,102,0.3)' },
            }}>
            Abrir WhatsApp
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
