import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'lg' }: LoadingStateProps) {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className={`${iconSize[size]} animate-spin text-slate-400 mx-auto mb-4`} />
        <p className='text-slate-600'>{message}</p>
      </div>
    </div>
  );
}
