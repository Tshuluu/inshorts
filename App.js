import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { StatusBar } from 'react-native'; // ✅ Import here
import { auth } from './firebaseConfig';
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';
import { CartProvider } from './screens/CartContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <CartProvider>
      {/* ✅ Add StatusBar here to globally hide it */}
      <StatusBar hidden={true} />
      <NavigationContainer>
        {user ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
