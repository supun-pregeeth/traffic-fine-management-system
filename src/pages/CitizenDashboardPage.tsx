import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Button } from '@mui/material';
import CitizenDashboard from '../components/CitizenDashboard';
import Receipt from '../components/Receipt';
import FineDetails from '../components/FineDetails';

export default function CitizenDashboardPage() {
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState<any>(null);
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptFine, setSelectedReceiptFine] = useState<any>(null);
  const [receiptPaymentInfo, setReceiptPaymentInfo] = useState<any>(null);
  const [selectedDetailsFine, setSelectedDetailsFine] = useState<any>(null);

  useEffect(() => {
    const savedCitizen = localStorage.getItem('citizen-session');
    if (!savedCitizen) {
      navigate('/citizen/login', { replace: true });
      return;
    }
    const citizenData = JSON.parse(savedCitizen);
    setCitizen(citizenData);

    // Fetch driver fines from backend
    fetch(`/api/fines/driver/${citizenData.id}`, {
      headers: {
        'Authorization': `Bearer ${citizenData.token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch fines');
        return res.json();
      })
      .then(body => {
        const data = body.data;
        if (data) {
          const mappedFines = data.map((f: any) => ({
            referenceNumber: f.referenceNumber,
            categoryCode: f.categoryId,
            driverName: f.driverName,
            licenseNumber: citizenData.licenseNumber,
            vehicleNumber: f.vehicleNumber || citizenData.vehicleNumber,
            violation: f.description,
            violationDate: f.issuedAt ? f.issuedAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
            violationTime: f.issuedAt ? f.issuedAt.substring(11, 16) : "12:00",
            location: f.district,
            officerName: f.officerName,
            officerBadge: "PS-88452",
            baseAmount: f.amount,
            lateFee: 0,
            dueDate: f.issuedAt ? new Date(new Date(f.issuedAt).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
            status: f.status.toLowerCase(),
          }));
          setFines(mappedFines);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching driver fines:', err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('citizen-session');
    navigate('/citizen/login');
  };

  const handlePayFine = (fine: any, totalAmount: number) => {
    navigate('/payment', { state: { fine, amount: totalAmount } });
  };

  const handleViewDetails = (fine: any) => {
    setSelectedDetailsFine(fine);
  };

  const handleViewReceipt = (fine: any) => {
    const paymentInfo = {
      receiptNumber: fine.receiptNumber || `REC-${fine.referenceNumber.substring(4)}`,
      paidAt: fine.paidAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      paymentMethod: fine.paymentMethod || 'Visa ending in 4242',
      email: citizen?.email || ''
    };
    setSelectedReceiptFine(fine);
    setReceiptPaymentInfo(paymentInfo);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <p>Loading your profile and ticket records...</p>
      </Container>
    );
  }

  if (!citizen) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {selectedReceiptFine && receiptPaymentInfo ? (
        <Receipt
          fine={selectedReceiptFine}
          payment={receiptPaymentInfo}
          onClose={() => {
            setSelectedReceiptFine(null);
            setReceiptPaymentInfo(null);
          }}
        />
      ) : selectedDetailsFine ? (
        <FineDetails
          fine={selectedDetailsFine}
          onProceed={(amount) => handlePayFine(selectedDetailsFine, amount)}
          onBack={() => setSelectedDetailsFine(null)}
          onViewReceipt={() => handleViewReceipt(selectedDetailsFine)}
        />
      ) : (
        <CitizenDashboard
          citizen={citizen}
          fines={fines}
          onPayFine={handlePayFine}
          onViewDetails={handleViewDetails}
          onViewReceipt={handleViewReceipt}
          onLogout={handleLogout}
        />
      )}
    </Container>
  );
}
