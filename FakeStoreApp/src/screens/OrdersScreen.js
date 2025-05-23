import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus, fetchProductDetail } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function OrdersScreen() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [productCache, setProductCache] = useState({});

  const loadOrders = async () => {
    try {
      const allOrders = await fetchAllOrders(user?.token);
      const tempCache = { ...productCache };

      const fullOrders = await Promise.all(
        allOrders.map(async (order) => {
          const parsedItems = JSON.parse(order.order_items);

          const detailedItems = await Promise.all(
            parsedItems.map(async (item) => {
              if (!tempCache[item.prodID]) {
                tempCache[item.prodID] = await fetchProductDetail(item.prodID);
              }
              return {
                ...item,
                ...tempCache[item.prodID],
              };
            })
          );

          return { ...order, detailedItems };
        })
      );

      setProductCache(tempCache);
      setOrders(fullOrders);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.token) loadOrders();
    }, [user?.token])
  );

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

const handleStatusUpdate = async (id, isPaid, isDelivered, token) => {
  try {
    if (!token) {
      throw new Error('No auth token found. Please sign in again.');
    }

    await updateOrderStatus(id, isPaid, isDelivered, token);
    await loadOrders();

    Alert.alert(
      'Updated',
      isDelivered ? 'Order marked as received' : 'Order marked as paid'
    );
  } catch (err) {
    console.error('FULL ERROR:', err);
    Alert.alert('Error', err.message || 'Something went wrong');
  }
};
  const renderOrder = ({ item }) => {
    const expanded = expandedIds.includes(item.id);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity style={styles.header} onPress={() => toggleExpand(item.id)}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Order #{item.id}</Text>
            <Text style={styles.status}>
              {item.is_delivered ? 'RECEIVED' : item.is_paid ? 'PAID' : 'NEW'}
            </Text>
          </View>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.details}>
            <Text style={styles.total}>Total: ${(item.total_price / 100).toFixed(2)}</Text>
            {item.detailedItems?.map((product) => (
              <View key={product.prodID} style={styles.productRow}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.itemDetail}>{product.title}</Text>
                  <Text style={styles.itemDetail}>x {product.quantity}</Text>
                </View>
              </View>
            ))}

            {!item.is_paid && (
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusUpdate(item.id, true, false, token)}
              >
                <Text style={styles.buttonText}>Pay</Text>
              </TouchableOpacity>
            )}

            {item.is_paid && !item.is_delivered && (
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusUpdate(item.id, true, true, token)}
              >
                <Text style={styles.buttonText}>Receive</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrder}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    marginTop: 10,
  },
  itemDetail: {
    fontSize: 14,
    color: '#333',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  statusButton: {
    marginTop: 10,
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});
