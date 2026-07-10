import { Card, CardContent, Typography } from '@mui/material';

export default function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ p: 2.5, boxShadow: 'soft', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
