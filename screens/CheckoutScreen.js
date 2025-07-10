import React, { useContext } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { CartContext } from './CartContext';

const CheckoutScreen = () => {
    const { items } = route.params;

  const { cartItems, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    Alert.alert("Success", "Purchase complete!");
    clearCart();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>🧾 Checkout</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - ₹{item.price}</Text>
        )}
      />
      <Text style={{ fontSize: 18, marginTop: 10 }}>Total: ₹{total}</Text>
      <Button title="Buy Now" onPress={handleCheckout} />
    </View>
  );
};

export default CheckoutScreen;
