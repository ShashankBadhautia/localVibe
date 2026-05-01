import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { ProductContext } from './ProductContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { products } = useContext(ProductContext) || { products: [] };

  useEffect(() => {
    setCartItems(cartService.getCart());
  }, []);

  const addToCart = (productId, quantity = 1) => {
    const newCart = [...cartItems];
    const existingIndex = newCart.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ productId, quantity });
    }
    
    setCartItems(newCart);
    cartService.saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(newCart);
    cartService.saveCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    
    const newCart = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    setCartItems(newCart);
    cartService.saveCart(newCart);
  };

  const clearCart = () => {
    setCartItems([]);
    cartService.clearCart();
  };

  // Helper to get full details for cart UI
  const getCartDetails = () => {
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId) || {};
      return { ...product, ...item };
    });
  };

  const subtotal = getCartDetails().reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartDetails,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
