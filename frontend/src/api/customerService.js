import apiClient from './axiosConfig';

const customerService = {
  // Get customers (admin)
  getCustomers: async ({ page = 0, count = 20 } = {}) => {
    const response = await apiClient.get('/private/customers', {
      params: { page, count }
    });
    return response.data;
  },

  // Get customer by ID (admin)
  getCustomerById: async (id) => {
    const response = await apiClient.get(`/private/customer/${id}`);
    return response.data;
  },

  // Create customer (admin)
  createCustomer: async (customerData) => {
    const response = await apiClient.post('/private/customer', customerData);
    return response.data;
  },

  // Update customer (admin)
  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/private/customer/${id}`, customerData);
    return response.data;
  },

  // Delete customer (admin)
  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/private/customer/${id}`);
    return response.data;
  },

  // Get authenticated customer profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/customer/profile');
    return response.data;
  },

  // Update authenticated customer profile
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/auth/customer/', profileData);
    return response.data;
  },

  // Update authenticated customer address
  updateAddress: async (addressData) => {
    const response = await apiClient.patch('/auth/customer/address', addressData);
    return response.data;
  },
};

export default customerService;
