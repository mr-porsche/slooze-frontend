import type { Product } from '@/types/product';
import { useMemo, useState } from 'react';

export interface FilterOptions {
  searchQuery: string;
  selectedCategories: string[];
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  priceRange: { min: number; max: number };
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  selectedCategories: [],
  stockStatus: 'all',
  priceRange: { min: 0, max: Infinity },
};

interface UseFilterReturn {
  filters: FilterOptions;
  setSearchQuery: (query: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setStockStatus: (status: FilterOptions['stockStatus']) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  activeFilterCount: number;
}

export function useFilter(products: Product[]): UseFilterReturn {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSelectedCategories = (categories: string[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories: categories }));
  };

  const setStockStatus = (status: FilterOptions['stockStatus']) => {
    setFilters((prev) => ({ ...prev, stockStatus: status }));
  };

  const setPriceRange = (range: { min: number; max: number }) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  //Active Filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) count++;

    return count;
  }, [filters]);

  //
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (filters.selectedCategories.length > 0) {
      result = result.filter((p) => filters.selectedCategories.includes(p.category));
    }

    // Stock Filter
    if (filters.stockStatus !== 'all') {
      result = result.filter((p) => {
        switch (filters.stockStatus) {
          case 'in-stock':
            return p.stock >= 10;
          case 'low-stock':
            return p.stock > 0 && p.stock < 10;
          case 'out-of-stock':
            return p.stock === 0;
          default:
            return true;
        }
      });
    }

    // Price Filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
      result = result.filter(
        (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    return result;
  }, [products, filters]);

  return {
    filters,
    setSearchQuery,
    setSelectedCategories,
    setStockStatus,
    setPriceRange,
    resetFilters,
    filteredProducts,
    activeFilterCount,
  };
}
