import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h1>Welcome to Shopizer</h1>
          <p className="lead">Frontend to test Component Based Engineering -Razin</p>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Browse Products</Card.Title>
              <Card.Text>
                Explore our product catalog, filter by categories, and search for items.
              </Card.Text>
              <Button as={Link} to="/products" variant="primary">
                View Products
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Customer Portal</Card.Title>
              <Card.Text>
                Register or login to place orders, view order history, and manage your profile.
              </Card.Text>
              <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                Login
              </Button>
              <Button as={Link} to="/register" variant="success">
                Register
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Admin Portal</Card.Title>
              <Card.Text>
                Manage products, orders, and customers through the admin dashboard.
              </Card.Text>
              <Button as={Link} to="/admin/login" variant="dark">
                Admin Login
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>API Documentation</Card.Title>
              <Card.Text>
                View the complete Shopizer API documentation via Swagger UI.
              </Card.Text>
              <Button
                href="http://localhost:8080/swagger-ui.html"
                target="_blank"
                variant="outline-secondary"
              >
                Open Swagger UI
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
