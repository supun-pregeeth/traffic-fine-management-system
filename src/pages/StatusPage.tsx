import { Container, Typography } from '@mui/material';

export default function StatusPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Fine Status Checker
      </Typography>
      <Typography color="text.secondary">Lookup your traffic fine status and payment history here.</Typography>
    </Container>
  );
}
