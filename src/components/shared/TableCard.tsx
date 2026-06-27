import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, Chip } from '@mui/material';

interface TableCardProps {
  title: string;
  rows: any[];
  kind: 'fine' | 'officer' | 'payment';
}

export default function TableCard({ title, rows = [], kind }: TableCardProps) {
  return (
    <Card sx={{ boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                {kind === 'fine' && (
                  <>
                    <TableCell sx={{ fontWeight: 700 }}>Ref Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Driver</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Violation</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </>
                )}
                {kind === 'officer' && (
                  <>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>District</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  </>
                )}
                {kind === 'payment' && (
                  <>
                    <TableCell sx={{ fontWeight: 700 }}>Ref</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  {kind === 'fine' && (
                    <>
                      <TableCell>{row.referenceNumber || row.ref || row.reference}</TableCell>
                      <TableCell>{row.driverName || row.driver}</TableCell>
                      <TableCell>{row.vehicleNumber || row.vehicle}</TableCell>
                      <TableCell>{row.violation || row.description}</TableCell>
                      <TableCell>LKR {row.baseAmount || row.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={(row.status || '').toString().toUpperCase()}
                          color={(row.status || '').toString().toLowerCase() === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </>
                  )}
                  {kind === 'officer' && (
                    <>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email || '—'}</TableCell>
                      <TableCell>{row.role || row.rank || 'OFFICER'}</TableCell>
                      <TableCell>{row.district || '—'}</TableCell>
                      <TableCell>{row.phoneNumber || row.finesIssued || '—'}</TableCell>
                    </>
                  )}
                  {kind === 'payment' && (
                    <>
                      <TableCell>{row.fineReferenceNumber || row.receiptNumber || row.transactionReference || row.ref}</TableCell>
                      <TableCell>{row.paymentMethod || row.method}</TableCell>
                      <TableCell>LKR {row.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={(row.transactionStatus || row.status || 'SUCCESS').toString().toUpperCase()}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.paidAt ? new Date(row.paidAt).toLocaleString('en-GB') : row.date}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
