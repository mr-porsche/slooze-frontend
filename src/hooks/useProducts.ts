import type { Product } from '@/types/product';
import { fetchProductsFromAPI } from '@/utils/apiService';
import { getCustomProducts } from '@/utils/localStorage';
import { useCallback, useEffect, useState } from 'react';

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadProducts: () => Promise<Product[]>;
  refreshProducts: () => Promise<void>;
}

export function UseProducts(autoLoad: boolean = true): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Getting Products
  const loadProducts = useCallback(async () => {
    try {
      setError(null);

      // Getting API PRODUCTS
      const apiProducts = await fetchProductsFromAPI();

      // Getting CUSTOM PRODUCTS
      const customProducts = getCustomProducts();

      // API + CUSTOM PRODUCTS
      const allProducts = [...apiProducts, ...customProducts];
      setProducts(allProducts);

      return allProducts;
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
      throw err;
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadProducts();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadProducts]);

  useEffect(() => {
    if (autoLoad) {
      const initialize = async () => {
        setIsLoading(true);
        try {
          await loadProducts();
        } finally {
          setIsLoading(false);
        }
      };

      initialize();
    }
  }, [autoLoad, loadProducts]);

  return { products, isLoading, isRefreshing, error, loadProducts, refreshProducts };
}
