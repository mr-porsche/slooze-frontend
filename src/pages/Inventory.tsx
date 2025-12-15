import Logo from '@/assets/FFFFFF-1.png';
import { DeleteDialog } from '@/components/inventory/DeleteDialog';
import { EmptyState } from '@/components/inventory/EmptyState';
import { ProductForm } from '@/components/inventory/ProductForm';
import { ProductGrid } from '@/components/inventory/ProductGrid';
import { ProductFilters } from '@/components/layout/ProductFilters';
import { StatsCard } from '@/components/layout/StatsCard';
import { Button } from '@/components/ui/button';
import { UseCategories } from '@/hooks/useCategories';
import { useFilter } from '@/hooks/useFilter';
import { UseLocalProducts } from '@/hooks/useLocalProducts';
import { UseProducts } from '@/hooks/useProducts';
import { useSorting } from '@/hooks/useSorting';
import type { Product, ProductFormData } from '@/types/product';
import { Loader2, Package, Plus, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';

export default function Inventory() {
  // Data Hooks
  const { products, isLoading, isRefreshing, refreshProducts } = UseProducts();
  const { categories } = UseCategories();
  const { addProduct, updateProduct, deleteProduct: deleteLocalProduct } = UseLocalProducts();

  // Filter hooks
  const {
    filters,
    setSearchQuery,
    setSelectedCategories,
    setStockStatus,
    setPriceRange,
    resetFilters,
    filteredProducts,
    activeFilterCount,
  } = useFilter(products);

  // Sorting Hooks
  const { sortBy, sortOrder, setSortBy, setSortOrder, sortedProducts } =
    useSorting(filteredProducts);

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

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

  const showNoProducts = products.length === 0;
  const showNoResults = !showNoProducts && sortedProducts.length === 0;

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
        {!showNoProducts && <StatsCard products={products} variant='compact' />}

        {/* FILTERS */}
        {!showNoProducts && (
          <ProductFilters
            filters={filters}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategories}
            onStockStatusChange={setStockStatus}
            onPriceRangeRangeChange={setPriceRange}
            onResetFilters={resetFilters}
            activeFilterCounts={activeFilterCount}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            categories={categories}
            totalProducts={products.length}
            filteredCount={sortedProducts.length}
          />
        )}

        {/* Products Grid OR Empty States */}
        {showNoProducts ? (
          <EmptyState
            icon={Package}
            title='No products found'
            description='Start by adding your first product to the inventory'
            action={{
              label: 'Add First Product',
              onClick: handleAddProduct,
              icon: Plus,
            }}
          />
        ) : showNoResults ? (
          <EmptyState
            icon={Search}
            title='No matching products'
            description='Try adjusting your filters or search query'
            action={{
              label: 'Reset Filters',
              onClick: resetFilters,
            }}
            variant='compact'
          />
        ) : (
          <ProductGrid
            products={sortedProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
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
