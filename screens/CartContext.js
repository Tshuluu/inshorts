
import React, { createContext, useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add to Firestore and local context
  const addToCart = async (product) => {
    if (!product?.id || !product?.name || !product?.price) {
      console.warn('⚠️ Invalid product data');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn('⚠️ No user logged in');
      return;
    }

    const userId = user.uid;

    // ✅ Check if already added to Firestore
    const q = query(
      collection(db, 'cart'),
      where('userId', '==', userId),
      where('productId', '==', product.id)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      console.log('🛒 Already in cart (Firestore)');
      return;
    }

    // ✅ Add to Firestore
    try {
      await addDoc(collection(db, 'cart'), {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
      });
      console.log('✅ Added to Firestore cart:', product.name);
    } catch (error) {
      console.error('🔥 Firestore add to cart error:', error);
    }

    // ✅ Add to local cart state (optional, for in-app usage)
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    console.log('❌ Removed from cart:', productId);
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('🧹 Cart cleared (local)');
    // Optional: Add Firestore deletion logic here if needed
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
