import { useState, useEffect } from 'react';
import { Table, Form, Badge, Button } from 'react-bootstrap';
import { message, Select } from 'antd';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import orderService from '../../api/orderService';
import { formatPrice, formatDate } from '../../utils/formatters';

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    status: '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAllOrders({ count: 100, ...filters });

      console.log('=== FETCHING ORDERS ===');
      console.log('API Response:', response);

      // Extract orders array from response
      let ordersArray = [];
      if (Array.isArray(response)) {
        ordersArray = response;
      } else if (Array.isArray(response.orders)) {
        ordersArray = response.orders;
      } else if (Array.isArray(response.items)) {
        ordersArray = response.items;
      } else if (Array.isArray(response.data)) {
        ordersArray = response.data;
      }

      console.log('Extracted orders:', ordersArray);
      setOrders(ordersArray);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
      setOrders([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      message.success('Order status updated');
      fetchOrders();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update order status');
      console.error('Status update error:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'ORDERED':
        return 'primary';
      case 'PROCESSED':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <Loader text="Loading orders..." />;
  }

  return (
    <>
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <div className="mb-4 row">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Customer name..."
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Email..."
              value={filters.email}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="ORDERED">Ordered</option>
              <option value="PROCESSED">Processed</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  {order.customer?.firstName} {order.customer?.lastName}
                  <br />
                  <small className="text-muted">{order.customer?.emailAddress || order.billing?.email}</small>
                </td>
                <td>{formatDate(order.datePurchased || order.orderDate)}</td>
                <td><strong>{formatPrice(order.total || order.orderTotal)}</strong></td>
                <td>
                  <Badge bg={getStatusVariant(order.status || order.orderStatus)}>
                    {order.status || order.orderStatus || 'ORDERED'}
                  </Badge>
                </td>
                <td>
                  <Select
                    defaultValue={order.status || order.orderStatus || 'ORDERED'}
                    style={{ width: 150 }}
                    onChange={(value) => handleStatusUpdate(order.id, value)}
                    size="small"
                  >
                    <Option value="ORDERED">Ordered</Option>
                    <Option value="PROCESSED">Processed</Option>
                    <Option value="DELIVERED">Delivered</Option>
                    <Option value="CANCELLED">Cancelled</Option>
                  </Select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OrderManagement;
