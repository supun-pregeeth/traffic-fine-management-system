import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchAllPayments } from '../../api/adminApi';
import TableCard from '../shared/TableCard';

export default function PaymentsOverview() {
  const [paymentData, setPaymentData] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await fetchAllPayments();
        // API returns ApiResponse<List<PaymentResponse>> where data is array
        const payments = response.data?.data ?? [];
        setPaymentData(payments.map((p: any) => ({
          id: p.id,
          reference: p.fineReferenceNumber,
          amount: p.amount,
          method: p.paymentMethod,
          status: p.transactionStatus,
          paidAt: p.paidAt
        })));
      } catch (error) {
        console.error('Unable to load payment records', error);
      }
    }

    loadPayments();
  }, []);

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {[
          ['Completed', '24,312'],
          ['Pending', '1,847'],
          ['Via Visa', '41%'],
          ['Via LankaPay', '34%']
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ boxShadow: 'soft' }}>
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
      <TableCard title="Payment Transactions" rows={paymentData} kind="payment" />
    </Stack>
  );
}
