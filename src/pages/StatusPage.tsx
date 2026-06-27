import { Container, Typography, Card, CardContent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import FineDetails from '../components/FineDetails';

export default function StatusPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fine = location.state?.fine;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {fine ? (
        <FineDetails
          fine={fine}
          onProceed={(amount) => navigate('/payment', { state: { fine, amount } })}
          onBack={() => navigate('/')}
          onViewReceipt={() => navigate('/')}
        />
      ) : (
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              No ticket selected. Please search for a fine reference number on the home page.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
