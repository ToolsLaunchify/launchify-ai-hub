import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  product_type: string | null;
  is_free: boolean | null;
  is_featured: boolean | null;
  original_price: number | null;
  discounted_price: number | null;
  currency: string | null;
  affiliate_link: string | null;
  payment_link: string | null;
  cta_button_text: string | null;
  views_count: number | null;
  saves_count: number | null;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const ProductTypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products-by-type', type],
    queryFn: async (): Promise<Product[]> => {
      let productType = type;
      
      // Map URL segments to database product types
      const typeMapping: Record<string, string> = {
        'ai-tools': 'ai_tools',
        'free-tools': 'free_tools',
        'paid-tools': 'paid_tools',
        'software': 'software'
      };

      if (type && typeMapping[type]) {
        productType = typeMapping[type];
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('product_type', productType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!type,
  });

  const getPageTitle = () => {
    const titleMap: Record<string, string> = {
      'ai-tools': 'AI Tools',
      'free-tools': 'Free Tools',
      'paid-tools': 'Paid Tools',
      'software': 'Software'
    };
    return titleMap[type || ''] || 'Products';
  };

  const handleSaveProduct = (productId: string) => {
    console.log('Save product:', productId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-80 bg-muted"></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
        <p className="text-muted-foreground">There was an error loading the products.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{getPageTitle()}</h1>
        <p className="text-muted-foreground">
          Discover amazing {getPageTitle().toLowerCase()} to boost your productivity
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">
            No {getPageTitle().toLowerCase()} available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description || '',
                image: product.image_url || '/placeholder.svg',
                category: product.category?.name || 'Uncategorized',
                isFree: product.is_free || false,
                isFeatured: product.is_featured || false,
                originalPrice: product.original_price || undefined,
                discountedPrice: product.discounted_price || undefined,
                currency: (product.currency as 'USD' | 'INR') || 'USD',
                ctaText: product.cta_button_text || 'Learn More',
                launchDate: product.created_at,
                viewsCount: product.views_count || 0,
                slug: product.slug,
                isAffiliate: !!product.affiliate_link,
                affiliateLink: product.affiliate_link || undefined,
                paymentLink: product.payment_link || undefined,
              }}
              onSave={handleSaveProduct}
              isAuthenticated={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTypePage;