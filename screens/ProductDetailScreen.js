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
import { useRoute } from '@react-navigation/native';

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

  const handleAddToCart = () => {
    Alert.alert('Cart', `${product.name || 'Item'} added to cart`);
  };

  const handleBuyNow = () => {
    Alert.alert(
      'Buy Now',
      `Do you want to buy "${product.name}" for ₹${product.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            Alert.alert('Checkout', 'Proceeding to checkout...');
          },
        },
      ]
    );
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
    backgroundColor: '#CEDCE2',
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
