import type { Product, ProductFormData } from '../types/product';

const CUSTOM_PRODUCT_KEY = 'slooze_custom_product';

// Getting CUSTOM PRODUCTS from localStorage
export function getCustomProducts(): Product[] {
  try {
    const stored = localStorage.getItem(CUSTOM_PRODUCT_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error getting CUSTOM PRODUCTS', err);
    return [];
  }
}

// Saving CUSTOM PRODUCTS to localStorage
function saveCustomProducts(products: Product[]): void {
  try {
    localStorage.setItem(CUSTOM_PRODUCT_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving CUSTOM PRODUCTS', err);
  }
}

// Unique ID for CUSTOM PRODUCTS
function generateId(): number {
  const customProducts = getCustomProducts();
  if (customProducts.length === 0) return 101;

  const maxId = Math.max(...customProducts.map((p) => p.id));
  return maxId + 1;
}

// Adding new CUSTOM PRODUCT
export function createCustomProduct(formData: ProductFormData): Product {
  const customProducts = getCustomProducts();

  const newProduct: Product = {
    id: generateId(),
    ...formData,
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  customProducts.push(newProduct);
  saveCustomProducts(customProducts);

  return newProduct;
}

// Updating CUSTOM PRODUCT
export function updateCustomProduct(
  id: number,
  formData: Partial<ProductFormData>
): Product | null {
  const customProducts = getCustomProducts();
  const index = customProducts.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updatedProduct: Product = {
    ...customProducts[index],
    ...formData,
    updatedAt: new Date().toISOString(),
  };

  customProducts[index] = updatedProduct;
  saveCustomProducts(customProducts);

  return updatedProduct;
}

// Deleting CUSTOM PRODUCT
export function deleteCustomProduct(id: number): boolean {
  const customProducts = getCustomProducts();
  const filtered = customProducts.filter((p) => p.id !== id);

  if (filtered.length === customProducts.length) return false; // Product not found

  saveCustomProducts(filtered);

  return true;
}

// Clearing CUSTOM PRODUCTS
export function clearCustomProducts(): void {
  localStorage.removeItem(CUSTOM_PRODUCT_KEY);
}
