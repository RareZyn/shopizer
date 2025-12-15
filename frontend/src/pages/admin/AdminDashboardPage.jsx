import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShoppingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const AdminDashboardPage = () => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <ShoppingOutlined style={{ fontSize: '48px', color: '#0d6efd' }} />
              <Card.Title className="mt-3">Product Management</Card.Title>
              <Card.Text>
                Create, edit, and manage your product catalog
              </Card.Text>
              <Link to="/admin/products" className="btn btn-primary">
                Manage Products
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <ShoppingCartOutlined style={{ fontSize: '48px', color: '#198754' }} />
              <Card.Title className="mt-3">Order Management</Card.Title>
              <Card.Text>
                View and process customer orders
              </Card.Text>
              <Link to="/admin/orders" className="btn btn-success">
                Manage Orders
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <UserOutlined style={{ fontSize: '48px', color: '#dc3545' }} />
              <Card.Title className="mt-3">Customer Management</Card.Title>
              <Card.Text>
                View and manage customer information
              </Card.Text>
              <Link to="/admin/customers" className="btn btn-danger">
                Manage Customers
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Quick Links</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>
                  <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer">
                    API Documentation (Swagger)
                  </a>
                </li>
                <li>
                  <Link to="/products">View Store (Customer View)</Link>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;
