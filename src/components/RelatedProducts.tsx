import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_free: boolean;
  is_featured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RelatedProductsProps {
  currentProduct: Product;
  maxProducts?: number;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProduct, 
  maxProducts = 3 
}) => {
  // Fetch products from the same category, excluding the current product
  const { data: products = [] } = useProducts({
    categoryId: currentProduct.category?.id,
    limit: maxProducts + 2, // Get a few extra in case some need to be filtered out
  });

  // Filter out the current product and limit results
  const relatedProducts = products
    .filter(product => product.id !== currentProduct.id)
    .slice(0, maxProducts);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Related Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover other great tools in the {currentProduct.category?.name || 'same'} category.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.is_free && (
                    <Badge className="bg-gradient-primary shadow-lg">Free</Badge>
                  )}
                  {product.is_featured && (
                    <Badge className="bg-gradient-accent shadow-lg">Featured</Badge>
                  )}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3">
                  {product.description || 'Discover this amazing tool and enhance your productivity.'}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category?.name || 'General'}
                  </Badge>
                  
                  <Button asChild variant="ghost" size="sm" className="group/btn">
                    <Link to={`/${product.slug}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {currentProduct.category && (
          <div className="text-center mt-12">
            <Button asChild variant="hero" size="lg">
              <Link to={`/category/${currentProduct.category.slug}`}>
                View All {currentProduct.category.name} Tools
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;