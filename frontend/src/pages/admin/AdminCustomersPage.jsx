import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomerManagement from '../../components/admin/CustomerManagement';

const AdminCustomersPage = () => {
  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <Card.Body>
          <CustomerManagement />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCustomersPage;
