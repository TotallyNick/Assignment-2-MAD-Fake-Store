const BASE_URL = 'http://192.168.1.136:3000';

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchProductsByCategory = async (category) => {
  const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!response.ok) throw new Error('Failed to fetch products by category');
  return response.json();
};

export const fetchProductDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product detail');
  return response.json();
};

export const signInUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (result.status === 'error' || result.message?.toLowerCase().includes('wrong')) {
    const friendly = result.message.includes('Wrong')
      ? 'Incorrect email or password.'
      : result.message;
    throw new Error(friendly || 'Login failed');
  }
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    token: result.token
  };
};

export const signUpUser = async ({ name, email, password }) => {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {
    console.warn('Signup failed:', result.message);
    throw new Error(result.message || 'Signup failed');
  }
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    token: result.token
  };
};

export const updateUserProfile = async ({ name, email, password }) => {
  const response = await fetch(`${BASE_URL}/users/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) {
    console.warn('Profile update failed:', result.message);
    throw new Error(result.message || 'Profile update failed');
  }
  return result;
};

export const submitOrder = async (cartItems, token) => {
  const payload = {
    items: cartItems.map(item => ({
      prodID: item.id,
      price: item.price,
      quantity: item.quantity,
    }))
  };

  const response = await fetch(`${BASE_URL}/orders/neworder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (result.status !== 'OK') {
    throw new Error(result.message || 'Failed to submit order');
  }

  return result;
};

export const fetchAllOrders = async (token) => {
  const response = await fetch(`${BASE_URL}/orders/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (result.status !== 'OK') {
    throw new Error(result.message || 'Failed to fetch orders');
  }

  return result.orders;
};

export const updateOrderStatus = async (orderID, isPaid, isDelivered, token) => {
  const response = await fetch(`${BASE_URL}/orders/updateorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderID: orderID,
      isPaid: isPaid ? 1 : 0,
      isDelivered: isDelivered ? 1 : 0
    })
  });

  console.log(token);

  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(data.message || 'Failed to update order status');
  }

  return data;
};