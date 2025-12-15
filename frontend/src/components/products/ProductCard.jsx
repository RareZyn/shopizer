import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const price = product.finalPrice || product.price || 0;
  const productName = product.description?.name || product.name || product.sku || 'Product';

  // Generate a gradient based on product name or SKU
  const getGradient = (text) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    ];

    // Simple hash function to pick a gradient
    let hash = 0;
    const str = text || 'default';
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const gradient = getGradient(productName);

  return (
    <Card className="h-100 product-card">
      <div className="position-relative overflow-hidden">
        <Link to={`/products/${product.description?.friendlyUrl || product.sku || product.id}`}>
          <div
            style={{
              height: '220px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              padding: '20px',
              textAlign: 'center',
              wordWrap: 'break-word',
              overflow: 'hidden'
            }}
          >
            {productName}
          </div>
        </Link>
        {!product.available && (
          <Badge
            bg="secondary"
            className="position-absolute top-0 end-0 m-2"
          >
            Out of Stock
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h6" className="mb-2" style={{ minHeight: '40px' }}>
          <Link
            to={`/products/${product.description?.friendlyUrl || product.sku || product.id}`}
            className="text-decoration-none text-dark"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {productName}
          </Link>
        </Card.Title>
        {product.sku && (
          <Card.Text className="text-muted small mb-2">
            <small>SKU: {product.sku}</small>
          </Card.Text>
        )}
        <Card.Text className="fw-bold text-primary fs-5 mb-3 mt-auto">
          {formatPrice(price)}
        </Card.Text>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          disabled={loading || !product.available}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <ShoppingCartOutlined style={{ fontSize: '16px' }} />
          <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
