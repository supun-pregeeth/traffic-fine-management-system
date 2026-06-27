import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { paymentData } from '../../data/mockData';
import TableCard from '../shared/TableCard';

interface PaymentsOverviewProps {
  recentPayments?: any[];
}

export default function PaymentsOverview({ recentPayments }: PaymentsOverviewProps) {
  const displayPayments = recentPayments && recentPayments.length > 0 ? recentPayments : paymentData;
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {[
          ['Completed', displayPayments.length.toLocaleString()],
          ['Pending', '1,847'],
          ['Via Visa', '41%'],
          ['Via LankaPay', '34%']
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                  {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                  {value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <TableCard title="Payment Transactions" rows={displayPayments} kind="payment" />
    </Stack>
  );
}
