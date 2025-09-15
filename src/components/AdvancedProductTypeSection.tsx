import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Monitor, Gift, Package, ArrowRight, TrendingUp, Users, Star, Grid, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProductStats } from '@/hooks/useProductStats';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useProducts } from '@/hooks/useProducts';

interface CategoryModalProps {
  typeId: string;
  productType: string;
  title: string;
  gradient: string;
  count: number;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  typeId, 
  productType, 
  title,
  gradient,
  count
}) => {
  const { data: categories = [] } = useCategoryStats();
  const { data: products = [] } = useProducts({ productType, limit: 8 });
  
  // Get relevant categories for this product type - filter by actual product type
  const relevantCategories = categories.filter(category => {
    // Get products of this category to check if they match the product type
    const categoryProducts = products.filter(p => p.category_id === category.id);
    return categoryProducts.length > 0;
  }).slice(0, 8);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-3 text-2xl">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Grid className="h-5 w-5 text-white" />
          </div>
          <span>Explore {title} Categories</span>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 pt-4">
        {/* Categories Grid */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Popular Categories ({relevantCategories.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`}
                className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 hover:border-primary/50 group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <span className="text-white text-lg">{category.icon || '📁'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-primary transition-colors truncate">{category.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {category.description || 'Explore tools in this category'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                  <Badge className="bg-gradient-accent text-white border-none text-xs px-2 py-1 whitespace-nowrap">
                    {category.product_count}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            Featured Products ({products.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.slice(0, 6).map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.slug}`}
                className="flex items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30 hover:border-primary/30 group"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg mr-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm font-bold">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium group-hover:text-primary transition-colors truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {product.is_free && (
                      <Badge variant="secondary" className="text-xs">Free</Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="bg-gradient-accent text-white border-none text-xs">Featured</Badge>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="pt-4 border-t border-border/50">
          <Link to={`/type/${typeId.replace('_', '-')}`}>
            <Button className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300`}>
              View All {title} ({count} total)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </DialogContent>
  );
};

const AdvancedProductTypeSection: React.FC = () => {
  const { data: productStats } = useProductStats();

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
      features: []
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
      features: []
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
      features: []
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
      features: []
    }
  ];


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
          {productTypes.map((type, index) => (
              <Card 
                key={type.id} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in"
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
                        
        {/* Remove hardcoded feature tags - these will be shown in expanded view */}
                      </div>
                    </div>
                    
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="flex items-center space-x-2 bg-gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Grid className="w-4 h-4" />
                          <span>Explore Categories</span>
                        </Button>
                      </DialogTrigger>
                      <CategoryModal
                        typeId={type.id}
                        productType={type.id}
                        title={type.title}
                        gradient={type.gradient}
                        count={type.count}
                      />
                    </Dialog>
                    
                    <Link to={type.href}>
                      <Button className={`bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300`}>
                        View All {type.title}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              ))}
        </div>

        {/* Removed redundant count sections */}
      </div>
    </section>
  );
};

export default AdvancedProductTypeSection;