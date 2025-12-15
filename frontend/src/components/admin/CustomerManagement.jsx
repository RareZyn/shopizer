import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { message, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import customerService from '../../api/customerService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers({ count: 100 });
      setCustomers(response.customers || response.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewDetails = async (customerId) => {
    try {
      const customer = await customerService.getCustomerById(customerId);
      setSelectedCustomer(customer);
      setShowModal(true);
    } catch (error) {
      message.error('Failed to load customer details');
      console.error('View customer error:', error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await customerService.deleteCustomer(customerId);
      message.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete customer');
      console.error('Delete error:', error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader text="Loading customers..." />;
  }

  return (
    <>
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No customers found
              </td>
            </tr>
          ) : (
            filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.firstName} {customer.lastName}
                </td>
                <td>{customer.emailAddress}</td>
                <td>{customer.billing?.phone || customer.phone || '-'}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewDetails(customer.id)}
                  >
                    <EyeOutlined /> Details
                  </Button>
                  <Popconfirm
                    title="Delete customer"
                    description="Are you sure you want to delete this customer?"
                    onConfirm={() => handleDelete(customer.id)}
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
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <div>
              <h5>Personal Information</h5>
              <p>
                <strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.emailAddress}
              </p>
              {selectedCustomer.phone && (
                <p>
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </p>
              )}

              {selectedCustomer.billing && (
                <>
                  <h5 className="mt-4">Billing Address</h5>
                  <p>
                    {selectedCustomer.billing.address}<br />
                    {selectedCustomer.billing.city}, {selectedCustomer.billing.stateProvince}{' '}
                    {selectedCustomer.billing.postalCode}<br />
                    {selectedCustomer.billing.country}
                  </p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerManagement;
