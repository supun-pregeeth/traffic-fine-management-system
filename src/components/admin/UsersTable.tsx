import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { usersData } from '../../data/mockData';

interface UsersTableProps {
  users?: any[];
}

const roleColor = (role: string): 'error' | 'warning' | 'success' | 'default' => {
  if (role === 'ADMIN') return 'error';
  if (role === 'OFFICER') return 'warning';
  if (role === 'DRIVER') return 'success';
  return 'default';
};

export default function UsersTable({ users }: UsersTableProps) {
  // Use real backend data if available, fall back to mock
  const rows = users && users.length > 0 ? users : usersData;

  return (
    <Paper sx={{ boxShadow: 1 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>District</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.email || idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={row.role || row.department || '—'}
                  color={roleColor(row.role)}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{row.district || row.department || '—'}</TableCell>
              <TableCell>{row.phoneNumber || '—'}</TableCell>
              <TableCell>
                {row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString('en-GB')
                  : row.status || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
