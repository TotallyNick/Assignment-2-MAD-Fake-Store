import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={CategoryScreen}
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
        }}
      />
    </Stack.Navigator>
  );
}

function CartTabIcon() {
  const cart = useSelector(state => state.cart);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      <Ionicons name="cart-outline" size={24} />
      {totalQuantity > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -12,
            backgroundColor: 'red',
            borderRadius: 10,
            paddingHorizontal: 6,
            minWidth: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {totalQuantity}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Products"
          component={ProductsStack}
          options={{
            tabBarIcon: () => <Ionicons name="home-outline" size={24} />,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: () => <CartTabIcon />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
