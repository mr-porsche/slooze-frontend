import type { Product } from '@/types/product';
import { sortByDate } from '@/utils/productMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package } from 'lucide-react';
import { Badge } from '../ui/badge';

interface RecentProductsProps {
  products: Product[];
  limit?: number;
}

export function RecentProducts({ products, limit = 5 }: RecentProductsProps) {
  // Sorting Products by Date
  const recentProductsWithDates = sortByDate(products.filter((p) => p.createdAt)).slice(0, limit);

  // If no such data then show first few products
  const displayProducts =
    recentProductsWithDates.length > 0 ? recentProductsWithDates : products.slice(0, limit);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {displayProducts.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Package className='w-12 h-12 mx-auto mb-2 text-slate-300' />
              <p>No products available</p>
            </div>
          ) : (
            displayProducts.map((p) => (
              <div
                key={p.id}
                className='flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors'
              >
                {/* Thumbnail */}
                <div className='w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0'>
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.title} className='w-full h-full object-cover' />
                  ) : (
                    <Package className='w-6 h-6 text-slate-300' />
                  )}
                </div>

                {/* Product Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h4 className='text-sm truncate'>{p.title}</h4>
                    {p.isCustom && (
                      <Badge variant='secondary' className='bg-blue-500 text-white text-xs'>
                        Custom
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-3 text-xs text-slate-500'>
                    <span>{p.category}</span>
                    <span>|</span>
                    <span>{formatDate(p.createdAt)}</span>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className='text-right shrink-0'>
                  <p className='text-sm text-slate-900'>${p.price.toFixed(2)}</p>
                  <p className='text-xs text-slate-500'>{p.stock} units</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
