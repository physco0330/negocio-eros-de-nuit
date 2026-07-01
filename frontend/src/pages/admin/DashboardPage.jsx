import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Skeleton, Alert,
  Chip, Divider, useTheme
} from '@mui/material';
import {
  Inventory, Warning, TrendingDown, AttachMoney,
  ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { dashboardAPI, inventarioAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const statColors = {
  primary: { bg: 'rgba(201,168,76,0.08)', fg: '#C9A84C', border: 'rgba(201,168,76,0.25)' },
  error: { bg: 'rgba(244,67,54,0.08)', fg: '#F44336', border: 'rgba(244,67,54,0.25)' },
  warning: { bg: 'rgba(255,152,0,0.08)', fg: '#FF9800', border: 'rgba(255,152,0,0.25)' },
  success: { bg: 'rgba(76,175,80,0.08)', fg: '#4CAF50', border: 'rgba(76,175,80,0.25)' },
};

const StatCard = ({ title, value, icon, colorKey, subtitle }) => {
  const palette = statColors[colorKey] || statColors.primary;
  return (
    <Card sx={{ height: '100%', bgcolor: palette.bg, border: `1px solid ${palette.border}`, '&:hover': { boxShadow: 3 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" gutterBottom sx={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: palette.fg }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif', lineHeight: 1.2 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5, borderRadius: 3,
              bgcolor: palette.bg,
              color: palette.fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [vendidos, setVendidos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, vendidosRes, movRes] = await Promise.all([
        dashboardAPI.obtener(),
        inventarioAPI.productosMasVendidos(),
        inventarioAPI.resumenMovimientos(),
      ]);
      setDashboard(dashRes.data);
      setVendidos(vendidosRes.data);
      setMovimientos(movRes.data);
    } catch (err) {
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={36} width={180} sx={{ mb: 3, borderRadius: 2 }} />
      <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
          </Grid>
        <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(34% - 16px)' } }}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) return <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>;

  const barData = {
    labels: vendidos.map((v) => v.producto?.substring(0, 18) || ''),
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: vendidos.map((v) => v.cantidad),
        backgroundColor: 'rgba(201,168,76,0.65)',
        borderColor: '#C9A84C',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: '#C9A84C',
      },
    ],
  };

  const entradasSalidas = movimientos.reduce(
    (acc, m) => {
      if (m.tipo === 'ENTRADA') acc.entradas += m.cantidad;
      if (m.tipo === 'SALIDA') acc.salidas += m.cantidad;
      return acc;
    },
    { entradas: 0, salidas: 0 }
  );

  const doughnutData = {
    labels: ['Entradas', 'Salidas'],
    datasets: [
      {
        data: [entradasSalidas.entradas || 0, entradasSalidas.salidas || 0],
        backgroundColor: ['#4CAF50', '#FF5252'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container sx={{ gap: 3, mb: 3 }}>
        <Grid sx={{ flex: { xs: '0 0 calc(50% - 12px)', md: '0 0 calc(25% - 18px)' } }}>
          <StatCard title="Total Productos" value={dashboard?.totalProductos || 0} icon={<Inventory />} colorKey="primary" />
        </Grid>
        <Grid sx={{ flex: { xs: '0 0 calc(50% - 12px)', md: '0 0 calc(25% - 18px)' } }}>
          <StatCard title="Productos Agotados" value={dashboard?.productosAgotados || 0} icon={<Warning />} colorKey="error" />
        </Grid>
        <Grid sx={{ flex: { xs: '0 0 calc(50% - 12px)', md: '0 0 calc(25% - 18px)' } }}>
          <StatCard title="Bajo Stock" value={dashboard?.productosBajoStock || 0} icon={<TrendingDown />} colorKey="warning" />
        </Grid>
        <Grid sx={{ flex: { xs: '0 0 calc(50% - 12px)', md: '0 0 calc(25% - 18px)' } }}>
          <StatCard title="Valor Inventario" value={formatCurrency(dashboard?.valorTotalInventario || 0)} icon={<AttachMoney />} colorKey="success" />
        </Grid>
      </Grid>

      <Grid container sx={{ gap: 4, mt: 2 }}>
        <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66% - 16px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                Productos Más Vendidos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {vendidos.length > 0 ? (
                <Box sx={{ height: 300, mt: 1 }}>
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: theme.palette.mode === 'dark' ? '#1A1A2E' : '#fff',
                          titleColor: theme.palette.mode === 'dark' ? '#F0ECE0' : '#1A1A1A',
                          bodyColor: theme.palette.mode === 'dark' ? '#F0ECE0' : '#1A1A1A',
                          borderColor: '#C9A84C',
                          borderWidth: 1,
                          cornerRadius: 8,
                          padding: 10,
                        },
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } },
                        x: { ticks: { maxRotation: 45 }, grid: { display: false } },
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                  No hay datos de ventas disponibles
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                Entradas vs Salidas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 } },
                    },
                    cutout: '60%',
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip icon={<ArrowUpward />} label={`${entradasSalidas.entradas}`} color="success" size="small" />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>Entradas</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip icon={<ArrowDownward />} label={`${entradasSalidas.salidas}`} color="error" size="small" />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>Salidas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
