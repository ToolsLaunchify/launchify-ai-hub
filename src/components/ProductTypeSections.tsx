import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Monitor, Gift, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      href: '/category/ai-tools',
      count: productStats?.ai_tools || 0
    },
    {
      id: 'software',
      title: 'Software',
      description: 'Professional software solutions',
      icon: Monitor,
      gradient: 'from-green-500 to-teal-600',
      href: '/category/software',
      count: productStats?.software || 0
    },
    {
      id: 'free_tools',
      title: 'Free Tools',
      description: 'Useful tools at no cost',
      icon: Gift,
      gradient: 'from-orange-500 to-red-600',
      href: '/free-tools',
      count: productStats?.free_tools || 0
    },
    {
      id: 'digital_products',
      title: 'Digital Products',
      description: 'Templates, assets, and downloads',
      icon: Package,
      gradient: 'from-pink-500 to-purple-600',
      href: '/category/digital-products',
      count: productStats?.digital_products || 0
    }
  ];

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productTypes.map((type) => (
            <Link key={type.id} to={type.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-muted/20 hover:border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {type.description}
                  </p>
                  <div className="text-sm font-semibold text-white bg-gradient-primary px-3 py-1 rounded-full">
                    {type.count} Tools
                  </div>
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