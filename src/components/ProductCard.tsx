import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Bookmark, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
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
    permalink: string;
    isAffiliate: boolean;
    paymentLink?: string;
    affiliateLink?: string;
  };
  variant?: 'card' | 'list';
  onSave?: (productId: string) => void;
  isAuthenticated?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  variant = 'card', 
  onSave,
  isAuthenticated = false 
}) => {
  const {
    id,
    name,
    description,
    image,
    category,
    subCategory,
    isFree,
    isFeatured,
    originalPrice,
    discountedPrice,
    currency,
    ctaText,
    launchDate,
    rating,
    viewsCount,
    permalink,
    isAffiliate,
    paymentLink,
    affiliateLink
  } = product;

  const handleCTAClick = () => {
    if (isAffiliate && affiliateLink) {
      window.open(affiliateLink, '_blank');
    } else if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && onSave) {
      onSave(id);
    }
  };

  const formatPrice = (price: number) => {
    return currency === 'USD' ? `$${price}` : `₹${price}`;
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

  if (variant === 'list') {
    return (
      <Card className="card-hover border-glow">
        <div className="flex items-start p-4 space-x-4">
          <div className="flex-shrink-0">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="w-16 h-16 rounded-lg object-cover bg-muted"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link to={`/${permalink}`} className="block group">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                </Link>
                
                <div className="flex items-center space-x-2 mt-1 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                  {subCategory && (
                    <Badge variant="outline" className="text-xs">
                      {subCategory}
                    </Badge>
                  )}
                  {isFeatured && (
                    <Badge className="bg-gradient-accent text-xs">Featured</Badge>
                  )}
                  {isFree && (
                    <Badge className="bg-gradient-primary text-xs">Free</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo(launchDate)}
                  </span>
                  <span>{viewsCount.toLocaleString()} views</span>
                  {rating && (
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                {!isFree && (
                  <div className="text-right">
                    {originalPrice && originalPrice !== discountedPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                    {discountedPrice && (
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(discountedPrice)}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className="h-8 w-8"
                    disabled={!isAuthenticated}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={isFree ? "accent" : "hero"}
                    size="sm"
                    onClick={handleCTAClick}
                    className="flex items-center space-x-1"
                  >
                    <span>{ctaText}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-hover border-glow group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="w-full h-48 object-cover bg-muted group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="h-8 w-8 bg-background/80 backdrop-blur hover:bg-background"
              disabled={!isAuthenticated}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {isFeatured && (
              <Badge className="bg-gradient-accent text-xs">Featured</Badge>
            )}
            {isFree && (
              <Badge className="bg-gradient-primary text-xs">Free</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {subCategory && (
              <Badge variant="outline" className="text-xs">
                {subCategory}
              </Badge>
            )}
          </div>
          
          {rating && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <Link to={`/${permalink}`} className="block group">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
            {name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {timeAgo(launchDate)}
          </span>
          <span>{viewsCount.toLocaleString()} views</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          {!isFree && (
            <div className="flex flex-col">
              {originalPrice && originalPrice !== discountedPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {discountedPrice && (
                <span className="text-lg font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
              )}
            </div>
          )}
          
          <Button
            variant={isFree ? "accent" : "hero"}
            size="sm"
            onClick={handleCTAClick}
            className="ml-auto flex items-center space-x-1"
          >
            <span>{ctaText}</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;