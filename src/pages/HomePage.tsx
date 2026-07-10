import { Box, Container, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
          Sri Lanka Police Traffic Fine System
        </Typography>
        <Typography color="text.secondary">
          Welcome to the public portal. Use the navigation bar to access payment, status, help, and admin sections.
        </Typography>
      </Box>
    </Container>
  );
}
