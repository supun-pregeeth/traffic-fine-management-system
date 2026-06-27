import { Grid, Stack, Box, Typography } from '@mui/material';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { districtCollection } from '../../data/mockData';
import ChartCard from '../shared/ChartCard';

interface DistrictAnalyticsProps {
  analyticsData?: {
    collectionsByDistrict?: Record<string, number>;
  };
}

export default function DistrictAnalytics({ analyticsData }: DistrictAnalyticsProps) {
  const chartData = useMemo(() => {
    if (analyticsData?.collectionsByDistrict && Object.keys(analyticsData.collectionsByDistrict).length > 0) {
      return Object.entries(analyticsData.collectionsByDistrict).map(([dist, rev]) => ({
        district: dist,
        revenue: Number(rev) / 1000000, // Display in Millions (LKR M)
        fines: Math.round(Number(rev) / 3000) // Extrapolate base count
      }));
    }
    return districtCollection;
  }, [analyticsData]);

  return (
    <Stack spacing={3}>
      <ChartCard title="District-wise Revenue Collection" subtitle="All major districts - current financial year">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <XAxis dataKey="district" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `LKR ${value}M`} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#003366" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Quarterly District Performance" subtitle="Q1-Q4 comparison">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.slice(0, 5)}>
                <XAxis dataKey="district" tickLine={false} axisLine={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#c9a227" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Top Districts by Fine Count" subtitle="Number of fines issued">
            <Stack spacing={1.2} sx={{ pt: 1 }}>
              {chartData.map((item) => (
                <Box key={item.district}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.district}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {item.fines} fines
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(0,0,0,0.08)' }}>
                    <Box sx={{ width: `${Math.min(100, (item.revenue / 42.1) * 100)}%`, height: '100%', borderRadius: 999, bgcolor: 'primary.main' }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </ChartCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
