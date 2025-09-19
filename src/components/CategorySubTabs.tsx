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

  // Tool-type specific mock categories for testing design
  const getToolTypeSpecificMockCategories = (toolType: string) => {
    const mockCategoriesByType = {
      'ai_tools': [
        { id: 'ai-1', name: 'Machine Learning', icon: '🤖', product_count: 25 },
        { id: 'ai-2', name: 'Natural Language Processing', icon: '💬', product_count: 18 },
        { id: 'ai-3', name: 'Computer Vision', icon: '👁️', product_count: 15 },
        { id: 'ai-4', name: 'AI Assistants', icon: '🤵', product_count: 12 },
        { id: 'ai-5', name: 'Deep Learning', icon: '🧠', product_count: 22 },
        { id: 'ai-6', name: 'AI Analytics', icon: '📊', product_count: 14 },
        { id: 'ai-7', name: 'Speech Recognition', icon: '🎙️', product_count: 8 },
        { id: 'ai-8', name: 'Recommendation Systems', icon: '🎯', product_count: 11 }
      ],
      'software': [
        { id: 'sw-1', name: 'Productivity', icon: '⚡', product_count: 32 },
        { id: 'sw-2', name: 'Development Tools', icon: '💻', product_count: 28 },
        { id: 'sw-3', name: 'Design Software', icon: '🎨', product_count: 24 },
        { id: 'sw-4', name: 'Business Apps', icon: '💼', product_count: 19 },
        { id: 'sw-5', name: 'Communication', icon: '📞', product_count: 16 },
        { id: 'sw-6', name: 'Project Management', icon: '📋', product_count: 21 },
        { id: 'sw-7', name: 'Security Software', icon: '🔒', product_count: 13 },
        { id: 'sw-8', name: 'Media & Entertainment', icon: '🎮', product_count: 17 }
      ],
      'free_tools': [
        { id: 'free-1', name: 'Calculators', icon: '🧮', product_count: 15 },
        { id: 'free-2', name: 'Converters', icon: '🔄', product_count: 12 },
        { id: 'free-3', name: 'Utilities', icon: '🛠️', product_count: 18 },
        { id: 'free-4', name: 'Educational Tools', icon: '📚', product_count: 22 },
        { id: 'free-5', name: 'Text Tools', icon: '📝', product_count: 14 },
        { id: 'free-6', name: 'Image Tools', icon: '🖼️', product_count: 10 },
        { id: 'free-7', name: 'File Tools', icon: '📁', product_count: 8 },
        { id: 'free-8', name: 'Web Tools', icon: '🌐', product_count: 16 }
      ],
      'paid_tools': [
        { id: 'paid-1', name: 'Premium Software', icon: '💎', product_count: 24 },
        { id: 'paid-2', name: 'Professional Services', icon: '🏢', product_count: 18 },
        { id: 'paid-3', name: 'Enterprise Solutions', icon: '🏗️', product_count: 15 },
        { id: 'paid-4', name: 'Advanced Analytics', icon: '📈', product_count: 12 },
        { id: 'paid-5', name: 'Cloud Platforms', icon: '☁️', product_count: 20 },
        { id: 'paid-6', name: 'Security Solutions', icon: '🛡️', product_count: 14 },
        { id: 'paid-7', name: 'Marketing Tools', icon: '📢', product_count: 16 },
        { id: 'paid-8', name: 'Finance Tools', icon: '💰', product_count: 11 }
      ]
    };

    return mockCategoriesByType[toolType as keyof typeof mockCategoriesByType] || [];
  };

  const mockCategories = categories.length < 5 ? [
    ...categories,
    ...getToolTypeSpecificMockCategories(toolType)
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