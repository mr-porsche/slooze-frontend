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
import { cn } from '@/lib/utils';

interface StatsCardProps {
  products: Product[];
  variant?: 'compact' | 'detailed';
}

type Accent = 'blue' | 'green' | 'indigo' | 'emerald' | 'yellow' | 'red';

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent: Accent;
}

const accentClasses: Record<Accent, { icon: string; bg: string }> = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  green: {
    icon: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-500/10',
  },
  yellow: {
    icon: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
  },
  red: {
    icon: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
  indigo: {
    icon: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  emerald: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
};

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
      accent: 'blue',
    },
    {
      title: variant === 'detailed' ? 'Total Inventory Value' : 'Inventory Value',
      value: formatCurrency(stats.totalValue),
      subtitle:
        variant === 'detailed' ? `${stats.totalStock.toLocaleString()} total units` : undefined,
      icon: DollarSign,
      accent: 'green',
    },
    ...(variant === 'detailed'
      ? [
          {
            title: 'Categories',
            value: stats.categories,
            subtitle: 'Product Categories',
            icon: Layers,
            accent: 'indigo',
          } as StatCard,
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
            accent: 'emerald',
          } as StatCard,
        ]
      : []),
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount,
      subtitle: variant === 'detailed' ? 'Needs restocking!' : undefined,
      icon: AlertTriangle,
      accent: 'yellow',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockCount,
      subtitle: variant === 'detailed' ? 'Urgent attention!' : undefined,
      icon: AlertTriangle,
      accent: 'red',
    },
  ];

  const gridCols = variant === 'detailed' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', gridCols)}>
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const accent = accentClasses[stat.accent];
        return (
          <Card
            key={stat.title}
            className='bg-card text-card-foreground hover:shadow-md transition-shadow'
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground mb-1'>{stat.title}</p>
                  <p className='text-xl font-semibold mb-1'>{stat.value}</p>
                  {stat.subtitle && (
                    <p className='text-xs text-muted-foreground'>{stat.subtitle}</p>
                  )}
                </div>

                <div className={cn('p-3 rounded-lg', accent.bg)}>
                  <Icon className={cn('w-6 h-6', accent.icon)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
