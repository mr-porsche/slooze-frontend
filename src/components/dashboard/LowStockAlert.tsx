import type { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { filterByStockStatus } from '@/utils/productMetrics';
import { AlertCircle, Package } from 'lucide-react';

interface LowStockAlertProps {
  products: Product[];
  limit?: number;
}

export function LowStockAlert({ products, limit = 6 }: LowStockAlertProps) {
  // Products Filter and Sort by Stock Level
  const alertProducts = filterByStockStatus(products, 'alert')
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit);
  //   const outOfStockStyle = 'bg-red-50 border-red-200';
  //   const criticalStyle = 'bg-orange-50 border-orange-200';
  //   const lowStockStyle = 'bg-yellow-50 border-yellow-200';

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Low Stock Alerts</CardTitle>
          <Badge variant='outline' className='bg-red-50 text-red-600 border-red-200'>
            {alertProducts.length} alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {alertProducts.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Package className='w-12 h-12 mx-auto mb-2 text-slate-300' />
              <p>All products are well stocked!</p>
            </div>
          ) : (
            alertProducts.map((p) => {
              const isOutOfStock = p.stock === 0;
              const isCritical = p.stock > 0 && p.stock < 5;

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isOutOfStock
                      ? 'bg-red-50 border-red-200'
                      : isCritical
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  {/* Alert Icon */}
                  <div
                    className={`p-2 rounded-lg ${
                      isOutOfStock
                        ? 'bg-red-100 text-red-200'
                        : isCritical
                        ? 'bg-orange-100 text-orange-200'
                        : 'bg-yellow-100 text-yellow-200'
                    }`}
                  >
                    <AlertCircle className='w-5 h-5' />
                  </div>

                  {/* Product Info */}
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm truncate mb-1'>{p.title}</h4>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {p.category}
                      </Badge>
                      <span className='text-xs text-slate-500'>${p.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className='text-right shr0'>
                    <p
                      className={`text-sm ${
                        isOutOfStock
                          ? 'text-red-600'
                          : isCritical
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {p.stock} units
                    </p>
                    <p className='text-xs text-slate-500'>
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
