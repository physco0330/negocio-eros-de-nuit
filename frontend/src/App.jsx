import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';

import LoginPage from './pages/client/LoginPage';
import HomePage from './pages/client/HomePage';
import CatalogoPage from './pages/client/CatalogoPage';
import ProductoDetallePage from './pages/client/ProductoDetallePage';
import CarritoPage from './pages/client/CarritoPage';
import PromocionesPage from './pages/client/PromocionesPage';
import ContactoPage from './pages/client/ContactoPage';

import DashboardPage from './pages/admin/DashboardPage';
import ProductosPage from './pages/admin/ProductosPage';
import CategoriasPage from './pages/admin/CategoriasPage';
import MarcasPage from './pages/admin/MarcasPage';
import InventarioPage from './pages/admin/InventarioPage';
import VentasPage from './pages/admin/VentasPage';
import CombosPage from './pages/admin/CombosPage';
import ReportesPage from './pages/admin/ReportesPage';
import ConfiguracionPage from './pages/admin/ConfiguracionPage';

function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Client Routes */}
              <Route element={<ClientLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogo" element={<CatalogoPage />} />
                <Route path="/producto/:id" element={<ProductoDetallePage />} />
                <Route path="/carrito" element={<CarritoPage />} />
                <Route path="/promociones" element={<PromocionesPage />} />
                <Route path="/contacto" element={<ContactoPage />} />
              </Route>

              {/* Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="productos" element={<ProductosPage />} />
                <Route path="categorias" element={<CategoriasPage />} />
                <Route path="marcas" element={<MarcasPage />} />
                <Route path="inventario" element={<InventarioPage />} />
                <Route path="ventas" element={<VentasPage />} />
                <Route path="combos" element={<CombosPage />} />
                <Route path="reportes" element={<ReportesPage />} />
                <Route path="configuracion" element={<ConfiguracionPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
