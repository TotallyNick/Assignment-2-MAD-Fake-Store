import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { fetchProductsByCategory } from '../services/api';

export default function ProductListScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProductsByCategory(category);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
});
