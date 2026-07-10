import { Paper, Stack, Typography, Chip, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { statusMeta } from '../../config/theme';
import apiClient from '../../api/client';

type NotificationRow = {
  id: number;
  phoneNumber: string;
  message: string;
  status: string;
  recipientName?: string;
  fineReference?: string;
  sentAt?: string;
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await apiClient.get('/admin/notifications');
        setNotifications(res.data?.data ?? []);
      } catch (err) {
        console.error('Failed to load notification logs', err);
      }
    }
    loadLogs();
  }, []);

  return (
    <Paper sx={{ p: 3, boxShadow: 'soft' }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
        SMS Notification Log
      </Typography>
      <Stack spacing={1.5}>
        {notifications.map((n) => (
          <Paper key={n.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', bgcolor: 'background.default' }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{n.recipientName ?? n.phoneNumber}</Typography>
              <Typography variant="body2" color="text.secondary">
                {n.message}
              </Typography>
            </Box>
            <Chip label={statusMeta[n.status?.toLowerCase()]?.label ?? n.status} color={statusMeta[n.status?.toLowerCase()]?.color ?? 'default'} variant="outlined" />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
