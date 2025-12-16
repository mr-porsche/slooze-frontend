import type { FilterOptions } from '@/hooks/useFilter';
import type { SortBy, SortOrder } from '@/types/product';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowUpDown, ChevronDown, Filter, Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  // Filter Related Props
  filters: FilterOptions;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categories: string[]) => void;
  onStockStatusChange: (status: FilterOptions['stockStatus']) => void;
  onPriceRangeRangeChange: (range: { min: number; max: number }) => void;
  onResetFilters: () => void;
  activeFilterCounts: number;

  // Filter Related Props
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (sort: SortBy) => void;
  onSortOrderChange: (sort: SortOrder) => void;

  // Data Props
  categories: string[];
  totalProducts: number;
  filteredCount: number;
}

const STOCK_STATUS_OPT = [
  { value: 'all', label: 'All Stock Levels' },
  { value: 'in-stock', label: 'In Stock (10+)' },
  { value: 'low-stock', label: 'Low Stock (1-9)' },
  { value: 'out-of-stock', label: 'Out of Stock' },
] as const;

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'title', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock Level' },
  { value: 'category', label: 'Category' },
  { value: 'createdAt', label: 'Added Date' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '$0 - $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000+', min: 1000, max: Infinity },
];

export function ProductFilters({
  filters,
  onSearchChange,
  onCategoryChange,
  onStockStatusChange,
  onPriceRangeRangeChange,
  onResetFilters,
  activeFilterCounts,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  categories,
  totalProducts,
  filteredCount,
}: ProductFiltersProps) {
  const [advancedFilter, setAdvancedFilter] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handlePriceRangeSelect = (range: { min: number; max: number }) => {
    onPriceRangeRangeChange(range);
  };

  return (
    <Card>
      <CardContent className='p-4 space-y-4'>
        <div className='flex flex-col md:flex-row gap-3'>
          {/* SEARCH */}
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search products by name, description, or category...'
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10 pr-10'
            />
            {filters.searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className='w-full md:w-45 cursor-pointer'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className='cursor-pointer'>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Button
            variant='outline'
            size='default'
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className='w-full md:w-auto cursor-pointer'
          >
            <ArrowUpDown className='w-4 h-4 mr-2' /> {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </Button>

          {/* Advance Filter */}
          <Button
            variant={advancedFilter ? 'default' : 'outline'}
            size='default'
            onClick={() => setAdvancedFilter(!advancedFilter)}
            className='w-full md:w-auto relative cursor-pointer'
          >
            <Filter className='w-4 h-4 mr-2' /> Filters
            {activeFilterCounts > 0 && (
              <Badge variant='destructive' className='ml-2 px-1.5 min-w-5 h-5'>
                {activeFilterCounts}
              </Badge>
            )}
            <ChevronDown
              className={cn('w-4 h-4 ml-2 transition-transform', advancedFilter && 'rotate-180')}
            />
          </Button>
        </div>

        {/* Advance Filter Panel*/}
        {advancedFilter && (
          <div className='pt-4 border-t border-border space-y-4'>
            {/* Stock Status */}
            <div>
              <label className='text-sm text-foreground mb-2 block'>Stock Status</label>
              <div className='flex flex-wrap gap-2'>
                {STOCK_STATUS_OPT.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={filters.stockStatus === opt.value ? 'default' : 'outline'}
                    size='sm'
                    className='cursor-pointer'
                    onClick={() => onStockStatusChange(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className='text-sm text-foreground mb-2 block'>Price Range</label>
              <div className='flex flex-wrap gap-2'>
                {PRICE_RANGES.map((range) => {
                  const isActive =
                    filters.priceRange.min === range.min && filters.priceRange.max === range.max;
                  return (
                    <Button
                      key={range.label}
                      variant={isActive ? 'default' : 'outline'}
                      size='sm'
                      className='cursor-pointer'
                      onClick={() => handlePriceRangeSelect(range)}
                    >
                      {range.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div>
                <label className='text-sm text-foreground mb-2 block'>
                  Categories ({filters.selectedCategories.length} selected)
                </label>
                <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                  {categories.map((cat) => {
                    const isSelected = filters.selectedCategories.includes(cat);
                    return (
                      <Badge
                        key={cat}
                        variant={isSelected ? 'default' : 'outline'}
                        className='cursor-pointer hover:opacity-80 transition-opacity capitalize'
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        {cat} {isSelected && <X className='w-3 h-3 ml-1' />}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Reset */}
            {activeFilterCounts > 0 && (
              <div className='flex items-center justify-between py-2'>
                <p className='text-sm text-muted-foreground'>
                  Showing {filteredCount} of {totalProducts} products
                </p>
                <Button
                  variant='ghost'
                  size='sm'
                  className='cursor-pointer'
                  onClick={onResetFilters}
                >
                  <X className='w-4 h-4 mr-2' /> Reset All filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY */}
        {!advancedFilter && (
          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <p>
              Showing {filteredCount} of {totalProducts} products
            </p>
            {activeFilterCounts > 0 && (
              <Button variant='ghost' size='sm' className='cursor-pointer' onClick={onResetFilters}>
                <X className='w-4 h-4 mr-2' /> Reset filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
