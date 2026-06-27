import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: <HomeIcon fontSize="small" />,
  },
  {
    path: '/payment',
    label: 'Payment',
    icon: <PaymentIcon fontSize="small" />,
  },
  {
    path: '/status',
    label: 'Status',
    icon: <SearchIcon fontSize="small" />,
  },
  {
    path: '/help',
    label: 'Help',
    icon: <HelpIcon fontSize="small" />,
  },
];
