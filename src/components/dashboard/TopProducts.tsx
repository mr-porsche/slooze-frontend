/**
 * TopProducts Component
 * Displays top products by inventory value
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package, TrendingUp } from 'lucide-react';
import type { Product } from '@/types/product';
import { sortByInventoryValues } from '@/utils/productMetrics';

interface TopProductsProps {
  products: Product[];
  limit?: number;
}

export function TopProducts({ products, limit = 5 }: TopProductsProps) {
  // Calculate and sort by inventory value using shared utility
  const topProducts = sortByInventoryValues(products)
    .slice(0, limit)
    .map((product) => ({
      ...product,
      inventoryValue: product.price * product.stock,
    }));

  const totalValue = topProducts.reduce((sum, p) => sum + p.inventoryValue, 0);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Top Products by Value</CardTitle>
          <TrendingUp className='w-5 h-5 text-green-600' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {topProducts.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Package className='w-12 h-12 mx-auto mb-2 text-slate-300' />
              <p>No products available</p>
            </div>
          ) : (
            <>
              {topProducts.map((product, index) => {
                const percentage = totalValue > 0 ? (product.inventoryValue / totalValue) * 100 : 0;

                return (
                  <div key={product.id} className='space-y-2'>
                    {/* Product Info */}
                    <div className='flex items-center gap-3'>
                      {/* Rank */}
                      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 shrink-0'>
                        <span className='text-sm text-slate-700'>#{index + 1}</span>
                      </div>

                      {/* Thumbnail */}
                      <div className='w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0'>
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <Package className='w-5 h-5 text-slate-300' />
                        )}
                      </div>

                      {/* Details */}
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm truncate mb-1'>{product.title}</h4>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Value */}
                      <div className='text-right shrink-0'>
                        <p className='text-sm text-slate-900'>
                          ${product.inventoryValue.toFixed(2)}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {product.stock} × ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='ml-11'>
                      <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500'
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className='text-xs text-slate-500 mt-1'>
                        {percentage.toFixed(1)}% of top {limit}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Total Summary */}
              <div className='pt-4 border-t border-slate-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>Total Value (Top {limit})</span>
                  <span className='text-slate-900'>${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
