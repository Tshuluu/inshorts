import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        'Login Required',
        'Please login to view your orders.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => navigation.navigate('LoginScreen'),
          },
        ]
      );
      return;
    }

    const fetchOrders = async () => {
      const q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      {item.orderDate && (
        <Text style={styles.date}>
          Ordered: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.status}>
        Status: {item.status || 'Pending'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧾 My Orders</Text>
      {orders.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: 'green', marginVertical: 6 },
  button: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontSize: 13 },
});

export default OrderScreen;
