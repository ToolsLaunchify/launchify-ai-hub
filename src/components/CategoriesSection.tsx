import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useCategoryStats } from '@/hooks/useCategoryStats';

const CategoriesSection: React.FC = () => {
  const { data: categories = [], isLoading } = useCategoryStats();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border hover-lift animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore <span className="text-gradient-primary">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover tools organized by category to find exactly what you need
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              <Card className="bg-card border-border hover-lift transition-smooth cursor-pointer group">
              
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {category.description}
                </p>
                <Badge variant="secondary" className="mb-4 text-xs font-medium">
                  {category.product_count} Tool{category.product_count !== 1 ? 's' : ''}
                </Badge>
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full bg-gradient-primary hover:opacity-90 text-white"
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 bg-gradient-primary hover:opacity-90"
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;