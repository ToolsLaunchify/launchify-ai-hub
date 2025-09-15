import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Monitor, Gift, Package, ArrowRight, TrendingUp, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductStats } from '@/hooks/useProductStats';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useProducts } from '@/hooks/useProducts';

interface ExpandedTypeProps {
  typeId: string;
  productType: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandedTypeContent: React.FC<ExpandedTypeProps> = ({ 
  typeId, 
  productType, 
  isExpanded, 
  onToggle 
}) => {
  const { data: categories = [] } = useCategoryStats();
  const { data: products = [] } = useProducts({ productType, limit: 6 });
  
  // Get relevant categories for this product type
  const relevantCategories = categories.slice(0, 4);

  if (!isExpanded) return null;

  return (
    <div className="mt-6 animate-fade-in">
      <div className="border-t border-border/50 pt-6">
        {/* Top Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Popular Categories
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {relevantCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs"
              >
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.product_count}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Sample Products */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Featured Products
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {products.slice(0, 3).map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.slug}`}
                className="flex items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-md mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedProductTypeSection: React.FC = () => {
  const { data: productStats } = useProductStats();
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const productTypes = [
    {
      id: 'ai_tools',
      title: 'AI Tools',
      description: 'Cutting-edge AI-powered solutions for modern workflows',
      icon: Zap,
      gradient: 'from-blue-500 via-purple-500 to-indigo-600',
      href: '/type/ai-tools',
      count: productStats?.ai_tools || 0,
      trending: true,
      features: ['Machine Learning', 'Natural Language', 'Computer Vision']
    },
    {
      id: 'software',
      title: 'Software',
      description: 'Professional software solutions for businesses',
      icon: Monitor,
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      href: '/type/software',
      count: productStats?.software || 0,
      trending: false,
      features: ['Enterprise Grade', 'Cloud Ready', 'Scalable']
    },
    {
      id: 'free_tools',
      title: 'Free Tools',
      description: 'High-quality tools at absolutely no cost',
      icon: Gift,
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      href: '/type/free-tools',
      count: productStats?.free_tools || 0,
      trending: true,
      features: ['No Cost', 'Open Source', 'Community Driven']
    },
    {
      id: 'digital_products',
      title: 'Digital Products',
      description: 'Templates, assets, and downloadable resources',
      icon: Package,
      gradient: 'from-pink-500 via-purple-500 to-violet-600',
      href: '/type/digital-products',
      count: productStats?.digital_products || 0,
      trending: false,
      features: ['Instant Download', 'Commercial Use', 'Premium Quality']
    }
  ];

  const handleTypeExpand = (typeId: string) => {
    setExpandedType(expandedType === typeId ? null : typeId);
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            {productStats?.total || 0}+ Tools Available
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Tools by <span className="text-gradient-primary">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection organized by tool types. Each category offers specialized solutions for your specific needs.
          </p>
        </div>
        
        {/* Advanced Product Type Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {productTypes.map((type, index) => {
            const isExpanded = expandedType === type.id;
            return (
              <Card 
                key={type.id} 
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                  isExpanded ? 'lg:col-span-2' : ''
                } animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardContent className="p-8 relative">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <type.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-foreground">
                            {type.title}
                          </h3>
                          {type.trending && (
                            <Badge className="bg-gradient-accent text-white border-none text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        
                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="secondary" 
                              className="text-xs bg-muted/50 text-muted-foreground"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats & Actions */}
                    <div className="text-right">
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-gradient-primary mb-1">
                          {type.count}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Tools
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <ExpandedTypeContent
                    typeId={type.id}
                    productType={type.id}
                    isExpanded={isExpanded}
                    onToggle={() => handleTypeExpand(type.id)}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleTypeExpand(type.id)}
                      className="flex items-center space-x-2 border-muted hover:border-primary hover:text-primary transition-colors"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Explore Categories'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Link to={type.href}>
                      <Button className={`bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300`}>
                        View All {type.title}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
          {productTypes.map((type, index) => (
            <div 
              key={`stat-${type.id}`} 
              className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient-primary mb-1">
                {type.count}
              </div>
              <div className="text-sm text-muted-foreground">
                {type.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedProductTypeSection;