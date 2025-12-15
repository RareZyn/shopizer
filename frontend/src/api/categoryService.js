import apiClient from './axiosConfig';

const categoryService = {
  // Get category hierarchy
  getCategories: async ({ filter, page = 0, count = 100, name } = {}) => {
    const params = { page, count };
    if (filter) params.filter = filter;
    if (name) params.name = name;

    const response = await apiClient.get('/category', { params });
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/category/${id}`);
    return response.data;
  },

  // Get category by friendly URL
  getCategoryBySlug: async (slug) => {
    const response = await apiClient.get(`/category/${slug}`);
    return response.data;
  },

  // Create category (admin)
  createCategory: async (categoryData) => {
    const response = await apiClient.post('/private/category', categoryData);
    return response.data;
  },

  // Update category (admin)
  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/private/category/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin)
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/private/category/${id}`);
    return response.data;
  },

  // Check if category code exists
  checkCategoryCodeExists: async (code) => {
    const response = await apiClient.get('/private/category/unique', {
      params: { code }
    });
    return response.data;
  },
};

export default categoryService;
