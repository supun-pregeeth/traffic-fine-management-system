import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent } from '@mui/material';
import CitizenLogin from '../components/CitizenLogin';

export default function CitizenLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const savedCitizen = localStorage.getItem('citizen-session');
    if (savedCitizen) {
      navigate('/citizen/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = (citizenData: any) => {
    localStorage.setItem('citizen-session', JSON.stringify(citizenData));
    navigate('/citizen/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50 py-12">
      <Container maxWidth="sm">
        <Card className="shadow-xl rounded-[28px] border border-slate-200" sx={{ overflow: 'visible' }}>
          <CardContent sx={{ p: 0 }}>
            <CitizenLogin
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => navigate('/')}
            />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
