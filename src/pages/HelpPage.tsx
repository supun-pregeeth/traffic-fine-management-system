import { Container, Typography } from '@mui/material';

export default function HelpPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Support & Help
      </Typography>
      <Typography color="text.secondary">Need assistance? Contact support for traffic fine inquiries and administrative access.</Typography>
    </Container>
  );
}
