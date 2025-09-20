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
    <div className="tab-container-elevated backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap justify-center gap-4">
          {toolTypes.map((toolType) => {
            const Icon = toolType.icon;
            const isActive = activeToolType === toolType.id;
            
            return (
              <Button
                key={toolType.id}
                variant="ghost"
                onClick={() => onToolTypeSelect(toolType.id)}
                className={`h-16 px-8 flex items-center space-x-4 group transition-all duration-300 rounded-full font-medium border-animated ${
                  isActive
                    ? 'tab-active-enhanced'
                    : 'tab-inactive-enhanced-borders'
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
                    isActive ? 'text-white' : 'text-foreground group-hover:text-white'
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