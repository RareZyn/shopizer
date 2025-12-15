import { Row, Col, Button, Form } from 'react-bootstrap';
import { DeleteOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/formatters';

const CartItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    onUpdateQuantity(item.sku || item.product?.sku, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.sku || item.product?.sku);
  };

  const productName = item.productName || item.product?.name || 'Product';
  const sku = item.sku || item.product?.sku || '';
  const price = item.price || item.product?.price || 0;
  const quantity = item.quantity || 1;
  const imageUrl = item.image || item.product?.image || 'https://via.placeholder.com/100x100?text=No+Image';
  const subtotal = price * quantity;

  return (
    <Row className="border-bottom py-3 align-items-center">
      <Col xs={2} md={1}>
        <img src={imageUrl} alt={productName} className="img-fluid rounded" />
      </Col>
      <Col xs={10} md={4}>
        <h6 className="mb-1">{productName}</h6>
        {sku && <small className="text-muted">SKU: {sku}</small>}
      </Col>
      <Col xs={6} md={2} className="text-center">
        <strong>{formatPrice(price)}</strong>
      </Col>
      <Col xs={6} md={2}>
        <Form.Control
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={loading}
          size="sm"
        />
      </Col>
      <Col xs={6} md={2} className="text-center">
        <strong>{formatPrice(subtotal)}</strong>
      </Col>
      <Col xs={6} md={1} className="text-center">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleRemove}
          disabled={loading}
        >
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;
