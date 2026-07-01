import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Typography, Alert, Snackbar, IconButton,
  Chip, Card, CardMedia, CardContent, Switch, FormControlLabel,
  Paper, Divider
} from '@mui/material';
import { Add, Edit, Delete, Inventory2, LocalOffer } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { combosAPI, productosAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const emptyForm = {
  nombre: '', descripcion: '', precioCombo: '', imagenUrl: '', activo: true, productos: [],
};

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [cRes, pRes] = await Promise.all([combosAPI.listar(), productosAPI.listar()]);
      setCombos(cRes.data);
      setProductos(pRes.data);
    } catch (err) {
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (combo = null) => {
    if (combo) {
      setEditingId(combo.id);
      setForm({
        nombre: combo.nombre,
        descripcion: combo.descripcion || '',
        precioCombo: combo.precioCombo,
        imagenUrl: combo.imagenUrl || '',
        activo: combo.activo,
        productos: combo.productos?.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })) || [],
      });
    } else {
      setEditingId(null);
      setForm({ ...emptyForm, productos: [{ productoId: '', cantidad: 1 }] });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!form.nombre.trim()) {
        showSnackbar('El nombre del combo es obligatorio', 'error');
        return;
      }
      if (!form.precioCombo) {
        showSnackbar('El precio del combo es obligatorio', 'error');
        return;
      }
      if (form.productos.length === 0) {
        showSnackbar('Agrega al menos un producto', 'error');
        return;
      }

      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precioCombo: parseFloat(form.precioCombo),
        imagenUrl: form.imagenUrl,
        activo: form.activo,
        productos: form.productos.map(p => ({
          productoId: parseInt(p.productoId),
          cantidad: parseInt(p.cantidad),
        })),
      };

      if (editingId) {
        await combosAPI.actualizar(editingId, data);
        showSnackbar('Combo actualizado correctamente');
      } else {
        await combosAPI.crear(data);
        showSnackbar('Combo creado correctamente');
      }
      setDialogOpen(false);
      loadAll();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await combosAPI.eliminar(id);
      showSnackbar('Combo eliminado');
      setDeleteConfirm(null);
      loadAll();
    } catch (err) {
      showSnackbar('Error al eliminar', 'error');
    }
  };

  const addProducto = () => {
    setForm({ ...form, productos: [...form.productos, { productoId: '', cantidad: 1 }] });
  };

  const updateProducto = (index, field, value) => {
    const newProd = [...form.productos];
    newProd[index] = { ...newProd[index], [field]: value };
    setForm({ ...form, productos: newProd });
  };

  const removeProducto = (index) => {
    setForm({ ...form, productos: form.productos.filter((_, i) => i !== index) });
  };

  const getPrecioIndividual = (combo) => {
    return combo.productos?.reduce((sum, p) => sum + (p.productoPrecio || 0) * (p.cantidad || 1), 0) || 0;
  };

  const columns = [
    {
      label: 'Combo', accessor: 'nombre',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(201,168,76,0.1)' }}>
            <LocalOffer sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.nombre}</Typography>
            {row.descripcion && (
              <Typography variant="caption" color="text.secondary">{row.descripcion}</Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      label: 'Productos', accessor: 'productos',
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.productos?.map((p, i) => (
            <Chip key={i} label={`${p.productoNombre} x${p.cantidad}`} size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      label: 'Precio Individual', accessor: 'precioIndividual',
      render: (row) => (
        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
          {formatCurrency(getPrecioIndividual(row))}
        </Typography>
      ),
    },
    {
      label: 'Precio Combo', accessor: 'precioCombo',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="primary">
          {formatCurrency(row.precioCombo)}
        </Typography>
      ),
    },
    {
      label: 'Estado', accessor: 'activo',
      render: (row) => (
        <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'default'} size="small" />
      ),
    },
    {
      label: 'Acciones', accessor: 'acciones', sortable: false,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
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
        title="Combos de Venta"
        columns={columns}
        data={combos}
        loading={loading}
        searchable
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()}>
            Nuevo Combo
          </Button>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          {editingId ? 'Editar Combo' : 'Nuevo Combo'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Información del Combo
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Nombre del Combo" value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Precio del Combo" value={form.precioCombo}
                    onChange={(e) => setForm({ ...form, precioCombo: e.target.value })} required
                    InputProps={{ startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography> }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Descripción" value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField fullWidth label="URL de Imagen" value={form.imagenUrl}
                    onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                    placeholder="https://ejemplo.com/combo.jpg" />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControlLabel
                    control={<Switch checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />}
                    label="Activo"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  Productos del Combo
                </Typography>
                <Button size="small" startIcon={<Add />} onClick={addProducto} sx={{ textTransform: 'none' }}>
                  Agregar producto
                </Button>
              </Box>

              {form.productos.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <Inventory2 sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay productos agregados.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {form.productos.map((detalle, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid size={{ xs: 12, sm: 7 }}>
                          <TextField fullWidth size="small" select label="Producto"
                            value={detalle.productoId}
                            onChange={(e) => updateProducto(index, 'productoId', e.target.value)}>
                            <MenuItem value="">Seleccionar...</MenuItem>
                            {productos.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.nombre} — {formatCurrency(p.precioVenta)}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField fullWidth size="small" type="number" label="Cantidad"
                            value={detalle.cantidad}
                            onChange={(e) => updateProducto(index, 'cantidad', e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <IconButton size="small" color="error" onClick={() => removeProducto(index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Precio individual:</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ textDecoration: 'line-through' }}>
                      {formatCurrency(form.productos.reduce((sum, d) => {
                        const prod = productos.find(p => p.id === parseInt(d.productoId));
                        return sum + (prod?.precioVenta || 0) * (d.cantidad || 1);
                      }, 0))}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none' }}>
            {editingId ? 'Actualizar Combo' : 'Crear Combo'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>¿Eliminar combo?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={() => handleDelete(deleteConfirm)} sx={{ textTransform: 'none' }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
