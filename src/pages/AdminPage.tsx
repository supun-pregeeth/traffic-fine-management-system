import { useEffect, useState } from 'react';
import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import PublicIcon from '@mui/icons-material/Public';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { finesData, officersData, usersData } from '../data/mockData';
import TableCard from '../components/shared/TableCard';
import DashboardContent from '../components/admin/DashboardContent';
import PaymentsOverview from '../components/admin/PaymentsOverview';
import DistrictAnalytics from '../components/admin/DistrictAnalytics';
import CategoryAnalytics from '../components/admin/CategoryAnalytics';
import ReportsGrid from '../components/admin/ReportsGrid';
import NotificationsPanel from '../components/admin/NotificationsPanel';
import UsersTable from '../components/admin/UsersTable';
import SettingsPanel from '../components/admin/SettingsPanel';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [section, setSection] = useState<'dashboard' | 'fines' | 'payments' | 'districts' | 'categories' | 'officers' | 'reports' | 'notifications' | 'users' | 'settings'>('dashboard');
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const navigate = useNavigate();

  // Real backend integration state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [allFines, setAllFines] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allOfficers, setAllOfficers] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('police-admin-token');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch dashboard analytics
        const analyticsRes = await fetch('/api/admin/analytics/dashboard', { headers });
        const analyticsJson = await analyticsRes.json();
        if (analyticsJson.success && analyticsJson.data) {
          setAnalyticsData(analyticsJson.data);
        }

        // 2. Fetch payments list
        const paymentsRes = await fetch('/api/admin/payments', { headers });
        const paymentsJson = await paymentsRes.json();
        if (paymentsJson.success && paymentsJson.data) {
          setRecentPayments(paymentsJson.data);
        }

        // 3. Fetch all fines
        const finesRes = await fetch('/api/admin/fines', { headers });
        const finesJson = await finesRes.json();
        if (finesJson.success && finesJson.data) {
          setAllFines(finesJson.data);
        }

        // 4. Fetch all users
        const usersRes = await fetch('/api/admin/users', { headers });
        const usersJson = await usersRes.json();
        if (usersJson.success && usersJson.data) {
          setAllUsers(usersJson.data);
        }

        // 5. Fetch officers
        const officersRes = await fetch('/api/admin/users/officers', { headers });
        const officersJson = await officersRes.json();
        if (officersJson.success && officersJson.data) {
          setAllOfficers(officersJson.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin backend data', err);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const adminLinks = [
    ['dashboard', 'Dashboard', <DashboardIcon fontSize="small" />],
    ['fines', 'Fine Management', <DirectionsCarIcon fontSize="small" />],
    ['payments', 'Payments', <PaymentIcon fontSize="small" />],
    ['districts', 'District Analytics', <PublicIcon fontSize="small" />],
    ['categories', 'Category Analytics', <GavelIcon fontSize="small" />],
    ['officers', 'Officers', <VerifiedIcon fontSize="small" />],
    ['reports', 'Reports', <ReceiptLongIcon fontSize="small" />],
    ['notifications', 'Notifications', <NotificationsIcon fontSize="small" />],
    ['users', 'User Management', <AdminPanelSettingsIcon fontSize="small" />],
    ['settings', 'Settings', <VerifiedIcon fontSize="small" />]
  ] as const;

  const sectionTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    fines: 'Fine Management',
    payments: 'Payments',
    districts: 'District Analytics',
    categories: 'Category Analytics',
    officers: 'Officers',
    reports: 'Reports',
    notifications: 'Notifications',
    users: 'User Management',
    settings: 'Settings'
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2.5, boxShadow: 1, position: 'sticky', top: 88 }}>
            <Typography variant="overline" sx={{ color: 'secondary.dark', fontWeight: 800, letterSpacing: 2 }}>
              Admin Portal
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
              Traffic Fine System
            </Typography>
            <Stack spacing={1}>
              {adminLinks.map(([key, label, icon]) => (
                <Button
                  key={key}
                  onClick={() => setSection(key as any)}
                  variant={section === key ? 'contained' : 'text'}
                  color={section === key ? 'primary' : 'inherit'}
                  startIcon={icon}
                  sx={{ justifyContent: 'flex-start', px: 1.5 }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                SP
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={800}>
                  Supt. Premasiri
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Super Admin
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2.5, boxShadow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  {sectionTitles[section]}
                </Typography>
                <Typography color="text.secondary">Operational oversight, analytics, and collections management.</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography color="text.secondary">{currentDate}</Typography>
                <Button variant="outlined" startIcon={<PublicIcon />} onClick={() => navigate('/')}>
                  Public Portal
                </Button>
              </Stack>
            </Paper>
            {section === 'dashboard' && <DashboardContent analyticsData={analyticsData} recentPayments={recentPayments} />}
            {section === 'fines' && <TableCard title="All Traffic Fines" rows={allFines.length > 0 ? allFines : finesData} kind="fine" />}
            {section === 'payments' && <PaymentsOverview recentPayments={recentPayments} />}
            {section === 'districts' && <DistrictAnalytics analyticsData={analyticsData} />}
            {section === 'categories' && <CategoryAnalytics analyticsData={analyticsData} />}
            {section === 'officers' && <TableCard title="Officer Performance Overview" rows={allOfficers.length > 0 ? allOfficers : officersData} kind="officer" />}
            {section === 'reports' && <ReportsGrid />}
            {section === 'notifications' && <NotificationsPanel />}
            {section === 'users' && <UsersTable users={allUsers} />}
            {section === 'settings' && <SettingsPanel />}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
