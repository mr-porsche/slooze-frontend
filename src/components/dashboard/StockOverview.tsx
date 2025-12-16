import type { Product } from '@/types/product';
import { productMetrics } from '@/utils/productMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface StockOverviewProps {
  products: Product[];
}

const STOCK_COLORS = {
  'Out of Stock': '#ef4444',
  'Low Stock': '#f59e0b',
  'In Stock': '#10b981',
};

export function StockOverview({ products }: StockOverviewProps) {
  // Stock Distribution Calc
  const stats = productMetrics(products);
  const outOfStock = stats.outOfStockCount;
  const lowStock = stats.lowStockCount;
  const inStock = stats.inStockCount - lowStock;

  const data = [
    { name: 'In Stock', value: inStock, color: STOCK_COLORS['In Stock'] },
    { name: 'Low Stock', value: lowStock, color: STOCK_COLORS['Low Stock'] },
    { name: 'Out of Stock', value: outOfStock, color: STOCK_COLORS['Out of Stock'] },
  ].filter((item) => item.value > 0); // Categories with value

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customLabel = (entry: any) => {
    const percent = ((entry.value / products.length) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={customLabel}
              outerRadius={100}
              fill='#8884D8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} products`, 'Count']}
            />
            <Legend
              verticalAlign='bottom'
              height={36}
              formatter={(value) => <span className='text-sm'>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary */}
        <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>In Stock</p>
            <p className='text-green-600'>{inStock}</p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Low Stock</p>
            <p className='text-yellow-600'>{lowStock}</p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Out of Stock</p>
            <p className='text-red-600'>{outOfStock}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
