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
    
    // For embedded tools, open in new window
    if (product.is_embedded_tool && product.tool_url) {
      window.open(product.tool_url, '_blank', 'noopener,noreferrer');
      return;
    }
    
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

  // For embedded tools, open in new window when clicked
  const linkTo = product.is_embedded_tool && product.tool_url 
    ? product.tool_url 
    : `/${product.slug || product.id}`;
  
  const LinkComponent = product.is_embedded_tool && product.tool_url 
    ? ({ children, className }: { children: React.ReactNode; className: string }) => (
        <a 
          href={product.tool_url} 
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            window.open(product.tool_url, '_blank', 'noopener,noreferrer');
          }}
        >
          {children}
        </a>
      )
    : ({ children, className }: { children: React.ReactNode; className: string }) => (
        <Link to={linkTo} className={className}>{children}</Link>
      );

  return (
    <LinkComponent className="block group">
      <Card className="h-full bg-card hover:shadow-lg transition-all duration-300 border-border group-hover:border-primary/20 group-hover:-translate-y-2 overflow-hidden">
        <CardContent className="p-4">
          {/* Product icon/image */}
          <div className="w-full h-32 bg-gradient-subtle rounded-lg flex items-center justify-center mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<span class="text-4xl">🔧</span>';
                }}
              />
            ) : (
              <span className="text-4xl">🔧</span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.is_featured && (
              <Badge className="text-xs bg-gradient-primary text-white border-none">
                Featured
              </Badge>
            )}
            {product.is_free && (
              <Badge className="text-xs bg-gradient-accent text-white border-none">
                Free
              </Badge>
            )}
            {product.category && (
              <Badge variant="secondary" className="text-xs">
                {product.category.name}
              </Badge>
            )}
          </div>

          {/* Product name */}
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Product description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
            {product.description || 'No description available'}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo(product.created_at)}
            </span>
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              {(product.views_count || 0).toLocaleString()}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant={product.is_free ? "accent" : "default"}
            size="sm"
            className="w-full group-hover:shadow-glow transition-all duration-300"
            onClick={handleCTAClick}
          >
            <span>{product.cta_button_text || (product.is_free ? 'Use Tool' : 'Get Now')}</span>
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </LinkComponent>
  );
};

export default ModernProductCard;