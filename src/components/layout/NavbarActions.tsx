import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UseProducts } from '@/hooks/useProducts';
import { Button } from '../ui/button';
import { LogOut, Plus, RefreshCw, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function NavbarActions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  {
    /* Temp */
  }
  const { isRefreshing, refreshProducts } = UseProducts();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    await refreshProducts();
    setLastUpdated(new Date());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // UserInfo Component
  const UserInfo = () => (
    <>
      <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg'>
        <User className='w-4 h-4 text-foreground' />
        <span className='text-sm text-foreground'>{user?.firstName}</span>
        <span className='text-xs text-muted-foreground'>({user?.role})</span>
      </div>
      <Button variant='destructive' size='sm' onClick={handleLogout}>
        <LogOut className='w-4 h-4' />
        <span className='hidden sm:inline'>Logout</span>
      </Button>
    </>
  );

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

        <UserInfo />
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

        <UserInfo />
      </>
    );
  }

  // Admin Panel
  return <UserInfo />;
}
