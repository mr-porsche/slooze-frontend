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
            <div className='text-center py-8 text-foreground'>
              <Package className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
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
                      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0'>
                        <span className='text-sm text-foreground'>#{index + 1}</span>
                      </div>

                      {/* Thumbnail */}
                      <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0'>
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <Package className='w-5 h-5 text-muted-foreground' />
                        )}
                      </div>

                      {/* Details */}
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium truncate mb-1 text-foreground'>
                          {product.title}
                        </h4>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Value */}
                      <div className='text-right shrink-0'>
                        <p className='text-sm text-foreground'>
                          ${product.inventoryValue.toFixed(2)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {product.stock} × ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='ml-11'>
                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500'
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {percentage.toFixed(1)}% of top {limit}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Total Summary */}
              <div className='pt-4 border-t border-border'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Total Value (Top {limit})</span>
                  <span className='text-foreground'>${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
