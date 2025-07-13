// screens/ThankYouScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ThankYouScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Thank You!</Text>
      <Text style={styles.message}>Your payment was successful.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ThankYouScreen;
