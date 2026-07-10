import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const loginEmail = email.includes('@') ? email : `${email}@example.com`;
    const ok = await auth.login(loginEmail, password);
    if (ok) {
      navigate(from, { replace: true });
      return;
    }

    setError('Invalid email or password.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50 py-12">
      <Container maxWidth="sm">
        <Card className="shadow-xl rounded-[28px] border border-slate-200">
          <CardContent className="p-10">
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
              Admin Login
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Access the Sri Lanka Police traffic fine administration portal.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin@123"
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained" color="primary" size="large">
                Sign in
              </Button>
            </Box>

            <Box className="mt-6 text-sm text-slate-600">
              <Typography>
                Use <strong>admin</strong> / <strong>Admin@123</strong> to sign in as the Super Admin.
              </Typography>
            </Box>

            <Box className="mt-6 text-center">
              <Button component={Link} to="/" color="inherit">
                Back to public portal
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
