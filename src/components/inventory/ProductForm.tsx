import type { Product, ProductFormData } from '@/types/product';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { FormField } from './FormField';

interface ProductFormProps {
  product?: Product | null;
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductForm({ product, categories, isOpen, onClose, onSubmit }: ProductFormProps) {
  const isEditMode = !!product;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          thumbnail: product.thumbnail || '',
        }
      : {
          title: '',
          description: undefined,
          price: 0,
          stock: 0,
          category: categories[0] ?? 'general',
          thumbnail: '',
        },
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the product details below.'
              : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          {/* Title */}
          <FormField id='title' label='Product Title' required error={errors.title?.message}>
            <Input
              id='title'
              placeholder='Product Name'
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
              })}
            />
          </FormField>

          {/* Description */}
          <FormField id='description' label='Description' error={errors.description?.message}>
            <Textarea
              id='description'
              placeholder='Add Product Description'
              {...register('description')}
            />
          </FormField>

          {/* Price & Stock */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField id='price' label='Price ($)' required error={errors.price?.message}>
              <Input
                id='price'
                type='number'
                step='0.01'
                placeholder='0.00'
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0.01, message: 'Price must be greater than 0!' },
                  valueAsNumber: true,
                })}
              />
            </FormField>

            <FormField id='stock' label='Stock' required error={errors.stock?.message}>
              <Input
                id='stock'
                type='number'
                placeholder='0'
                {...register('stock', {
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock must be at least 1 or greater!' },
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField id='category' label='Category' required error={errors.category?.message}>
            <select
              id='category'
              {...register('category', {
                required: 'Category is required',
              })}
              className='flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {categories.map((cat) => (
                <option value={cat} key={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          {/* Thumbnail */}
          <FormField id='thumbnail' label='Thumbnail URL'>
            <Input
              id='thumbnail'
              type='url'
              placeholder='https://example.com/image.jpg (optional)'
              {...register('thumbnail')}
            />
          </FormField>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
