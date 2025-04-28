const BASE_URL = 'http://192.168.1.136:3000';

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return res.json();
};

export const fetchProductsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/products/category/${category}`);
  return res.json();
};

export const fetchProductDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};
