import type { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { filterByStockStatus } from '@/utils/productMetrics';
import { AlertCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LowStockAlertProps {
  products: Product[];
  limit?: number;
}

export function LowStockAlert({ products, limit = 6 }: LowStockAlertProps) {
  // Products Filter and Sort by Stock Level
  const alertProducts = filterByStockStatus(products, 'alert')
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Low Stock Alerts</CardTitle>
          <Badge variant='destructive'>{alertProducts.length} alerts</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {alertProducts.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Package className='w-12 h-12 mx-auto mb-2 text-muted-foreground' />
              <p>All products are well stocked!</p>
            </div>
          ) : (
            alertProducts.map((p) => {
              const isOutOfStock = p.stock === 0;
              const isCritical = p.stock > 0 && p.stock < 5;

              return (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    isOutOfStock && 'border-destructive/40 bg-destructive/10',
                    isCritical && 'border-warning/40 bg-warning/10',
                    !isOutOfStock && !isCritical && 'border-border bg-muted'
                  )}
                >
                  {/* Alert Icon */}
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      isCritical && !isOutOfStock && 'bg-destructive/30 text-destructive',
                      !isOutOfStock && !isCritical && 'bg-destructive/15 text-destructive/30'
                    )}
                  >
                    <AlertCircle className='w-5 h-5' />
                  </div>

                  {/* Product Info */}
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm font-medium truncate mb-1 text-foreground'>{p.title}</h4>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {p.category}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>${p.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className='text-right shrink-0'>
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isOutOfStock
                          ? 'text-red-600'
                          : isCritical
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      )}
                    >
                      {p.stock} units
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {isOutOfStock ? 'Out of stock' : 'Low stock'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
