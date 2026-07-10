import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

type TableCardProps = {
  title: string;
  rows: Array<Record<string, any>>;
  kind?: 'fine' | 'payment' | 'officer';
};

export default function TableCard({ title, rows }: TableCardProps) {
  if (!rows?.length) {
    return (
      <Paper sx={{ p: 3, boxShadow: 'soft' }}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">No records available.</Typography>
      </Paper>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <Paper sx={{ p: 2.5, boxShadow: 'soft', overflowX: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
        {title}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ textTransform: 'capitalize' }}>
                {column.replace(/([A-Z])/g, ' $1')}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id ?? index}>
              {columns.map((column) => (
                <TableCell key={column}>{String(row[column] ?? '')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
