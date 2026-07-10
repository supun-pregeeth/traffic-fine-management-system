import { Container, Typography } from '@mui/material';

export default function PaymentPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Payment Portal
      </Typography>
      <Typography color="text.secondary">This page is coming soon for public fine payment access.</Typography>
    </Container>
  );
}
