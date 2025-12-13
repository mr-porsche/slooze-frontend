import type { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Edit, Package, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { title, description, price, stock, category, thumbnail, isCustom } = product;

  const isLowStock = stock < 10;
  const isOutOfStock = stock === 0;

  return (
    <Card className='flex flex-col h-full hover:shadow-lg transition-shadow'>
      <CardHeader className='p-0'>
        {/* IMAGE */}
        <div className='relative w-full h-48 bg-slate-100 rounded-t-lg overflow-hidden'>
          {thumbnail ? (
            <img src={thumbnail} alt={title} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <Package className='w-16 h-16 text-slate-300' />
            </div>
          )}

          {/* CUSTOM BADGE */}
          {isCustom && (
            <div className='absolute top-2 left-2'>
              <Badge variant='secondary' className='bg-blue-500 text-white'>
                Custom
              </Badge>
            </div>
          )}

          {/* Stock Status */}
          <div className='absolute top-2 right-2'>
            {isOutOfStock ? (
              <Badge variant='destructive'>Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant='outline' className='bg-yellow-500 text-white border-yellow-lime-600'>
                Low Stock
              </Badge>
            ) : (
              <Badge variant='outline' className='bg-green-500 text-white border-green-lime-600'>
                In Stock
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='flex-1 p-4'>
        <div>
          <Badge variant='outline'>{category}</Badge>
        </div>
        <h3 className='mb-2 line-clamp-1'>{title}</h3>
        <p className='text-sm text-slate-600 mb-3 line-clamp-1'>{description}</p>
        <div className='mb-2'>
          <p className='text-slate-900'>{price.toFixed(2)}</p>
        </div>
        <p className='text-sm text-slate-500'>Stock: {stock}</p>
      </CardContent>

      <CardFooter className='p-4 pt-0 flex gap-2'>
        <Button className='flex-1' variant='outline' size='sm' onClick={() => onEdit(product)}>
          <Edit className='w-4 h-4 mr-2' /> Edit
        </Button>
        {isCustom && (
          <Button
            className='flex-1 text-red-600 hover:text-red-700 hover:bg-red-50'
            variant='outline'
            size='sm'
            onClick={() => onDelete(product)}
          >
            <Trash2 className='w-4 h-4 mr-2' /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
