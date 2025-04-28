// src/screens/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { fetchProductDetail } from '../services/api';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductDetail(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>

      {product.rating && (
        <Text style={styles.rating}>
          Rating: {product.rating.rate} ⭐ ({product.rating.count} reviews)
        </Text>
      )}

      <Text style={styles.description}>{product.description}</Text>

      <Button title="Add to Shopping Cart" onPress={() => {}} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  price: { fontSize: 20, color: 'green', marginBottom: 10 },
  rating: { fontSize: 16, color: '#555', marginBottom: 10 }, // ⭐ added style
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
