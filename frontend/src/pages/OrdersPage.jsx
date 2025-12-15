import { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Empty, Spin } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import OrderList from '../components/orders/OrderList';
import ErrorAlert from '../components/common/ErrorAlert';
import orderService from '../api/orderService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getCustomerOrders();
        console.log('Orders API Response:', response);

        // Handle different response structures
        let ordersList = [];
        if (Array.isArray(response)) {
          ordersList = response;
        } else if (response.orders && Array.isArray(response.orders)) {
          ordersList = response.orders;
        } else if (response.items && Array.isArray(response.items)) {
          ordersList = response.items;
        } else if (response.data && Array.isArray(response.data)) {
          ordersList = response.data;
        }

        console.log('Parsed orders list:', ordersList);
        setOrders(ordersList);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
        console.error('Error loading orders:', err);
        console.error('Error response:', err.response);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center py-5">
            <Spin size="large">
              <div className="mt-3">
                <p className="text-muted">Loading your orders...</p>
              </div>
            </Spin>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-2">
                <ShoppingOutlined className="me-2" />
                My Orders
              </h2>
              <p className="text-muted mb-0">
                View and track all your orders
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <ErrorAlert error={error} onClose={() => setError(null)} />
          </Col>
        </Row>
      )}

      {!orders || orders.length === 0 ? (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body className="py-5">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <h5>No Orders Yet</h5>
                      <p className="text-muted">You haven't placed any orders yet.</p>
                    </div>
                  }
                >
                  <Link to="/products" className="btn btn-primary">
                    <ShoppingOutlined className="me-2" />
                    Start Shopping
                  </Link>
                </Empty>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Order History</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <OrderList orders={orders} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrdersPage;
