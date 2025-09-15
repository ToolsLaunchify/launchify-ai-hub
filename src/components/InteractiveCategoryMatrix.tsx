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
  
  // Map frontend tool types to database product_type values
  const getProductTypeForQuery = (toolType: string) => {
    switch (toolType) {
      case 'ai_tools':
        return 'ai_tools';
      case 'software':
        return 'software';
      case 'free_tools':
        return 'free_tools';
      case 'digital_products':
        return 'digital_products';
      default:
        return toolType;
    }
  };

  const { data: products = [] } = useProducts({ 
    productType: getProductTypeForQuery(activeTab), 
    limit: 24, // Increased limit to show more products
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
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4 bg-transparent border-0 p-1.5 rounded-2xl shadow-none gap-2">
              {productTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id}
                  className="relative rounded-xl py-3 px-2 md:px-4 text-xs md:text-sm data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-gradient-to-br data-[state=inactive]:from-card data-[state=inactive]:to-card/80 data-[state=inactive]:text-foreground data-[state=inactive]:border-primary/30 hover:bg-card/70 hover:border-primary/50 transition-all duration-300 group border-2 shadow-sm"  
                >
                  <div className="flex flex-col md:flex-row items-center justify-center md:space-x-2 space-y-1 md:space-y-0 min-h-[60px] md:min-h-[48px]">
                    <type.icon className="w-4 h-4 md:w-5 md:h-5 group-data-[state=active]:scale-110 transition-transform" />
                    <span className="font-medium text-center leading-tight">{type.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Active Tab Content */}
          {productTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-8 mt-12">
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
                    <h4 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {type.title} Collection
                    </h4>
                    <p className="text-muted-foreground mt-1">
                      {filteredProducts.length} {type.title.toLowerCase()} available
                    </p>
                  </div>
                  <Link to={`/type/${type.id.replace('_', '-')}`}>
                    <Button variant="premium" className="hover:scale-105 transition-all duration-300">
                      Explore All {type.title} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="space-y-6">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-card/50 to-card/30 rounded-xl border border-border/30">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{filteredProducts.length}</div>
                        <div className="text-xs text-muted-foreground">Total Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">
                          {filteredProducts.filter(p => p.is_free).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Free Tools</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-500">
                          {filteredProducts.filter(p => !p.is_free).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Premium Tools</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-500">
                          {filteredProducts.filter(p => p.is_featured).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Featured</div>
                      </div>
                    </div>

                    {/* Products Display */}
                    <div className={
                      filters.viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                        : "space-y-4"
                    }>
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="group">
                          <ProductCard
                            product={convertToMockProduct(product)}
                            variant={filters.viewMode === 'grid' ? 'card' : 'list'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-12 text-center bg-gradient-to-br from-card/50 to-card/30 border-border/30">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <type.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">No {type.title} Found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We're constantly adding new {type.title.toLowerCase()} to our collection. 
                      Try adjusting your filters or check back later for new products.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setFilters(prev => ({ ...prev, priceFilter: 'all', sortBy: 'newest' }))}
                      >
                        Clear Filters
                      </Button>
                      <Button variant="premium">
                        Browse All Categories
                      </Button>
                    </div>
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