import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CategoryProductsScreen = ({ route, navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const gender = route?.params?.gender || '';
  const category = route?.params?.category || '';

  useEffect(() => {
    if (!gender || !category) {
      Alert.alert('Missing Info', 'Gender or Category not provided');
      setLoading(false);
      return;
    }
    fetchFilteredProducts();
  }, []);

  const fetchFilteredProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clothes'));
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allProducts.filter(item =>
  item.gender &&
  item.category &&
  item.gender.toLowerCase() === gender.toLowerCase() &&
  item.category.toLowerCase() === category.toLowerCase()
);


      setProducts(filtered);
    } catch (error) {
      console.error('🔥 Error fetching products:', error);
      Alert.alert('Error', 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate('ProductDetail', { product: item });
      });
    };

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {gender && category ? `${gender} / ${category}` : 'Category'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="brown" />
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>No products found.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
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
  name: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    color: 'green',
    fontSize: 13,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default CategoryProductsScreen;
