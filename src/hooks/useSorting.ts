import type { Product, SortBy, SortOrder } from '@/types/product';
import { useMemo, useState } from 'react';

interface UseSortingReturn {
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  sortedProducts: Product[];
}

export function useSorting(products: Product[]): UseSortingReturn {
  const [sortBy, setSortBy] = useState<SortBy>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedProducts = useMemo(() => {
    const result = [...products];

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'createdAt': {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = dateB - dateA;
          break;
        }
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, sortBy, sortOrder]);

  return { sortBy, sortOrder, setSortBy, setSortOrder, toggleSortOrder, sortedProducts };
}
