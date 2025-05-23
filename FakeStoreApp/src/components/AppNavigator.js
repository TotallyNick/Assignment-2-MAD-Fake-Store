import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Text } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();

function ProductStackNavigator() {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen name="Categories" component={CategoryScreen} options={{ headerShown: false }} />
      <ProductStack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
      <ProductStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Details' }} />
    </ProductStack.Navigator>
  );
}

function BottomTabs() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.cart.orders).filter(
    (order) => order.userEmail === user?.email
  );
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          if (!loggedIn && route.name !== 'Profile') {
            e.preventDefault();
            Alert.alert('Access Denied', 'Please log in or sign up for an account');
          }
        },
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons name="cart-outline" color={color} size={size} />
              {totalQuantity > 0 && (
                <Text style={{
                  position: 'absolute', right: -6, top: -3,
                  backgroundColor: 'red', color: 'white', borderRadius: 10,
                  paddingHorizontal: 5, fontSize: 10, overflow: 'hidden'
                }}>{totalQuantity}</Text>
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Ionicons name="clipboard-outline" color={color} size={size} />
              {newOrdersCount > 0 && (
                <Text style={{
                  position: 'absolute', right: -6, top: -3,
                  backgroundColor: 'red', color: 'white', borderRadius: 10,
                  paddingHorizontal: 5, fontSize: 10, overflow: 'hidden'
                }}>{newOrdersCount}</Text>
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isSplashVisible, setSplashVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSplashVisible ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <Stack.Screen name="Main" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
