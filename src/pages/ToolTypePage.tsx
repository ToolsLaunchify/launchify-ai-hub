import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  product_count: number;
}

const ToolTypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  // Map URL type to database product_type
  const productTypeMapping: { [key: string]: string } = {
    'ai-tools': 'ai_tools',
    'software': 'software',
    'free-tools': 'free_tools',
    'digital-products': 'digital_products'
  };

  const productType = productTypeMapping[type || ''];

  // Fetch categories for this product type
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['tool-type-categories', productType],
    queryFn: async (): Promise<Category[]> => {
      if (!productType) return [];

      // Get categories that have products of this type
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          icon
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Get product counts for each category with this product type
      const categoriesWithCounts = await Promise.all(
        data.map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('product_type', productType);

          return {
            ...category,
            product_count: count || 0
          };
        })
      );

      // Filter out categories with no products
      return categoriesWithCounts.filter(cat => cat.product_count > 0);
    },
    enabled: !!productType,
  });

  const getPageTitle = (type: string | undefined) => {
    switch (type) {
      case 'ai-tools':
        return 'AI Tools';
      case 'software':
        return 'Software';
      case 'free-tools':
        return 'Free Tools';
      case 'digital-products':
        return 'Digital Products';
      default:
        return 'Tools';
    }
  };

  const getPageDescription = (type: string | undefined) => {
    switch (type) {
      case 'ai-tools':
        return 'Discover cutting-edge AI-powered solutions across different categories';
      case 'software':
        return 'Professional software solutions for various business needs';
      case 'free-tools':
        return 'Useful tools at no cost for individuals and businesses';
      case 'digital-products':
        return 'Templates, assets, and digital downloads for your projects';
      default:
        return 'Browse tools by category';
    }
  };

  if (!productType) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Type Not Found</h1>
        <p className="text-muted-foreground mb-6">The tool type you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {getPageTitle(type)} <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Categories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {getPageDescription(type)}
          </p>
          <Badge variant="secondary" className="text-sm">
            {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Available
          </Badge>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-muted/20 hover:border-primary/20 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="text-4xl mb-4">{category.icon || '📂'}</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {category.description}
                    </p>
                    <Badge variant="outline" className="mt-auto">
                      {category.product_count} {category.product_count === 1 ? 'Tool' : 'Tools'}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground">
              No categories have been created for {getPageTitle(type).toLowerCase()} yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolTypePage;