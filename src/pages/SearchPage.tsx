import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Grid, List, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import ProductCard from '@/components/ProductCard';
import { Helmet } from 'react-helmet-async';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategoryStats();

  // Filter products based on search and filters
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || product.product_type === filterType;
    const matchesCategory = filterCategory === 'all' || product.category_id === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Search Results - Tools Launchify</title>
        <meta name="description" content="Search and discover amazing tools, software, and paid tools on Tools Launchify." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="bg-gradient-card rounded-2xl border border-border shadow-lg p-8 mb-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Search Products
              </h1>
              <p className="text-muted-foreground mb-6">
                Discover the perfect tools and resources for your needs
              </p>
              
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for tools, software, or paid tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8">
                  Search
                </Button>
              </form>

              {searchQuery && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Showing {sortedProducts.length} results for</span>
                  <Badge variant="secondary" className="font-medium">
                    "{searchQuery}"
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ai_tools">AI Tools</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="paid_tools">Paid Tools</SelectItem>
                  <SelectItem value="free_tools">Free Tools</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <Card className="bg-gradient-card border border-border">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Link to="/">
                  <Button variant="outline">Browse All Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
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
    </>
  );
};

export default SearchPage;