import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Tag, Button } from 'antd';
import { EyeOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { formatPrice, formatDate } from '../../utils/formatters';

const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-5">
        <h5>No orders found</h5>
        <p className="text-muted">You haven't placed any orders yet.</p>
      </div>
    );
  }

  // Extract total from order object
  const getOrderTotal = (order) => {
    // If order has a direct total field
    if (order.total && typeof order.total === 'number') {
      return order.total;
    }
    if (order.orderTotal && typeof order.orderTotal === 'number') {
      return order.orderTotal;
    }

    // If order has a totals array, find the total
    if (order.totals && Array.isArray(order.totals)) {
      const totalItem = order.totals.find(t =>
        t.code === 'TOTAL' ||
        t.module === 'total' ||
        t.title?.toLowerCase().includes('total')
      );
      if (totalItem) {
        return parseFloat(totalItem.value) || 0;
      }
      // Fallback: sum all totals
      return order.totals.reduce((sum, t) => sum + (parseFloat(t.value) || 0), 0);
    }

    return 0;
  };

  // Extract date from order object
  const getOrderDate = (order) => {
    return order.datePurchased || order.orderDate || order.date || order.createdDate || new Date();
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ORDERED':
        return 'blue';
      case 'PROCESSED':
      case 'PROCESSING':
        return 'cyan';
      case 'SHIPPED':
        return 'purple';
      case 'DELIVERED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Table responsive hover className="mb-0">
      <thead className="table-light">
        <tr>
          <th style={{ width: '120px' }}>Order ID</th>
          <th>Date</th>
          <th style={{ width: '140px' }}>Status</th>
          <th className="text-end" style={{ width: '120px' }}>Total</th>
          <th className="text-center" style={{ width: '150px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const orderTotal = getOrderTotal(order);
          const orderDate = getOrderDate(order);

          return (
            <tr key={order.id}>
              <td>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-decoration-none fw-bold"
                >
                  #{order.id}
                </Link>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <CalendarOutlined className="me-2 text-muted" />
                  <span>{formatDate(orderDate)}</span>
                </div>
              </td>
              <td>
                <Tag color={getStatusColor(order.status || order.orderStatus)}>
                  {order.status || order.orderStatus || 'ORDERED'}
                </Tag>
              </td>
              <td className="text-end">
                <div className="d-flex align-items-center justify-content-end">
                  <DollarOutlined className="me-2 text-success" />
                  <strong className="text-success">
                    {formatPrice(orderTotal)}
                  </strong>
                </div>
              </td>
              <td className="text-center">
                <Link to={`/orders/${order.id}`}>
                  <Button type="primary" size="small" icon={<EyeOutlined />}>
                    View Details
                  </Button>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default OrderList;
