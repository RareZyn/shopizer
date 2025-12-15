import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductManagement from '../../components/admin/ProductManagement';

const AdminProductsPage = () => {
  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <Link to="/admin" className="btn btn-outline-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <Card.Body>
          <ProductManagement />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminProductsPage;
