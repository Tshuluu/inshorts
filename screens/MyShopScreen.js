import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const MyShop = () => {
  const [products, setProducts] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchSellerInfo(currentUser.uid);
      fetchSellerProducts(currentUser.uid);
    } else {
      Alert.alert('Not signed in', 'Please log in to view your shop.');
    }
  }, []);

  const fetchSellerInfo = async (uid) => {
    try {
      const docRef = doc(db, 'sellers', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSellerInfo(docSnap.data());
      }
    } catch (err) {
      console.error('Seller info error:', err);
    }
  };

  const fetchSellerProducts = async (uid) => {
    try {
      const q = query(collection(db, 'clothes'), where('sellerId', '==', uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (err) {
      console.error('Fetch products error:', err);
      Alert.alert('Error', 'Could not load products');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Shop</Text>

      {sellerInfo && (
        <View style={styles.sellerInfo}>
          <Text style={styles.label}>🧍 Seller: {sellerInfo.fullName || '—'}</Text>
          <Text style={styles.label}>🏬 Shop: {sellerInfo.shopName || '—'}</Text>
          <Text style={styles.label}>📞 Phone: {sellerInfo.phone || '—'}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>🛍 My Products</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : products.length === 0 ? (
        <Text style={{ marginTop: 10 }}>You haven't uploaded any products yet.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#CEDCE2',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sellerInfo: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  productList: {
    justifyContent: 'center',
  },
  productCard: {
    backgroundColor: '#fefefe',
    margin: 8,
    borderRadius: 10,
    padding: 10,
    width: '45%',
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 6,
  },
  productName: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
});

export default MyShop;
