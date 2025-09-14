import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

const CombinedLaunchesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');
  
  const { data: latestProducts = [] } = useProducts({ isNewlyLaunched: true, limit: 12 });
  const { data: featuredProducts = [] } = useProducts({ isFeatured: true, limit: 12 });

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
    permalink: product.slug || product.id,
    isAffiliate: !!product.affiliate_link,
    paymentLink: product.payment_link,
    affiliateLink: product.affiliate_link,
  });

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gradient-primary">
            Discover Amazing Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay ahead with the latest launches and our handpicked featured tools
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('latest')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                  activeTab === 'latest'
                    ? 'bg-gradient-primary text-white border-primary shadow-glow scale-105'
                    : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    activeTab === 'latest' 
                      ? 'bg-white/20 text-white border-0' 
                      : 'bg-primary/10 text-primary border-0'
                  }`}
                >
                  {latestProducts.length}
                </Badge>
                <span>New Launches</span>
              </button>
              
              <button
                onClick={() => setActiveTab('featured')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                  activeTab === 'featured'
                    ? 'bg-gradient-primary text-white border-primary shadow-glow scale-105'
                    : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    activeTab === 'featured' 
                      ? 'bg-white/20 text-white border-0' 
                      : 'bg-primary/10 text-primary border-0'
                  }`}
                >
                  {featuredProducts.length}
                </Badge>
                <span>Featured Tools</span>
              </button>
            </div>
          </div>

          <TabsContent value="latest" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">🚀 Fresh Launches</h3>
              <p className="text-muted-foreground">Brand new tools that just hit the market</p>
            </div>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {latestProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <ProductCard
                      product={convertToMockProduct(product)}
                      variant="card"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">⭐ Editor's Choice</h3>
              <p className="text-muted-foreground">Carefully curated tools that deliver exceptional value</p>
            </div>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <ProductCard
                      product={convertToMockProduct(product)}
                      variant="card"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default CombinedLaunchesSection;