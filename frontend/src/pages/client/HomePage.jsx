import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, Chip, Skeleton, Container, Paper, IconButton
} from '@mui/material';
import { ShoppingCart, Visibility, Star, ArrowForward, TrendingUp, LocalOffer } from '@mui/icons-material';
import { productosAPI, configuracionAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useThemeMode } from '../../context/ThemeContext';
import logoEros from '../../logos/Logo imagen eros de nuit.jpg.jpeg';

const gold = '#C9A84C';

const ProductCard = ({ producto, navigate, addItem, isDark }) => {
  const imagen = producto.imagenes?.find(i => i.principal)?.urlImagen || producto.imagenes?.[0]?.urlImagen;
  return (
    <Card
      onClick={() => navigate(`/producto/${producto.id}`)}
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer',
        bgcolor: 'background.paper',
        border: `1px solid ${isDark ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.03)'}`,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isDark
            ? '0 20px 60px rgba(201,168,76,0.12)'
            : '0 20px 60px rgba(0,0,0,0.12)',
          '& .card-image': { transform: 'scale(1.05)' },
          '& .card-overlay': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="280"
          image={imagen || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'}
          alt={producto.nombre}
          className="card-image"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <Box className="card-overlay" sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
          opacity: 0, transition: 'opacity 0.3s ease',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pb: 2,
        }}>
          <Button size="small" sx={{
            color: 'white', borderColor: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)', bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderColor: 'white' },
          }} variant="outlined" startIcon={<Visibility />}>
            Ver detalles
          </Button>
        </Box>
        {producto.descuentoPorcentaje > 0 && (
          <Chip
            label={`-${producto.descuentoPorcentaje}%`}
            sx={{
              position: 'absolute', top: 12, left: 12,
              bgcolor: '#D32F2F', color: 'white', fontWeight: 700, fontSize: '0.75rem',
              height: 28, borderRadius: 2,
            }}
          />
        )}
        {producto.stockActual === 0 && (
          <Chip label="Agotado" sx={{
            position: 'absolute', top: 12, right: 12,
            bgcolor: 'rgba(0,0,0,0.7)', color: 'white', fontWeight: 600,
            backdropFilter: 'blur(4px)',
          }} />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, px: 2.5, pt: 2, pb: 1 }}>
        <Typography variant="caption" sx={{
          color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', mb: 0.5, display: 'block',
        }}>
          {producto.marcaNombre}
        </Typography>
        <Typography variant="subtitle1" sx={{
          fontFamily: '"Playfair Display", serif', fontWeight: 600, mb: 0.5,
          lineHeight: 1.3, fontSize: '1rem',
        }}>
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', fontSize: '0.82rem', lineHeight: 1.5,
        }}>
          {producto.descripcion}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          {producto.descuentoPorcentaje > 0 && (
            <Typography variant="body2" sx={{
              textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.8rem',
            }}>
              {formatCurrency(producto.precioVenta)}
            </Typography>
          )}
          <Typography variant="h6" sx={{
            fontWeight: 700, color: 'primary.main', fontSize: '1.1rem',
          }}>
            {formatCurrency(producto.descuentoPorcentaje > 0 ? producto.precioConDescuento : producto.precioVenta)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          disabled={producto.stockActual === 0}
          onClick={(e) => { e.stopPropagation(); addItem(producto); }}
          startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
          sx={{ py: 1, borderRadius: 2, fontSize: '0.82rem' }}
        >
          Agregar al carrito
        </Button>
      </CardActions>
    </Card>
  );
};

export default function HomePage() {
  const [destacados, setDestacados] = useState([]);
  const [nuevos, setNuevos] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [dRes, nRes, cRes] = await Promise.all([
        productosAPI.destacados().catch(() => ({ data: [] })),
        productosAPI.nuevos().catch(() => ({ data: [] })),
        configuracionAPI.obtener().catch(() => ({ data: {} })),
      ]);
      setDestacados(dRes.data);
      setNuevos(nRes.data);
      setConfig(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{
        position: 'relative', height: { xs: '85vh', md: '90vh' }, minHeight: 500,
        backgroundImage: `url(${config?.bannerPrincipal || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400'})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center',
        '&::before': {
          content: '""', position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.85) 100%)'
            : 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)',
        },
        '&::after': {
          content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: isDark
            ? 'linear-gradient(transparent, #0A0A0F)'
            : 'linear-gradient(transparent, #F8F6F0)',
        },
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Box component="img" src={logoEros} alt="Eros De Nuit" sx={{
              width: { xs: 200, md: 320 }, height: 'auto', mb: 4, filter: 'drop-shadow(0 4px 30px rgba(201,168,76,0.3))',
            }} />
            <Typography variant="h1" sx={{
              color: 'white', mb: 2, fontSize: { xs: '2.5rem', md: '4.2rem' },
              lineHeight: 1.1,
            }}>
              El arte de{' '}
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${gold} 0%, #E8D48B 50%, ${gold} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                la elegancia
              </Box>
            </Typography>
            <Typography sx={{
              color: 'rgba(255,255,255,0.7)', mb: 4, fontSize: { xs: '0.95rem', md: '1.15rem' },
              lineHeight: 1.7, mx: 'auto',
            }}>
              Descubre nuestra colección de perfumes y productos de belleza premium.
              Cada fragancia cuenta una historia única.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained" size="large"
                onClick={() => navigate('/catalogo')}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4, py: 1.5, fontSize: '1rem',
                  background: `linear-gradient(135deg, ${gold} 0%, #A68A3E 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, #E8D48B 0%, ${gold} 100%)`,
                    boxShadow: `0 8px 30px rgba(201,168,76,0.4)`,
                  },
                }}
              >
                Explorar Catálogo
              </Button>
              <Button
                variant="outlined" size="large"
                onClick={() => navigate('/promociones')}
                startIcon={<LocalOffer />}
                sx={{
                  px: 4, py: 1.5, fontSize: '1rem',
                  borderColor: 'rgba(255,255,255,0.3)', color: 'white',
                  '&:hover': { borderColor: gold, color: gold, bgcolor: 'rgba(201,168,76,0.05)' },
                }}
              >
                Ver Promociones
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Stats */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 }, justifyContent: 'center', maxWidth: 900, mx: 'auto' }}>
          {[
            { icon: <Star />, label: 'Marcas Premium', value: '+8 Marcas' },
            { icon: <TrendingUp />, label: 'Productos', value: '+10 Productos' },
            { icon: <LocalOffer />, label: 'Descuentos', value: 'Hasta -20%' },
          ].map((stat, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Paper elevation={0} sx={{
                p: 3, textAlign: 'center',
                border: `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.04)'}`,
                borderRadius: 4,
              }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 3, mx: 'auto', mb: 1.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)',
                  color: 'primary.main',
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 0.3 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Destacados */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'primary.main', mb: 0.5, display: 'block' }}>
                SELECCIÓN ESPECIAL
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                Productos Destacados
              </Typography>
            </Box>
            <Button
              onClick={() => navigate('/catalogo')}
              endIcon={<ArrowForward />}
              sx={{ color: 'primary.main', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
            >
              Ver todo
            </Button>
          </Box>
          <Grid container spacing={3}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Skeleton variant="rounded" height={460} sx={{ borderRadius: 5 }} />
                </Grid>
              ))
            ) : (
              (destacados.length > 0 ? destacados : nuevos).slice(0, 4).map(p => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
                  <ProductCard producto={p} navigate={navigate} addItem={addItem} isDark={isDark} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* Nuevos */}
        {nuevos.length > 0 && (
          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', mb: 0.5, display: 'block' }}>
                  RECIENTEMENTE AGREGADOS
                </Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  Lo Nuevo
                </Typography>
              </Box>
              <Button
                onClick={() => navigate('/catalogo')}
                endIcon={<ArrowForward />}
                sx={{ color: 'primary.main', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
              >
                Ver todo
              </Button>
            </Box>
            <Grid container spacing={3}>
              {nuevos.slice(0, 4).map(p => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
                  <ProductCard producto={p} navigate={navigate} addItem={addItem} isDark={isDark} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* CTA WhatsApp */}
        <Paper elevation={0} sx={{
          p: { xs: 4, md: 8 }, borderRadius: 6, textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #141420 0%, #1A1A2E 50%, #141420 100%)'
            : 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 50%, #0D0D0D 100%)',
          border: `1px solid ${isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.1)'}`,
        }}>
          <Box sx={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            borderRadius: '50%', bgcolor: 'rgba(201,168,76,0.05)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
            borderRadius: '50%', bgcolor: 'rgba(201,168,76,0.03)',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ color: 'white', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              ¿Buscas algo{' '}
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${gold}, #E8D48B)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                especial
              </Box>?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, maxWidth: 450, mx: 'auto', fontSize: '1rem' }}>
              Nuestro equipo está listo para asesorarte y encontrar la fragancia perfecta para ti.
            </Typography>
            <Button
              variant="contained" size="large"
              href="https://wa.me/573012558773" target="_blank"
              sx={{
                px: 5, py: 1.5, fontSize: '1rem',
                bgcolor: '#25D366', '&:hover': { bgcolor: '#20BD5A', boxShadow: '0 8px 30px rgba(37,211,102,0.3)' },
              }}
            >
              Contactar por WhatsApp
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
