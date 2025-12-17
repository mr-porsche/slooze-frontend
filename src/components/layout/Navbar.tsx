import { Package, BarChart3, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/FFFFFF-1.png';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { NavbarActions } from './NavbarActions';
import type { UserRole } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

interface NavLink {
  to: string;
  label: string;
  icon: typeof Package;
  allowedRoles: UserRole[];
}

const navLinks: NavLink[] = [
  {
    to: '/inventory',
    label: 'Inventory',
    icon: Package,
    allowedRoles: ['Admin', 'Manager', 'Store Keeper'],
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    allowedRoles: ['Admin', 'Manager'],
  },
  {
    to: '/admin',
    label: 'Admin Panel',
    icon: Shield,
    allowedRoles: ['Admin'],
  },
];

export function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  // Role based Link Filters
  const visibleLinks = navLinks.filter((link) =>
    user ? link.allowedRoles.includes(user.role) : false
  );

  return (
    <nav className='bg-background border-b border-border sticky top-0 z-50 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-6'>
            <Link
              to='/inventory'
              className='flex items-center gap-3 hover:opacity-80 transition-opacity'
            >
              <img src={Logo} alt='Slooze' className='h-10' />
              <div className='hidden sm:block'>
                <h1 className='text-lg text-foreground'>Slooze</h1>
                <p className='text-xs text-muted-foreground'>Commodities Management</p>
              </div>
            </Link>

            {/* navLinks */}
            <div className='hidden md:flex items-center gap-1 ml-4'>
              {visibleLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size='sm'
                      className={cn('gap-2', isActive && 'shadow-sm')}
                    >
                      <Icon className='w-4 h-4' />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <NavbarActions />
          </div>
        </div>

        {/* Mobile Navs */}
        <div className='md:hidden flex items-center gap-1 pb-3 overflow-x-auto'>
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size='sm'
                  className={cn('gap-2 whitespace-nowrap', isActive && 'shadow-sm')}
                >
                  <Icon className='w-4 h-4' />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
