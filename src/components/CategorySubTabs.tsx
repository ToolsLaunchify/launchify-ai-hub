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

  // Only show actual categories with products - no mock data

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
              {categories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </Badge>
          </Button>
        </div>

        {/* Category Grid - Multi-row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {categories.map((category) => (
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