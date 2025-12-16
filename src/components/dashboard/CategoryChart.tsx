import type { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CategoryChartProps {
  products: Product[];
}

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6d4', // cyan
  '#F97316', // orange
];

export function CategoryChart({ products }: CategoryChartProps) {
  // Categories Distribution Calc
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0 };
    }
    acc[category].count += 1;
    acc[category].value += product.price * product.stock;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const chartData = Object.entries(categoryData)
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: data.count,
      value: data.value,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 categories

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#E2E8F0' />
            <XAxis
              dataKey='name'
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value, 'Products'];
                return [`$${value.toFixed(2)}`, 'Total Value'];
              }}
            />
            <Bar dataKey='count' radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
