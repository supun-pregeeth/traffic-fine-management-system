import { Grid, Stack, Card, CardContent, Button, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function ReportsGrid() {
  return (
    <Grid container spacing={2.5}>
      {['Daily Collection Report', 'Weekly Report', 'Monthly Report', 'Annual Report', 'District Report', 'Category Report'].map((title) => (
        <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', boxShadow: 'soft' }}>
            <CardContent>
              <ReceiptLongIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
                Downloadable operational summary available in PDF, Excel, or CSV formats.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Button size="small" variant="contained">
                  PDF
                </Button>
                <Button size="small" variant="outlined">
                  Excel
                </Button>
                <Button size="small" variant="outlined">
                  CSV
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
