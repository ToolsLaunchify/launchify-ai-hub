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
    <div className="bg-card/50 border-y border-border/60 shadow-elegant backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        {/* All Categories Button - Always First */}
        <div className="mb-3">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(null)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all border-2 ${
              activeCategory === null
                ? 'bg-gradient-primary text-white shadow-glow border-primary/30 hover:shadow-accent-glow'
                : 'bg-card/80 text-foreground hover:bg-primary/5 hover:border-primary/40 border-border/60 hover:text-primary'
            }`}
          >
            All Categories
            <Badge 
              variant="secondary" 
              className={`ml-2 text-xs font-medium ${
                activeCategory === null 
                  ? 'bg-white/25 text-white border-white/20' 
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {categories.reduce((total, cat) => total + (cat.product_count || 0), 0)}
            </Badge>
          </Button>
        </div>

        {/* Category Grid - Multi-row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all border-2 min-w-[120px] h-auto ${
                activeCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-glow border-primary/30 hover:shadow-accent-glow'
                  : 'bg-card/80 text-foreground hover:bg-primary/5 hover:border-primary/40 border-border/60 hover:text-primary'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 w-full">
                <span className="text-base flex-shrink-0">{category.icon || '📂'}</span>
                <span className="text-center leading-tight">{category.name}</span>
                {category.product_count !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 text-xs font-medium flex-shrink-0 ${
                      activeCategory === category.id 
                        ? 'bg-white/25 text-white border-white/20' 
                        : 'bg-primary/10 text-primary border-primary/20'
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