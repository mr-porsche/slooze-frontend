import { BarChart3 } from 'lucide-react';
import Logo from '../assets/FFFFFF-1.png';
import { useState } from 'react';

export default function Dashboard() {
  const [lastUpdated] = useState<Date>(new Date());

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div className='min-h-screen bg-slate-50'>
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
        </div>
      </div>
    </div>
  );
}
