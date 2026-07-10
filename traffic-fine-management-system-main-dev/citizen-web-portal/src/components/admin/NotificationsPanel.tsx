import { Paper, Stack, Typography, Chip, Box } from '@mui/material';
import { statusMeta } from '../../config/theme';

export default function NotificationsPanel() {
  const notifications = [
    ['PC Samantha Fernando', 'Payment confirmation SMS sent - TF-2024-0087432', 'paid'],
    ['SGT Anil Wickrama', 'Payment confirmation SMS sent - TF-2024-0087391', 'paid'],
    ['PC Ravi Murugesan', 'SMS delivery failed - TF-2024-0087372 - Invalid number', 'failed'],
    ['INS Nirmala Peris', 'Payment confirmation SMS sent - TF-2024-0087350', 'paid']
  ] as const;

  return (
    <Paper sx={{ p: 3, boxShadow: 'soft' }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
        SMS Notification Log
      </Typography>
      <Stack spacing={1.5}>
        {notifications.map(([officer, message, status]) => (
          <Paper key={message} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', bgcolor: 'background.default' }}>
            <Box>
              <Typography fontWeight={800}>{officer}</Typography>
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            </Box>
            <Chip label={statusMeta[status].label} color={statusMeta[status].color} variant="outlined" />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
