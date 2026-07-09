import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, Badge, useMediaQuery, useTheme,
  Divider, Container, Paper, BottomNavigation, BottomNavigationAction,
  Fab, Button, Avatar, Chip
} from '@mui/material';
import {
  Menu as MenuIcon, Home, Storefront, LocalOffer, ShoppingCart,
  ContactMail, DarkMode, LightMode, Close, WhatsApp
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useThemeMode } from '../context/ThemeContext';
import logoEros from '../logos/logo-el-nene.jpeg';

const DRAWER_WIDTH = 280;
const GOLD = '#C9A84C';

const navItems = [
  { text: 'Inicio', icon: <Home />, path: '/' },
  { text: 'Catálogo', icon: <Storefront />, path: '/catalogo' },
  { text: 'Promociones', icon: <LocalOffer />, path: '/promociones' },
  { text: 'Contacto', icon: <ContactMail />, path: '/contacto' },
];

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bottomNav, setBottomNav] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const { mode, toggleMode } = useThemeMode();
  const itemCount = getItemCount();
  const isDark = mode === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const idx = navItems.findIndex(i => i.path === location.pathname);
    if (idx >= 0) setBottomNav(idx);
  }, [location.pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{
        p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isDark
          ? 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(10,10,15,0) 100%)'
          : 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(248,246,240,0) 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={logoEros} alt="El Nene" sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'contain' }} />
          <Box>
            <Typography variant="h6" sx={{
              fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'primary.main',
              lineHeight: 1.2, fontSize: '1.1rem', letterSpacing: '0.05em',
            }}>
              EL NENE
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.55rem', opacity: 0.6, letterSpacing: '0.3em' }}>
              PERFUMERÍA
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 3, mb: 0.5, px: 2, py: 1.2,
                transition: 'all 0.2s ease',
                ...(isActive && {
                  bgcolor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                }),
                '&:hover': {
                  bgcolor: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.95rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItemButton
          onClick={() => { navigate('/admin/dashboard'); setMobileOpen(false); }}
          sx={{ borderRadius: 3, py: 1 }}
        >
          <ListItemText
            primary="Panel Admin"
            primaryTypographyProps={{ textAlign: 'center', fontWeight: 500, fontSize: '0.85rem', color: 'text.secondary' }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled
            ? (isDark ? 'rgba(14,14,20,0.85)' : 'rgba(248,246,240,0.85)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          color: 'text.primary',
          borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.05)'}` : 'none',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 6 }}
            onClick={() => navigate('/')}>
            <Box component="img" src={logoEros} alt="El Nene" sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'contain' }} />
            <Box>
              <Typography variant="h6" sx={{
                fontFamily: '"Playfair Display", serif', fontWeight: 700,
                color: 'primary.main', lineHeight: 1.1, fontSize: '1rem', letterSpacing: '0.05em',
              }}>
                EL NENE
              </Typography>
              <Typography variant="caption" sx={{
                fontSize: '0.5rem', letterSpacing: '0.3em', color: 'text.secondary',
                display: 'block', lineHeight: 1,
              }}>
                PERFUMERÍA
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.88rem',
                    px: 2, py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.04)',
                    },
                    '&::after': isActive ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 2,
                      left: '25%',
                      width: '50%',
                      height: 2,
                      borderRadius: 1,
                      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                    } : {},
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={toggleMode} sx={{
              color: 'text.secondary', borderRadius: 2,
              '&:hover': { color: 'primary.main', bgcolor: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)' },
            }}>
              {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
            <IconButton onClick={() => navigate('/carrito')} sx={{
              color: 'text.secondary', borderRadius: 2,
              '&:hover': { color: 'primary.main', bgcolor: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)' },
            }}>
              <Badge badgeContent={itemCount} sx={{
                '& .MuiBadge-badge': {
                  bgcolor: 'primary.main', color: 'black', fontWeight: 700, fontSize: '0.7rem',
                  minWidth: 18, height: 18,
                },
              }}>
                <ShoppingCart fontSize="small" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, mt: '64px', mb: { xs: '56px', md: 0 } }}>
        <Outlet />
      </Box>

      {isMobile && (
        <Paper elevation={0} sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: theme.zIndex.drawer + 1,
          borderTop: `1px solid ${isDark ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.05)'}`,
          backdropFilter: 'blur(20px)',
          bgcolor: isDark ? 'rgba(14,14,20,0.9)' : 'rgba(248,246,240,0.9)',
        }}>
          <BottomNavigation
            value={bottomNav}
            showLabels
            onChange={(e, newVal) => {
              setBottomNav(newVal);
              navigate(navItems[newVal]?.path || '/carrito');
            }}
            sx={{
              bgcolor: 'transparent',
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                minWidth: 'auto',
                py: 1,
                '&.Mui-selected': { color: 'primary.main' },
              },
            }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction key={item.text} label={item.text} icon={item.icon} />
            ))}
            <BottomNavigationAction
              label="Carrito"
              icon={
                <Badge badgeContent={itemCount} sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: 'primary.main', color: 'black', fontWeight: 700,
                    fontSize: '0.65rem', minWidth: 16, height: 16,
                  },
                }}>
                  <ShoppingCart fontSize="small" />
                </Badge>
              }
              onClick={() => navigate('/carrito')}
            />
          </BottomNavigation>
        </Paper>
      )}

      <Fab
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 28 },
          right: { xs: 16, md: 28 },
          zIndex: 1000,
          bgcolor: '#25D366',
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': { bgcolor: '#20BD5A', transform: 'scale(1.05)' },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        }}
        href="https://wa.me/573012558773"
        target="_blank"
      >
        <WhatsApp sx={{ fontSize: 28 }} />
      </Fab>
    </Box>
  );
}
