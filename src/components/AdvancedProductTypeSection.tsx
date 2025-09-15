import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Monitor, Gift, Package, ArrowRight, TrendingUp, Users, Grid, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProductStats } from '@/hooks/useProductStats';
import { supabase } from '@/integrations/supabase/client';

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
  const [relevantCategories, setRelevantCategories] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategoriesForProductType = async () => {
      setIsLoading(true);
      try {
        // First get all categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug, description, icon')
          .is('parent_id', null)
          .order('name');

        if (categoriesError) throw categoriesError;

        // Then get product counts for each category filtered by product type
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => {
            const { count, error: countError } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('product_type', productType);

            if (countError) throw countError;

            return {
              ...category,
              product_count: count || 0
            };
          })
        );

        // Filter out categories with no products of this type and limit results
        const filteredCategories = categoriesWithCounts
          .filter(category => category.product_count > 0)
          .slice(0, 12);

        setRelevantCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories for product type:', error);
        setRelevantCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesForProductType();
  }, [productType]);

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
        {isLoading ? (
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Loading Categories...
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted/70 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              {title} Categories ({relevantCategories.length})
            </h4>
            {relevantCategories.length > 0 ? (
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
                          {category.description || `Explore ${title.toLowerCase()} in this category`}
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
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Grid className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
                <p className="text-muted-foreground">
                  No categories available for {title.toLowerCase()} at the moment.
                </p>
              </div>
            )}
          </div>
        )}

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
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in hover-scale cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5 group-hover:opacity-15 transition-all duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-8 relative transform transition-transform duration-300 group-hover:scale-[1.02]">
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
                    
                    {/* Tool Count Display */}
                    <div className="text-right">
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-gradient-primary mb-1">
                          {type.count}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available Tools
                        </div>
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