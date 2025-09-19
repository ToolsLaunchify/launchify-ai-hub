import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, Gift, CreditCard, Loader2 } from 'lucide-react';

interface ToolTypeTabsSectionProps {
  activeToolType: string;
  onToolTypeSelect: (toolType: string) => void;
  productStats?: {
    ai_tools: number;
    software: number;
    free_tools: number;
    paid_tools: number;
    total: number;
  };
  isLoading?: boolean;
}

const ToolTypeTabsSection: React.FC<ToolTypeTabsSectionProps> = ({
  activeToolType,
  onToolTypeSelect,
  productStats,
  isLoading = false
}) => {
  const toolTypes = [
    {
      id: 'ai_tools',
      name: 'AI Tools',
      icon: Bot,
      description: 'AI-powered solutions',
      count: productStats?.ai_tools || 0,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'software',
      name: 'Software',
      icon: Package,
      description: 'Professional software',
      count: productStats?.software || 0,
      gradient: 'from-green-500 to-blue-600'
    },
    {
      id: 'free_tools',
      name: 'Free Tools',
      icon: Gift,
      description: 'Free solutions',
      count: productStats?.free_tools || 0,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'paid_tools',
      name: 'Paid Tools',
      icon: CreditCard,
      description: 'Premium tools & assets',
      count: productStats?.paid_tools || 0,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-3">
          {toolTypes.map((toolType) => {
            const Icon = toolType.icon;
            const isActive = activeToolType === toolType.id;
            
            return (
              <Button
                key={toolType.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onToolTypeSelect(toolType.id)}
                className={`h-14 px-6 flex items-center space-x-3 group transition-all duration-300 rounded-full border ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-glow border-primary/20'
                    : 'hover:bg-card hover:shadow-md hover:border-primary/20 border-border/50 bg-background/80'
                }`}
              >
                <div className={`p-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-primary/10 group-hover:bg-primary/20'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-primary'
                  }`} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${
                    isActive ? 'text-white' : 'text-foreground group-hover:text-primary'
                  } transition-colors`}>
                    {toolType.name}
                  </span>
                  
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 ${
                        isActive ? 'bg-white/20 text-white border-white/20' : 'bg-muted text-muted-foreground'
                      }`}
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

export default ToolTypeTabsSection;