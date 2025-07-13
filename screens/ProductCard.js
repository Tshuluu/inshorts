import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* ✅ Handle image safely */}
      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('http') ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={{ color: 'red', fontSize: 12 }}>Image not available</Text>
        </View>
      )}

      <Text style={styles.name}>{item?.name || 'Unnamed Product'}</Text>
      <Text style={styles.price}>₹{item?.price || 'N/A'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  price: {
    color: 'green',
    fontSize: 13,
    marginTop: 4,
  },
});

export default ProductCard;
