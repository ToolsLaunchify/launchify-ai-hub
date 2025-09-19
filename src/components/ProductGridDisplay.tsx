import React from 'react';
import { Loader2, Package } from 'lucide-react';
import ModernProductCard from './ModernProductCard';
import type { Product } from '@/hooks/useProducts';

interface ProductGridDisplayProps {
  products: Product[];
  isLoading: boolean;
  categoryName?: string;
}

const ProductGridDisplay: React.FC<ProductGridDisplayProps> = ({
  products,
  isLoading,
  categoryName
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tools...</span>
      </div>
    );
  }

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
          {categoryName 
            ? `No tools are available in the ${categoryName} category yet. Check back later for new additions!`
            : 'No tools are available in this category yet. Check back later for new additions!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ModernProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGridDisplay;