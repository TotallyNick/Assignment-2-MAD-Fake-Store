import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchProductsByCategory } from '../services/api'; 
import ProductItem from '../components/ProductItem'; 

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
        console.error('Error fetching products:', error); 
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
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
