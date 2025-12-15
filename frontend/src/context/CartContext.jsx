import { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../api/cartService';
import { message } from 'antd';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCode, setCartCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore cart code from localStorage
    const storedCartCode = localStorage.getItem('cartCode');
    if (storedCartCode) {
      setCartCode(storedCartCode);
      fetchCart(storedCartCode);
    }
  }, []);

  const fetchCart = async (code) => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart(code);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // If cart not found, clear the stored cart code
      if (error.response?.status === 404) {
        localStorage.removeItem('cartCode');
        setCartCode(null);
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);

      console.log('=== ADD TO CART ===');
      console.log('Product object:', product);
      console.log('Product ID:', product.id);
      console.log('Product SKU:', product.sku);

      const cartItem = {
        product: product.sku, // Backend expects SKU, not ID
        quantity,
      };

      console.log('Cart item payload:', JSON.stringify(cartItem, null, 2));

      let response;
      if (cartCode) {
        // Add to existing cart
        console.log('Modifying existing cart:', cartCode);
        response = await cartService.modifyCart(cartCode, cartItem);
      } else {
        // Create new cart
        console.log('Creating new cart');
        response = await cartService.createCart(cartItem);
        const newCartCode = response.code;
        setCartCode(newCartCode);
        localStorage.setItem('cartCode', newCartCode);
      }

      console.log('Cart response:', response);
      setCart(response);
      const productName = product.description?.name || product.name || product.sku || 'Product';
      message.success(`${productName} added to cart`);
      return { success: true };
    } catch (error) {
      console.error('=== ADD TO CART ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);

      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      message.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (sku, quantity) => {
    try {
      setLoading(true);
      const cartItem = {
        product: String(sku), // Backend expects string
        quantity,
      };

      const response = await cartService.modifyCart(cartCode, cartItem);
      setCart(response);
      message.success('Cart updated');
    } catch (error) {
      message.error('Failed to update cart');
      console.error('Update cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (sku) => {
    try {
      setLoading(true);
      await cartService.removeCartItem(cartCode, sku);
      // Fetch updated cart
      await fetchCart(cartCode);
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
      console.error('Remove item error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    setCartCode(null);
    localStorage.removeItem('cartCode');
  };

  const itemCount = cart?.products?.length || 0;

  const value = {
    cart,
    cartCode,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    refreshCart: () => cartCode && fetchCart(cartCode),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
