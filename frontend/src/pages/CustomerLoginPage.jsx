import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const CustomerLoginPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center mb-4">
                Customer Login
              </Card.Title>
              <LoginForm isAdmin={false} />
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register">Register here</Link>
                </p>
                <p className="mt-2 mb-0">
                  <Link to="/admin/login">Admin Login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerLoginPage;
