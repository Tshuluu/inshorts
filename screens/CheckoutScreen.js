import React, { useContext } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from './CartContext';
import RazorpayCheckout from 'react-native-razorpay';

const CheckoutScreen = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = () => {
    const options = {
      description: 'Payment for your items',
      image: 'https://example.com/logo.png', // optional
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag', // ✅ Working test key
      amount: total * 100, // in paise (₹1 = 100)
      name: 'Drobe',
      prefill: {
        email: 'test@customer.com',
        contact: '9876543210',
        name: 'Test User',
      },
      theme: { color: '#F37254' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
        clearCart(); // Clear the cart
        navigation.navigate('ThankYou'); // Go to thank you screen
      })
      .catch((error) => {
        Alert.alert('Payment Failed', error.description || 'Something went wrong');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧾 Checkout</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.name} - ₹{item.price}
          </Text>
        )}
      />

      <Text style={styles.total}>Total: ₹{total}</Text>

      <Button title="Pay with Razorpay" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  total: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CheckoutScreen;
