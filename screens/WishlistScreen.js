import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  addDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const WishlistScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(list);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async (item) => {
    try {
      await addDoc(collection(db, 'cart'), {
        name: item.name,
        price: item.price,
        image: item.image || '',
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
      Alert.alert('Success', `${item.name} added to cart`);
    } catch (err) {
      console.log('Add to cart error:', err);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await deleteDoc(doc(db, 'wishlist', id));
    } catch (err) {
      console.log('Remove wishlist error:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.fallbackText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
          <Text style={styles.name}>{item.name || 'No Name'}</Text>
          <Text style={styles.price}>₹{item.price != null ? item.price : 'N/A'}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartButton}>
            <Text style={styles.cartText}>Move to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeFromWishlist(item.id)} style={styles.trashButton}>
          <Ionicons name="trash-outline" size={22} color="#acc6c4ff" />

            
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>My Wishlist ❤️</Text>

        {wishlist.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.empty}>💔 Your wishlist is empty</Text>
            <Text style={styles.empty}>Start adding your favorite styles!</Text>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#c0c2c3ff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 4,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  imageFallback: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 12,
    color: 'gray',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: '#acc6c4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cartText: {
    fontWeight: 'bold',
    color: '#000',
  },
  trashButton: {
    marginLeft: 10,
  },
});
