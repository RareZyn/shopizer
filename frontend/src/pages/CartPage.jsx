import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/formatters';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && !cart) {
    return <Loader text="Loading cart..." />;
  }

  if (!cart || itemCount === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Add some products to your cart to get started.</p>
          <Button as={Link} to="/products" variant="primary">
            Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const cartItems = cart.products || cart.items || [];
  const subtotal = cart.subTotal || cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const tax = cart.tax || 0;
  const shipping = cart.shipping || 0;
  const total = cart.total || (subtotal + tax + shipping);

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">Shopping Cart</h2>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <Row className="fw-bold d-none d-md-flex">
                <Col md={1}></Col>
                <Col md={4}>Product</Col>
                <Col md={2} className="text-center">Price</Col>
                <Col md={2}>Quantity</Col>
                <Col md={2} className="text-center">Subtotal</Col>
                <Col md={1}></Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id || item.sku || index}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  loading={loading}
                />
              ))}
            </Card.Body>
          </Card>

          <Button as={Link} to="/products" variant="outline-secondary">
            ← Continue Shopping
          </Button>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              {tax > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <strong>{formatPrice(tax)}</strong>
                </div>
              )}
              {shipping > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <strong>{formatPrice(shipping)}</strong>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5 className="text-primary">{formatPrice(total)}</h5>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
