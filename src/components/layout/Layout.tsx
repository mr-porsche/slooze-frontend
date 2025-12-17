import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '@/hooks/useAuth';

export function Layout() {
  const { isAuthenticated } = useAuth();

  // If not logged in
  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
