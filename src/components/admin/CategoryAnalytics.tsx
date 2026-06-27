import { Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { categoryRevenue } from '../../data/mockData';
import { finesData } from '../../data/mockData';
import ChartCard from '../shared/ChartCard';

export default function CategoryAnalytics() {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Violation Category Distribution" subtitle="By number of fines issued">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={finesData.map((item) => ({ name: item.violation, value: Number(item.amount.replace(/[^\d]/g, '')) }))} dataKey="value" nameKey="name" outerRadius={100}>
                  {finesData.map((_, index) => (
                    <Cell key={index} fill={['#003366', '#1a7a4a', '#c9a227', '#16a085', '#8e44ad', '#c0392b'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Revenue by Category" subtitle="Total amount collected (LKR M)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryRevenue}>
                <XAxis dataKey="category" tickLine={false} axisLine={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#003366" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
      <Paper sx={{ p: 0, boxShadow: 'soft' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Fines Issued</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Revenue (LKR)</TableCell>
              <TableCell>Avg Fine</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['Speeding', '8,421', '7,102', '1,319', '52,631,250', '7,500'],
              ['Parking Violations', '5,830', '5,210', '620', '17,430,000', '3,000'],
              ['Signal Violations', '4,200', '3,800', '400', '25,200,000', '6,000'],
              ['License Violations', '3,100', '2,700', '400', '31,000,000', '10,000'],
              ['Dangerous Driving', '1,240', '1,100', '140', '24,800,000', '20,000']
            ].map((row) => (
              <TableRow key={row[0]}>
                {row.map((cell) => (
                  <TableCell key={String(cell)}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
