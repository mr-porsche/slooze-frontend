import { useEffect, useState } from 'react';
import type { Product, ProductFormData } from '@/types/product';
import { UseProducts } from '@/hooks/useProducts';
import { UseCategories } from '@/hooks/useCategories';
import { UseLocalProducts } from '@/hooks/useLocalProducts';
import { useFilter } from '@/hooks/useFilter';
import { useSorting } from '@/hooks/useSorting';
import { StatsCard } from '@/components/layout/StatsCard';
import { ProductFilters } from '@/components/layout/ProductFilters';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/inventory/EmptyState';
import { ProductGrid } from '@/components/inventory/ProductGrid';
import { ProductForm } from '@/components/inventory/ProductForm';
import { DeleteDialog } from '@/components/inventory/DeleteDialog';
import { Package, Plus, Search } from 'lucide-react';

export default function Inventory() {
  // Data Hooks
  const { products, isLoading, refreshProducts } = UseProducts();
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

  // Listening to add product event for navbarAction
  useEffect(() => {
    const handleOpenAddProduct = () => {
      setEditingProduct(null);
      setIsFormOpen(true);
    };

    window.addEventListener('openAddProduct', handleOpenAddProduct);
    return () => window.removeEventListener('openAddProduct', handleOpenAddProduct);
  }, []);

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

  // Loading State
  if (isLoading) {
    return <LoadingState message='Loading inventory' />;
  }

  const showNoProducts = products.length === 0;
  const showNoResults = !showNoProducts && sortedProducts.length === 0;

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-foreground mb-1'>Inventory Management</h1>
          <p className='text-muted-foreground'>{products.length} total products in inventory</p>
        </div>
      </div>

      {/***************** Main Content ****************/}
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
