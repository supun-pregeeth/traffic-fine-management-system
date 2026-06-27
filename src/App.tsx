import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Shell from './layout/Shell';
import { theme } from './config/theme';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<Shell />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
