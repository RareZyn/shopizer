import apiClient from './axiosConfig';

const orderService = {
  // Anonymous checkout
  checkout: async (cartCode, orderData) => {
    const response = await apiClient.post(`/cart/${cartCode}/checkout`, orderData);
    return response.data;
  },

  // Authenticated checkout
  checkoutAuthenticated: async (cartCode, orderData) => {
    const response = await apiClient.post(`/auth/cart/${cartCode}/checkout`, orderData);
    return response.data;
  },

  // Get customer orders
  getCustomerOrders: async ({ page = 0, count = 20 } = {}) => {
    const response = await apiClient.get('/auth/orders', {
      params: { page, count }
    });
    return response.data;
  },

  // Get order by ID (authenticated customer)
  getOrderById: async (id) => {
    const response = await apiClient.get(`/auth/orders/${id}`);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async ({ page = 0, count = 20, name, email, phone, status } = {}) => {
    const params = { page, count };
    if (name) params.name = name;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (status) params.status = status;

    const response = await apiClient.get('/private/orders', { params });
    return response.data;
  },

  // Get order by ID (admin)
  getOrderByIdAdmin: async (id) => {
    const response = await apiClient.get(`/private/orders/${id}`);
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.put(`/private/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Get orders for specific customer (admin)
  getOrdersForCustomer: async (customerId, { page = 0, count = 20 } = {}) => {
    const response = await apiClient.get(`/private/orders/customers/${customerId}`, {
      params: { page, count }
    });
    return response.data;
  },
};

export default orderService;
