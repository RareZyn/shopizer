import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { message } from 'antd';
import productService from '../../api/productService';

const ProductForm = ({ product = null, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    price: '',
    quantity: '',
    available: true,
    productSpecifications: {
      weight: '',
      height: '',
      width: '',
      length: '',
    },
    description: [{
      name: '',
      description: '',
      title: '',
      language: 'en',
    }],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        price: product.price || '',
        quantity: product.quantity || '',
        available: product.available !== undefined ? product.available : true,
        productSpecifications: product.productSpecifications || {
          weight: '',
          height: '',
          width: '',
          length: '',
        },
        description: product.description || [{
          name: '',
          description: '',
          title: '',
          language: 'en',
        }],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('productSpecifications.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        productSpecifications: {
          ...prev.productSpecifications,
          [field]: value,
        },
      }));
    } else if (name.startsWith('description.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: [{
          ...prev.description[0],
          [field]: value,
        }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== PRODUCT FORM SUBMISSION ===');
    console.log('Raw form data:', formData);
    console.log('Description object:', JSON.stringify(formData.description, null, 2));

    // Validate product name is provided
    if (!formData.description[0]?.name || formData.description[0].name.trim() === '') {
      message.error('Product name is required');
      setLoading(false);
      return;
    }

    try {
      // Transform formData to match backend API structure
      const productData = {
        sku: formData.sku,
        available: formData.available,
        visible: formData.available,
        productShipeable: true,
        productVirtual: false,
        dateAvailable: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
        productSpecifications: formData.productSpecifications,
        // Ensure descriptions array has all required fields
        descriptions: formData.description.map(desc => ({
          language: desc.language || 'en',
          name: desc.name || '',
          description: desc.description || '',
          title: desc.title || desc.name || '',
          friendlyUrl: (desc.name || formData.sku || '').toLowerCase().replace(/\s+/g, '-'),
        })),
        inventory: {
          sku: formData.sku,
          quantity: parseInt(formData.quantity) || 0,
          available: formData.available,
          price: {
            price: parseFloat(formData.price) || 0,
            defaultPrice: true,
            code: 'DEFAULT'
          }
        }
      };

      console.log('Transformed product data being sent to API:', JSON.stringify(productData, null, 2));

      if (product) {
        const response = await productService.updateProduct(product.id, productData);
        console.log('Product update response:', response);
        console.log('Updated product ID:', product.id);
        message.success('Product updated successfully');
      } else {
        const response = await productService.createProduct(productData);
        console.log('Product create response:', response);
        console.log('Created product ID:', response.id);
        message.success(`Product created successfully with ID: ${response.id}`);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save product');
      console.error('Product save error:', error);
      console.error('Error response data:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h5 className="mb-3">Basic Information</h5>

      <Form.Group className="mb-3">
        <Form.Label>Product Name *</Form.Label>
        <Form.Control
          type="text"
          name="description.name"
          value={formData.description[0]?.name || ''}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>SKU *</Form.Label>
            <Form.Control
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3 mt-4">
            <Form.Check
              type="checkbox"
              name="available"
              label="Available for sale"
              checked={formData.available}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description.description"
          value={formData.description[0]?.description || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Group>

      <h5 className="mb-3 mt-4">Specifications (Optional)</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="productSpecifications.weight"
              value={formData.productSpecifications.weight}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Height</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="productSpecifications.height"
              value={formData.productSpecifications.height}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Width</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="productSpecifications.width"
              value={formData.productSpecifications.width}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Length</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="productSpecifications.length"
              value={formData.productSpecifications.length}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
};

export default ProductForm;
