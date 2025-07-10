import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import AnimatedCategoryTile from './AnimatedCategoryTile';


const imageCategories = [
  { name: 'Dresses', image: require('../assets/categories/dresses.jpeg'), gender: 'Her', category: 'Dresses' },
  { name: 'Jeans', image: require('../assets/categories/jeans.jpeg'), gender: 'Him', category: 'Jeans' }, 
  { name: 'Skirts', image: require('../assets/categories/skirt.jpeg'), gender: 'Her', category: 'Skirts' },
  { name: 'Jacket', image: require('../assets/categories/jacket.jpeg'), gender: 'Him', category: 'Jackets' },
  { name: 'Shoes', image: require('../assets/categories/shoes.jpeg'), gender: 'Unisex', category: 'Shoes' },
  { name: 'Jacket (Her)', image: require('../assets/categories/jacket for her.jpeg'), gender: 'Her', category: 'Jacket' },
  { name: 'Jacket (Him)', image: require('../assets/categories/jacket for him.jpeg'), gender: 'Him', category: 'Jacket' },
  { name: 'Shirts', image: require('../assets/categories/tshirt.jpeg'), gender: 'Him', category: 'Shirts' },
  { name: 'Bags', image: require('../assets/categories/bags.jpeg'), gender: 'Her', category: 'Bags' },
  { name: 'Flipflops', image: require('../assets/categories/flipflop for him.jpeg'), gender: 'Him', category: 'Flipflops' },
  { name: 'Shorts', image: require('../assets/categories/shorts.jpeg'), gender: 'Him', category: 'Shorts' },
  { name: 'Bottoms', image: require('../assets/categories/bottom wear.jpeg'), gender: 'Her', category: 'Bottoms' },  
  { name: 'Jewelry', image: require('../assets/categories/jewelry.jpeg'), gender: 'Her', category: 'Jewelry' },
];


const HomeScreen = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState('All');
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const categories = ['Home', 'Her', 'Him', 'Ministyle', 'Sale', 'New Arrivals', 'Essentials'];

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, 'clothes'), snapshot => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

    const unsubscribeWishlist = onSnapshot(collection(db, 'wishlist'), snapshot => {
      const ids = snapshot.docs.map(doc => doc.data().productId);
      setWishlistItems(ids);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeWishlist();
    };
  }, []);

  const toggleWishlist = async (item) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        'Login Required',
        'Please login to add items to your wishlist.',
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

    const name = item.name || item.Name;
    const price = item.price;
    const productId = item.id;

    try {
      const q = query(collection(db, 'wishlist'), where('productId', '==', productId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await Promise.all(snapshot.docs.map(docItem =>
          deleteDoc(doc(db, 'wishlist', docItem.id))
        ));
      } else {
        await addDoc(collection(db, 'wishlist'), {
          name,
          price,
          productId,
          userId: currentUser.uid,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const handleCategoryPress = (item) => {
    if (item === 'Home') {
      setSelectedGender('All');
      setSelectedCategory('All');
    } else if (item === 'Her' || item === 'Him' || item === 'Ministyle') {
      setSelectedGender(item);
      setSelectedCategory('All');
    } else {
      setSelectedCategory(item);
      setSelectedGender('All');
    }
  };

  const filteredProducts = products.filter(item => {
    const name = item.name?.toLowerCase() || '';
    const category = item.category?.toLowerCase() || 'all';
    const gender = item.gender?.toLowerCase() || 'all';

    const selectedCategoryLower = selectedCategory.toLowerCase();
    const selectedGenderLower = selectedGender.toLowerCase();

    const matchesCategory = selectedCategoryLower === 'all' || category === selectedCategoryLower;
    const matchesGender =
      selectedGenderLower === 'all' ||
      gender === selectedGenderLower ||
      gender === 'unisex';
    const matchesSearch = name.includes(searchText.toLowerCase());

    return matchesCategory && matchesGender && matchesSearch;
  });

  const renderItem = ({ item }) => {
    const name = item.name || item.Name;
    const price = item.price;
    const isInWishlist = wishlistItems.includes(item.id);
    const imageUrl = item.image || 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.imagePlaceholder}
          resizeMode="cover"
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₹{price}</Text>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleWishlist(item)}
        >
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color="#A9E4DE"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.searchSection}>
            <TextInput
              placeholder="Search your style"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ImageSearch')}>
              <Ionicons name="camera-outline" size={20} color="black" style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
              <Ionicons name="heart-outline" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="cart-outline" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />

        {['Her', 'Him', 'Ministyle'].map(gender => (
          <View key={gender} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {gender === 'Her' ? 'For Her' : gender === 'Him' ? 'For Him' : 'Ministyle'}
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={imageCategories.filter(cat => cat.gender === gender)}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <AnimatedCategoryTile item={item} navigation={navigation} />
              )}
              contentContainerStyle={styles.imageCategoryRow}
            />
          </View>
        ))}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.productGrid}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#CEDCE2',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  cameraIcon: {
    marginLeft: 6,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryList: {
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 6,
  },
  selectedCategory: {
    backgroundColor: '#A9E4DE',
  },
  categoryText: {
    color: '#000',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  imageCategoryRow: {
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    width: '48%',
  },
  imagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productGrid: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
    color: 'blue',
    marginBottom: 6,
  },
  wishlistButton: {
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
