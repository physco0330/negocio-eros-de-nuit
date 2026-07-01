import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Typography, Alert, Snackbar, Chip,
  Paper, Divider
} from '@mui/material';
import { Add, Input, Output, Tune } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { inventarioAPI, productosAPI } from '../../services/api';
import { formatDate, getStockStatus } from '../../utils/helpers';

export default function InventarioPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    productoId: '', tipoMovimiento: 'ENTRADA', cantidad: '', observacion: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        inventarioAPI.listar(), productosAPI.listar()
      ]);
      setMovimientos(movRes.data);
      setProductos(prodRes.data);
    } catch (err) {
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRegistrar = async () => {
    try {
      await inventarioAPI.registrar({
        ...form,
        cantidad: parseInt(form.cantidad),
        productoId: parseInt(form.productoId),
      });
      showSnackbar('Movimiento registrado correctamente');
      setDialogOpen(false);
      setForm({ productoId: '', tipoMovimiento: 'ENTRADA', cantidad: '', observacion: '' });
      loadData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al registrar', 'error');
    }
  };

  const columns = [
    { label: 'Fecha', accessor: 'fecha', render: (row) => formatDate(row.fecha) },
    { label: 'Producto', accessor: 'productoNombre' },
    {
      label: 'Tipo', accessor: 'tipoMovimiento',
      render: (row) => {
        const config = {
          ENTRADA: { color: 'success', icon: <Input fontSize="small" /> },
          SALIDA: { color: 'error', icon: <Output fontSize="small" /> },
          AJUSTE: { color: 'warning', icon: <Tune fontSize="small" /> },
        };
        const c = config[row.tipoMovimiento] || config.ENTRADA;
        return <Chip icon={c.icon} label={row.tipoMovimiento} color={c.color} size="small" />;
      },
    },
    { label: 'Cantidad', accessor: 'cantidad' },
    { label: 'Observación', accessor: 'observacion' },
  ];

  return (
    <Box>
      <DataTable
        title="Entradas de Mercancía"
        columns={columns}
        data={movimientos}
        loading={loading}
        searchable
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => setDialogOpen(true)}>
            Registrar Movimiento
          </Button>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          Registrar Movimiento de Inventario
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 0.5 }}>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Detalle del Movimiento
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth select label="Producto" value={form.productoId}
                    onChange={(e) => setForm({ ...form, productoId: e.target.value })} required>
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre} — Stock actual: {p.stockActual}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Tipo de Movimiento" value={form.tipoMovimiento}
                    onChange={(e) => setForm({ ...form, tipoMovimiento: e.target.value })}>
                    <MenuItem value="ENTRADA">
                      <Chip label="ENTRADA" color="success" size="small" sx={{ mr: 1 }} />Entrada
                    </MenuItem>
                    <MenuItem value="SALIDA">
                      <Chip label="SALIDA" color="error" size="small" sx={{ mr: 1 }} />Salida
                    </MenuItem>
                    <MenuItem value="AJUSTE">
                      <Chip label="AJUSTE" color="warning" size="small" sx={{ mr: 1 }} />Ajuste
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Cantidad" value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })} required />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Observación
              </Typography>
              <TextField fullWidth multiline rows={3} label="Nota sobre el movimiento (opcional)" value={form.observacion}
                onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
            </Paper>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrar} sx={{ textTransform: 'none' }}>
            Registrar Movimiento
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
