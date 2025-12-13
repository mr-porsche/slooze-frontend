import type { Product } from '@/types/product';
import { AlertTriangle, DollarSign, Package } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatsCardProps {
  products: Product[];
}

export function StatsCard({ products }: StatsCardProps) {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  //   const avgPrice = totalProducts > 0 ? totalValue / products.reduce((sum, p) => sum + p.stock, 0) : 0;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Inventory Value',
      value: `$${totalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-slate-600 mb-1'>{stat.title}</p>
                  <p className='text-slate-900'>{stat.value}</p>
                </div>
                <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className='w-6 h-6' />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
