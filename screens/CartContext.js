// context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add to cart (check for duplicates)
  const addToCart = (product) => {
    if (!product?.id || !product?.name || !product?.price) {
      console.warn('⚠️ Invalid product data');
      return;
    }

    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      console.log('Already in cart');
      return;
    }

    setCartItems(prev => [...prev, product]);
    console.log('✅ Added to cart:', product.name);
  };

  // ✅ Remove by product id
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    console.log('❌ Removed from cart:', productId);
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems([]);
    console.log('🧹 Cart cleared');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
