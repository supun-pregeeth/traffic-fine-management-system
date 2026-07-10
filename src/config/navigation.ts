import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const navItems = [
  { path: '/', label: 'Home', icon: DashboardIcon },
  { path: '/payment', label: 'Payment', icon: PaymentIcon },
  { path: '/status', label: 'Status', icon: FactCheckIcon },
  { path: '/help', label: 'Help', icon: HelpIcon },
  { path: '/admin', label: 'Admin', icon: AdminPanelSettingsIcon }
];
