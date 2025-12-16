import type { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/utils/productMetrics';

interface PriceTrendProps {
  products: Product[];
}

export function PriceTrend({ products }: PriceTrendProps) {
  // Price Distribution Data
  const priceRange = [
    { range: '$0-50', min: 0, max: 50 },
    { range: '$50-100', min: 50, max: 100 },
    { range: '$100-250', min: 100, max: 250 },
    { range: '$250-500', min: 250, max: 500 },
    { range: '$500-1000', min: 500, max: 1000 },
    { range: '$1000+', min: 1000, max: Infinity },
  ];

  const chartData = priceRange.map(({ range, min, max }) => {
    const productsInRange = products.filter((p) => p.price >= min && p.price < max);
    const count = productsInRange.length;
    const totalValue = productsInRange.reduce((sum, p) => sum + p.price * p.stock, 0);

    return { range, count, value: totalValue };
  });

  // Summary Statistics
  const avgPrice =
    products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;

  const minPrice = products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3B82F6' strokeOpacity={0.8} />
                <stop offset='95%' stopColor='#3B82F6' strokeOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#E2E8F0' />
            <XAxis dataKey='range' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value, 'Products'];
                return [formatCurrency(value), 'Total Value'];
              }}
            />
            <Area
              type='monotone'
              dataKey='count'
              stroke='#3B82F6'
              fillOpacity={1}
              fill='url(#colorCount)'
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Price Statistics */}
        <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200'>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground mb-1'>Average</p>
            <p className='text-sm text-foreground'>{formatCurrency(avgPrice)}</p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground mb-1'>Minimum</p>
            <p className='text-sm text-foreground'>{formatCurrency(minPrice)}</p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground mb-1'>Maximum</p>
            <p className='text-sm text-foreground'>{formatCurrency(maxPrice)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
