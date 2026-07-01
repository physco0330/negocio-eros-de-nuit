import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

api.interceptors.response.use(
  (response) => {
    const ct = response.headers?.['content-type'] || '';
    if (ct.includes('text/html')) {
      return Promise.reject(new Error('API returned HTML instead of JSON'));
    }
    if (response.config.method === 'get' && response.data != null && !Array.isArray(response.data)) {
      const d = response.data;
      if (Array.isArray(d.content)) response.data = d.content;
      else if (Array.isArray(d.data)) response.data = d.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Productos
export const productosAPI = {
  listar: () => api.get('/productos'),
  obtener: (id) => api.get(`/productos/${id}`),
  buscar: (q) => api.get(`/productos/buscar?q=${encodeURIComponent(q)}`),
  porCategoria: (id) => api.get(`/productos/categoria/${id}`),
  porMarca: (id) => api.get(`/productos/marca/${id}`),
  descuento: () => api.get('/productos/descuento'),
  nuevos: () => api.get('/productos/nuevos'),
  destacados: () => api.get('/productos/destacados'),
  crear: (data) => api.post('/productos', data),
  actualizar: (id, data) => api.put(`/productos/${id}`, data),
  eliminar: (id) => api.delete(`/productos/${id}`),
  agregarImagen: (productoId, url, principal) =>
    api.post(`/productos/${productoId}/imagenes?urlImagen=${url}&principal=${principal}`),
  eliminarImagen: (imagenId) => api.delete(`/productos/imagenes/${imagenId}`),
};

// Inventario
export const inventarioAPI = {
  listar: () => api.get('/inventario'),
  porProducto: (id) => api.get(`/inventario/producto/${id}`),
  registrar: (data) => api.post('/inventario', data),
  dashboard: () => api.get('/inventario/dashboard'),
  productosMasVendidos: () => api.get('/inventario/productos-mas-vendidos'),
  resumenMovimientos: () => api.get('/inventario/resumen-movimientos'),
  bajoStock: () => api.get('/inventario/bajo-stock'),
  agotados: () => api.get('/inventario/agotados'),
};

// Dashboard
export const dashboardAPI = {
  obtener: () => api.get('/dashboard'),
  productosMasVendidos: () => api.get('/dashboard/productos-mas-vendidos'),
  resumenMovimientos: () => api.get('/dashboard/resumen-movimientos'),
};

// Categorias
export const categoriasAPI = {
  listar: () => api.get('/categorias'),
  obtener: (id) => api.get(`/categorias/${id}`),
  crear: (data) => api.post('/categorias', data),
  actualizar: (id, data) => api.put(`/categorias/${id}`, data),
  eliminar: (id) => api.delete(`/categorias/${id}`),
};

// Marcas
export const marcasAPI = {
  listar: () => api.get('/marcas'),
  obtener: (id) => api.get(`/marcas/${id}`),
  crear: (data) => api.post('/marcas', data),
  actualizar: (id, data) => api.put(`/marcas/${id}`, data),
  eliminar: (id) => api.delete(`/marcas/${id}`),
};

// Configuracion
export const configuracionAPI = {
  obtener: () => api.get('/configuracion'),
  actualizar: (data) => api.put('/configuracion', data),
};

// Ventas
export const ventasAPI = {
  listar: () => api.get('/ventas'),
  obtener: (id) => api.get(`/ventas/${id}`),
  porEstado: (estado) => api.get(`/ventas/estado/${estado}`),
  buscar: (cliente) => api.get(`/ventas/buscar?cliente=${encodeURIComponent(cliente)}`),
  crear: (data) => api.post('/ventas', data),
  actualizar: (id, data) => api.put(`/ventas/${id}`, data),
  actualizarEstado: (id, estado) => api.patch(`/ventas/${id}/estado`, { estado }),
  eliminar: (id) => api.delete(`/ventas/${id}`),
  resumen: () => api.get('/ventas/resumen'),
};

// Combos
export const combosAPI = {
  listar: () => api.get('/combos'),
  activos: () => api.get('/combos/activos'),
  obtener: (id) => api.get(`/combos/${id}`),
  crear: (data) => api.post('/combos', data),
  actualizar: (id, data) => api.put(`/combos/${id}`, data),
  eliminar: (id) => api.delete(`/combos/${id}`),
};

export default api;
