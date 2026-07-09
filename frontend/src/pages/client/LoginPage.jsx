import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Tabs, Tab, Fade
} from '@mui/material';
import { Visibility, VisibilityOff, Login, PersonAdd, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { authAPI } from '../../services/api';
import logoEros from '../../logos/logo-el-nene.jpeg';

const gold = '#C9A84C';

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ correo: form.correo, contrasena: form.contrasena });
      login(res.data, res.data.token);
      navigate(res.data.rol === 'SUPER_ADMIN' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register({ nombre: form.nombre, correo: form.correo, contrasena: form.contrasena });
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      bgcolor: 'background.default',
    }}>
      {/* Left Panel - Branding */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0A0A0F 0%, #141420 50%, #1A1A2E 100%)'
          : 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 50%, #141420 100%)',
      }}>
        <Box sx={{
          position: 'absolute', top: '10%', left: '10%', width: 300, height: 300,
          borderRadius: '50%', background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`,
        }} />
        <Box sx={{
          position: 'absolute', bottom: '15%', right: '15%', width: 200, height: 200,
          borderRadius: '50%', background: `radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)`,
        }} />
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 4 }}>
          <Box sx={{
            width: 140, height: 140, mx: 'auto', mb: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 40px rgba(201,168,76,0.25)`,
            borderRadius: 3, overflow: 'hidden',
          }}>
            <Box component="img" src={logoEros} alt="El Nene" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography variant="h3" sx={{
            fontFamily: '"Playfair Display", serif', fontWeight: 700,
            color: 'white', mb: 1, letterSpacing: '0.08em',
          }}>
            EL NENE
          </Typography>
          <Typography sx={{
            color: gold, fontSize: '0.7rem', letterSpacing: '0.4em',
            fontWeight: 500, mb: 3,
          }}>
            PERFUMERÍA
          </Typography>
          <Typography sx={{
            color: 'rgba(255,255,255,0.5)', maxWidth: 320, mx: 'auto',
            lineHeight: 1.7, fontSize: '0.9rem',
          }}>
            Gestiona tu inventario de fragancias y productos de belleza con elegancia.
          </Typography>
        </Box>
      </Box>

      {/* Right Panel - Form */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 520px' },
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        px: { xs: 3, sm: 6 }, py: 4,
        position: 'relative',
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute', top: 20, left: 20,
            color: 'text.secondary', fontSize: '0.85rem',
            '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
          }}
        >
          Volver a la tienda
        </Button>

        <Box sx={{ maxWidth: 380, mx: 'auto', width: '100%' }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box component="img" src={logoEros} alt="El Nene" sx={{ width: 36, height: 36, borderRadius: 1, objectFit: 'contain' }} />
            <Typography variant="h5" sx={{
              fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'primary.main', letterSpacing: '0.05em',
            }}>
              EL NENE
            </Typography>
          </Box>

          <Typography variant="h4" sx={{
            fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 0.5,
          }}>
            {tab === 0 ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {tab === 0 ? 'Ingresa para gestionar tu negocio' : 'Regístrate para comenzar'}
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, v) => { setTab(v); setError(''); }}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600, fontSize: '0.9rem', textTransform: 'none',
                minHeight: 44, borderRadius: 2,
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiTabs-indicator': {
                height: 3, borderRadius: 2, bgcolor: 'primary.main',
              },
            }}
          >
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>

          <Fade in timeout={300}>
            <Box>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
              )}

              {tab === 0 ? (
                <form onSubmit={handleLogin}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth label="Correo electrónico" type="email"
                      value={form.correo}
                      onChange={(e) => setForm({ ...form, correo: e.target.value })}
                      required
                      size="small"
                    />
                    <TextField
                      fullWidth label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      value={form.contrasena}
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                      required size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}
                      startIcon={<Login />} sx={{ py: 1.3, mt: 1 }}>
                      {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                  </Box>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField fullWidth label="Nombre completo" size="small"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                    <TextField fullWidth label="Correo electrónico" type="email" size="small"
                      value={form.correo}
                      onChange={(e) => setForm({ ...form, correo: e.target.value })}
                      required
                    />
                    <TextField fullWidth label="Contraseña" size="small"
                      type={showPassword ? 'text' : 'password'}
                      value={form.contrasena}
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}
                      startIcon={<PersonAdd />} sx={{ py: 1.3, mt: 1 }}>
                      {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}
