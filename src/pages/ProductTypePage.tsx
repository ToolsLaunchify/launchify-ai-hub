import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductTypeFilter, ProductType } from '@/hooks/useProductTypeFilter';
import { useCategoriesByProductType } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useProductStats } from '@/hooks/useProductStats';
import ProductTypeFilter from '@/components/ProductTypeFilter';
import ToolSidebar from '@/components/ToolSidebar';
import ProductViewControls from '@/components/ProductViewControls';
import ProductGridDisplay from '@/components/ProductGridDisplay';
import ProductListView from '@/components/ProductListView';
import { Skeleton } from '@/components/ui/skeleton';

const ProductTypePage = () => {
  const { type } = useParams<{ type: string }>();
  
  // Map URL-friendly types to database product types
  const productTypeMapping: Record<string, ProductType> = {
    'ai-tools': 'ai_tools',
    'software': 'software',
    'free-tools': 'free_tools',
    'paid-tools': 'paid_tools',
  };
  
  const mappedType = type ? productTypeMapping[type] : 'ai_tools';
  
  // State management
  const { activeType, setActiveType } = useProductTypeFilter({
    defaultType: mappedType,
    syncWithUrl: false, // We handle URL manually
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'featured' | 'newly_launched'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newly_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Fetch categories for the active type
  const { data: categories, isLoading: categoriesLoading } = useCategoriesByProductType(activeType);
  
  // Fetch product stats
  const { data: productStats, isLoading: statsLoading } = useProductStats();
  
  // Build product filters
  const productFilters: any = {
    productType: activeType,
    sortBy,
    sortOrder,
  };
  
  if (activeCategory) {
    productFilters.categoryId = activeCategory;
  }
  
  if (activeSubTab === 'featured') {
    productFilters.isFeatured = true;
  } else if (activeSubTab === 'newly_launched') {
    productFilters.isNewlyLaunched = true;
  }
  
  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useProducts(productFilters);
  
  // Helper function to get page title based on type
  const getPageTitle = (type: string | undefined): string => {
    switch (type) {
      case 'ai-tools':
        return 'AI Tools';
      case 'software':
        return 'Software';
      case 'free-tools':
        return 'Free Tools';
      case 'paid-tools':
        return 'Paid Tools';
      default:
        return 'Tools';
    }
  };
  
  // Helper function to get page description
  const getPageDescription = (type: string | undefined): string => {
    switch (type) {
      case 'ai-tools':
        return 'Explore our collection of AI-powered tools and solutions';
      case 'software':
        return 'Discover software tools and applications';
      case 'free-tools':
        return 'Browse our collection of free tools and resources';
      case 'paid-tools':
        return 'Premium tools and paid solutions';
      default:
        return 'Browse our tools collection';
    }
  };

  if (!mappedType) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-6">The tool type you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {getPageTitle(type)}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getPageDescription(type)}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 space-y-4 flex-shrink-0">
            {/* Product Type Filter */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Type</h3>
              <ProductTypeFilter
                activeType={activeType}
                onTypeChange={setActiveType}
                productStats={productStats}
                isLoading={statsLoading}
                layout="vertical"
              />
            </div>

            {/* Category Sidebar */}
            <ToolSidebar
              categories={categories || []}
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
              productCount={products.length}
              activeSubTab={activeSubTab}
              onSubTabSelect={setActiveSubTab}
              activeToolType={activeType}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* View Controls */}
            <div className="mb-6">
              <ProductViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                totalCount={products.length}
              />
            </div>

            {/* Products Display */}
            {categoriesLoading || productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <ProductGridDisplay
                products={products}
                isLoading={productsLoading}
                categoryName={activeCategory ? categories?.find(c => c.id === activeCategory)?.name : undefined}
              />
            ) : (
              <ProductListView
                products={products}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductTypePage;
