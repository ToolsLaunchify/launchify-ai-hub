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
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {toolTypes.map((toolType) => {
            const Icon = toolType.icon;
            const isActive = activeToolType === toolType.id;
            
            return (
              <Button
                key={toolType.id}
                variant="ghost"
                onClick={() => onToolTypeSelect(toolType.id)}
                className={`h-auto p-6 flex flex-col items-center space-y-3 group transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-glow border-primary/20'
                    : 'hover:shadow-elegant hover:-translate-y-1 border-border'
                } border rounded-lg`}
              >
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gradient-subtle group-hover:scale-110'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    isActive ? 'text-white' : 'text-primary'
                  }`} />
                </div>
                
                <div className="text-center">
                  <h3 className={`font-semibold text-sm ${
                    isActive ? 'text-white' : 'text-foreground group-hover:text-primary'
                  } transition-colors`}>
                    {toolType.name}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    isActive ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {toolType.description}
                  </p>
                </div>

                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      isActive ? 'bg-white/20 text-white border-white/20' : ''
                    }`}
                  >
                    {toolType.count} tools
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolTypeTabsSection;