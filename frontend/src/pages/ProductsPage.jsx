import { Container } from 'react-bootstrap';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="page-title">Products</h1>
        <p className="text-muted">Browse our collection of products</p>
      </div>
      <ProductList />
    </Container>
  );
};

export default ProductsPage;
