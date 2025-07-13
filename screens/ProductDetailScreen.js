import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
 import RazorpayCheckout from 'react-native-razorpay'; // ✅ Add this import at the top
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProductDetailScreen = () => {
  const route = useRoute();

  // ✅ Safely get product from route params
  const product = route.params?.product;

  // ✅ If product is not passed, avoid crash
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 18 }}>⚠️ Product not found.</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      const existingCartItemsString = await AsyncStorage.getItem('cartItems');
      let cartItems = existingCartItemsString ? JSON.parse(existingCartItemsString) : [];
      const productId = product.id;
      const productToAdd = {...product, quantity: 1}; // Add quantity property to the product

      const isItemInCart = cartItems.some(item => item.id === productId);

      if (isItemInCart) {
        const updatedCart = cartItems.map(item =>
          item.id === productId ? {...item, quantity: item.quantity + 1} : item
        );
        await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
        Alert.alert('Cart', `${product.name || 'Item'} quantity updated in cart`);
      } else {
        cartItems.push(productToAdd);
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
        Alert.alert('Cart', `${product.name || 'Item'} added to cart`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Could not add item to cart.');
    }
  };

 
const handleBuyNow = () => {
  const options = {
    description: 'Purchase from Drobe',
    image: 'https://example.com/logo.png',
    currency: 'INR',
    key: 'rzp_test_1DP5mmOlF5G5ag',
    amount: product.price * 100,
    name: 'Drobe',
    prefill: {
      email: 'test@drobe.com',
      contact: '9999999999',
      name: 'Test User',
    },
    theme: { color: '#F37254' },
  };

  RazorpayCheckout.open(options)
    .then((data) => {
      console.log('Payment Success:', data);
      Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
    })
    .catch((error) => {
      console.log('Payment Error:', error);
      Alert.alert('Payment Failed', error.description || JSON.stringify(error));
    });
};

  console.log('Product:', product);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>
        {product.description || 'No description available.'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowButton}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cedce2ff',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  buyNowButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});