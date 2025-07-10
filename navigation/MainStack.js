import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';

// Extra screens outside of tab navigation
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import ImageSearchScreen from '../screens/ImageSearchScreen';
import OrderScreen from '../screens/OrderScreen';
import SellerRegistration from '../screens/BecomeSeller';
import MyShop from '../screens/MyShopScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs (Home, Upload, Profile) */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* Global Screens outside the tab navigator */}
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="ImageSearch" component={ImageSearchScreen} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="SellerRegistration" component={SellerRegistration} />
      <Stack.Screen name="MyShop" component={MyShop} />
    </Stack.Navigator>
  );
};

export default MainStack;
