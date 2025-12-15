import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ProductForm from '../products/ProductForm';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import productService from '../../api/productService';
import { formatPrice } from '../../utils/formatters';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts({ count: 100 });
      setProducts(response.products || response.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete product');
      console.error('Delete error:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.description?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader text="Loading products..." />;
  }

  return (
    <>
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        <Button variant="primary" onClick={handleCreate}>
          <PlusOutlined /> Create Product
        </Button>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No products found
              </td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.description?.name}</td>
                <td>{product.sku}</td>
                <td>{formatPrice(product.price || 0)}</td>
                <td>{product.quantity || 0}</td>
                <td>
                  <span
                    className={`badge bg-${
                      product.available ? "success" : "danger"
                    }`}
                  >
                    {product.available ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(product)}
                  >
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    title="Delete product"
                    description="Are you sure you want to delete this product?"
                    onConfirm={() => handleDelete(product.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button variant="outline-danger" size="sm">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct ? "Edit Product" : "Create Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            product={selectedProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductManagement;
