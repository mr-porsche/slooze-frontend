import { fetchCategoriesFromAPI } from '@/utils/apiService';
import { useEffect, useState } from 'react';

const FALLBACK_CATEGORIES = [
  'general',
  'electronics',
  'clothing',
  'food',
  'furniture',
  'beauty',
  'sports',
  'automotive',
];

interface UseCategoriesReturn {
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

export function UseCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const categoriesData = await fetchCategoriesFromAPI();
        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, isLoading, error };
}
