import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolTypeTabsSection from './ToolTypeTabsSection';
import ToolSidebar from './ToolSidebar';
import ProductViewControls from './ProductViewControls';
import ProductGridDisplay from './ProductGridDisplay';
import ProductListView from './ProductListView';
import { useProductStats } from '@/hooks/useProductStats';
import { useCategoriesByProductType } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

const ModernHomepage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial tab from URL parameter, default to 'ai_tools'
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    // Don't allow paid_tools tab for now (hidden until we have paid products)
    if (tab === 'paid_tools') return 'ai_tools';
    return ['ai_tools', 'software', 'free_tools'].includes(tab || '') ? tab! : 'ai_tools';
  };
  
  // State management
  const [activeToolType, setActiveToolType] = useState(getInitialTab());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'featured' | 'newly_launched'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newly_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching
  const { data: productStats, isLoading: statsLoading } = useProductStats();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByProductType(activeToolType);
  
  // Products query based on active filters - now all products come from database
  const { data: displayProducts = [], isLoading: productsLoading } = useProducts({
    productType: activeToolType,
    categoryId: activeCategory || undefined,
    limit: 200,
    isFeatured: activeSubTab === 'featured' ? true : undefined,
    isNewlyLaunched: activeSubTab === 'newly_launched' ? true : undefined,
    sortBy: sortBy,
    sortOrder: sortOrder
  });

  // Reset category and sub tab when tool type changes
  useEffect(() => {
    setActiveCategory(null);
    setActiveSubTab('all');
  }, [activeToolType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToolTypeSelect = (toolType: string) => {
    setActiveToolType(toolType);
    // Update URL parameter when tab is selected
    setSearchParams({ tab: toolType });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  const handleSubTabSelect = (subTab: 'all' | 'featured' | 'newly_launched') => {
    setActiveSubTab(subTab);
  };

  const getToolTypeDisplayName = (toolType: string) => {
    const names = {
      ai_tools: 'AI Tools',
      software: 'Software',
      free_tools: 'Free Tools',
      paid_tools: 'Paid Tools'
    };
    return names[toolType as keyof typeof names] || toolType;
  };

  const getCurrentCategoryName = () => {
    if (!activeCategory) return null;
    const category = categories.find(cat => cat.id === activeCategory);
    return category?.name || null;
  };

  // Show sidebar layout for tool types with categories
  const showSidebarLayout = categories && categories.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-subtle border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Every tool you need in{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              one place
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover, compare, and access the best AI tools, software, and digital resources. 
            All categories organized for easy navigation.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for tools, software, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-12 bg-background/80 backdrop-blur border-border"
              />
              <Button 
                type="submit" 
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:opacity-90"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Tool Type Tabs */}
      <ToolTypeTabsSection
        activeToolType={activeToolType}
        onToolTypeSelect={handleToolTypeSelect}
        productStats={productStats}
        isLoading={statsLoading}
      />

      {/* Main Content Area */}
      {showSidebarLayout ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <ToolSidebar
            categories={categories || []}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
            productCount={displayProducts.length}
            activeSubTab={activeSubTab}
            onSubTabSelect={handleSubTabSelect}
            activeToolType={activeToolType}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ProductViewControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              totalCount={displayProducts.length}
            />

            <div className="flex-1 p-6">
              {viewMode === 'grid' ? (
                <ProductGridDisplay
                  products={displayProducts}
                  isLoading={productsLoading}
                  categoryName={getCurrentCategoryName()}
                />
              ) : (
                <ProductListView
                  products={displayProducts}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Simple layout for Free Tools */
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {getToolTypeDisplayName(activeToolType)}
            </h2>
            <p className="text-muted-foreground">
              Essential calculators and utilities - completely free to use
            </p>
          </div>

          <ProductGridDisplay
            products={displayProducts}
            isLoading={productsLoading}
            categoryName={getCurrentCategoryName()}
          />
        </div>
      )}
    </div>
  );
};

export default ModernHomepage;