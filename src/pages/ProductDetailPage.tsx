import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, Bookmark, Star, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rich_description: string | null;
  image_url: string | null;
  category_id: string | null;
  product_type: string | null;
  is_free: boolean | null;
  is_featured: boolean | null;
  is_newly_launched: boolean | null;
  is_popular: boolean | null;
  is_trending: boolean | null;
  is_editors_choice: boolean | null;
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

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleCTAClick = () => {
    if (product?.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else if (product?.payment_link) {
      window.open(product.payment_link, '_blank');
    }
  };

  const formatPrice = (price: number) => {
    return product?.currency === 'USD' ? `$${price}` : `₹${price}`;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const launch = new Date(date);
    const diffTime = Math.abs(now.getTime() - launch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tools</span>
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.is_featured && (
                  <Badge className="bg-gradient-accent">Featured</Badge>
                )}
                {product.is_free && (
                  <Badge className="bg-gradient-primary">Free</Badge>
                )}
                {product.is_newly_launched && (
                  <Badge variant="secondary">New Launch</Badge>
                )}
                {product.is_trending && (
                  <Badge variant="outline">Trending</Badge>
                )}
                {product.is_editors_choice && (
                  <Badge className="bg-gradient-hero">Editor's Choice</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
                )}
                {product.product_type && (
                  <Badge variant="outline">{product.product_type}</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-3">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{timeAgo(product.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{(product.views_count || 0).toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{(product.saves_count || 0).toLocaleString()} saves</span>
              </div>
            </div>

            {/* Pricing */}
            {!product.is_free && (product.original_price || product.discounted_price) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="flex items-center space-x-3">
                  {product.original_price && product.original_price !== product.discounted_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {product.discounted_price && (
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.discounted_price)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-primary hover:opacity-90"
                onClick={handleCTAClick}
              >
                <span>{product.cta_button_text || 'Learn More'}</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Rich Description */}
        {product.rich_description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About {product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: product.rich_description }}
              />
            </CardContent>
          </Card>
        )}

        {/* Features or Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Easy to use interface</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Advanced AI capabilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Regular updates and support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{product.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{product.product_type || 'Software'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Launch Date:</span>
                <span>{new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pricing:</span>
                <span>{product.is_free ? 'Free' : 'Paid'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;