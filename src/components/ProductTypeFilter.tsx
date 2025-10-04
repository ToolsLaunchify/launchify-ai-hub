import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, Gift, CreditCard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductType } from '@/hooks/useProductTypeFilter';

interface ProductTypeFilterProps {
  activeType: ProductType;
  onTypeChange: (type: ProductType) => void;
  productStats?: {
    ai_tools: number;
    software: number;
    free_tools: number;
    paid_tools: number;
    total: number;
  };
  isLoading?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
  activeType,
  onTypeChange,
  productStats,
  isLoading = false,
  layout = 'horizontal',
  className
}) => {
  const toolTypes = [
    {
      id: 'ai_tools' as ProductType,
      name: 'AI Tools',
      icon: Bot,
      description: 'AI-powered solutions',
      count: productStats?.ai_tools || 0,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'software' as ProductType,
      name: 'Software',
      icon: Package,
      description: 'Professional software',
      count: productStats?.software || 0,
      gradient: 'from-green-500 to-blue-600'
    },
    {
      id: 'free_tools' as ProductType,
      name: 'Free Tools',
      icon: Gift,
      description: 'Free solutions',
      count: productStats?.free_tools || 0,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'paid_tools' as ProductType,
      name: 'Paid Tools',
      icon: CreditCard,
      description: 'Premium tools & assets',
      count: productStats?.paid_tools || 0,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  // Filter out Paid Tools tab if there are no paid tools
  const visibleToolTypes = toolTypes.filter(toolType => {
    if (toolType.id === 'paid_tools' && toolType.count === 0) {
      return false;
    }
    return true;
  });

  const getGradientStyle = (gradient: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'hsl(217, 91%, 60%)',
      'purple': 'hsl(262, 83%, 58%)',
      'green': 'hsl(142, 71%, 45%)',
      'emerald': 'hsl(160, 84%, 39%)',
      'teal': 'hsl(173, 80%, 40%)',
      'orange': 'hsl(25, 95%, 53%)',
      'red': 'hsl(0, 84%, 60%)'
    };

    const colors = gradient
      .replace('from-', '')
      .replace('to-', '')
      .replace('-500', '')
      .replace('-600', '')
      .split(' ')
      .map(color => colorMap[color] || color);

    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

  if (layout === 'vertical') {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {visibleToolTypes.map((toolType) => {
          const Icon = toolType.icon;
          const isActive = activeType === toolType.id;
          
          return (
            <Button
              key={toolType.id}
              variant="ghost"
              onClick={() => onTypeChange(toolType.id)}
              className={cn(
                "h-auto py-3 px-4 flex items-start gap-3 justify-start group transition-all duration-500 rounded-lg font-medium border-animated",
                isActive
                  ? `tab-active-enhanced tab-active-${toolType.id}`
                  : `tab-inactive-enhanced tab-inactive-${toolType.id}`
              )}
              style={{
                '--tool-gradient': getGradientStyle(toolType.gradient)
              } as React.CSSProperties}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 shrink-0",
                isActive 
                  ? 'bg-background/20' 
                  : 'bg-primary/10 group-hover:bg-primary/20'
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? 'text-background' : 'text-primary'
                )} />
              </div>
              
              <div className="flex flex-col items-start gap-1 flex-1">
                <span className={cn(
                  "font-medium text-sm",
                  isActive ? 'text-background' : 'text-foreground group-hover:text-background'
                )}>
                  {toolType.name}
                </span>
                
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-2 py-0.5",
                      isActive 
                        ? 'bg-background/20 text-background border-background/20' 
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {toolType.count}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    );
  }

  // Horizontal layout (default)
  return (
    <div className={cn("tab-container-elevated backdrop-blur-sm border-b", className)}>
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap justify-center gap-4">
          {visibleToolTypes.map((toolType) => {
            const Icon = toolType.icon;
            const isActive = activeType === toolType.id;
            
            return (
              <Button
                key={toolType.id}
                variant="ghost"
                onClick={() => onTypeChange(toolType.id)}
                className={cn(
                  "h-16 px-8 flex items-center space-x-4 group transition-all duration-500 rounded-full font-medium border-animated",
                  isActive
                    ? `tab-active-enhanced tab-active-${toolType.id}`
                    : `tab-inactive-enhanced tab-inactive-${toolType.id}`
                )}
                style={{
                  '--tool-gradient': getGradientStyle(toolType.gradient)
                } as React.CSSProperties}
              >
                <div className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isActive 
                    ? 'bg-background/20' 
                    : 'bg-primary/10 group-hover:bg-primary/20'
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    isActive ? 'text-background' : 'text-primary'
                  )} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "font-medium text-sm transition-colors",
                    isActive ? 'text-background' : 'text-foreground group-hover:text-background'
                  )}>
                    {toolType.name}
                  </span>
                  
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs px-2 py-0.5",
                        isActive 
                          ? 'bg-background/20 text-background border-background/20' 
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {toolType.count}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductTypeFilter;
