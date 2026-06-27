import { Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Area, Cell, ComposedChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { monthlyCollections, violationDistribution, paymentData } from '../../data/mockData';
import ChartCard from '../shared/ChartCard';
import TableCard from '../shared/TableCard';

interface DashboardContentProps {
  analyticsData?: {
    collectionsByDistrict?: Record<string, number>;
    collectionsByCategory?: Record<string, number>;
    revenueSummary?: Record<string, number>;
    grandTotal?: number;
    totalPaidFines?: number;
    totalPendingFines?: number;
  };
  recentPayments?: any[];
}

export default function DashboardContent({ analyticsData, recentPayments }: DashboardContentProps) {
  const [dateRange, setDateRange] = useState({ start: '2026-01', end: '2026-12' });

  // 1. Build Monthly Collection Trends Chart
  const chartData = useMemo(() => {
    if (analyticsData?.revenueSummary && Object.keys(analyticsData.revenueSummary).length > 0) {
      return Object.entries(analyticsData.revenueSummary).map(([month, amount]) => ({
        month,
        current: amount,
        previous: amount * 0.8 // Dummy comparative previous value
      }));
    }
    return monthlyCollections;
  }, [analyticsData]);

  // 2. Build Category Distribution Chart
  const categoryChartData = useMemo(() => {
    if (analyticsData?.collectionsByCategory && Object.keys(analyticsData.collectionsByCategory).length > 0) {
      return Object.entries(analyticsData.collectionsByCategory).map(([category, amount]) => ({
        name: category,
        value: amount
      }));
    }
    return violationDistribution;
  }, [analyticsData]);

  // 3. Setup Stats Cards
  const stats = useMemo(() => {
    const totalRev = analyticsData?.grandTotal != null 
      ? `LKR ${analyticsData.grandTotal.toLocaleString()}` 
      : 'LKR 142.6M';
    const pendingCount = analyticsData?.totalPendingFines != null 
      ? analyticsData.totalPendingFines.toLocaleString() 
      : '1,847';
    const paidCount = analyticsData?.totalPaidFines != null 
      ? analyticsData.totalPaidFines.toLocaleString() 
      : '24,312';

    return [
      { label: 'Total Revenue Collected', value: totalRev, note: 'Real-time database sum' },
      { label: "Today's Collections", value: 'LKR 847K', note: 'Standard daily overview' },
      { label: 'Pending Payments', value: pendingCount, note: 'Fines awaiting settlement' },
      { label: 'Completed Transactions', value: paidCount, note: 'Settled ticket count' }
    ];
  }, [analyticsData]);

  const displayPayments = recentPayments || paymentData;

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {stats.map(({ label, value, note }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ boxShadow: 1 }}>
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
          <ChartCard title="Monthly Collection Trends" subtitle="Revenue comparison">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `LKR ${value}`} />
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
                <Pie data={categoryChartData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#003366', '#1a7a4a', '#c9a227', '#16a085', '#8e44ad', '#c0392b'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      <TableCard title="Recent Fine Transactions" rows={displayPayments} kind="payment" />
    </Stack>
  );
}
