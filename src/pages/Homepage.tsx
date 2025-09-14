import React, { useState } from 'react';
import { ArrowRight, Grid, List, Filter } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CategoriesSection from '@/components/CategoriesSection';
import ProductTypeSections from '@/components/ProductTypeSections';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useProducts, useFreeToolsByCategory } from '@/hooks/useProducts';

// Mock data - Replace with actual data from Supabase
const mockProducts = [
  {
    id: '1',
    name: 'Leonardo AI',
    description: 'Transform your creative vision into stunning art with AI-powered image generation. Perfect for artists, designers, and content creators.',
    image: '/placeholder.svg',
    category: 'AI Tools',
    subCategory: 'Image Generation',
    isFree: false,
    isFeatured: true,
    originalPrice: 99,
    discountedPrice: 49,
    currency: 'USD' as const,
    ctaText: 'Get Started',
    launchDate: '2024-01-15',
    rating: 4.8,
    viewsCount: 12543,
    permalink: 'leonardo-ai',
    isAffiliate: true,
    affiliateLink: 'https://leonardo.ai'
  },
  {
    id: '2',
    name: 'Notion AI',
    description: 'Supercharge your productivity with AI-powered writing, editing, and brainstorming directly in your workspace.',
    image: '/placeholder.svg',
    category: 'Productivity',
    subCategory: 'Writing Tools',
    isFree: true,
    isFeatured: false,
    currency: 'USD' as const,
    ctaText: 'Try Free',
    launchDate: '2024-01-20',
    rating: 4.6,
    viewsCount: 8932,
    permalink: 'notion-ai',
    isAffiliate: false,
    paymentLink: 'https://notion.so'
  },
  {
    id: '3',
    name: 'Figma Dev Mode',
    description: 'Bridge the gap between design and development with enhanced collaboration tools and code generation.',
    image: '/placeholder.svg',
    category: 'Design Tools',
    subCategory: 'Collaboration',
    isFree: false,
    isFeatured: true,
    originalPrice: 120,
    discountedPrice: 89,
    currency: 'USD' as const,
    ctaText: 'Start Trial',
    launchDate: '2024-01-18',
    rating: 4.9,
    viewsCount: 15672,
    permalink: 'figma-dev-mode',
    isAffiliate: true,
    affiliateLink: 'https://figma.com'
  },
  {
    id: '4',
    name: 'Zapier AI',
    description: 'Automate your workflows with intelligent automation that learns and adapts to your business needs.',
    image: '/placeholder.svg',
    category: 'Automation',
    subCategory: 'Workflow',
    isFree: false,
    isFeatured: false,
    discountedPrice: 29,
    currency: 'USD' as const,
    ctaText: 'Automate Now',
    launchDate: '2024-01-22',
    rating: 4.7,
    viewsCount: 9876,
    permalink: 'zapier-ai',
    isAffiliate: true,
    affiliateLink: 'https://zapier.com'
  },
  {
    id: '5',
    name: 'Canva Magic Studio',
    description: 'Create professional designs with AI-powered tools that understand your brand and style preferences.',
    image: '/placeholder.svg',
    category: 'Design Tools',
    subCategory: 'Graphic Design',
    isFree: true,
    isFeatured: false,
    currency: 'USD' as const,
    ctaText: 'Design Now',
    launchDate: '2024-01-25',
    rating: 4.5,
    viewsCount: 6543,
    permalink: 'canva-magic-studio',
    isAffiliate: false,
    paymentLink: 'https://canva.com'
  },
  {
    id: '6',
    name: 'GitHub Copilot X',
    description: 'Next-generation AI pair programmer that helps you write code faster with contextual suggestions.',
    image: '/placeholder.svg',
    category: 'Developer Tools',
    subCategory: 'Code Assistant',
    isFree: false,
    isFeatured: true,
    discountedPrice: 19,
    currency: 'USD' as const,
    ctaText: 'Code Better',
    launchDate: '2024-01-28',
    rating: 4.8,
    viewsCount: 11234,
    permalink: 'github-copilot-x',
    isAffiliate: true,
    affiliateLink: 'https://github.com/copilot'
  }
];

const categories = [
  { name: 'AI Tools', count: 156, color: 'bg-gradient-primary' },
  { name: 'Design Tools', count: 89, color: 'bg-gradient-accent' },
  { name: 'Productivity', count: 124, color: 'bg-gradient-primary' },
  { name: 'Developer Tools', count: 78, color: 'bg-gradient-accent' },
  { name: 'Marketing', count: 67, color: 'bg-gradient-primary' },
  { name: 'Analytics', count: 45, color: 'bg-gradient-accent' },
];

