import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Grid, List, Zap, Code, Gift, ShoppingBag, Star, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryStats } from '@/hooks/useCategoryStats';

interface FilterState {
  sortBy: 'newest' | 'popular' | 'rating' | 'name';
  viewMode: 'grid' | 'list';
  priceFilter: 'all' | 'free' | 'paid';
}

const InteractiveCategoryMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai_tools');
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
    viewMode: 'grid',
    priceFilter: 'all'
  });

  const { data: categories = [] } = useCategoryStats();
  const { data: products = [] } = useProducts({ 
    productType: activeTab, 
    limit: 12,
    isFree: filters.priceFilter === 'free' ? true : filters.priceFilter === 'paid' ? false : undefined
  });

  const productTypes = [
    {
      id: 'ai_tools',
      title: 'AI Tools',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-600',
      count: products.length
    },
    {
      id: 'software',
      title: 'Software',
      icon: Code,
      gradient: 'from-green-500 to-teal-600',
      count: products.length
    },
    {
      id: 'free_tools',
      title: 'Free Tools',
      icon: Gift,
      gradient: 'from-orange-500 to-red-600',
      count: products.length
    },
    {
      id: 'digital_products',
      title: 'Digital Products',
      icon: ShoppingBag,
      gradient: 'from-pink-500 to-purple-600',
      count: products.length
    }
  ];

  // Convert to mock product format for ProductCard compatibility
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Sort products
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, filters.sortBy]);

  const currentType = productTypes.find(type => type.id === activeTab);
  const relevantCategories = categories.slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-gradient-primary">Products by Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Dive deep into our organized product collections. Find exactly what you need with advanced filtering and intuitive browsing.
          </p>
        </div>

        {/* Product Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-2/3 mx-auto mb-8 bg-card border border-border/50 p-1 rounded-2xl shadow-md">
            {productTypes.map((type) => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                className="relative rounded-xl py-3 px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-primary/50 data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <type.icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{type.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Active Tab Content */}
          {productTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-8">
              {/* Category Navigation Bar */}
              <div className="bg-card rounded-2xl p-6 shadow-md border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{type.title}</h3>
                      <p className="text-muted-foreground">Browse categories and products</p>
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center space-x-3">
                    <Select value={filters.priceFilter} onValueChange={(value: any) => setFilters(prev => ({ ...prev, priceFilter: value }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="free">Free Only</SelectItem>
                        <SelectItem value="paid">Paid Only</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex border rounded-lg bg-muted/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                        className={`rounded-r-none ${filters.viewMode === 'grid' ? 'bg-primary text-white' : ''}`}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                        className={`rounded-l-none ${filters.viewMode === 'list' ? 'bg-primary text-white' : ''}`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Category Access */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {relevantCategories.map((category) => (
                    <Link 
                      key={category.id} 
                      to={`/category/${category.slug}`}
                      className="flex flex-col items-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-white text-lg">{category.icon || '📁'}</span>
                      </div>
                      <span className="text-sm font-medium text-center">{category.name}</span>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {category.product_count}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold">Featured {type.title}</h4>
                    <p className="text-muted-foreground">{filteredProducts.length} products found</p>
                  </div>
                  <Link to={`/type/${type.id.replace('_', '-')}`}>
                    <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                      View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className={
                    filters.viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                      : "space-y-4"
                  }>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={convertToMockProduct(product)}
                        variant={filters.viewMode === 'grid' ? 'card' : 'list'}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <type.icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or check back later for new products.
                    </p>
                    <Button variant="outline">
                      Clear Filters
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default InteractiveCategoryMatrix;