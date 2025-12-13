export type SortBy = 'title' | 'price' | 'stock' | 'category' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  thumbnail?: string;
  image?: string[];
  createdAt?: string;
  updatedAt?: string;
  isCustom?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  thumbnail?: string;
}

export interface APiResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}
