import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CheckoutPage = () => {
  const location = useLocation();
  const { cart } = useCart();
  const order = location.state?.order;

  // If we have an order in state, show confirmation
  if (order) {
    return (
      <Container className="mt-4 mb-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <OrderConfirmation order={order} />
          </Col>
        </Row>
      </Container>
    );
  }

  const cartItems = cart?.products || cart?.items || [];
  const subtotal = cart?.subTotal || cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const total = cart?.total || subtotal;

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">Checkout</h2>

      <Row>
        <Col lg={8}>
          <CheckoutForm />
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </small>
              </div>

              {cartItems.map((item, index) => {
                const productName = item.productName || item.product?.name || 'Product';
                const quantity = item.quantity || 1;
                const price = item.price || item.product?.price || 0;

                return (
                  <div key={index} className="d-flex justify-content-between mb-2 small">
                    <span>
                      {productName} x{quantity}
                    </span>
                    <span>{formatPrice(price * quantity)}</span>
                  </div>
                );
              })}

              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5 className="text-primary">{formatPrice(total)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
