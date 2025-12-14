import type { Product } from '@/types/product';
import {
  AlertTriangle,
  DollarSign,
  Layers,
  Package,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { formatCurrency, formatPercentage, productMetrics } from '@/utils/productMetrics';

interface StatsCardProps {
  products: Product[];
  variant?: 'compact' | 'detailed';
}

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatsCard({ products, variant = 'compact' }: StatsCardProps) {
  // Getting statistics
  const stats = productMetrics(products);

  // STAT CARD based on variant
  const statCards: StatCard[] = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle:
        variant === 'detailed'
          ? `${stats.apiProducts} API | ${stats.customProducts} Custom`
          : undefined,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: variant === 'detailed' ? 'Total Inventory Value' : 'Inventory Value',
      value: formatCurrency(stats.totalValue),
      subtitle:
        variant === 'detailed' ? `${stats.totalStock.toLocaleString()} total units` : undefined,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    ...(variant === 'detailed'
      ? [
          {
            title: 'Categories',
            value: stats.categories,
            subtitle: 'Product Categories',
            icon: Layers,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
          },
        ]
      : []),
    ...(variant === 'detailed'
      ? [
          {
            title: 'In Stock',
            value: stats.inStockCount,
            subtitle: `${formatPercentage(
              (stats.inStockCount / stats.totalProducts) * 100 || 0
            )} availability`,
            icon: ShoppingCart,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
          },
        ]
      : []),
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount,
      subtitle: variant === 'detailed' ? 'Needs restocking!' : undefined,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockCount,
      subtitle: variant === 'detailed' ? 'Urgent attention!' : undefined,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const gridCols = variant === 'detailed' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4`}>
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className='hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <p className='text-sm text-slate-600 mb-1'>{stat.title}</p>
                  <p className='text-slate-900 mb-1'>{stat.value}</p>
                  {stat.subtitle && <p className='text-xs text-slate-500'>{stat.subtitle}</p>}
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
