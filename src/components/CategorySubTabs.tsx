import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/hooks/useCategories';

interface CategorySubTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  isLoading: boolean;
  toolType: string;
}

const CategorySubTabs: React.FC<CategorySubTabsProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
  isLoading,
  toolType
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          No categories available for {toolType.replace('_', ' ')}
        </p>
      </div>
    );
  }

  // Mock categories for testing design with many items
  const mockCategories = categories.length < 10 ? [
    ...categories,
    { id: 'mock-1', name: 'Web Development', icon: '💻', product_count: 15 },
    { id: 'mock-2', name: 'Mobile Apps', icon: '📱', product_count: 8 },
    { id: 'mock-3', name: 'Data Analytics', icon: '📊', product_count: 12 },
    { id: 'mock-4', name: 'Machine Learning', icon: '🤖', product_count: 22 },
    { id: 'mock-5', name: 'Cloud Services', icon: '☁️', product_count: 18 },
    { id: 'mock-6', name: 'Security Tools', icon: '🔒', product_count: 9 },
    { id: 'mock-7', name: 'Design Tools', icon: '🎨', product_count: 14 },
    { id: 'mock-8', name: 'DevOps', icon: '⚙️', product_count: 11 },
    { id: 'mock-9', name: 'E-commerce', icon: '🛒', product_count: 7 },
    { id: 'mock-10', name: 'Marketing', icon: '📈', product_count: 16 },
    { id: 'mock-11', name: 'Communication', icon: '💬', product_count: 6 },
    { id: 'mock-12', name: 'Project Management', icon: '📋', product_count: 13 },
    { id: 'mock-13', name: 'Finance', icon: '💰', product_count: 10 },
    { id: 'mock-14', name: 'Education', icon: '📚', product_count: 19 },
    { id: 'mock-15', name: 'Healthcare', icon: '🏥', product_count: 5 },
    { id: 'mock-16', name: 'Entertainment', icon: '🎮', product_count: 8 },
    { id: 'mock-17', name: 'Travel', icon: '✈️', product_count: 4 },
    { id: 'mock-18', name: 'Food & Beverage', icon: '🍕', product_count: 3 }
  ] : categories;

  return (
    <div className="tab-container-elevated border-y backdrop-blur-sm">
      <div className="container mx-auto px-4 py-5">
        {/* All Categories Button - Always First */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategorySelect(null)}
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all ${
              activeCategory === null
                ? 'tab-active-enhanced'
                : 'tab-inactive-high-contrast'
            }`}
          >
            All Categories
            <Badge 
              variant="secondary" 
              className={`ml-3 text-xs font-medium ${
                activeCategory === null 
                  ? 'bg-white/25 text-white border-white/20' 
                  : 'bg-primary/15 text-primary border-primary/30'
              }`}
            >
              {mockCategories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </Badge>
          </Button>
        </div>

        {/* Category Grid - Multi-row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {mockCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={`rounded-full px-5 py-3 text-sm font-medium transition-all min-w-[140px] h-auto ${
                activeCategory === category.id
                  ? 'tab-active-enhanced'
                  : 'tab-inactive-high-contrast'
              }`}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="text-base flex-shrink-0">{category.icon || '📂'}</span>
                <span className="text-center leading-tight font-medium">{category.name}</span>
                {category.product_count !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-1.5 text-xs font-medium flex-shrink-0 ${
                      activeCategory === category.id 
                        ? 'bg-white/25 text-white border-white/20' 
                        : 'bg-primary/15 text-primary border-primary/30'
                    }`}
                  >
                    {category.product_count}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySubTabs;