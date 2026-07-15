import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Alert, Snackbar, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { categoriasAPI } from '../../services/api';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { loadCategorias(); }, []);

  const loadCategorias = async () => {
    try {
      const res = await categoriasAPI.listar();
      setCategorias(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al cargar', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    } else {
      setEditingId(null);
      setForm({ nombre: '', descripcion: '' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await categoriasAPI.actualizar(editingId, form);
        setSnackbar({ open: true, message: 'Categoría actualizada', severity: 'success' });
      } else {
        await categoriasAPI.crear(form);
        setSnackbar({ open: true, message: 'Categoría creada', severity: 'success' });
      }
      setDialogOpen(false);
      loadCategorias();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoriasAPI.eliminar(id);
      setSnackbar({ open: true, message: 'Categoría eliminada', severity: 'success' });
      loadCategorias();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
    }
  };

  const columns = [
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
        title="Categorías"
        columns={columns}
        data={categorias}
        loading={loading}
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()}>
            Nueva Categoría
          </Button>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
            <TextField fullWidth label="Nombre de la Categoría" value={form.nombre}
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
