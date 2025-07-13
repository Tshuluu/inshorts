import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';

// Screens
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import ImageSearchScreen from '../screens/ImageSearchScreen';
import OrderScreen from '../screens/OrderScreen';
import SellerRegistration from '../screens/BecomeSeller';
import MyShop from '../screens/MyShopScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen'; 
import ThankYouScreen from '../screens/ThankYouScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="ImageSearch" component={ImageSearchScreen} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="SellerRegistration" component={SellerRegistration} />
      <Stack.Screen name="MyShop" component={MyShop} />
      <Stack.Screen name="CategoryProductsScreen" component={CategoryProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} /> 
      <Stack.Screen name="ThankYou" component={ThankYouScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
