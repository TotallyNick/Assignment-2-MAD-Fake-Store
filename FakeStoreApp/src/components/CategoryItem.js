import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryItem({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.text}>{category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});