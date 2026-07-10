import { Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchCategoryCollections } from '../../api/adminApi';
import ChartCard from '../shared/ChartCard';
import { useEffect, useState } from 'react';

export default function CategoryAnalytics() {
  const [categoryRevenue, setCategoryRevenue] = useState<Array<{ category: string; revenue: number }>>([]);
  const [distribution, setDistribution] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    async function loadCategoryAnalytics() {
      try {
        const response = await fetchCategoryCollections();
        const data = response.data?.data ?? {};
        const revenueData = Object.entries(data).map(([category, value]) => ({
          category,
          revenue: Number(value ?? 0),
        }));

        setCategoryRevenue(revenueData);
        setDistribution(revenueData.map((item) => ({ name: item.category, value: item.revenue })));
      } catch (error) {
        console.error('Unable to load category analytics', error);
      }
    }

    loadCategoryAnalytics();
  }, []);

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Violation Category Distribution" subtitle="By total revenue per category">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={100}>
                  {distribution.map((_, index) => (
                    <Cell key={index} fill={['#003366', '#1a7a4a', '#c9a227', '#16a085', '#8e44ad', '#c0392b'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Revenue by Category" subtitle="Total amount collected (LKR)">
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
              <TableCell>Revenue (LKR)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryRevenue.map((row) => (
              <TableRow key={row.category}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
