import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Monitor, Gift, Package, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductStats } from '@/hooks/useProductStats';

interface ProductTypeSectionProps {
  onTypeSelect?: (type: string) => void;
}

const ProductTypeSections: React.FC<ProductTypeSectionProps> = ({ onTypeSelect }) => {
  const { data: productStats } = useProductStats();

  const productTypes = [
    {
      id: 'ai_tools',
      title: 'AI Tools',
      description: 'Cutting-edge AI-powered solutions',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-600',
      href: '/type/ai-tools',
      count: productStats?.ai_tools || 0,
      order: 1
    },
    {
      id: 'software',
      title: 'Software',
      description: 'Professional software solutions',
      icon: Monitor,
      gradient: 'from-green-500 to-teal-600',
      href: '/type/software',
      count: productStats?.software || 0,
      order: 2
    },
    {
      id: 'free_tools',
      title: 'Free Tools',
      description: 'Useful tools at no cost',
      icon: Gift,
      gradient: 'from-orange-500 to-red-600',
      href: '/type/free-tools',
      count: productStats?.free_tools || 0,
      order: 3
    },
    {
      id: 'paid_tools',
      title: 'Paid Tools',
      description: 'Templates, assets, and downloads',
      icon: Package,
      gradient: 'from-pink-500 to-purple-600',
      href: '/type/paid-tools',
      count: productStats?.paid_tools || 0,
      order: 4
    }
  ].sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by <span className="text-gradient-primary">Tool Type</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to your favorite tool categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productTypes.map((type) => (
            <Link key={type.id} to={type.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-muted/20 hover:border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-center">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm text-center mb-4">
                    {type.description}
                  </p>
                  <Badge className="bg-gradient-primary text-white border-none mb-4">
                    {type.count} Tools
                  </Badge>
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-white border-none group-hover:bg-primary">
                    Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTypeSections;