import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, Chip, TextField, InputAdornment, Container, MenuItem,
  FormControl, InputLabel, Select, Skeleton, Pagination,
  Drawer, IconButton, useMediaQuery, useTheme, Snackbar, Alert
} from '@mui/material';
import { Search, ShoppingCart, Visibility, FilterList, Close } from '@mui/icons-material';
import { productosAPI, categoriasAPI, marcasAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useThemeMode } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useFetch';

const gold = '#C9A84C';
const ITEMS_PER_PAGE = 12;

export default function CatalogoPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [marcaFilter, setMarcaFilter] = useState('');
  const [page, setPage] = useState(1);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { setPage(1); }, [debouncedSearch, categoriaFilter, marcaFilter]);

  const loadData = async () => {
    try {
      const [pRes, cRes, mRes] = await Promise.all([
        productosAPI.listar(), categoriasAPI.listar(), marcasAPI.listar()
      ]);
      setAllProducts(pRes.data);
      setCategorias(cRes.data);
      setMarcas(mRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredProducts = allProducts.filter((p) => {
    const matchSearch = !debouncedSearch ||
      p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchCategoria = !categoriaFilter || p.categoriaId === categoriaFilter;
    const matchMarca = !marcaFilter || p.marcaId === marcaFilter;
    return matchSearch && matchCategoria && matchMarca;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddToCart = (producto) => {
    addItem(producto);
    setSnackbar({ open: true, message: `${producto.nombre} agregado al carrito`, severity: 'success' });
  };

  const ProductCard = ({ producto }) => {
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
            transform: 'translateY(-6px)',
            boxShadow: isDark ? '0 16px 48px rgba(201,168,76,0.1)' : '0 16px 48px rgba(0,0,0,0.1)',
            '& .card-img': { transform: 'scale(1.05)' },
            '& .card-overlay': { opacity: 1 },
          },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia component="img" height="260"
            image={imagen || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'}
            alt={producto.nombre}
            className="card-img"
            sx={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />
          <Box className="card-overlay" sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)',
            opacity: 0, transition: 'opacity 0.3s',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pb: 2,
          }}>
            <Button size="small" variant="outlined" startIcon={<Visibility />}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', bgcolor: 'rgba(255,255,255,0.08)', fontSize: '0.78rem' }}>
              Ver detalles
            </Button>
          </Box>
          {producto.descuentoPorcentaje > 0 && (
            <Chip label={`-${producto.descuentoPorcentaje}%`} sx={{
              position: 'absolute', top: 10, left: 10, bgcolor: '#D32F2F', color: 'white',
              fontWeight: 700, fontSize: '0.72rem', height: 26, borderRadius: 2,
            }} />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, px: 2, pt: 1.5, pb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.62rem', display: 'block', mb: 0.3 }}>
            {producto.marcaNombre}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, mb: 0.5, fontSize: '0.95rem', lineHeight: 1.3 }}>
            {producto.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.8rem' }}>
            {producto.descripcion}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            {producto.descuentoPorcentaje > 0 && (
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.78rem' }}>
                {formatCurrency(producto.precioVenta)}
              </Typography>
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}>
              {formatCurrency(producto.descuentoPorcentaje > 0 ? producto.precioConDescuento : producto.precioVenta)}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button size="small" variant="contained" fullWidth disabled={producto.stockActual === 0}
            onClick={(e) => { e.stopPropagation(); handleAddToCart(producto); }}
            startIcon={<ShoppingCart sx={{ fontSize: 15 }} />}
            sx={{ py: 0.8, borderRadius: 2, fontSize: '0.8rem' }}>
            Agregar
          </Button>
        </CardActions>
      </Card>
    );
  };

  const FilterPanel = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField fullWidth size="small" placeholder="Buscar productos..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Categoría</InputLabel>
        <Select value={categoriaFilter} label="Categoría" onChange={(e) => setCategoriaFilter(e.target.value)}>
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((c) => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel>Marca</InputLabel>
        <Select value={marcaFilter} label="Marca" onChange={(e) => setMarcaFilter(e.target.value)}>
          <MenuItem value="">Todas</MenuItem>
          {marcas.map((m) => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
        </Select>
      </FormControl>
      {(categoriaFilter || marcaFilter || search) && (
        <Button color="inherit" size="small" onClick={() => { setCategoriaFilter(''); setMarcaFilter(''); setSearch(''); }}>
          Limpiar filtros
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: 'primary.main', mb: 0.5, display: 'block' }}>
          CATÁLOGO COMPLETO
        </Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 0.5 }}>
          Nuestros Productos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explora nuestra selección de perfumes, lociones y productos de belleza.
        </Typography>
      </Box>

      {isMobile && (
        <Button startIcon={<FilterList />} onClick={() => setFilterDrawer(true)}
          variant="outlined" sx={{ mb: 2, borderColor: 'divider' }}>
          Filtros
        </Button>
      )}

      <Grid container spacing={3}>
        {!isMobile && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{
              position: 'sticky', top: 88,
              p: 2.5, borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
              bgcolor: 'background.paper',
            }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Filtros</Typography>
              <FilterPanel />
            </Box>
          </Grid>
        )}
        <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Skeleton variant="rounded" height={400} sx={{ borderRadius: 5 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.82rem' }}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </Typography>
              <Grid container spacing={3}>
                {paginatedProducts.map((p) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                    <ProductCard producto={p} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)}
                    color="primary" size={isMobile ? 'small' : 'medium'}
                    sx={{ '& .MuiPaginationItem-root': { borderRadius: 2 } }}
                  />
                </Box>
              )}
              {filteredProducts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="h5" color="text.secondary" sx={{ fontFamily: '"Playfair Display", serif' }}>
                    No se encontraron productos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Intenta con otros filtros de búsqueda
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
        <Box sx={{ p: 2.5, width: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>Filtros</Typography>
            <IconButton onClick={() => setFilterDrawer(false)} size="small"><Close fontSize="small" /></IconButton>
          </Box>
          <FilterPanel />
        </Box>
      </Drawer>

      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
