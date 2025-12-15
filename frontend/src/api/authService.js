import apiClient from './axiosConfig';

const authService = {
  // Customer registration
  registerCustomer: async (customerData) => {
    const response = await apiClient.post('/customer/register', customerData);
    return response.data;
  },

  // Customer login
  loginCustomer: async (username, password) => {
    const response = await apiClient.post('/customer/login', {
      username,
      password,
    });
    return response.data;
  },

  // Admin login
  loginAdmin: async (username, password) => {
    const response = await apiClient.post('/private/login', {
      username,
      password,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.get('/auth/customer/refresh');
    return response.data;
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartCode');
  },
};

export default authService;
