import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { CommonActions } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchSellerDetails(currentUser.uid);
    }
  }, []);

  const fetchSellerDetails = async (uid) => {
    try {
      const sellerRef = doc(db, 'sellers', uid);
      const sellerSnap = await getDoc(sellerRef);
      if (sellerSnap.exists()) {
        setSellerData(sellerSnap.data());
      } else {
        setSellerData(null);
      }
    } catch (error) {
      console.error('❌ Seller fetch error:', error);
      Alert.alert('Error', 'Failed to fetch seller info');
    }
  };

  const handleLogout = async () => {
  try {
    await signOut(auth);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // or 'Welcome', if that’s your auth entry
      })
    );
  } catch (error) {
    Alert.alert('Logout Failed', error.message);
  }
};


  const avatarUri = user?.photoURL || 'https://i.ibb.co/ZYW3VTp/brown-user.png';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {user ? (
        <>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.name}>{user.displayName || 'Your Name'}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </TouchableOpacity>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>UID:</Text>
            <Text style={styles.value}>{user.uid}</Text>

            <Text style={styles.label}>Account Type:</Text>
            <Text style={styles.value}>
              {sellerData ? '✅ Seller' : '🧍 Regular User'}
            </Text>

            {sellerData && (
              <>
                <Text style={styles.label}>Full Name:</Text>
                <Text style={styles.value}>{sellerData.fullName || '—'}</Text>

                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{sellerData.phone || '—'}</Text>

                <Text style={styles.label}>Shop Name:</Text>
                <Text style={styles.value}>{sellerData.shopName || '—'}</Text>
              </>
            )}
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => navigation.navigate('OrderScreen')}
            >
              <Text style={styles.orderButtonText}>🧾 View My Orders</Text>
            </TouchableOpacity>

            {!sellerData ? (
              <TouchableOpacity
                style={styles.sellerButton}
                onPress={() => navigation.navigate('SellerRegistration')}
              >
                <Text style={styles.sellerButtonText}>🛍 Become a Seller</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('MyShop')}
              >
                <Text style={styles.shopButtonText}>🏬 Go to My Shop</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View style={styles.notLoggedInBox}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.name}>Guest User</Text>
          <Text style={styles.email}>You're not logged in.</Text>

          <TouchableOpacity
  style={styles.primaryButton}
  activeOpacity={0.7}
  onPress={() => navigation.navigate('Welcome')}
>
  <Text style={styles.primaryButtonText}>GO TO HOME</Text>
</TouchableOpacity>

        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#c0c2c3ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  infoBlock: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#444',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  actionSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: 'brown',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 12,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sellerButton: {
    backgroundColor: '#ffb703',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sellerButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shopButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notLoggedInBox: {
    alignItems: 'center',
    marginTop: 30,
  },
});

export default ProfileScreen;
