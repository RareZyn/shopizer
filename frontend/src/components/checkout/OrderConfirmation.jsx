import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import { formatPrice, formatDate } from '../../utils/formatters';

const OrderConfirmation = ({ order }) => {
  if (!order) {
    return (
      <Card>
        <Card.Body>
          <p>No order information available.</p>
          <Button as={Link} to="/products" variant="primary">
            Continue Shopping
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body className="text-center">
        <CheckCircleOutlined style={{ fontSize: '64px', color: '#28a745' }} />
        <h2 className="mt-3 mb-4">Order Placed Successfully!</h2>

        <div className="mb-4">
          <h5>Order ID: {order.id || order.orderId}</h5>
          {order.datePurchased && (
            <p className="text-muted">
              Date: {formatDate(order.datePurchased)}
            </p>
          )}
        </div>

        {order.total && (
          <div className="mb-4">
            <h4>Total: {formatPrice(order.total)}</h4>
          </div>
        )}

        {order.status && (
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        )}

        <div className="mt-4">
          <p>
            A confirmation email has been sent to{' '}
            <strong>{order.customer?.emailAddress || order.billing?.email}</strong>
          </p>
        </div>

        <div className="mt-4">
          <Button as={Link} to="/products" variant="primary" className="me-2">
            Continue Shopping
          </Button>
          <Button as={Link} to="/orders" variant="outline-primary">
            View Orders
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderConfirmation;
