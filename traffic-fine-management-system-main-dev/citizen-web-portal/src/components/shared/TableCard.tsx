import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { statusMeta } from '../../config/theme';

interface TableCardProps {
  title: string;
  rows: any[];
  kind: 'fine' | 'officer' | 'payment';
}

export default function TableCard({ title, rows = [], kind }: TableCardProps) {
  return (
    <Paper sx={{ p: 3, boxShadow: 'soft' }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {kind === 'fine' && (
                <>
                  <TableCell>Ref Number</TableCell>
                  <TableCell>Driver Name</TableCell>
                  <TableCell>Violation</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
              {kind === 'officer' && (
                <>
                  <TableCell>Badge</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell align="right">Fines Issued</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                </>
              )}
              {kind === 'payment' && (
                <>
                  <TableCell>Ref Number</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Paid At</TableCell>
                  <TableCell>Status</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {kind === 'fine' && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>{row.referenceNumber}</TableCell>
                    <TableCell>{row.driverName}</TableCell>
                    <TableCell>{row.violation}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={statusMeta[row.status]?.label || row.status} 
                        color={statusMeta[row.status]?.color || 'default'} 
                        variant="outlined" 
                      />
                    </TableCell>
                  </>
                )}
                {kind === 'officer' && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>{row.badge}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.district}</TableCell>
                    <TableCell align="right">{row.issuedCount}</TableCell>
                    <TableCell align="right">{row.revenue}</TableCell>
                  </>
                )}
                {kind === 'payment' && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>{row.referenceNumber}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.paymentMethod}</TableCell>
                    <TableCell>{row.paidAt}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={statusMeta[row.status]?.label || row.status} 
                        color={statusMeta[row.status]?.color || 'default'} 
                        variant="outlined" 
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