const Homepage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch real data from Supabase
  const { data: newlyLaunchedProducts = [] } = useProducts({ isNewlyLaunched: true, limit: 4 });
  const { data: featuredProducts = [] } = useProducts({ isFeatured: true });
  const { data: freeToolsData, isLoading: freeToolsLoading } = useFreeToolsByCategory();

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  const handleSaveProduct = (productId: string) => {
    console.log('Saving product:', productId);
    // Implement save functionality
  };

  // Process free tools data
  const freeToolCategories = freeToolsData?.categories || [];
  const allFreeTools = freeToolsData?.products || [];
  
  // Filter free tools by active category
  const filteredFreeTools = activeCategory === 'all' 
    ? allFreeTools 
    : allFreeTools.filter(product => product.category?.slug === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />
      
      {/* Product Type Sections */}
      <ProductTypeSections />
      
      {/* New Launches Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Launches</h2>
            <p className="text-muted-foreground">Discover the newest tools and software</p>
          </div>
          <Button variant="premium" asChild>
            <a href="/new-launches">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4 pt-4">
            {newlyLaunchedProducts.length > 0 ? (
              newlyLaunchedProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || '',
                      image: product.image_url || '/placeholder.svg',
                      category: product.category?.name || 'Uncategorized',
                      isFree: product.is_free || false,
                      isFeatured: product.is_featured || false,
                      originalPrice: product.original_price || undefined,
                      discountedPrice: product.discounted_price || undefined,
                      currency: (product.currency as 'USD' | 'INR') || 'USD',
                      ctaText: product.cta_button_text || 'Learn More',
                      launchDate: product.created_at,
                      viewsCount: product.views_count || 0,
                      permalink: product.slug,
                      isAffiliate: !!product.affiliate_link,
                      affiliateLink: product.affiliate_link || undefined,
                      paymentLink: product.payment_link || undefined,
                    }}
                    onSave={handleSaveProduct}
                    isAuthenticated={false}
                  />
                </CarouselItem>
              ))
            ) : (
              // Fallback to mock data if no real data
              mockProducts.slice(0, 3).map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <ProductCard
                    product={product}
                    onSave={handleSaveProduct}
                    isAuthenticated={false}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked tools and software that are making waves in the tech community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    image: product.image_url || '/placeholder.svg',
                    category: product.category?.name || 'Uncategorized',
                    isFree: product.is_free || false,
                    isFeatured: product.is_featured || false,
                    originalPrice: product.original_price || undefined,
                    discountedPrice: product.discounted_price || undefined,
                    currency: (product.currency as 'USD' | 'INR') || 'USD',
                    ctaText: product.cta_button_text || 'Learn More',
                    launchDate: product.created_at,
                    viewsCount: product.views_count || 0,
                    permalink: product.slug,
                    isAffiliate: !!product.affiliate_link,
                    affiliateLink: product.affiliate_link || undefined,
                    paymentLink: product.payment_link || undefined,
                  }}
                  onSave={handleSaveProduct}
                  isAuthenticated={false}
                />
              ))
            ) : (
              // Fallback to mock data
              mockProducts.filter(p => p.isFeatured).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSave={handleSaveProduct}
                  isAuthenticated={false}
                />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-gradient-primary hover:opacity-90" 
              asChild
            >
              <a href="/featured-products">
                View All Featured Products <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Free Tools by Category */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Free Tools by Category</h2>
          <p className="text-muted-foreground">
            Explore amazing free tools across different categories
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg border-2 transition-smooth font-medium ${
                activeCategory === 'all'
                  ? 'bg-gradient-primary text-white border-primary shadow-glow'
                  : 'bg-card text-card-foreground border-border hover:border-primary/50'
              }`}
            >
              All ({allFreeTools.length})
            </button>
            {freeToolCategories.map((category) => {
              const categoryToolsCount = allFreeTools.filter(
                product => product.category?.id === category.id
              ).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg border-2 transition-smooth font-medium ${
                    activeCategory === category.slug
                      ? 'bg-gradient-primary text-white border-primary shadow-glow'
                      : 'bg-card text-card-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {category.name} ({categoryToolsCount})
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredFreeTools.length} free tools found
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-0">
            {freeToolsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                    <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredFreeTools.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredFreeTools.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || '',
                      image: product.image_url || '/placeholder.svg',
                      category: product.category?.name || 'Uncategorized',
                      isFree: product.is_free || false,
                      isFeatured: product.is_featured || false,
                      originalPrice: product.original_price || undefined,
                      discountedPrice: product.discounted_price || undefined,
                      currency: (product.currency as 'USD' | 'INR') || 'USD',
                      ctaText: product.cta_button_text || 'Learn More',
                      launchDate: product.created_at,
                      viewsCount: product.views_count || 0,
                      permalink: product.slug,
                      isAffiliate: !!product.affiliate_link,
                      affiliateLink: product.affiliate_link || undefined,
                      paymentLink: product.payment_link || undefined,
                    }}
                    variant={viewMode === 'grid' ? 'card' : 'list'}
                    onSave={handleSaveProduct}
                    isAuthenticated={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No free tools found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeCategory === 'all' 
                    ? "There are no free tools available yet." 
                    : `No free tools found in the ${freeToolCategories.find(c => c.slug === activeCategory)?.name || activeCategory} category.`
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveCategory('all')}
                  className="bg-gradient-primary text-white border-primary hover:opacity-90"
                >
                  View All Categories
                </Button>
              </div>
            )}
          </div>
        </Tabs>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 bg-gradient-primary hover:opacity-90" 
            asChild
          >
            <a href="/free-tools">
              View All Free Tools <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Related Suggestions */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">You Might Also Like</h2>
          <p className="text-muted-foreground">
            Based on popular tools in similar categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.slice(2, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSave={handleSaveProduct}
              isAuthenticated={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;