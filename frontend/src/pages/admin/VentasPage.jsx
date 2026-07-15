import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Typography, Alert, Snackbar, Chip,
  IconButton, Avatar, Paper, Divider, Card, CardContent, Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Add, Edit, Delete, ShoppingCart, TrendingUp, Schedule,
  CheckCircle, Cancel, Visibility, Person, Phone, Email, LocalOffer,
  Payments
} from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import { ventasAPI, productosAPI, combosAPI, abonosAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const avatarColors = ['#C9A84C', '#E91E63', '#9C27B0', '#2196F3', '#FF9800', '#4CAF50', '#00BCD4', '#795548'];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const estadoConfig = {
  PENDIENTE: { color: 'warning', icon: <Schedule fontSize="small" />, label: 'Pendiente', bg: 'rgba(255,152,0,0.08)', border: 'rgba(255,152,0,0.25)' },
  EN_PROCESO: { color: 'info', icon: <TrendingUp fontSize="small" />, label: 'En Proceso', bg: 'rgba(33,150,243,0.08)', border: 'rgba(33,150,243,0.25)' },
  FINALIZADA: { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Finalizada', bg: 'rgba(76,175,80,0.08)', border: 'rgba(76,175,80,0.25)' },
  CANCELADA: { color: 'error', icon: <Cancel fontSize="small" />, label: 'Cancelada', bg: 'rgba(244,67,54,0.08)', border: 'rgba(244,67,54,0.25)' },
};

const emptyForm = {
  clienteNombre: '', clienteTelefono: '', clienteEmail: '',
  estado: 'PENDIENTE', observacion: '', detalles: [],
};

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [abonoDialog, setAbonoDialog] = useState(false);
  const [abonoVentaId, setAbonoVentaId] = useState(null);
  const [abonoForm, setAbonoForm] = useState({ monto: '', observacion: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [vRes, pRes, cRes] = await Promise.all([
        ventasAPI.listar(), productosAPI.listar(), combosAPI.activos()
      ]);
      setVentas(toArray(vRes.data));
      setProductos(toArray(pRes.data));
      setCombos(toArray(cRes.data));
    } catch (err) {
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toArray = (d) => Array.isArray(d) ? d : d?.content || d?.data || [];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (venta = null) => {
    if (venta) {
      setEditingId(venta.id);
      setForm({
        clienteNombre: venta.clienteNombre,
        clienteTelefono: venta.clienteTelefono || '',
        clienteEmail: venta.clienteEmail || '',
        estado: venta.estado,
        observacion: venta.observacion || '',
        detalles: venta.detalles?.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })) || [],
      });
    } else {
      setEditingId(null);
      setForm({ ...emptyForm, detalles: [] });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!form.clienteNombre.trim()) {
        showSnackbar('El nombre del cliente es obligatorio', 'error');
        return;
      }
      if (form.detalles.length === 0) {
        showSnackbar('Agrega al menos un producto', 'error');
        return;
      }

      const data = {
        clienteNombre: form.clienteNombre,
        clienteTelefono: form.clienteTelefono,
        clienteEmail: form.clienteEmail,
        estado: form.estado,
        observacion: form.observacion,
        detalles: form.detalles.map(d => {
          const isCombo = String(d.productoId).startsWith('combo-');
          return {
            productoId: isCombo ? null : parseInt(d.productoId),
            comboId: isCombo ? parseInt(String(d.productoId).replace('combo-', '')) : null,
            cantidad: parseInt(d.cantidad),
            precioUnitario: parseFloat(d.precioUnitario),
          };
        }),
      };

      if (editingId) {
        await ventasAPI.actualizar(editingId, data);
        showSnackbar('Venta actualizada correctamente');
      } else {
        await ventasAPI.crear(data);
        showSnackbar('Venta creada correctamente');
      }
      setDialogOpen(false);
      loadAll();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await ventasAPI.eliminar(id);
      showSnackbar('Venta eliminada');
      setDeleteConfirm(null);
      loadAll();
    } catch (err) {
      showSnackbar('Error al eliminar', 'error');
    }
  };

  const handleAbono = async () => {
    try {
      const monto = parseFloat(abonoForm.monto);
      if (!monto || monto <= 0) {
        showSnackbar('Ingresa un monto válido', 'error');
        return;
      }
      await abonosAPI.crear(abonoVentaId, { monto, observacion: abonoForm.observacion });
      showSnackbar('Abono registrado');
      setAbonoDialog(false);
      setAbonoForm({ monto: '', observacion: '' });
      loadAll();
      if (selectedVenta && selectedVenta.id === abonoVentaId) {
        const updated = await ventasAPI.obtener(abonoVentaId);
        setSelectedVenta(updated.data);
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Error al registrar abono', 'error');
    }
  };

  const addDetalle = () => {
    setForm({
      ...form,
      detalles: [...form.detalles, { productoId: '', cantidad: 1, precioUnitario: 0 }],
    });
  };

  const updateDetalle = (index, field, value) => {
    const newDetalles = [...form.detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    if (field === 'productoId') {
      if (String(value).startsWith('combo-')) {
        const comboId = parseInt(String(value).replace('combo-', ''));
        const combo = combos.find(c => c.id === comboId);
        if (combo) newDetalles[index].precioUnitario = combo.precioCombo;
      } else {
        const prod = productos.find(p => p.id === parseInt(value));
        if (prod) newDetalles[index].precioUnitario = prod.precioVenta;
      }
    }
    setForm({ ...form, detalles: newDetalles });
  };

  const removeDetalle = (index) => {
    setForm({ ...form, detalles: form.detalles.filter((_, i) => i !== index) });
  };

  const filteredVentas = filtroEstado
    ? ventas.filter(v => v.estado === filtroEstado)
    : ventas;

  const resumenByEstado = {
    PENDIENTE: ventas.filter(v => v.estado === 'PENDIENTE').length,
    EN_PROCESO: ventas.filter(v => v.estado === 'EN_PROCESO').length,
    FINALIZADA: ventas.filter(v => v.estado === 'FINALIZADA').length,
    CANCELADA: ventas.filter(v => v.estado === 'CANCELADA').length,
  };

  const columns = [
    {
      label: 'Cliente', accessor: 'clienteNombre',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(row.clienteNombre), color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>
            {row.clienteNombre?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>{row.clienteNombre}</Typography>
            {row.clienteTelefono && (
              <Typography variant="caption" color="text.secondary">{row.clienteTelefono}</Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      label: 'Productos', accessor: 'detalles',
      render: (row) => (
        <Typography variant="body2">
          {row.detalles?.length || 0} {(row.detalles?.length || 0) === 1 ? 'producto' : 'productos'}
        </Typography>
      ),
    },
    {
      label: 'Total', accessor: 'total',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>{formatCurrency(row.total)}</Typography>
      ),
    },
    {
      label: 'Abonado', accessor: 'totalAbonado',
      render: (row) => {
        const total = parseFloat(row.total) || 0;
        const abonado = parseFloat(row.totalAbonado) || 0;
        const pct = total > 0 ? Math.min((abonado / total) * 100, 100) : 0;
        return (
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" fontWeight={600} color={pct >= 100 ? 'success.main' : abonado > 0 ? 'info.main' : 'text.secondary'}>
              {formatCurrency(abonado)}
            </Typography>
            <LinearProgress variant="determinate" value={pct} sx={{ mt: 0.5, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: pct >= 100 ? '#4CAF50' : '#2196F3' } }} />
          </Box>
        );
      },
    },
    {
      label: 'Estado', accessor: 'estado',
      render: (row) => {
        const config = estadoConfig[row.estado] || estadoConfig.PENDIENTE;
        return <Chip icon={config.icon} label={config.label} color={config.color} size="small" />;
      },
    },
    {
      label: 'Fecha', accessor: 'fechaVenta',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">{formatDate(row.fechaVenta)}</Typography>
      ),
    },
    {
      label: 'Acciones', accessor: 'acciones', sortable: false,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Ver detalle">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedVenta(row); setDetailOpen(true); }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(row); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row.id); }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Grid container sx={{ mb: 4, gap: 2, justifyContent: 'center' }}>
        {Object.entries(estadoConfig).map(([key, config]) => (
          <Grid key={key} sx={{ flex: { xs: '0 0 calc(50% - 8px)', md: '0 0 calc(25% - 12px)' } }}>
            <Card
              onClick={() => setFiltroEstado(filtroEstado === key ? '' : key)}
              sx={{
                cursor: 'pointer', transition: 'all 0.2s ease', bgcolor: config.bg,
                border: `1px solid ${filtroEstado === key ? config.border : 'transparent'}`,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, border: `1px solid ${config.border}` },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: config.color === 'warning' ? '#FF9800' : config.color === 'info' ? '#2196F3' : config.color === 'success' ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
                      {config.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif', mt: 0.5 }}>
                      {resumenByEstado[key]}
                    </Typography>
                  </Box>
                  <Box sx={{ color: config.color === 'warning' ? '#FF9800' : config.color === 'info' ? '#2196F3' : config.color === 'success' ? '#4CAF50' : '#F44336', opacity: 0.8 }}>
                    {config.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DataTable
        title="Registro de Ventas"
        columns={columns}
        data={filteredVentas}
        loading={loading}
        searchable
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {filtroEstado && (
              <Button variant="outlined" size="small" onClick={() => setFiltroEstado('')} sx={{ textTransform: 'none' }}>
                Limpiar filtro
              </Button>
            )}
            <Button startIcon={<Add />} variant="contained" onClick={() => handleOpen()} sx={{ textTransform: 'none' }}>
              Nueva Venta
            </Button>
          </Box>
        }
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          {editingId ? 'Editar Venta' : 'Nueva Venta'}
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Información del Cliente
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Nombre del Cliente" value={form.clienteNombre}
                    onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Teléfono" value={form.clienteTelefono}
                    onChange={(e) => setForm({ ...form, clienteTelefono: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Email" value={form.clienteEmail}
                    onChange={(e) => setForm({ ...form, clienteEmail: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Estado" value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                    {Object.entries(estadoConfig).map(([key, config]) => (
                      <MenuItem key={key} value={key}>{config.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Observación" value={form.observacion}
                    onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  Productos
                </Typography>
                <Button size="small" startIcon={<Add />} onClick={addDetalle} sx={{ textTransform: 'none' }}>
                  Agregar producto
                </Button>
              </Box>

              {form.detalles.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <ShoppingCart sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay productos agregados.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {form.detalles.map((detalle, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField fullWidth size="small" select label="Producto / Combo"
                            value={detalle.productoId}
                            onChange={(e) => updateDetalle(index, 'productoId', e.target.value)}>
                            <MenuItem value="">Seleccionar...</MenuItem>
                            {combos.length > 0 && (
                              <MenuItem disabled sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'primary.main' }}>
                                COMBOS
                              </MenuItem>
                            )}
                            {combos.map((c) => (
                              <MenuItem key={`combo-${c.id}`} value={`combo-${c.id}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalOffer sx={{ fontSize: 16, color: 'primary.main' }} />
                                  <span>{c.nombre} — {formatCurrency(c.precioCombo)}</span>
                                </Box>
                              </MenuItem>
                            ))}
                            {productos.length > 0 && (
                              <MenuItem disabled sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>
                                PRODUCTOS
                              </MenuItem>
                            )}
                            {productos.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.nombre} — {formatCurrency(p.precioVenta)}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <TextField fullWidth size="small" type="number" label="Cantidad"
                            value={detalle.cantidad}
                            onChange={(e) => updateDetalle(index, 'cantidad', e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <TextField fullWidth size="small" type="number" label="P. Unitario"
                            value={detalle.precioUnitario}
                            onChange={(e) => updateDetalle(index, 'precioUnitario', e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 2 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ pt: 1 }}>
                            {formatCurrency((detalle.cantidad || 0) * (detalle.precioUnitario || 0))}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 1 }}>
                          <IconButton size="small" color="error" onClick={() => removeDetalle(index)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>
                      Total: {formatCurrency(form.detalles.reduce((sum, d) => sum + (d.cantidad || 0) * (d.precioUnitario || 0), 0))}
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
            {editingId ? 'Actualizar' : 'Crear Venta'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
          Detalle de Venta
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          {selectedVenta && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Person sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600}>Cliente</Typography>
                </Box>
                <Typography variant="body2">{selectedVenta.clienteNombre}</Typography>
                {selectedVenta.clienteTelefono && (
                  <Typography variant="body2" color="text.secondary">
                    <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    {selectedVenta.clienteTelefono}
                  </Typography>
                )}
                {selectedVenta.clienteEmail && (
                  <Typography variant="body2" color="text.secondary">
                    <Email sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    {selectedVenta.clienteEmail}
                  </Typography>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Productos</Typography>
                {selectedVenta.detalles?.map((d, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: i < selectedVenta.detalles.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                    <Typography variant="body2">{d.productoNombre} x{d.cantidad}</Typography>
                    <Typography variant="body2" fontWeight={500}>{formatCurrency(d.subtotal)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary">{formatCurrency(selectedVenta.total)}</Typography>
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Payments sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight={600}>Abonos</Typography>
                  </Box>
                  {selectedVenta.estado !== 'CANCELADA' && selectedVenta.estado !== 'FINALIZADA' && (
                    <Button size="small" startIcon={<Add />} onClick={() => { setAbonoVentaId(selectedVenta.id); setAbonoDialog(true); }} sx={{ textTransform: 'none' }}>
                      Abonar
                    </Button>
                  )}
                </Box>
                {selectedVenta.totalAbonado > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Abonado: {formatCurrency(selectedVenta.totalAbonado)}</Typography>
                      <Typography variant="caption" color="text.secondary">Restante: {formatCurrency((selectedVenta.total || 0) - (selectedVenta.totalAbonado || 0))}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(((selectedVenta.totalAbonado || 0) / (selectedVenta.total || 1)) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                  </Box>
                )}
                {(!selectedVenta.detalles || selectedVenta.totalAbonado <= 0) && (
                  <Typography variant="body2" color="text.secondary">Sin abonos registrados</Typography>
                )}
              </Paper>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip icon={estadoConfig[selectedVenta.estado]?.icon} label={estadoConfig[selectedVenta.estado]?.label} color={estadoConfig[selectedVenta.estado]?.color} />
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {formatDate(selectedVenta.fechaVenta)}
                </Typography>
              </Box>

              {selectedVenta.observacion && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>Observación</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedVenta.observacion}</Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: 'none' }}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={abonoDialog} onClose={() => setAbonoDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>Registrar Abono</DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth type="number" label="Monto del Abono" value={abonoForm.monto}
              onChange={(e) => setAbonoForm({ ...abonoForm, monto: e.target.value })} required />
            <TextField fullWidth label="Observación (opcional)" value={abonoForm.observacion}
              onChange={(e) => setAbonoForm({ ...abonoForm, observacion: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAbonoDialog(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleAbono} sx={{ textTransform: 'none' }}>Registrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>¿Eliminar venta?</DialogTitle>
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
