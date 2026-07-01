import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, IconButton, Typography, Alert, Snackbar,
  Chip, Avatar, Divider, Paper
} from '@mui/material';
import { Add, Edit, Delete, Image as ImageIcon } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { productosAPI, categoriasAPI, marcasAPI } from '../../services/api';
import { formatCurrency, getStockStatus } from '../../utils/helpers';

const emptyForm = {
  nombre: '', descripcion: '', categoriaId: '', marcaId: '',
  precioCompra: '', precioVenta: '', descuentoPorcentaje: 0,
  stockActual: 0, stockMinimo: 5,
};

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState(['']);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [pRes, cRes, mRes] = await Promise.all([
        productosAPI.listar(), categoriasAPI.listar(), marcasAPI.listar()
      ]);
      setProductos(pRes.data);
      setCategorias(cRes.data);
      setMarcas(mRes.data);
    } catch (err) {
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (producto = null) => {
    if (producto) {
      setEditingId(producto.id);
      setForm({
        nombre: producto.nombre, descripcion: producto.descripcion || '',
        categoriaId: producto.categoriaId || '', marcaId: producto.marcaId || '',
        precioCompra: producto.precioCompra, precioVenta: producto.precioVenta,
        descuentoPorcentaje: producto.descuentoPorcentaje || 0,
        stockActual: producto.stockActual, stockMinimo: producto.stockMinimo,
      });
      setImageUrls(producto.imagenes?.length > 0 ? producto.imagenes.map(i => i.urlImagen) : ['']);
    } else {
      setEditingId(null);
      setForm(emptyForm);
      setImageUrls(['']);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        precioCompra: parseFloat(form.precioCompra),
        precioVenta: parseFloat(form.precioVenta),
        descuentoPorcentaje: parseFloat(form.descuentoPorcentaje) || 0,
        stockActual: parseInt(form.stockActual),
        stockMinimo: parseInt(form.stockMinimo),
        categoriaId: form.categoriaId || null,
        marcaId: form.marcaId || null,
      };

      let productoRes;
      if (editingId) {
        productoRes = await productosAPI.actualizar(editingId, data);
        showSnackbar('Producto actualizado correctamente');
      } else {
        productoRes = await productosAPI.crear(data);
        showSnackbar('Producto creado correctamente');
      }

      const validUrls = imageUrls.filter((u) => u.trim());
      if (validUrls.length > 0 && productoRes.data?.id) {
        for (let i = 0; i < validUrls.length; i++) {
          await productosAPI.agregarImagen(productoRes.data.id, validUrls[i], i === 0);
        }
      }

      setDialogOpen(false);
      loadAll();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productosAPI.eliminar(id);
      showSnackbar('Producto eliminado');
      setDeleteConfirm(null);
      loadAll();
    } catch (err) {
      showSnackbar('Error al eliminar', 'error');
    }
  };

  const columns = [
    {
      label: 'Producto', accessor: 'nombre',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.imagenes?.find(i => i.principal)?.urlImagen || row.imagenes?.[0]?.urlImagen}
            variant="rounded"
            sx={{ width: 48, height: 48, bgcolor: 'grey.200' }}
          >
            <ImageIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">{row.marcaNombre}</Typography>
          </Box>
        </Box>
      ),
    },
    { label: 'Categoría', accessor: 'categoriaNombre' },
    {
      label: 'Precio Compra', accessor: 'precioCompra',
      render: (row) => formatCurrency(row.precioCompra),
    },
    {
      label: 'Precio Venta', accessor: 'precioVenta',
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{formatCurrency(row.precioVenta)}</Typography>
          {row.descuentoPorcentaje > 0 && (
            <Chip label={`-${row.descuentoPorcentaje}%`} color="error" size="small" sx={{ mt: 0.5 }} />
          )}
        </Box>
      ),
    },
    {
      label: 'Stock', accessor: 'stockActual',
      render: (row) => {
        const status = getStockStatus(row.stockActual, row.stockMinimo);
        return <Chip label={`${row.stockActual}`} color={status.color} size="small" variant="outlined" />;
      },
    },
    {
      label: 'Acciones', accessor: 'acciones', sortable: false,
      render: (row) => (
        <Box>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(row); }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row.id); }}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Productos"
        columns={columns}
        data={productos}
        loading={loading}
        searchable
        selectable
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()}>
            Nuevo Producto
          </Button>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          {editingId ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Sección: Información General */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Información General
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Nombre del Producto" value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline rows={3} label="Descripción" value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Categoría" value={form.categoriaId}
                    onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}>
                    <MenuItem value="">Sin categoría</MenuItem>
                    {categorias.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Marca" value={form.marcaId}
                    onChange={(e) => setForm({ ...form, marcaId: e.target.value })}>
                    <MenuItem value="">Sin marca</MenuItem>
                    {marcas.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* Sección: Precios */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Precios
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth type="number" label="Precio Compra" value={form.precioCompra}
                    onChange={(e) => setForm({ ...form, precioCompra: e.target.value })} required
                    InputProps={{ startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth type="number" label="Precio Venta" value={form.precioVenta}
                    onChange={(e) => setForm({ ...form, precioVenta: e.target.value })} required
                    InputProps={{ startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth type="number" label="Descuento %" value={form.descuentoPorcentaje}
                    onChange={(e) => setForm({ ...form, descuentoPorcentaje: e.target.value })}
                    InputProps={{ endAdornment: <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>%</Typography> }} />
                </Grid>
              </Grid>
            </Paper>

            {/* Sección: Inventario */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Inventario
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Stock Actual" value={form.stockActual}
                    onChange={(e) => setForm({ ...form, stockActual: e.target.value })} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Stock Mínimo" value={form.stockMinimo}
                    onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
                </Grid>
              </Grid>
            </Paper>

            {/* Sección: Imágenes */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Imágenes del Producto
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {imageUrls.map((url, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth size="small"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...imageUrls];
                        newUrls[index] = e.target.value;
                        setImageUrls(newUrls);
                      }}
                    />
                    {index === 0 && <Chip label="Principal" color="primary" size="small" variant="outlined" />}
                    {imageUrls.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => {
                        setImageUrls(imageUrls.filter((_, i) => i !== index));
                      }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button size="small" startIcon={<Add />} onClick={() => setImageUrls([...imageUrls, ''])}
                  sx={{ alignSelf: 'flex-start', textTransform: 'none', mt: 0.5 }}>
                  Agregar otra imagen
                </Button>
              </Box>
            </Paper>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none' }}>
            {editingId ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={() => handleDelete(deleteConfirm)}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
