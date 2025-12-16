import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
  variant?: 'default' | 'compact';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const padding = variant === 'compact' ? 'py-12' : 'py-16';
  const iconSize = variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16';

  return (
    <div className={`text-center ${padding} text-foreground`}>
      <Icon className={`${iconSize} text-muted-foreground mx-auto mb-4`} />
      <h3 className='text-foreground mb-2'>{title}</h3>
      <h3 className='text-muted-foreground mb-4'>{description}</h3>
      {action && (
        <Button onClick={action.onClick}>
          {action.icon && <action.icon className='w-4 h-4 mr-2' />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
