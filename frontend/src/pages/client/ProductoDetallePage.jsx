import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Grid, Card, CardMedia, Button, Chip,
  Divider, Skeleton, IconButton, Snackbar, Alert, Paper
} from '@mui/material';
import { ShoppingCart, ArrowBack, Add, Remove, WhatsApp } from '@mui/icons-material';
import { productosAPI, configuracionAPI } from '../../services/api';
import { formatCurrency, generateWhatsAppMessage } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useThemeMode } from '../../context/ThemeContext';

const gold = '#C9A84C';

export default function ProductoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addItem } = useCart();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        productosAPI.obtener(id),
        configuracionAPI.obtener().catch(() => ({ data: {} })),
      ]);
      setProducto(pRes.data);
      setConfig(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddToCart = () => {
    addItem(producto, cantidad);
    setSnackbar({ open: true, message: `${producto.nombre} agregado al carrito`, severity: 'success' });
  };

  const handleWhatsApp = () => {
    const precio = producto.descuentoPorcentaje > 0 ? producto.precioConDescuento : producto.precioVenta;
    window.open(generateWhatsAppMessage([{ ...producto, cantidad }], precio * cantidad, config), '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={480} sx={{ borderRadius: 5 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={80} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif' }}>Producto no encontrado</Typography>
        <Button onClick={() => navigate('/catalogo')} sx={{ mt: 3 }} variant="contained">Volver al catálogo</Button>
      </Container>
    );
  }

  const imagen = producto.imagenes?.find(i => i.principal)?.urlImagen || producto.imagenes?.[0]?.urlImagen;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/catalogo')}
        sx={{ mb: 3, color: 'text.secondary', fontSize: '0.85rem' }}>
        Volver al catálogo
      </Button>

      <Grid container spacing={5}>
        {/* Imágenes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{
            borderRadius: 5, overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
          }}>
            <CardMedia
              component="img"
              height="480"
              image={producto.imagenes?.[imagenActiva]?.urlImagen || imagen || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'}
              alt={producto.nombre}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          {producto.imagenes?.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, overflowX: 'auto', pb: 1 }}>
              {producto.imagenes.map((img, idx) => (
                <CardMedia
                  key={idx} component="img"
                  sx={{
                    width: 72, height: 72, objectFit: 'cover', borderRadius: 2.5, cursor: 'pointer',
                    border: idx === imagenActiva ? `2px solid ${gold}` : '2px solid transparent',
                    opacity: idx === imagenActiva ? 1 : 0.6,
                    transition: 'all 0.2s',
                    '&:hover': { opacity: 1 },
                  }}
                  image={img.urlImagen} onClick={() => setImagenActiva(idx)}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Detalles */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 1 }}>
            {producto.marcaNombre}
          </Typography>
          <Typography variant="h3" sx={{
            fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 2,
            fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.2,
          }}>
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8, fontSize: '0.95rem' }}>
            {producto.descripcion}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Precio */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
            {producto.descuentoPorcentaje > 0 && (
              <>
                <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontWeight: 400 }}>
                  {formatCurrency(producto.precioVenta)}
                </Typography>
                <Chip label={`-${producto.descuentoPorcentaje}%`} sx={{
                  bgcolor: 'rgba(211,47,47,0.08)', color: '#D32F2F', fontWeight: 700,
                }} />
              </>
            )}
          </Box>
          <Typography variant="h4" sx={{
            fontWeight: 700, color: 'primary.main', mb: 4,
            fontFamily: '"Playfair Display", serif', fontSize: { xs: '1.8rem', md: '2.2rem' },
          }}>
            {formatCurrency(producto.descuentoPorcentaje > 0 ? producto.precioConDescuento : producto.precioVenta)}
          </Typography>

          {/* Cantidad */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Cantidad</Typography>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              border: `1px solid ${isDark ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 3, p: 0.5,
            }}>
              <IconButton size="small" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                <Remove fontSize="small" />
              </IconButton>
              <Typography fontWeight={700} sx={{ minWidth: 36, textAlign: 'center', fontSize: '1.1rem' }}>
                {cantidad}
              </Typography>
              <IconButton size="small" onClick={() => setCantidad(cantidad + 1)}>
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Stock */}
          <Chip
            label={producto.stockActual > 0 ? `En stock (${producto.stockActual} disponibles)` : 'Agotado'}
            sx={{
              mb: 4,
              bgcolor: producto.stockActual > 0
                ? (isDark ? 'rgba(46,125,50,0.12)' : 'rgba(46,125,50,0.06)')
                : 'rgba(211,47,47,0.08)',
              color: producto.stockActual > 0 ? '#2E7D32' : '#D32F2F',
              fontWeight: 600,
            }}
          />

          {/* Botones */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button variant="contained" size="large" fullWidth startIcon={<ShoppingCart />}
              onClick={handleAddToCart} disabled={producto.stockActual === 0}
              sx={{ py: 1.4 }}>
              Agregar al Carrito
            </Button>
            <Button variant="contained" size="large" fullWidth startIcon={<WhatsApp />}
              onClick={handleWhatsApp} disabled={producto.stockActual === 0}
              sx={{
                py: 1.4, bgcolor: '#25D366', '&:hover': { bgcolor: '#20BD5A', boxShadow: '0 6px 24px rgba(37,211,102,0.3)' },
              }}>
              Comprar por WhatsApp
            </Button>
          </Box>

          {/* Categoría */}
          {producto.categoriaNombre && (
            <Box sx={{ mt: 3 }}>
              <Chip label={producto.categoriaNombre} variant="outlined" sx={{
                borderColor: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.1)',
                fontWeight: 500,
              }} />
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
