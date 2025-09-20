import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Filter, Tag, Star, Zap } from 'lucide-react';
import type { Category } from '@/hooks/useCategories';

interface ToolSidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  productCount: number;
  activeSubTab: 'all' | 'featured' | 'newly_launched';
  onSubTabSelect: (subTab: 'all' | 'featured' | 'newly_launched') => void;
  activeToolType: string;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
  productCount,
  activeSubTab,
  onSubTabSelect,
  activeToolType
}) => {
  const [filtersOpen, setFiltersOpen] = React.useState(true);
  const [categoriesOpen, setCategoriesOpen] = React.useState(true);

  const subTabs = [
    { id: 'all' as const, label: 'All Tools', icon: Tag },
    { id: 'featured' as const, label: 'Featured', icon: Star },
    { id: 'newly_launched' as const, label: 'Newly Launched', icon: Zap }
  ];

  return (
    <div className="w-80 bg-card border-r border-border h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {activeToolType.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {productCount} tools available
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Sub Tabs */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 mb-3">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Type
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mb-6">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeSubTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSubTabSelect(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-4" />

        {/* Categories */}
        {categories.length > 0 && (
          <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 mb-3">
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <Button
                variant={activeCategory === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onCategorySelect(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-between group"
                  onClick={() => onCategorySelect(category.id)}
                >
                  <span className="flex items-center">
                    {category.icon && (
                      <span className="mr-2 text-sm">{category.icon}</span>
                    )}
                    {category.name}
                  </span>
                  {category.product_count && (
                    <Badge variant="secondary" className="ml-auto">
                      {category.product_count}
                    </Badge>
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </ScrollArea>
    </div>
  );
};

export default ToolSidebar;