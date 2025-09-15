import React, { useState } from 'react';
import { Grid, List, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import ProductCard from '@/components/ProductCard';
import { Helmet } from 'react-helmet-async';

const ProductBrowserPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useCategoryStats();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();

  // Filter products based on selected category, search, and filters
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || product.product_type === filterType;
    
    return matchesCategory && matchesSearch && matchesType;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.views_count || 0) - (a.views_count || 0);
      case 'price-low':
        return (a.discounted_price || a.original_price || 0) - (b.discounted_price || b.original_price || 0);
      case 'price-high':
        return (b.discounted_price || b.original_price || 0) - (a.discounted_price || a.original_price || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const SidebarContent = () => (
    <div className="h-full">
      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/25"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-bold text-lg mb-3 text-foreground">Filter by Type</h3>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ai_tools">AI Tools</SelectItem>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="digital_products">Digital Products</SelectItem>
            <SelectItem value="free_tools">Free Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="flex-1">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-foreground">Categories</h3>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[calc(100vh-200px)]">
          <div className="p-2">
            {categoriesLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className={`w-full justify-between h-auto p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-primary text-primary-foreground shadow-lg transform scale-[1.02]' 
                        : 'hover:bg-primary/15 hover:text-primary hover:border-primary/30 border border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCategory === category.id ? 'bg-white/20' : 'bg-gradient-primary'
                      }`}>
                        <span className={`text-lg ${
                          selectedCategory === category.id ? 'text-white' : 'text-primary-foreground'
                        }`}>
                          {category.icon}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base leading-tight">{category.name}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={selectedCategory === category.id ? 'secondary' : 'outline'} 
                      className={`ml-2 font-semibold ${
                        selectedCategory === category.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-gradient-subtle border-primary/30 text-primary'
                      }`}
                    >
                      {category.product_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Browse Products - Tools Launchify</title>
        <meta name="description" content="Browse our complete catalog of tools, software, and digital products by category." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-background">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 bg-gradient-to-b from-card to-card/95 border-r border-border/50 shadow-lg">
            <SidebarContent />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-gradient-card border-b border-border p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {selectedCategoryData ? selectedCategoryData.name : 'All Products'}
                  </h1>
                  <p className="text-muted-foreground">
                    {selectedCategoryData 
                      ? selectedCategoryData.description 
                      : 'Discover amazing tools, software, and digital products'
                    }
                  </p>
                  {filteredProducts.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {filteredProducts.length} products found
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="p-4 border-b border-border">
                        <SheetTitle>Browse Products</SheetTitle>
                      </SheetHeader>
                      <SidebarContent />
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="price-low">Price ↑</SelectItem>
                      <SelectItem value="price-high">Price ↓</SelectItem>
                      <SelectItem value="name">A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-6 pb-24">
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-48 bg-muted rounded mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-4"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <Card className="bg-gradient-card">
                  <CardContent className="p-12 text-center">
                    <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                        setFilterType('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description || '',
                        image: product.image_url || '',
                        category: product.category?.name || 'Uncategorized',
                        isFree: product.is_free || false,
                        isFeatured: product.is_featured || false,
                        isAffiliate: !!product.affiliate_link,
                        originalPrice: product.original_price,
                        discountedPrice: product.discounted_price,
                        currency: (product.currency as 'USD' | 'INR') || 'USD',
                        ctaText: product.cta_button_text || 'Learn More',
                        slug: product.slug,
                        affiliateLink: product.affiliate_link,
                        paymentLink: product.payment_link,
                        viewsCount: product.views_count,
                        launchDate: product.created_at,
                        rating: 4.5
                      }}
                      variant={viewMode === 'grid' ? 'card' : 'list'}
                      isAuthenticated={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBrowserPage;