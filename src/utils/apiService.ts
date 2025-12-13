import type { APiResponse, Category, Product } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com';
const CACHE_KEY = 'slooze_api_products';
const CACHE_TIMESTAMP_KEY = 'slooze_api_cache_timestamp';
const CACHE_DURATION = 1000 * 60 * 60; // 1hr

// Checking if data is valid
function isDataVAlid(): boolean {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const dataAge = Date.now() - parseInt(timestamp, 10);
  return dataAge < CACHE_DURATION;
}

// Getting Cached Products
function getCachedProducts(): Product[] | null {
  if (!isDataVAlid()) return null;

  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch (err) {
    console.error('Error parsing cached data:', err);
    return null;
  }
}

// Caching Products
function cacheProducts(products: Product[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (err) {
    console.error('Error caching products:', err);
  }
}

// Getting API Products
export async function fetchProductsFromAPI(): Promise<Product[]> {
  // First checking cache
  const cached = getCachedProducts();
  if (cached) {
    console.log('Returning cached products');
    return cached;
  }

  try {
    //fetching 100 products from DummyJSON with limit
    const res = await fetch(`${API_BASE_URL}/products?limit=100`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data: APiResponse<Product> = await res.json();

    // Caching data
    cacheProducts(data.products);

    return data.products;
  } catch (err) {
    console.error('Error fetching products:', err);
    // Getting cached data if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      console.log('API failed, getting cache data');
      return JSON.parse(cached);
    }

    throw err;
  }
}

// Getting API Categories
export async function fetchCategoriesFromAPI(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const categories: Category[] = await res.json();
    // Getting slug from category OBJ
    return categories.map((cat) => cat.slug);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

// Products search query
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: APiResponse<Product> = await res.json();
    return data.products;
  } catch (err) {
    console.error('Error searching products:', err);
    return [];
  }
}

// Cache clearing
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}
