import type { Product, ProductFormData } from '@/types/product';
import {
  createCustomProduct,
  deleteCustomProduct,
  getCustomProducts,
  updateCustomProduct,
} from '@/utils/localStorage';
import { useCallback, useState } from 'react';

interface UseLocalProductsReturn {
  customProducts: Product[];
  addProduct: (Data: ProductFormData) => boolean;
  updateProduct: (id: number, data: ProductFormData) => boolean;
  deleteProduct: (id: number) => boolean;
  refreshProduct: () => void;
}

export function UseLocalProducts(): UseLocalProductsReturn {
  const [customProducts, setCustomProducts] = useState<Product[]>(getCustomProducts());

  const refreshProduct = useCallback(() => {
    setCustomProducts(getCustomProducts());
  }, []);

  const addProduct = useCallback(
    (data: ProductFormData): boolean => {
      try {
        createCustomProduct(data);
        refreshProduct();
        return true;
      } catch (err) {
        console.error('Error adding product:', err);
        return false;
      }
    },
    [refreshProduct]
  );

  const updateProduct = useCallback(
    (id: number, data: ProductFormData): boolean => {
      try {
        const updatedProduct = updateCustomProduct(id, data);
        if (updatedProduct) {
          refreshProduct();
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error updating product:', err);
        return false;
      }
    },
    [refreshProduct]
  );

  const deleteProduct = useCallback(
    (id: number): boolean => {
      try {
        const success = deleteCustomProduct(id);
        if (success) {
          refreshProduct();
        }
        return success;
      } catch (err) {
        console.error('Error deleting product:', err);
        return false;
      }
    },
    [refreshProduct]
  );

  return { customProducts, addProduct, updateProduct, deleteProduct, refreshProduct };
}
