import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolTypeTabsSection from './ToolTypeTabsSection';
import CategorySubTabs from './CategorySubTabs';
import ProductGridDisplay from './ProductGridDisplay';
import { useProductStats } from '@/hooks/useProductStats';
import { useCategoriesByProductType } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import percentageCalculatorIcon from '@/assets/percentage-calculator-icon.jpg';
import bmiCalculatorIcon from '@/assets/bmi-calculator-icon.jpg';

const ModernHomepage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeToolType, setActiveToolType] = useState('ai_tools');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching
  const { data: productStats, isLoading: statsLoading } = useProductStats();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByProductType(activeToolType);
  
  // Products query based on active filters
  const { data: databaseProducts = [], isLoading: productsLoading } = useProducts({
    productType: activeToolType,
    categoryId: activeCategory || undefined,
    limit: 20
  });

  // Static free tools that are not in the database
  const staticFreeTools = activeToolType === 'free_tools' ? [
    {
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      slug: 'percentage-calculator',
      description: 'Calculate percentages, percentage changes, and percentage of totals with ease.',
      rich_description: null,
      image_url: percentageCalculatorIcon,
      category_id: null,
      product_type: 'free_tools',
      is_free: true,
      is_featured: false,
      is_newly_launched: true,
      is_popular: false,
      is_trending: false,
      is_editors_choice: false,
      original_price: null,
      discounted_price: null,
      currency: null,
      affiliate_link: '/tools/percentage-calculator',
      payment_link: null,
      cta_button_text: 'Use Tool',
      views_count: 0,
      saves_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: null
    },
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator',
      slug: 'bmi-calculator',
      description: 'Calculate your Body Mass Index using metric or imperial units.',
      rich_description: null,
      image_url: bmiCalculatorIcon,
      category_id: null,
      product_type: 'free_tools',
      is_free: true,
      is_featured: false,
      is_newly_launched: true,
      is_popular: false,
      is_trending: false,
      is_editors_choice: false,
      original_price: null,
      discounted_price: null,
      currency: null,
      affiliate_link: '/tools/bmi-calculator',
      payment_link: null,
      cta_button_text: 'Use Tool',
      views_count: 0,
      saves_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: null
    }
  ] : [];

  // For free tools, only show static tools. For other types, combine with database products
  const products = activeToolType === 'free_tools' 
    ? staticFreeTools 
    : [...staticFreeTools, ...databaseProducts];

  // Reset category when tool type changes
  useEffect(() => {
    setActiveCategory(null);
  }, [activeToolType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToolTypeSelect = (toolType: string) => {
    setActiveToolType(toolType);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setActiveCategory(categoryId);
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

      {/* Category Sub-tabs */}
      <CategorySubTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        isLoading={categoriesLoading}
        toolType={getToolTypeDisplayName(activeToolType)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {getToolTypeDisplayName(activeToolType)}
            {getCurrentCategoryName() && (
              <span className="text-primary"> • {getCurrentCategoryName()}</span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {activeCategory 
              ? `Explore ${getCurrentCategoryName()} tools and solutions`
              : `Browse all ${getToolTypeDisplayName(activeToolType).toLowerCase()} available`
            }
          </p>
        </div>

        {/* Products Grid */}
        <ProductGridDisplay
          products={products}
          isLoading={productsLoading}
          categoryName={getCurrentCategoryName()}
        />
      </div>
    </div>
  );
};

export default ModernHomepage;