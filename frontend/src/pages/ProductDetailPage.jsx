import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Breadcrumb } from 'react-bootstrap';
import ProductDetail from '../components/products/ProductDetail';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import productService from '../api/productService';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return <Loader text="Loading product..." />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <ErrorAlert error={error} onClose={() => setError(null)} />
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-4">
        <h4>Product not found</h4>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>
          Products
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <ProductDetail product={product} />

      <div className="mt-4 mb-4">
        <Link to="/products" className="btn btn-outline-secondary">
          ← Back to Products
        </Link>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
