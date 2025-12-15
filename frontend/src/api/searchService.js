import apiClient from './axiosConfig';

const searchService = {
  // Search products
  searchProducts: async (query, page = 0, count = 20) => {
    const response = await apiClient.post('/search', {
      query,
      page,
      count,
    });
    return response.data;
  },

  // Autocomplete
  autocomplete: async (query) => {
    const response = await apiClient.post('/search/autocomplete', {
      query,
    });
    return response.data;
  },
};

export default searchService;
