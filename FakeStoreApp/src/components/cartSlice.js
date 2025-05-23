import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  orders: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseQuantity(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      else state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    checkoutCart(state, action) {
      const userEmail = action.payload;
      if (state.items.length > 0 && userEmail) {
        const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder = {
          id: Date.now(),
          status: 'new',
          items: [...state.items],
          total,
          userEmail,
        };
        state.orders.push(newOrder);
        state.items = [];
      }
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) order.status = status;
    },
    clearOrders(state) {
      state.orders = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  checkoutCart,
  updateOrderStatus,
  clearOrders,
} = cartSlice.actions;

export default cartSlice.reducer;