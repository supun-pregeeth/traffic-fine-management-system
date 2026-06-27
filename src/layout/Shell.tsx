import { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography
} from '@mui/material';
import HomePage from '../pages/HomePage';
import PaymentPage from '../pages/PaymentPage';
import StatusPage from '../pages/StatusPage';
import HelpPage from '../pages/HelpPage';
import AdminPage from '../pages/AdminPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import { navItems } from '../config/navigation';
import { useAuth } from '../context/AuthContext';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function Shell({ defaultTab = 'home' }: { defaultTab?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const activeTab = useMemo(() => {
    if (location.pathname.startsWith('/payment')) return 'payment';
    if (location.pathname.startsWith('/status')) return 'status';
    if (location.pathname.startsWith('/help')) return 'help';
    if (location.pathname.startsWith('/admin')) return 'admin';
    return defaultTab;
  }, [defaultTab, location.pathname]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.dark', borderBottom: '3px solid', borderColor: 'secondary.main' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'secondary.main', color: 'primary.dark', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
              SLP
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Sri Lanka Police
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Traffic Fine System
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                variant={activeTab === item.label.toLowerCase() ? 'contained' : 'text'}
                color={activeTab === item.label.toLowerCase() ? 'secondary' : 'inherit'}
                sx={{ color: 'rgba(255,255,255,0.88)', '&.MuiButton-contained': { color: 'primary.dark' } }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {auth.user ? (
            <Button variant="contained" color="secondary" onClick={() => { auth.logout(); navigate('/'); }} sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 700 }}>
              Logout
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={() => navigate('/admin/login')} sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 700 }}>
              Admin Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}
