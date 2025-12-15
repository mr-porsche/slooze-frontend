import { Package, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/FFFFFF-1.png';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { NavbarActions } from './NavbarActions';

interface NavLink {
  to: string;
  label: string;
  icon: typeof Package;
}

const navLinks: NavLink[] = [
  {
    to: '/',
    label: 'Inventory',
    icon: Package,
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
  },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className='bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-6'>
            <Link to='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
              <img src={Logo} alt='Slooze' className='h-10' />
              <div className='hidden sm:block'>
                <h1 className='text-slate-900 text-lg'>Slooze</h1>
                <p className='text-xs text-slate-600'>Commodities Management</p>
              </div>
            </Link>

            {/* navLinks */}
            <div className='hidden md:flex items-center gap-1 ml-4'>
              {navLinks.map((link) => {
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
          {navLinks.map((link) => {
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
