import apiClient from './axiosConfig';

const cartService = {
  // Create cart and add item
  createCart: async (cartItem) => {
    const response = await apiClient.post('/cart', cartItem);
    return response.data;
  },

  // Modify cart (add/update item)
  modifyCart: async (code, cartItem) => {
    const response = await apiClient.put(`/cart/${code}`, cartItem);
    return response.data;
  },

  // Add multiple items to cart
  addMultipleItems: async (code, cartItems) => {
    const response = await apiClient.post(`/cart/${code}/multi`, cartItems);
    return response.data;
  },

  // Get cart by code
  getCart: async (code) => {
    const response = await apiClient.get(`/cart/${code}`);
    return response.data;
  },

  // Get authenticated customer cart
  getCustomerCart: async () => {
    const response = await apiClient.get('/auth/customer/cart');
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (cartCode, sku) => {
    const response = await apiClient.delete(`/cart/${cartCode}/product/${sku}`);
    return response.data;
  },

  // Add promo code
  addPromoCode: async (cartCode, promoCode) => {
    const response = await apiClient.post(`/cart/${cartCode}/promo/${promoCode}`);
    return response.data;
  },
};

export default cartService;
