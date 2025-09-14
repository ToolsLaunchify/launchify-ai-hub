import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Filter } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ProductTypeSections from '@/components/ProductTypeSections';
import CombinedLaunchesSection from '@/components/CombinedLaunchesSection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductCard from '@/components/ProductCard';
import { useProducts, useFreeToolsByCategory } from '@/hooks/useProducts';

const Homepage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch real data from Supabase
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

      {/* Combined Latest Launches & Featured Products */}
      <CombinedLaunchesSection />

      {/* Product Type Sections */}
      <ProductTypeSections />

      {/* Free Tools by Category */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gradient-primary">
              Free Tools by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of free tools organized by category
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
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />
    </div>
  );
};

export default Homepage;