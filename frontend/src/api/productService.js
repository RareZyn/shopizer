import apiClient from './axiosConfig';
import axios from 'axios';

const productService = {
  // Get products with filters
  getProducts: async ({ page = 0, count = 20, category, name, sku, available } = {}) => {
    const params = { page, count };
    if (category) params.category = category;
    if (name) params.name = name;
    if (sku) params.sku = sku;
    if (available !== undefined) params.available = available;

    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get product by friendly URL or SKU
  getProductBySlug: async (slug) => {
    try {
      // Try v1 API with friendly URL first
      const response = await apiClient.get(`/product/${slug}`);
      return response.data;
    } catch (error) {
      // If not found, fallback to v2 API which supports SKU
      if (error.response?.status === 404) {
        const baseURL = apiClient.defaults.baseURL.replace('/v1', '/v2');
        const response = await axios.get(`${baseURL}/product/${slug}`, {
          params: apiClient.defaults.params,
          headers: apiClient.defaults.headers
        });
        return response.data;
      }
      throw error;
    }
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await apiClient.post('/private/product', productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/private/product/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/private/product/${id}`);
    return response.data;
  },

  // Check if product code exists
  checkProductCodeExists: async (code) => {
    const response = await apiClient.get('/private/product/unique', {
      params: { code }
    });
    return response.data;
  },

  // Patch product (update inventory/quantity)
  patchProduct: async (id, patchData) => {
    const response = await apiClient.patch(`/private/product/${id}`, patchData);
    return response.data;
  },
};

export default productService;
