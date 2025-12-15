import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  gridCols?: 'auto' | '2' | '3' | '4' | '5';
}

export function ProductGrid({ products, onEdit, onDelete, gridCols = 'auto' }: ProductGridProps) {
  const gridColsClass = {
    auto: 'lg:grid-cols-3 xl:grid-cols-4',
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
    '5': 'lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass[gridCols]} gap-6`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
