import { useState, useEffect } from 'react';
import { Row, Col, Form, Pagination } from 'react-bootstrap';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import productService from '../../api/productService';

const ProductList = ({ categoryFilter = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    sku: '',
    available: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING PRODUCTS ===');
      console.log('Request params:', { page, count: 12, category: categoryFilter, ...filters });

      const response = await productService.getProducts({
        page,
        count: 12,
        category: categoryFilter,
        ...filters,
      });

      console.log('API Response:', response);
      console.log('Extracted products:', response.products || response.items || []);

      setProducts(response.products || response.items || []);
      setTotalPages(response.totalPages || Math.ceil((response.recordsTotal || 0) / 12));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Error loading products:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading && products.length === 0) {
    return <Loader text="Loading products..." />;
  }

  return (
    <>
      {/* Filters */}
      <div className="filter-section">
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="filter-title">Search by Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter product name..."
                value={filters.name}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="filter-title">Search by SKU</Form.Label>
              <Form.Control
                type="text"
                name="sku"
                placeholder="Enter SKU..."
                value={filters.sku}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Check
                type="checkbox"
                name="available"
                label="Show available products only"
                checked={filters.available}
                onChange={handleFilterChange}
                className="mb-2"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="empty-state">
          <h4>No products found</h4>
          <p>Try adjusting your search filters to find what you're looking for</p>
        </div>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
                  <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />

                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = page < 3 ? idx : page - 2 + idx;
                    if (pageNum >= totalPages) return null;
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum + 1}
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                  />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}

      {loading && products.length > 0 && (
        <div className="text-center py-3">
          <Loader size="sm" text="" />
        </div>
      )}
    </>
  );
};

export default ProductList;
