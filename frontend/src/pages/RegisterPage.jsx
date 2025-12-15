import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="text-center mb-4">
                Create Account
              </Card.Title>
              <RegisterForm />
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
