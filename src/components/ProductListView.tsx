import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Eye, Bookmark, ExternalLink, Package } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';

interface ProductListViewProps {
  products: Product[];
}

const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  const handleCTAClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = product.affiliate_link || product.payment_link;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gradient-subtle rounded-full flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No tools found
        </h3>
        <p className="text-muted-foreground max-w-md">
          No tools match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <Link 
                to={`/tools/${product.slug}`}
                className="block w-24 h-24 bg-gradient-subtle rounded-lg overflow-hidden"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </Link>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Link 
                    to={`/tools/${product.slug}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.is_featured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {product.is_newly_launched && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                    {product.is_free ? (
                      <Badge variant="outline" className="text-xs">
                        Free
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right ml-4">
                  {product.is_free ? (
                    <span className="text-lg font-semibold text-primary">Free</span>
                  ) : product.discounted_price ? (
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">
                        {formatPrice(product.discounted_price)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  ) : product.original_price ? (
                    <span className="text-lg font-semibold text-foreground">
                      {formatPrice(product.original_price)}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {product.description}
              </p>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {product.views_count || 0}
                  </span>
                  <span className="flex items-center">
                    <Bookmark className="h-3 w-3 mr-1" />
                    {product.saves_count || 0}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={(e) => handleCTAClick(e, product)}
                  className="ml-4"
                >
                  {product.cta_button_text || 'Learn More'}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductListView;