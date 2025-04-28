import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

export default function ProductItem({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  info: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 5,
    color: 'green',
  },
});
