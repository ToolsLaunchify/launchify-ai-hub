import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, Users, ArrowRight, Eye, Calendar, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useProducts } from '@/hooks/useProducts';

interface CategoryPreviewProps {
  category: any;
  products: any[];
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({ category, products }) => {
  const [showPreview, setShowPreview] = useState(false);
  const sampleProducts = products.slice(0, 3);

  return (
    <Card 
      className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer bg-gradient-card"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-xl">{category.icon || '📁'}</span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
              {category.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description || 'Explore tools in this category'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="bg-gradient-accent text-white border-none">
            {category.product_count} Tools
          </Badge>
          {category.product_count > 10 && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        {/* Product Preview - Shows on Hover */}
        <div className={`transition-all duration-300 ${showPreview ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="border-t border-border/50 pt-4 mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Featured Tools
            </h4>
            <div className="space-y-2">
              {sampleProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.slug}`}
                  className="flex items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group/product"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-md mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {product.views_count || 0}
                      </span>
                      {product.is_free && (
                        <Badge variant="secondary" className="text-xs">Free</Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/product:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Always Visible Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Active
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Updated
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-primary hover:opacity-90 text-white border-none group-hover:scale-105 transition-transform"
          >
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SmartCategoryExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'trending' | 'popular'>('all');
  
  const { data: categories = [] } = useCategoryStats();
  const { data: allProducts = [] } = useProducts({ limit: 50 });

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    allProducts.forEach(product => {
      const categoryId = product.category_id || 'uncategorized';
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });
    return grouped;
  }, [allProducts]);

  // Filter categories based on search and view mode
  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (viewMode) {
      case 'trending':
        filtered = filtered.filter(cat => cat.product_count > 5);
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.product_count - a.product_count).slice(0, 8);
        break;
    }

    return filtered;
  }, [categories, searchQuery, viewMode]);

  const topCategories = categories
    .sort((a, b) => b.product_count - a.product_count)
    .slice(0, 3);

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-accent text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Smart Category Explorer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Tools by <span className="text-gradient-primary">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the perfect tools for your needs. Browse by category, explore popular collections, or search for specific solutions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search categories (e.g., AI, design, productivity...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'All Categories', icon: Filter },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'popular', label: 'Popular', icon: Star }
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? 'default' : 'outline'}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`flex items-center space-x-2 ${
                    viewMode === mode.id 
                      ? 'bg-gradient-primary text-white border-none' 
                      : 'hover:border-primary hover:text-primary'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories Highlight */}
        {viewMode === 'all' && !searchQuery && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-primary" />
              Most Popular Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topCategories.map((category) => (
                <Card key={category.id} className="bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                        <span className="text-white text-2xl">{category.icon || '📁'}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{category.name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-accent text-white border-none">
                        #{Math.floor(Math.random() * 3) + 1} Most Popular
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-primary">
                          {category.product_count}
                        </div>
                        <div className="text-xs text-muted-foreground">Tools</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse All Categories'}
              </h3>
              <p className="text-muted-foreground">
                {filteredCategories.length} categories found
              </p>
            </div>
            <Link to="/categories">
              <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                View All Categories <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <CategoryPreview 
                    category={category} 
                    products={productsByCategory[category.id] || []}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-card border-0 shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
                <p className="text-muted-foreground">
                  Use our advanced search to find specific tools, or browse our complete product catalog.
                </p>
              </div>
              <div className="flex space-x-3">
                <Link to="/search">
                  <Button className="bg-gradient-primary hover:opacity-90 text-white border-none">
                    Advanced Search
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                    Browse All Tools
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmartCategoryExplorer;