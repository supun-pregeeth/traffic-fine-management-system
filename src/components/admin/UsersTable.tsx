import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import apiClient from '../../api/client';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  district?: string;
};

export default function UsersTable() {
  const [rows, setRows] = useState<UserRow[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await apiClient.get('/admin/users');
        setRows(res.data?.data ?? []);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    }
    loadUsers();
  }, []);

  return (
    <Paper sx={{ boxShadow: 'soft' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>District</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.phoneNumber ?? '-'}</TableCell>
              <TableCell>{row.district ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
