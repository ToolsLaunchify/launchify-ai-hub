import React from 'react';
import { ArrowRight, Zap, Code, Gift, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';

interface CategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  productType: string;
  bgClass: string;
  slug: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  description, 
  icon, 
  productType, 
  bgClass,
  slug 
}) => {
  const { data: products = [] } = useProducts({ productType, limit: 8 });

  // Mock conversion for compatibility
  const convertToMockProduct = (product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    image: product.image_url,
    category: product.category?.name || 'Software',
    subCategory: product.product_type,
    isFree: product.is_free || false,
    isFeatured: product.is_featured || false,
    originalPrice: product.original_price,
    discountedPrice: product.discounted_price,
    currency: (product.currency === 'USD' ? 'USD' : 'INR') as 'USD' | 'INR',
    ctaText: product.cta_button_text || 'Learn More',
    launchDate: product.created_at,
    rating: 4.5,
    viewsCount: product.views_count || 0,
    slug: product.slug || product.id,
    isAffiliate: !!product.affiliate_link,
    paymentLink: product.payment_link,
    affiliateLink: product.affiliate_link,
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              {icon}
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard
                  product={convertToMockProduct(product)}
                  variant="card"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        
        <div className="text-center mt-8">
          <Link to={`/category/${slug}`}>
            <Button className="bg-gradient-primary hover:opacity-90 text-white border-none px-8 py-3">
              View All {title}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ProductsByCategorySection: React.FC = () => {
  const categories = [
    {
      title: "AI Tools",
      description: "Artificial Intelligence powered solutions",
      icon: <Zap className="h-6 w-6 text-white" />,
      productType: "ai_tools",
      bgClass: "bg-background",
      slug: "ai-tools"
    },
    {
      title: "Software",
      description: "Professional software applications",
      icon: <Code className="h-6 w-6 text-white" />,
      productType: "software",
      bgClass: "bg-gradient-to-br from-muted/30 to-background",
      slug: "software"
    },
    {
      title: "Free Tools",
      description: "Completely free tools and resources",
      icon: <Gift className="h-6 w-6 text-white" />,
      productType: "free_tools",
      bgClass: "bg-background",
      slug: "free-tools"
    },
    {
      title: "Digital Products",
      description: "Digital downloads and resources",
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      productType: "digital_products",
      bgClass: "bg-gradient-to-br from-muted/30 to-background",
      slug: "digital-products"
    }
  ];

  return (
    <div>
      {categories.map((category, index) => (
        <CategorySection
          key={category.productType}
          {...category}
        />
      ))}
    </div>
  );
};

export default ProductsByCategorySection;