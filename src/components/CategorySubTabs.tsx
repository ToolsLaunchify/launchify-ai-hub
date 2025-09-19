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

  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 py-4 overflow-x-auto scrollbar-hide">
          {/* All Categories Button */}
          <Button
            variant={activeCategory === null ? "default" : "ghost"}
            size="sm"
            onClick={() => onCategorySelect(null)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === null
                ? 'bg-gradient-primary text-white shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            All Categories
            <Badge variant="secondary" className="ml-2 text-xs">
              {categories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </Badge>
          </Button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <span className="mr-2">{category.icon || '📂'}</span>
              {category.name}
              {category.product_count !== undefined && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.product_count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySubTabs;