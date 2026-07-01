import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, Chip, Container, Skeleton
} from '@mui/material';
import { ShoppingCart, Visibility, LocalOffer } from '@mui/icons-material';
import { productosAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useThemeMode } from '../../context/ThemeContext';

const gold = '#C9A84C';

export default function PromocionesPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    productosAPI.descuento().then((res) => setProductos(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box sx={{
        py: { xs: 6, md: 10 }, textAlign: 'center',
        background: isDark
          ? 'linear-gradient(135deg, rgba(211,47,47,0.05) 0%, rgba(10,10,15,0) 50%, rgba(201,168,76,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(211,47,47,0.03) 0%, rgba(248,246,240,0) 50%, rgba(201,168,76,0.03) 100%)',
      }}>
        <Container maxWidth="md">
          <Chip icon={<LocalOffer sx={{ fontSize: 14, color: '#D32F2F' }} />} label="OFERTAS ESPECIALES"
            sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.06)', color: '#D32F2F', fontWeight: 600, fontSize: '0.7rem', border: '1px solid rgba(211,47,47,0.12)' }} />
          <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Promociones
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Aprovecha nuestros descuentos exclusivos en productos seleccionados.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Skeleton variant="rounded" height={400} sx={{ borderRadius: 5 }} />
              </Grid>
            ))}
          </Grid>
        ) : productos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <LocalOffer sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ fontFamily: '"Playfair Display", serif' }}>
              No hay promociones disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Vuelve pronto para ver nuestras ofertas
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {productos.map((p) => {
              const imagen = p.imagenes?.find(i => i.principal)?.urlImagen || p.imagenes?.[0]?.urlImagen;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
                  <Card
                    onClick={() => navigate(`/producto/${p.id}`)}
                    sx={{
                      height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                      border: `1px solid ${isDark ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.03)'}`,
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: isDark ? '0 16px 48px rgba(201,168,76,0.1)' : '0 16px 48px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia component="img" height="260"
                        image={imagen || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'}
                        alt={p.nombre} sx={{ objectFit: 'cover' }} />
                      <Chip label={`-${p.descuentoPorcentaje}%`} sx={{
                        position: 'absolute', top: 10, left: 10, bgcolor: '#D32F2F', color: 'white',
                        fontWeight: 700, fontSize: '0.72rem', height: 26, borderRadius: 2,
                      }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, px: 2, pt: 1.5, pb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.62rem', display: 'block', mb: 0.3 }}>
                        {p.marcaNombre}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '0.95rem' }}>
                        {p.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.78rem' }}>
                          {formatCurrency(p.precioVenta)}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(p.precioConDescuento)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Button size="small" variant="contained" fullWidth
                        onClick={(e) => { e.stopPropagation(); addItem(p); }}
                        startIcon={<ShoppingCart sx={{ fontSize: 15 }} />}
                        sx={{ py: 0.8, borderRadius: 2, fontSize: '0.8rem' }}>
                        Agregar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
