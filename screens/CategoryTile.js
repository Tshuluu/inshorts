import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryTile = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('CategoryProductsScreen', {
          gender: item.gender,
          category: item.category,
        })
      }
    >
     <Image source={item.image} style={styles.image} />
  <View>
    <Text style={styles.label}>{item.name}</Text>
  </View>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategoryTile;
