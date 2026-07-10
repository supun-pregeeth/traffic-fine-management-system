import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Paper sx={{ p: 3, boxShadow: 'soft', height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </Paper>
  );
}
