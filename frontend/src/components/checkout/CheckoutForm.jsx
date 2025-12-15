import { useState } from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import orderService from '../../api/orderService';
import { message } from 'antd';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const CheckoutForm = () => {
  const { isAuthenticated } = useAuth();
  const { cartCode, cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phone: '',
    billing: {
      address: '',
      city: '',
      postalCode: '',
      stateProvince: '',
      country: 'MY',
    },
    delivery: {
      address: '',
      city: '',
      postalCode: '',
      stateProvince: '',
      country: 'MY',
    },
    paymentMethod: 'COD',
    sameAsShipping: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'sameAsShipping') {
      setFormData((prev) => ({ ...prev, sameAsShipping: checked }));
    } else if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        billing: { ...prev.billing, [field]: value },
      }));
    } else if (name.startsWith('delivery.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        delivery: { ...prev.delivery, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate cart total
      const cartItems = cart?.products || cart?.items || [];
      const subtotal = cart?.subTotal || cartItems.reduce((sum, item) => {
        const price = item.price || item.product?.price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
      const tax = cart?.tax || 0;
      const shipping = cart?.shipping || 0;
      const total = cart?.total || (subtotal + tax + shipping);

      // Format amount as string with 2 decimal places
      const amount = total.toFixed(2);

      let orderData;

      if (isAuthenticated) {
        // Authenticated checkout - simpler structure (customer already known)
        orderData = {
          currency: DEFAULT_CURRENCY,
          payment: {
            paymentModule: formData.paymentMethod === 'COD' ? 'cod' : 'stripe',
            paymentType: formData.paymentMethod === 'COD' ? 'cod' : 'creditcard',
            transactionType: 'AUTHORIZECAPTURE',
            amount: amount,
          },
        };
      } else {
        // Anonymous checkout - needs full customer info
        orderData = {
          currency: DEFAULT_CURRENCY,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailAddress: formData.emailAddress,
            phone: formData.phone,
            billing: formData.billing,
          },
          delivery: formData.sameAsShipping ? formData.billing : formData.delivery,
          payment: {
            paymentModule: formData.paymentMethod === 'COD' ? 'cod' : 'stripe',
            paymentType: formData.paymentMethod === 'COD' ? 'cod' : 'creditcard',
            transactionType: 'AUTHORIZECAPTURE',
            amount: amount,
          },
        };
      }

      console.log('=== CHECKOUT SUBMISSION ===');
      console.log('Cart Code:', cartCode);
      console.log('Is Authenticated:', isAuthenticated);
      console.log('Order Data:', JSON.stringify(orderData, null, 2));

      let response;
      if (isAuthenticated) {
        console.log('Using authenticated checkout');
        response = await orderService.checkoutAuthenticated(cartCode, orderData);
      } else {
        console.log('Using anonymous checkout');
        response = await orderService.checkout(cartCode, orderData);
      }

      console.log('Checkout response:', response);
      message.success('Order placed successfully!');
      clearCart();
      navigate('/checkout/confirmation', { state: { order: response } });
    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);

      const errorMessage = error.response?.data?.message || 'Failed to place order';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cartCode) {
    return (
      <Card>
        <Card.Body>
          <p>No items in cart. Please add items before checking out.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <Card.Header>
          <h5>Contact Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h5>Shipping Address</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Address *</Form.Label>
            <Form.Control
              type="text"
              name="billing.address"
              value={formData.billing.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City *</Form.Label>
                <Form.Control
                  type="text"
                  name="billing.city"
                  value={formData.billing.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State/Province</Form.Label>
                <Form.Control
                  type="text"
                  name="billing.stateProvince"
                  value={formData.billing.stateProvince}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Postal Code *</Form.Label>
                <Form.Control
                  type="text"
                  name="billing.postalCode"
                  value={formData.billing.postalCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Country *</Form.Label>
            <Form.Select
              name="billing.country"
              value={formData.billing.country}
              onChange={handleChange}
              required
            >
              <option value="MY">Malaysia</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="SG">Singapore</option>
              <option value="TH">Thailand</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
              <option value="VN">Vietnam</option>
              <option value="AU">Australia</option>
              <option value="NZ">New Zealand</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h5>Payment Method</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Check
              type="radio"
              label="Cash on Delivery (COD)"
              name="paymentMethod"
              value="COD"
              checked={formData.paymentMethod === 'COD'}
              onChange={handleChange}
            />
            <Form.Check
              type="radio"
              label="Credit Card"
              name="paymentMethod"
              value="CREDIT_CARD"
              checked={formData.paymentMethod === 'CREDIT_CARD'}
              onChange={handleChange}
              disabled
            />
            <Form.Text className="text-muted">
              Online payment options coming soon. Currently only COD is available.
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <Button
        type="submit"
        variant="success"
        size="lg"
        className="w-100"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" />
            Placing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </Form>
  );
};

export default CheckoutForm;
