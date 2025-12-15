import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const AdminLoginPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="border-dark">
            <Card.Header className="bg-dark text-white">
              <Card.Title as="h3" className="text-center mb-0">
                Admin Login
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <LoginForm isAdmin={true} />
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-0">
                  <Link to="/login">Customer Login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLoginPage;
