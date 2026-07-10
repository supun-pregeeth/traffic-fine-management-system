import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { usersData } from '../../data/mockData';
import { statusMeta } from '../../config/theme';

export default function UsersTable() {
  return (
    <Paper sx={{ boxShadow: 'soft' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((row) => (
            <TableRow key={row.email}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <Chip size="small" label={statusMeta[row.status].label} color={statusMeta[row.status].color} variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
