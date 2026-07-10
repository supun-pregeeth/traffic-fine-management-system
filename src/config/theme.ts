import { createTheme } from '@mui/material/styles';

type StatusMeta = Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }>;

export const statusMeta: StatusMeta = {
  paid: { label: 'Paid', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  failed: { label: 'Failed', color: 'error' },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#f5c518',
    },
  },
});
