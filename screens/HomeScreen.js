import React, { useEffect, useState,useRef } from 'react';
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
  LayoutAnimation,
  Platform,
  UIManager,
  
  
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { Dimensions } from 'react-native';

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
import CategoryTile from './CategoryTile';
import ProductCard from './ProductCard';
import imageCategories, { banners } from './imageCategories'

const HomeScreen = ({ navigation }) => {
  

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
  const [selectedGender, setSelectedGender] = useState('All');
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
      useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % banners.length;
      setCurrentBannerIndex(nextIndex);

      if (bannerRef.current) {
        bannerRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentBannerIndex]);

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
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
        <View style={styles.imageWrapper}>
  <Image
    source={{ uri: imageUrl }}
    style={styles.productImage}
    resizeMode="cover"
  />
</View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₹{price}</Text>

        {/* ✅ Use View to hold wishlist button */}
        <View style={styles.wishlistButton}>
          <TouchableOpacity onPress={() => toggleWishlist(item)}>
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color="#A9E4DE"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#c0c2c3ff" />

    {/* 🔍 Search + Icons */}
    <View style={{ paddingTop: 15 }}>
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
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      {/* 👚 Category buttons */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const isSelected =
            (selectedCategory === item && !['Her', 'Him', 'Ministyle'].includes(item)) ||
            (selectedGender === item && ['Her', 'Him', 'Ministyle'].includes(item));
          return (
            <TouchableOpacity
              style={[styles.categoryButton, isSelected && styles.selectedCategory]}
              onPress={() => handleCategoryPress(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={[styles.categoryList, { justifyContent: 'center' }]}
      />

      {/* 🖼️ Banner Carousel */}
      <View style={{ marginTop: 16, marginBottom: 12 }}>
        <FlatList
          ref={bannerRef}
          data={banners}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => (
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={{
                width: Dimensions.get('window').width - 32,
                height: 160,
                borderRadius: 14,
                marginRight: 12,
              }}
              resizeMode="cover"
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentBannerIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>

      {/* 👗 Gender-based Categories */}
      {['Her', 'Him', 'Ministyle'].map((gender) => (
        <View key={gender} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            {gender === 'Her' ? 'For Her' : gender === 'Him' ? 'For Him' : 'For Kids'}
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={imageCategories.filter(cat => cat.gender === gender)}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <CategoryTile item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.imageCategoryRow}
          />
        </View>
      ))}

      {/* 🔥 Trending Now */}
      {products.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={products.slice(0, 8)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.imageCategoryRow}
          />
        </View>
      )}

      {/* 🆕 Just Dropped */}
      {products.some(p => p.new) && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>🆕 Just Dropped</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={products.filter(p => p.new)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.imageCategoryRow}
          />
        </View>
      )}

      {/* 💥 Crazy Deals */}
      {products.some(p => p.dealTag) && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>💥 Crazy Deals</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={products.filter(p => p.dealTag)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.imageCategoryRow}
          />
        </View>
      )}

      {/* 🛍 Product Grid */}
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
}; // ← This closes the HomeScreen function


const styles = StyleSheet.create({
  container: {
    paddingTop: 9,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#c0c2c3ff',
  },

  // 🔍 Top Search Row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  searchSection: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#ccdbd8ff',
    borderRadius: 18,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  cameraIcon: {
    marginLeft: 6,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // 🔘 Gender/Category Button Row
  categoryList: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  paddingVertical: 12,
  paddingHorizontal: 8,
},


  categoryButton: {
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: 24,
  backgroundColor: '#d6e3e2',
  marginRight: 10,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 32,
  minWidth: 60,
},

categoryText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
  lineHeight: 18, // ✅ ensures full character height is visible
  includeFontPadding: false, // ✅ helps avoid clipping on Android
  textAlignVertical: 'center', // ✅ for Android
  textAlign: 'center',
},



  selectedCategory: {
    backgroundColor: '#798685',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // 🧷 Image Category Section (Her, Him, etc.)
  imageCategoryRow: {
    paddingVertical: 16,
  },

  // 🛍 Product Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: '47%',
    margin: '1.5%',
    overflow: 'hidden',
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  wishlistButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
    dotContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 10,
},
dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#b2d4cdff',
  marginHorizontal: 4,
},
activeDot: {
  backgroundColor: '#000',
},

    sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  paddingHorizontal: 8,
  color: '#333',
},

  
  productGrid: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
export default HomeScreen;
