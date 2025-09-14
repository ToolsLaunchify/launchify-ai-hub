import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  rich_description: string;
  image_url: string;
  category_id: string;
  original_price: number;
  discounted_price: number;
  currency: string;
  is_featured: boolean;
  is_free: boolean;
  affiliate_link: string;
  payment_link: string;
  cta_button_text: string;
  views_count: number;
  saves_count: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as Category;
    }
  });

  // Fetch products in this category
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['category-products', category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!category?.id
  });

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
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

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{category.icon}</div>
        <h1 className="text-4xl font-bold mb-4">
          {category.name} <span className="text-gradient-primary">Tools</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {category.description}
        </p>
        <Badge variant="secondary" className="text-sm">
          {products.length} {products.length === 1 ? 'Tool' : 'Tools'} Available
        </Badge>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                image: product.image_url,
                category: category.name,
                isFree: product.is_free,
                isFeatured: product.is_featured,
                originalPrice: product.original_price,
                discountedPrice: product.discounted_price,
                currency: product.currency as 'USD' | 'INR',
                ctaText: product.cta_button_text,
                launchDate: product.created_at,
                viewsCount: product.views_count,
                permalink: `/product/${product.slug}`,
                isAffiliate: !!product.affiliate_link,
                paymentLink: product.payment_link,
                affiliateLink: product.affiliate_link,
              }}
              variant="card"
              isAuthenticated={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Tools Found</h3>
          <p className="text-muted-foreground">
            No tools have been added to this category yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;