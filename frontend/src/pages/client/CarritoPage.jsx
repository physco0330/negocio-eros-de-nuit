import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Card, CardMedia, IconButton, Button,
  Divider, Grid, Paper, Chip, Snackbar, Alert
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, WhatsApp, ArrowBack, Storefront } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useThemeMode } from '../../context/ThemeContext';
import { configuracionAPI } from '../../services/api';
import { formatCurrency, generateWhatsAppMessage } from '../../utils/helpers';

const gold = '#C9A84C';

export default function CarritoPage() {
  const { items, updateItem, removeItem, getSubtotal, getDescuentoTotal, getTotal, clearCart } = useCart();
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    configuracionAPI.obtener().then((res) => setConfig(res.data)).catch(() => {});
  }, []);

  const handleWhatsApp = () => {
    window.open(generateWhatsAppMessage(items, getTotal(), config), '_blank');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 12 }, textAlign: 'center' }}>
        <Box sx={{
          width: 100, height: 100, borderRadius: '50%', mx: 'auto', mb: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.05)',
        }}>
          <ShoppingCart sx={{ fontSize: 44, color: 'primary.main', opacity: 0.5 }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          Tu carrito está vacío
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
          Explora nuestro catálogo y agrega productos exclusivos a tu carrito de compras.
        </Typography>
        <Button variant="contained" size="large" startIcon={<Storefront />}
          onClick={() => navigate('/catalogo')} sx={{ px: 5, py: 1.5 }}>
          Ver Catálogo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/catalogo')}
        sx={{ mb: 2, color: 'text.secondary', fontSize: '0.85rem' }}>
        Seguir comprando
      </Button>

      <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 0.5 }}>
        TU PEDIDO
      </Typography>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
        Carrito de Compras
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {items.map((item, index) => {
            const imagen = item.imagenes?.find(i => i.principal)?.urlImagen || item.imagenes?.[0]?.urlImagen;
            const precioUnitario = item.descuentoPorcentaje > 0 ? item.precioConDescuento : item.precioVenta;
            return (
              <Card key={item.id} sx={{
                mb: 2, p: { xs: 2, md: 2.5 },
                border: `1px solid ${isDark ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.03)'}`,
              }}>
                <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: 80, md: 110 }, height: { xs: 80, md: 110 },
                      objectFit: 'cover', borderRadius: 3,
                      border: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
                    }}
                    image={imagen || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200'}
                    alt={item.nombre}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.6rem', display: 'block' }}>
                      {item.marcaNombre}
                    </Typography>
                    <Typography variant="subtitle1" sx={{
                      fontFamily: '"Playfair Display", serif', fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1.05rem' }, mb: 0.5,
                    }}>
                      {item.nombre}
                    </Typography>
                    {item.descuentoPorcentaje > 0 && (
                      <Chip label={`-${item.descuentoPorcentaje}%`} size="small" sx={{
                        bgcolor: 'rgba(211,47,47,0.08)', color: '#D32F2F', fontWeight: 700,
                        fontSize: '0.68rem', height: 22, borderRadius: 1.5,
                      }} />
                    )}
                    <Box sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      mt: 1.5, flexWrap: 'wrap', gap: 1,
                    }}>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        border: `1px solid ${isDark ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: 2, p: 0.3,
                      }}>
                        <IconButton size="small" onClick={() => updateItem(item.id, item.cantidad - 1)}
                          sx={{ width: 28, height: 28 }}>
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography fontWeight={700} sx={{ minWidth: 28, textAlign: 'center', fontSize: '0.95rem' }}>
                          {item.cantidad}
                        </Typography>
                        <IconButton size="small" onClick={() => updateItem(item.id, item.cantidad + 1)}
                          sx={{ width: 28, height: 28 }}>
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography fontWeight={700} sx={{ color: 'primary.main', fontSize: '1.05rem' }}>
                          {formatCurrency(precioUnitario * item.cantidad)}
                        </Typography>
                        <IconButton size="small" onClick={() => removeItem(item.id)}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#D32F2F' } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })}
          <Button color="error" startIcon={<Delete />} onClick={clearCart} size="small"
            sx={{ mt: 1, fontSize: '0.82rem' }}>
            Vaciar carrito
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 4, position: 'sticky', top: 88,
            border: `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.04)'}`,
          }}>
            <Typography variant="h6" gutterBottom sx={{
              fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 2,
            }}>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatCurrency(getSubtotal())}</Typography>
            </Box>
            {getDescuentoTotal() > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Descuentos</Typography>
                <Typography sx={{ fontWeight: 600, color: '#2E7D32', fontSize: '0.9rem' }}>
                  -{formatCurrency(getDescuentoTotal())}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Playfair Display", serif' }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: '"Playfair Display", serif' }}>
                {formatCurrency(getTotal())}
              </Typography>
            </Box>
            <Button
              fullWidth variant="contained" size="large"
              startIcon={<WhatsApp />}
              onClick={handleWhatsApp}
              sx={{
                py: 1.4, fontSize: '0.95rem',
                bgcolor: '#25D366', '&:hover': { bgcolor: '#20BD5A', boxShadow: '0 6px 24px rgba(37,211,102,0.3)' },
              }}
            >
              Comprar por WhatsApp
            </Button>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: 'text.secondary', fontSize: '0.72rem' }}>
              Te redirigiremos a WhatsApp con tu pedido
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
