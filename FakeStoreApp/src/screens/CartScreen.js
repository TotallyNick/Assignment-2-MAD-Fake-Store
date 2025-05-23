import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { clearCart } from '../components/cartSlice';
import { submitOrder } from '../services/api';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user?.token) {
      Alert.alert('Error', 'Missing user token.');
      console.log('USER OBJECT:', user);

      return;
    }

    try {
      await submitOrder(cart, user.token);
      Alert.alert('Checkout Complete', 'Your order has been placed.');
      dispatch(clearCart());
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Your shopping cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>
        Items: {totalItems} | Total: ${totalCost.toFixed(2)}
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  center: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
