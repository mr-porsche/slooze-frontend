import type { ReactNode } from 'react';
import { Label } from '../ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>
        {label} {required && <span className='text-destructive'>*</span>}
      </Label>
      {children}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}
