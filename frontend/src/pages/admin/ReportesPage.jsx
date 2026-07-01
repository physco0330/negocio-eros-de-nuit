import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Skeleton, Divider, Paper } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, PieChart as PieChartIcon } from '@mui/icons-material';
import { inventarioAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { formatCurrency } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ReportesPage() {
  const [vendidos, setVendidos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vRes, mRes, bsRes] = await Promise.all([
        inventarioAPI.productosMasVendidos(),
        inventarioAPI.resumenMovimientos(),
        inventarioAPI.bajoStock(),
      ]);
      setVendidos(vRes.data);
      setMovimientos(mRes.data);
      setBajoStock(bsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const barData = {
    labels: vendidos.map((v) => v.producto?.substring(0, 20)),
    datasets: [{
      label: 'Unidades',
      data: vendidos.map((v) => v.cantidad),
      backgroundColor: 'rgba(201,168,76,0.65)',
      borderColor: '#C9A84C',
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: '#C9A84C',
    }],
  };

  const tipoData = movimientos.reduce((acc, m) => {
    acc[m.tipo] = (acc[m.tipo] || 0) + m.cantidad;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(tipoData).map(k => k === 'ENTRADA' ? 'Entradas' : k === 'SALIDA' ? 'Salidas' : 'Ajustes'),
    datasets: [{
      data: Object.values(tipoData),
      backgroundColor: ['#4CAF50', '#FF5252', '#FFC107'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const stockColumns = [
    { label: 'Producto', accessor: 'nombre' },
    { label: 'Stock Actual', accessor: 'stockActual' },
    { label: 'Stock Mínimo', accessor: 'stockMinimo' },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
        Reportes
      </Typography>

      {/* Sección: Gráficas */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(201,168,76,0.1)' }}>
            <TrendingUp sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Análisis de Ventas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                  Productos Más Vendidos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                  <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
                ) : vendidos.length > 0 ? (
                  <Box sx={{ height: 280 }}>
                    <Bar data={barData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } },
                        x: { ticks: { maxRotation: 45 }, grid: { display: false } },
                      },
                    }} />
                  </Box>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                    No hay datos de ventas disponibles
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                  Movimientos por Tipo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                  <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
                ) : Object.keys(tipoData).length > 0 ? (
                  <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={doughnutData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 } } },
                      cutout: '55%',
                    }} />
                  </Box>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                    No hay movimientos registrados
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Sección: Inventario Bajo */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,152,0,0.1)' }}>
            <PieChartIcon sx={{ color: 'warning.main', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Estado del Inventario
          </Typography>
        </Box>
        <DataTable
          title=""
          columns={stockColumns}
          data={bajoStock}
          loading={loading}
          searchable={false}
          exportable
          emptyMessage="No hay productos con bajo stock"
        />
      </Paper>
    </Box>
  );
}
