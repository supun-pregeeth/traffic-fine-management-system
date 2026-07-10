import { Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Area, Cell, ComposedChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { monthlyCollections, violationDistribution, paymentData } from '../../data/mockData';
import ChartCard from '../shared/ChartCard';
import TableCard from '../shared/TableCard';

const monthOrder: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};

export default function DashboardContent() {
  const [dateRange, setDateRange] = useState({ start: '2024-01', end: '2024-12' });

  const filteredMonthlyCollections = useMemo(() => {
    const startMonth = Number(dateRange.start.split('-')[1]);
    const endMonth = Number(dateRange.end.split('-')[1]);
    const from = Math.min(startMonth, endMonth);
    const to = Math.max(startMonth, endMonth);

    return monthlyCollections.filter((item) => {
      const monthNumber = monthOrder[item.month];
      return monthNumber >= from && monthNumber <= to;
    });
  }, [dateRange]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
          Analytics date range:
        </Typography>
        <TextField
          label="Start month"
          type="month"
          value={dateRange.start}
          onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
          size="small"
        />
        <TextField
          label="End month"
          type="month"
          value={dateRange.end}
          onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
          size="small"
        />
      </Stack>
      <Grid container spacing={2}>
        {[
          ['Total Revenue Collected', 'LKR 142.6M', '↑ 12.4% vs last month'],
          ["Today's Collections", 'LKR 847K', '324 transactions'],
          ['Pending Payments', '1,847', '↑ 8.2% this week'],
          ['Completed Transactions', '24,312', '↑ 5.1% this month']
        ].map(([label, value, note]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ boxShadow: 'soft' }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                  {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard title="Monthly Collection Trends" subtitle="Revenue comparison: 2024 vs 2023">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredMonthlyCollections}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `LKR ${value}M`} />
                <Tooltip />
                <Area type="monotone" dataKey="current" stroke="#003366" fill="rgba(0,51,102,0.16)" />
                <Area type="monotone" dataKey="previous" stroke="#c9a227" fill="rgba(201,162,39,0.1)" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard title="Violation Categories" subtitle="Distribution of fine types">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={violationDistribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>
                  {violationDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={['#003366', '#1a7a4a', '#c9a227', '#16a085', '#8e44ad', '#c0392b'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <TableCard title="Recent Fine Transactions" rows={paymentData} kind="payment" />
    </Stack>
  );
}
