import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, Avatar, Divider, useMediaQuery, useTheme,
  Badge, Menu, MenuItem, Button, Chip, Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Inventory, Assessment,
  Settings, DarkMode, LightMode, Logout, Category, Label, LocalShipping,
  ChevronLeft, ChevronRight, Storefront, PointOfSale, Inventory2
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import logoEros from '../logos/Logo imagen eros de nuit.jpg.jpeg';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Productos', icon: <Inventory />, path: '/admin/productos' },
  { text: 'Categorías', icon: <Category />, path: '/admin/categorias' },
  { text: 'Marcas', icon: <Label />, path: '/admin/marcas' },
  { text: 'Combos', icon: <Inventory2 />, path: '/admin/combos' },
  { text: 'Inventario', icon: <LocalShipping />, path: '/admin/inventario' },
  { text: 'Ventas', icon: <PointOfSale />, path: '/admin/ventas' },
  { text: 'Reportes', icon: <Assessment />, path: '/admin/reportes' },
  { text: 'Configuración', icon: <Settings />, path: '/admin/configuracion' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const handleToggleCollapse = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { logout(); navigate('/'); };

  const renderMenuItems = (isDrawer = false) => (
    <List sx={{ flex: 1, px: collapsed ? 1 : 1.5, py: 2 }}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right" arrow>
            <ListItemButton
              onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
              sx={{
                minHeight: 44,
                justifyContent: collapsed ? 'center' : 'initial',
                borderRadius: 3,
                mb: 0.5,
                px: collapsed ? 1.5 : 2,
                transition: 'all 0.2s ease',
                ...(isActive && {
                  bgcolor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                }),
                '&:hover': {
                  bgcolor: isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: collapsed ? 0 : 40,
                justifyContent: 'center',
                color: 'inherit',
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.88rem' }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Logo + Toggle */}
      <Box sx={{
        px: collapsed ? 1.5 : 2.5, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
        minHeight: 64,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src={logoEros} alt="Eros De Nuit" sx={{ width: 36, height: 36, borderRadius: 1, objectFit: 'contain' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, lineHeight: 1.2, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                EROS DE NUIT
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: 'text.secondary' }}>
                ADMIN PANEL
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Box component="img" src={logoEros} alt="EN" sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'contain' }} />
        )}
        {!isMobile && (
          <Tooltip title={collapsed ? 'Expandir menú' : ''} placement="right" arrow>
            <IconButton onClick={handleToggleCollapse} size="small" sx={{ color: 'text.secondary' }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Menu items */}
      {!isMobile && renderMenuItems()}

      {/* Mobile menu items */}
      {isMobile && (
        <List sx={{ flex: 1, px: 1.5, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 3, mb: 0.5, px: 2, py: 1.2,
                  ...(isActive && {
                    bgcolor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.08)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.88rem' }} />
              </ListItemButton>
            );
          })}
        </List>
      )}

      {/* Footer */}
      <Divider sx={{ mx: isMobile || collapsed ? 1 : 2 }} />
      <Box sx={{ px: isMobile || collapsed ? 1 : 1.5, py: 1.5 }}>
        <Tooltip title={collapsed ? 'Ver Tienda' : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => { navigate('/'); if (isMobile) setMobileOpen(false); }}
            sx={{
              borderRadius: 3, minHeight: 40,
              justifyContent: collapsed ? 'center' : 'initial',
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
              <Storefront fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Ver Tienda" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed" elevation={0}
        sx={{
          bgcolor: isDark ? 'rgba(14,14,20,0.85)' : 'rgba(248,246,240,0.85)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: `1px solid ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.04)'}`,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          transition: 'width 0.3s ease, margin 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Cambiar tema">
            <IconButton onClick={toggleMode} sx={{ color: 'text.secondary', borderRadius: 2, mr: 1 }}>
              {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Chip
              label={user?.nombre || 'Admin'}
              avatar={<Avatar sx={{ bgcolor: 'primary.main', color: 'black', width: 28, height: 28, fontSize: '0.8rem' }}>
                {user?.nombre?.[0] || 'A'}
              </Avatar>}
              variant="outlined"
              sx={{ borderColor: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.1)', fontWeight: 500, fontSize: '0.82rem' }}
            />
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 180 } }}>
            <MenuItem disabled sx={{ opacity: 0.7 }}>
              <Typography variant="caption" color="text.secondary">{user?.correo}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, mx: 0.5, mb: 0.5 }}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
        }}>
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${isDark ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.04)'}`,
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
        open>
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` },
          transition: 'margin 0.3s ease',
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
