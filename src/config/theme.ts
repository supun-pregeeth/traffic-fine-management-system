import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0a1931',
      dark: '#050f1e',
      light: '#1f3e72',
    },
    secondary: {
      main: '#f5c043',
      dark: '#c9a227',
      light: '#f7cf70',
    },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export const statusMeta: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  active: { label: 'Active', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  inactive: { label: 'Inactive', color: 'default' },
  failed: { label: 'Failed', color: 'error' },
  success: { label: 'Success', color: 'success' },
  sent: { label: 'Sent', color: 'info' },
  delivered: { label: 'Delivered', color: 'success' },
};
