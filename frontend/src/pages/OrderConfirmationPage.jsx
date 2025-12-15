import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Result, Descriptions, Tag, Timeline, Divider } from 'antd';
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // If no order data, redirect to home
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Success Result */}
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title={
              <h2 className="mb-3">
                Order Placed Successfully!
              </h2>
            }
            subTitle={
              <div>
                <p className="lead mb-1">
                  Thank you for your order! Your order number is <strong>#{order.id}</strong>
                </p>
                <p className="text-muted">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            }
            extra={[
              <Link key="orders" to="/orders" className="btn btn-primary btn-lg me-2">
                <ShoppingOutlined className="me-2" />
                View My Orders
              </Link>,
              <Link key="home" to="/" className="btn btn-outline-secondary btn-lg">
                Continue Shopping
              </Link>
            ]}
            className="bg-white rounded-3 shadow-sm p-4 mb-4"
          />

          {/* Order Details */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <ShoppingOutlined className="me-2" />
                Order Details
              </h5>
            </Card.Header>
            <Card.Body>
              <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                <Descriptions.Item
                  label={<span><strong>Order Number</strong></span>}
                  span={2}
                >
                  <Tag color="blue" className="fs-6">#{order.id}</Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<span><CalendarOutlined className="me-2" /><strong>Order Date</strong></span>}
                >
                  {formatDate(order.datePurchased || order.createdDate || new Date())}
                </Descriptions.Item>

                <Descriptions.Item
                  label={<span><DollarOutlined className="me-2" /><strong>Payment Method</strong></span>}
                >
                  <Tag color="green">
                    {order.paymentMethod || order.payment?.paymentModule?.toUpperCase() || 'COD'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<span><strong>Order Status</strong></span>}
                  span={2}
                >
                  <Tag color="processing">
                    {order.status || 'ORDERED'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={<span><DollarOutlined className="me-2" /><strong>Total Amount</strong></span>}
                  span={2}
                >
                  <span className="fs-4 fw-bold text-success">
                    {formatCurrency(order.total || order.orderTotal)}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card.Body>
          </Card>

          {/* Customer Information */}
          {order.customer && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <MailOutlined className="me-2" />
                  Customer Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong><MailOutlined className="me-2" />Email:</strong><br />
                      {order.customer.emailAddress || order.customer.email || 'N/A'}
                    </p>
                  </Col>
                  {order.customer.billing && (
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><PhoneOutlined className="me-2" />Phone:</strong><br />
                        {order.customer.billing.phone || 'N/A'}
                      </p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Billing & Delivery Address */}
          <Row>
            {order.billing && (
              <Col md={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-secondary text-white">
                    <h5 className="mb-0">
                      <HomeOutlined className="me-2" />
                      Billing Address
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <address>
                      {order.billing.firstName} {order.billing.lastName}<br />
                      {order.billing.address}<br />
                      {order.billing.city}, {order.billing.stateProvince} {order.billing.postalCode}<br />
                      {order.billing.country}
                    </address>
                    {order.billing.phone && (
                      <p className="mb-0">
                        <PhoneOutlined className="me-2" />
                        {order.billing.phone}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )}

            {order.delivery && (
              <Col md={6} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">
                      <HomeOutlined className="me-2" />
                      Delivery Address
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <address>
                      {order.delivery.firstName} {order.delivery.lastName}<br />
                      {order.delivery.address}<br />
                      {order.delivery.city}, {order.delivery.stateProvince} {order.delivery.postalCode}<br />
                      {order.delivery.country}
                    </address>
                    {order.delivery.phone && (
                      <p className="mb-0">
                        <PhoneOutlined className="me-2" />
                        {order.delivery.phone}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {/* Order Items */}
          {order.products && order.products.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">
                  <ShoppingOutlined className="me-2" />
                  Order Items
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="me-3 rounded"
                              />
                            )}
                            <div>
                              <div className="fw-bold">{item.name || item.description}</div>
                              {item.sku && (
                                <small className="text-muted">SKU: {item.sku}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">{item.quantity || 1}</td>
                        <td className="text-end align-middle">{formatCurrency(item.price)}</td>
                        <td className="text-end align-middle fw-bold">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-warning">
              <h5 className="mb-0">
                <DollarOutlined className="me-2" />
                Order Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td className="text-end"><strong>Subtotal:</strong></td>
                    <td className="text-end" style={{ width: '150px' }}>
                      {formatCurrency(order.subTotal || order.total)}
                    </td>
                  </tr>
                  {order.shipping && parseFloat(order.shipping) > 0 && (
                    <tr>
                      <td className="text-end"><strong>Shipping:</strong></td>
                      <td className="text-end">{formatCurrency(order.shipping)}</td>
                    </tr>
                  )}
                  {order.tax && parseFloat(order.tax) > 0 && (
                    <tr>
                      <td className="text-end"><strong>Tax:</strong></td>
                      <td className="text-end">{formatCurrency(order.tax)}</td>
                    </tr>
                  )}
                  <tr className="border-top">
                    <td className="text-end"><h5 className="mb-0"><strong>Total:</strong></h5></td>
                    <td className="text-end">
                      <h5 className="mb-0 text-success">
                        <strong>{formatCurrency(order.total || order.orderTotal)}</strong>
                      </h5>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Order Timeline */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <CalendarOutlined className="me-2" />
                What's Next?
              </h5>
            </Card.Header>
            <Card.Body>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: (
                      <>
                        <p className="mb-1"><strong>Order Confirmed</strong></p>
                        <p className="text-muted mb-0">Your order has been received and is being processed</p>
                      </>
                    )
                  },
                  {
                    color: 'blue',
                    children: (
                      <>
                        <p className="mb-1"><strong>Processing</strong></p>
                        <p className="text-muted mb-0">We're preparing your items for shipment</p>
                      </>
                    )
                  },
                  {
                    color: 'gray',
                    children: (
                      <>
                        <p className="mb-1"><strong>Shipped</strong></p>
                        <p className="text-muted mb-0">You'll receive a tracking number once shipped</p>
                      </>
                    )
                  },
                  {
                    color: 'gray',
                    children: (
                      <>
                        <p className="mb-1"><strong>Delivered</strong></p>
                        <p className="text-muted mb-0">Your order will be delivered to your address</p>
                      </>
                    )
                  }
                ]}
              />
            </Card.Body>
          </Card>

          {/* Help Section */}
          <Card className="shadow-sm border-primary">
            <Card.Body className="text-center">
              <h5>Need Help?</h5>
              <p className="text-muted mb-3">
                If you have any questions about your order, please contact our customer support.
              </p>
              <Link to="/orders" className="btn btn-primary me-2">
                Track Your Order
              </Link>
              <a href="mailto:support@shopizer.com" className="btn btn-outline-secondary">
                Contact Support
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmationPage;
