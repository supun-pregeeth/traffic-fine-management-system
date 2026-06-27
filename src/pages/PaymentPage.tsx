import { Container, Typography, Card, CardContent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentPortal from '../components/PaymentPortal';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fine = location.state?.fine;
  const amount = location.state?.amount || (fine ? fine.baseAmount : 0);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {fine ? (
        <PaymentPortal
          amount={amount}
          onPaymentSuccess={(transactionData) => {
            // After payment, return to status showing the ticket is paid
            navigate('/status', { state: { fine: { ...fine, status: 'paid', ...transactionData } } });
          }}
          onCancel={() => navigate('/status', { state: { fine } })}
        />
      ) : (
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              No outstanding payment pending.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
