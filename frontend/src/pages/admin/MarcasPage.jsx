import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Alert, Snackbar, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { marcasAPI } from '../../services/api';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { loadMarcas(); }, []);

  const loadMarcas = async () => {
    try {
      const res = await marcasAPI.listar();
      setMarcas(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al cargar', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (marca = null) => {
    if (marca) {
      setEditingId(marca.id);
      setForm({ nombre: marca.nombre, descripcion: marca.descripcion || '' });
    } else {
      setEditingId(null);
      setForm({ nombre: '', descripcion: '' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await marcasAPI.actualizar(editingId, form);
        setSnackbar({ open: true, message: 'Marca actualizada', severity: 'success' });
      } else {
        await marcasAPI.crear(form);
        setSnackbar({ open: true, message: 'Marca creada', severity: 'success' });
      }
      setDialogOpen(false);
      loadMarcas();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await marcasAPI.eliminar(id);
      setSnackbar({ open: true, message: 'Marca eliminada', severity: 'success' });
      loadMarcas();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
    }
  };

  const columns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Nombre', accessor: 'nombre' },
    { label: 'Descripción', accessor: 'descripcion' },
    {
      label: 'Acciones', accessor: 'acciones', sortable: false,
      render: (row) => (
        <Box>
          <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Marcas"
        columns={columns}
        data={marcas}
        loading={loading}
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()}>
            Nueva Marca
          </Button>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          {editingId ? 'Editar Marca' : 'Nueva Marca'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
            <TextField fullWidth label="Nombre de la Marca" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <TextField fullWidth multiline rows={3} label="Descripción (opcional)" value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none' }}>
            {editingId ? 'Actualizar' : 'Crear'}
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
