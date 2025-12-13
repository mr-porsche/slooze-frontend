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
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>
      {children}
      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
}
