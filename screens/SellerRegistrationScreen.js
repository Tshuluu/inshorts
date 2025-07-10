import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SellerRegistrationScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Login Required', 'Please login to register as a seller.');
      return;
    }

    if (!fullName || !shopName || !phone) {
      Alert.alert('Incomplete', 'Please fill in all fields');
      return;
    }

    try {
      const sellerRef = doc(db, 'sellers', user.uid);
      await setDoc(sellerRef, {
        fullName,
        shopName,
        phone,
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'You are now registered as a seller!');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Error saving seller data:', error);
      Alert.alert('Error', 'Something went wrong during registration.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🛍 Seller Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register as Seller</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#CEDCE2',
    alignItems: 'center',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'brown',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'brown',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SellerRegistrationScreen;
