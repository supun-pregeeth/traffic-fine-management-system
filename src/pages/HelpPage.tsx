import { Container, Typography, Card, CardContent } from '@mui/material';

export default function HelpPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ boxShadow: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            Support & Help Desk
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
            If you need assistance with checking your fine status, resolving card payment failures, or correcting driver license discrepancies on the system, please reach out to our dedicated support channels:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            📞 Telephone Help Desk: +94 11 222 2222
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            ✉️ Email Support: support@srilankapolice.com
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            🏢 Address: Police Headquarters, Colombo 11, Sri Lanka
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
