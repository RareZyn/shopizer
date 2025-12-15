import { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    emailAddress: '',
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    billing: {
      country: 'US',
      zone: '',
      city: '',
      address: '',
      postalCode: '',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        billing: { ...prev.billing, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== REGISTRATION FORM SUBMISSION ===');
    console.log('Registration form data:', formData);

    try {
      const result = await register(formData);
      console.log('Registration result:', result);

      if (result.success) {
        console.log('Registration successful, navigating to /products');
        navigate('/products');
      } else {
        console.log('Registration failed:', result.error);
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <h5 className="mb-3">Account Information</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address *</Form.Label>
            <Form.Control
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Password *</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          disabled={loading}
        />
        <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
      </Form.Group>

      <h5 className="mb-3 mt-4">Billing Address</h5>

      <Form.Group className="mb-3">
        <Form.Label>Country *</Form.Label>
        <Form.Select
          name="billing.country"
          value={formData.billing.country}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="MY">Malaysia</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="billing.address"
          value={formData.billing.address}
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="billing.city"
              value={formData.billing.city}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>State/Province</Form.Label>
            <Form.Control
              type="text"
              name="billing.zone"
              value={formData.billing.zone}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="billing.postalCode"
              value={formData.billing.postalCode}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button
        variant="success"
        type="submit"
        disabled={loading}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" />
            Creating Account...
          </>
        ) : (
          "Register"
        )}
      </Button>
    </Form>
  );
};

export default RegisterForm;
