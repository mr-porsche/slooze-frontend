import type { Product } from '@/types/product';

export interface ProductStats {
  totalProducts: number;
  customProducts: number;
  apiProducts: number;
  totalValue: number;
  totalStock: number;
  avgPrice: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  categories: number;
}

export function productMetrics(products: Product[]): ProductStats {
  const totalProducts = products.length;
  const customProducts = products.filter((p) => p.isCustom).length;
  const apiProducts = totalProducts - customProducts;

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = products.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = totalStock > 0 ? totalValue / totalStock : 0;

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const inStockCount = totalProducts - outOfStockCount;

  const categories = new Set(products.map((p) => p.category)).size;

  return {
    totalProducts,
    customProducts,
    apiProducts,
    totalValue,
    totalStock,
    avgPrice,
    lowStockCount,
    outOfStockCount,
    inStockCount,
    categories,
  };
}

// Currency Value
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

// Stock Status
export function getStockStatus(stock: number): 'out' | 'low' | 'in' {
  if (stock === 0) return 'out';
  if (stock < 10) return 'low';
  return 'in';
}

/********** SORT & FILTER **********/

// Products Sorting by Inventory Values
export function sortByInventoryValues(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const valueA = a.price * a.stock;
    const valueB = b.price * b.stock;
    return valueB - valueA;
  });
}

// Products Sorting by Date (latest on top)
export function sortByDate(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

// Products Filtering by Stock Status
export function filterByStockStatus(
  products: Product[],
  status: 'low' | 'out' | 'alert'
): Product[] {
  if (status === 'alert') {
    return products.filter((p) => p.stock < 10);
  }
  if (status === 'out') {
    return products.filter((p) => p.stock < 0);
  }
  return products.filter((p) => p.stock > 0 && p.stock < 10);
}
