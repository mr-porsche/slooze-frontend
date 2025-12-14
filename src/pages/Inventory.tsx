import Logo from '@/assets/FFFFFF-1.png';
import { DeleteDialog } from '@/components/inventory/DeleteDialog';
import { ProductCard } from '@/components/inventory/ProductCard';
import { ProductForm } from '@/components/inventory/ProductForm';
import { StatsCard } from '@/components/layout/StatsCard';
import { Button } from '@/components/ui/button';
import { UseCategories } from '@/hooks/useCategories';
import { UseLocalProducts } from '@/hooks/useLocalProducts';
import { UseProducts } from '@/hooks/useProducts';
import type { Product, ProductFormData, SortBy, SortOrder } from '@/types/product';
import { Loader2, Package, Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Inventory() {
  const { products, isLoading, isRefreshing, refreshProducts } = UseProducts();
  const { categories } = UseCategories();
  const { addProduct, updateProduct, deleteProduct: deleteLocalProduct } = UseLocalProducts();

  // Sorting state
  const [sortBy] = useState<SortBy>('title');
  const [sortOrder] = useState<SortOrder>('asc');

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Sorting Products
  const sortedProducts = useMemo(() => {
    const result = [...products];

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'createdAt': {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = dateB - dateA;
          break;
        }
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, sortBy, sortOrder]);

  // CRUD Operation Handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;

    if (deleteProduct.isCustom) {
      const success = deleteLocalProduct(deleteProduct.id);
      if (success) {
        await refreshProducts();
        alert('Product deleted successfully'); // Later will implement Toastify
      } else {
        alert('Failed to delete product'); // Later will implement Toastify
      }
    } else {
      alert('Cannot delete API products'); // Later will implement Toastify
    }

    setDeleteProduct(null);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        if (editingProduct.isCustom) {
          const updated = updateProduct(editingProduct.id, data);
          if (updated) {
            await refreshProducts();
            alert('Product updated successfully'); // Later will implement Toastify
            setIsFormOpen(false);
            setEditingProduct(null);
          } else {
            alert('Failed to update product'); // Later will implement Toastify
          }
        } else {
          alert('Cannot edit API products. Create a custom product instead.'); // Later will implement Toastify
        }
      } else {
        // Adding new Product
        const addedProduct = addProduct(data);
        if (addedProduct) {
          await refreshProducts();
          alert('Product added successfully'); // Later will implement Toastify
          setIsFormOpen(false);
        } else {
          alert('Failed to add product'); // Later will implement Toastify
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product'); // Later will implement Toastify
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin text-slate-400 mx-auto mb-4' />
          <p className='text-slate-600'>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <header className='bg-white border-b border-slate-200 sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <img src={Logo} alt='Slooze' className='h-18' />
              <div className='h-8 w-px bg-slate-300' />
              <div>
                <h1 className='text-slate-800'>Inventory Management</h1>
                <p className='text-sm text-slate-600'>{sortedProducts.length} products</p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={refreshProducts} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size='sm' onClick={handleAddProduct}>
                <Plus className='w-4 h-4 mr-2' />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-4 space-y-6'>
        {/* STAT Card */}
        <StatsCard products={products} variant='compact' />
        {/* Upcoming feature */}
        <p className='text-center font-semibold'>
          Upcoming feature: Filter <span className='text-red-500 font-extrabold'>*</span>
        </p>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className='text-center py-16'>
            <Package className='w-16 h-16 text-slate-300 mx-auto mb-4' />
            <h3 className='text-slate-800 mb-2'>Products not found!</h3>
            <p className='text-slate-600 mb-4'>Start by adding your first product</p>
            <Button onClick={handleAddProduct}>
              <Plus className='w-4 h-4 mr-2' />
              Add First Product
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Form */}
      <ProductForm
        product={editingProduct}
        categories={categories}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
      />
      {/* Confirm Delete Dialog Form */}
      <DeleteDialog
        product={deleteProduct}
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
