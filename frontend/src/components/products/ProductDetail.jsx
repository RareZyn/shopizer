import { useState } from 'react';
import { Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const price = product.finalPrice || product.price || 0;
  const imageUrl = product.image || product.images?.[0]?.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <Row>
      <Col md={6}>
        <img
          src={imageUrl}
          alt={product.name}
          className="img-fluid rounded"
          style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
        />
      </Col>
      <Col md={6}>
        <h2>{product.name}</h2>

        {product.sku && (
          <p className="text-muted">
            <strong>SKU:</strong> {product.sku}
          </p>
        )}

        {product.available !== undefined && (
          <p>
            <Badge bg={product.available ? 'success' : 'danger'}>
              {product.available ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </p>
        )}

        <h3 className="text-primary mb-4">{formatPrice(price)}</h3>

        {product.description && (
          <div className="mb-4">
            <h5>Description</h5>
            <p>{product.description.description || product.description}</p>
          </div>
        )}

        {product.manufacturer && (
          <p>
            <strong>Brand:</strong> {product.manufacturer}
          </p>
        )}

        {product.quantity !== undefined && (
          <p>
            <strong>Available Quantity:</strong> {product.quantity}
          </p>
        )}

        <Form.Group className="mb-3" style={{ maxWidth: '150px' }}>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max={product.quantity || 100}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </Form.Group>

        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={loading || !product.available}
          className="w-100"
        >
          <ShoppingCartOutlined style={{ fontSize: '20px' }} />{' '}
          {loading ? 'Adding to Cart...' : 'Add to Cart'}
        </Button>

        {product.categories && product.categories.length > 0 && (
          <div className="mt-4">
            <strong>Categories:</strong>{' '}
            {product.categories.map((cat) => (
              <Badge key={cat.id} bg="secondary" className="me-2">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ProductDetail;
