import { Container } from '@mui/material';
import FineSearch from '../components/FineSearch';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <FineSearch onFineFound={(fine) => {
        navigate('/status', { state: { fine } });
      }} />
    </Container>
  );
}
