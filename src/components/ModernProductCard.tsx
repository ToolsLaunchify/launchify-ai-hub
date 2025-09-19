import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/hooks/useProducts';

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product }) => {
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else if (product.payment_link) {
      window.open(product.payment_link, '_blank');
    }
  };

  const formatPrice = (price: number) => {
    return product.currency === 'USD' ? `$${price}` : `₹${price}`;
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Link to={`/${product.slug || product.id}`} className="block group">
      <Card className="h-full bg-card hover:shadow-elegant transition-all duration-300 border-border group-hover:border-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-6">
          {/* Header with badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {product.is_featured && (
                <Badge className="mb-2 bg-gradient-primary text-white border-none">
                  Featured
                </Badge>
              )}
              {product.is_free && (
                <Badge className="mb-2 bg-gradient-accent text-white border-none">
                  Free
                </Badge>
              )}
            </div>
            
            {/* Product icon/image placeholder */}
            <div className="w-12 h-12 bg-gradient-subtle rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-primary">🔧</span>
              )}
            </div>
          </div>

          {/* Product name */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Product description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
            {product.description || 'No description available'}
          </p>

          {/* Category badge */}
          {product.category && (
            <Badge variant="secondary" className="mb-4 text-xs">
              {product.category.name}
            </Badge>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo(product.created_at)}
            </span>
            <span>{(product.views_count || 0).toLocaleString()} views</span>
          </div>

          {/* Price display */}
          {!product.is_free && (product.original_price || product.discounted_price) && (
            <div className="mb-4">
              {product.original_price && product.original_price !== product.discounted_price && (
                <span className="text-sm text-muted-foreground line-through block">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {product.discounted_price && (
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.discounted_price)}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            variant={product.is_free ? "accent" : "hero"}
            className="w-full group-hover:shadow-glow transition-all duration-300"
            onClick={handleCTAClick}
          >
            <span>{product.cta_button_text || (product.is_free ? 'Use Tool' : 'Get Now')}</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ModernProductCard;