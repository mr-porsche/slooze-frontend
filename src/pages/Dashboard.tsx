import { UseProducts } from '@/hooks/useProducts';
import { StatsCard } from '@/components/layout/StatsCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { StockOverview } from '@/components/dashboard/StockOverview';
import { RecentProducts } from '@/components/dashboard/RecentProducts';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { PriceTrend } from '@/components/dashboard/PriceTrends';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { LoadingState } from '@/components/layout/LoadingState';

export default function Dashboard() {
  const { products, isLoading } = UseProducts();

  if (isLoading) {
    return <LoadingState message='Loading dashboard...' />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-foreground mb-1'>Dashboard Overview</h1>
          <p className='text-muted-foreground'>
            Real-time analytics and insights for your inventory
          </p>
        </div>

        {/***************** Main Content ****************/}
        {/* Metric STATS Card */}
        <section>
          <StatsCard products={products} variant='detailed' />
        </section>

        {/* CHARTS ROW-1 */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <CategoryChart products={products} />
          <StockOverview products={products} />
        </section>

        {/* CHARTS ROW-1 */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <PriceTrend products={products} />
          <TopProducts products={products} />
        </section>

        {/* TABLE */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <RecentProducts products={products} />
          <LowStockAlert products={products} />
        </section>
      </div>
    </div>
  );
}
