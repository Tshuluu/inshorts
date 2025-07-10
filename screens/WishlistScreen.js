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
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.info}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.cartButton}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
            <Ionicons name="trash-outline" size={22} color="red" />
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
    backgroundColor: '#CEDCE2',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cartButton: {
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
