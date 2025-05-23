import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './src/components/cartSlice';
import authReducer from './src/components/authSlice';

import AppNavigator from './src/components/AppNavigator'; 

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}