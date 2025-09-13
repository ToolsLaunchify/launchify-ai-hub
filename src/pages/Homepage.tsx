import React, { useState } from 'react';
import { ArrowRight, Grid, List, Filter, Clock, Star, Bookmark } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
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

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  const handleSaveProduct = (productId: string) => {
    console.log('Saving product:', productId);
    // Implement save functionality
  };

  const newLaunches = mockProducts.slice(0, 4);
  const featuredProducts = mockProducts.filter(p => p.isFeatured);
  const freeTools = mockProducts.filter(p => p.isFree);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />
      
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
          <CarouselContent className="-ml-2 md:-ml-4">
            {newLaunches.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <ProductCard
                  product={product}
                  onSave={handleSaveProduct}
                  isAuthenticated={false}
                />
              </CarouselItem>
            ))}
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
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSave={handleSaveProduct}
                isAuthenticated={false}
              />
            ))}
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="developer">Developer</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {freeTools.length} free tools found
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

          <TabsContent value={activeCategory} className="mt-0">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {freeTools.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={viewMode === 'grid' ? 'card' : 'list'}
                  onSave={handleSaveProduct}
                  isAuthenticated={false}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
            <p className="text-muted-foreground">
              Browse tools by category to find exactly what you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group cursor-pointer hover-lift transition-smooth"
              >
                <div className="bg-gradient-card rounded-lg p-6 border border-muted hover:border-primary/40">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                    <div className="w-6 h-6 bg-white/20 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.count} tools available
                  </p>
                  <div className="flex items-center text-sm text-primary group-hover:text-primary-foreground transition-colors">
                    Explore category <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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