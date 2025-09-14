import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  category: string;
  subCategory?: string;
  isFree: boolean;
  isFeatured: boolean;
  originalPrice?: number;
  discountedPrice?: number;
  currency: 'USD' | 'INR';
  ctaText: string;
  launchDate: string;
  rating?: number;
  viewsCount: number;
  isAffiliate: boolean;
  paymentLink?: string;
  affiliateLink?: string;
}

interface SavedProduct {
  id: string;
  created_at: string;
  product: Product;
}

const SavedProductsPage = () => {
  const { user } = useAuth();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedProducts();
    }
  }, [user]);

  const fetchSavedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_saved_products')
        .select(`
          id,
          created_at,
          product:products (
            id,
            name,
            slug,
            description,
            image_url,
            is_free,
            is_featured,
            original_price,
            discounted_price,
            currency,
            affiliate_link,
            payment_link,
            cta_button_text,
            created_at,
            views_count,
            category:categories (
              id,
              name,
              slug
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match ProductCard interface
      const transformedData = data?.map(item => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          description: item.product.description || '',
          image: item.product.image_url,
          category: item.product.category?.name || 'General',
          subCategory: '',
          isFree: item.product.is_free,
          isFeatured: item.product.is_featured,
          originalPrice: item.product.original_price,
          discountedPrice: item.product.discounted_price,
          currency: (item.product.currency || 'USD') as 'USD' | 'INR',
          ctaText: item.product.cta_button_text || 'Learn More',
          launchDate: item.product.created_at,
          viewsCount: item.product.views_count || 0,
          isAffiliate: !!item.product.affiliate_link,
          paymentLink: item.product.payment_link,
          affiliateLink: item.product.affiliate_link,
        }
      })) || [];

      setSavedProducts(transformedData);

    } catch (error) {
      console.error('Error fetching saved products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (productId: string) => {
    try {
      await supabase
        .from('user_saved_products')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user?.id);

      setSavedProducts(prev => prev.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Error removing saved product:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your saved products.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BookmarkIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Saved Products</h1>
          <p className="text-muted-foreground">
            {savedProducts.length} saved {savedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <Card className="text-center py-16">
          <CardHeader>
            <BookmarkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle>No Saved Products</CardTitle>
            <CardDescription>
              Start saving products you're interested in to see them here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item.product}
              onSave={() => handleRemoveSaved(item.product.id)}
              isAuthenticated={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProductsPage;