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
                    <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>District</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fines Issued</TableCell>
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
                          label={(row.status || '').toUpperCase()} 
                          color={row.status === 'paid' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                    </>
                  )}
                  {kind === 'officer' && (
                    <>
                      <TableCell>{row.badgeNumber || row.badge}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.rank || 'Inspector'}</TableCell>
                      <TableCell>{row.district || 'Colombo'}</TableCell>
                      <TableCell>{row.finesIssued || row.count || 0}</TableCell>
                    </>
                  )}
                  {kind === 'payment' && (
                    <>
                      <TableCell>{row.receiptNumber || row.transactionReference || row.ref}</TableCell>
                      <TableCell>{row.paymentMethod || row.method}</TableCell>
                      <TableCell>LKR {row.amount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={(row.status || row.transactionStatus || 'SUCCESS').toUpperCase()} 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{row.paidAt || row.date}</TableCell>
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
