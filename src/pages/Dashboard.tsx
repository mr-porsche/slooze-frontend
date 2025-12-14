import { UseProducts } from '@/hooks/useProducts';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import Logo from '../assets/FFFFFF-1.png';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/layout/StatsCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { StockOverview } from '@/components/dashboard/StockOverview';
import { RecentProducts } from '@/components/dashboard/RecentProducts';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';

export default function Dashboard() {
  const { products, isLoading, isRefreshing, refreshProducts } = UseProducts();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    await refreshProducts();
    setLastUpdated(new Date());
  };

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin text-slate-400 mx-auto mb-4' />
          <p className='text-slate-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <header className='bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            {/* Slooze Logo */}
            <div className='flex items-center gap-4'>
              <img src={Logo} alt='Slooze' className='h-10' />
              <div className='w-px h-8 bg-slate-300' />
              <div>
                <div className='flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5 text-blue-600' />
                  <h1 className='text-slate-800'>Welcome to Dashboard!</h1>
                </div>
                <p className='text-sm text-slate-600'>Last updated: {formatLastUpdated()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-6'>
          {/* Metric STATS Card */}
          <section>
            <StatsCard products={products} variant='detailed' />
          </section>

          {/* CHARTS */}

          <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <CategoryChart products={products} />
            <StockOverview products={products} />
          </section>

          {/* TABLE */}
          <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <RecentProducts products={products} />
            <LowStockAlert products={products} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-slate-200 mt-12'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between text-sm text-slate-600'>
            <p>Slooze Commodities Management System</p>
            <p>{products.length} products tracked</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
