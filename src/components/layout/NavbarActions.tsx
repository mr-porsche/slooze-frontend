import { UseProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';

export function NavbarActions() {
  const location = useLocation();
  const { isRefreshing, refreshProducts } = UseProducts();
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

  // Inventory Actions
  if (location.pathname === '/inventory') {
    return (
      <>
        <Button
          variant='outline'
          size='sm'
          className='cursor-pointer'
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className='hidden sm:inline'>Refresh</span>
        </Button>
        <Button
          size='sm'
          className='cursor-pointer'
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openAddProduct'));
          }}
        >
          <Plus className='w-4 h-4 sm:mr-2' />
          <span className='hidden sm:inline'>Add Product</span>
        </Button>
      </>
    );
  }
  // Dashboard Actions
  if (location.pathname === '/dashboard') {
    return (
      <>
        <div className='hidden sm:block text-sm text-muted-foreground mr-2'>
          Updated: {formatLastUpdated()}
        </div>
        <Button
          variant='outline'
          size='sm'
          className='cursor-pointer'
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className='hidden sm:inline'>Refresh</span>
        </Button>
      </>
    );
  }

  return null;
}
