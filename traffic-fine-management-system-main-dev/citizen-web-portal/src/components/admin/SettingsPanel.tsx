import { Button, Paper, Stack, Switch, Typography } from '@mui/material';

export default function SettingsPanel() {
  return (
    <Stack spacing={3}>
      {[
        ['SMS Gateway Configuration', 'Dialog Axiata - Primary gateway'],
        ['Payment Gateway Settings', 'Visa, Mastercard, and LankaPay integrations'],
        ['Security & Authentication', 'JWT token expiry, 2FA, and audit logging'],
        ['System Backup', 'Daily backups and secure cloud storage']
      ].map(([title, description]) => (
        <Paper key={title} sx={{ p: 3, boxShadow: 'soft' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Stack spacing={1.5}>
            {['Enable option', 'Review configuration', 'Save changes'].map((label, index) => (
              <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                {index === 0 ? <Switch defaultChecked /> : <Button size="small" variant={index === 2 ? 'contained' : 'outlined'}>{index === 2 ? 'Save' : 'Configure'}</Button>}
              </Stack>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
