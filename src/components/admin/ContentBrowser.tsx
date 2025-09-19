import React, { useState } from 'react';
import { Search, Copy, ExternalLink, FileText, Tag, Package, Pen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usePages } from '@/hooks/usePages';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useProducts } from '@/hooks/useProducts';
import { usePublishedBlogPosts } from '@/hooks/useBlog';
import { useProductStats } from '@/hooks/useProductStats';

interface ContentBrowserProps {
  onContentSelect: (content: { title: string; url: string }) => void;
  onExternalLinkAdd: () => void;
  className?: string;
}

export const ContentBrowser: React.FC<ContentBrowserProps> = ({
  onContentSelect,
  onExternalLinkAdd,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: pages = [], isLoading: pagesLoading } = usePages();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoryStats();
  const { data: products = [], isLoading: productsLoading } = useProducts({ limit: 20, isFeatured: true });
  const { data: blogPosts = [], isLoading: blogLoading } = usePublishedBlogPosts();
  const { data: productStats, isLoading: productStatsLoading } = useProductStats();

  const copyToClipboard = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`Copied "${title}" link to clipboard!`);
  };

  const handleContentSelect = (title: string, url: string) => {
    onContentSelect({ title, url });
    toast.success(`Added "${title}" to footer`);
  };

  // Get actual product types from your database
  const productTypes = React.useMemo(() => {
    if (!productStats) return [];
    
    const typeMapping = {
      ai_tools: 'AI Tools',
      software: 'Software', 
      free_tools: 'Free Tools',
      paid_tools: 'Paid Tool'
    };
    
    return Object.entries(typeMapping).map(([key, name]) => ({
      name,
      slug: key.replace('_', '-'),
      count: productStats[key as keyof typeof productStats] || 0
    })).filter(type => type.count > 0); // Only show types that have products
  }, [productStats]);

  const filterItems = (items: any[], searchFields: string[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      searchFields.some(field => 
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredPages = filterItems(pages, ['title', 'slug']);
  const filteredCategories = filterItems(categories, ['name', 'description']);
  const filteredProducts = filterItems(products, ['name', 'description']);
  const filteredBlogPosts = filterItems(blogPosts, ['title', 'excerpt']);
  const filteredProductTypes = filterItems(productTypes, ['name']);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Content Browser
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={onExternalLinkAdd}>
              <ExternalLink className="h-4 w-4 mr-2" />
              External Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="pages" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="types" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Tool Types
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-1">
                <Pen className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Click "Copy Link" to copy the URL, then paste it in any footer section
              </div>
              
              {pagesLoading ? (
                <div className="text-center py-4">Loading pages...</div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No pages found matching your search.' : 'No pages available.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-muted-foreground">
                          /{page.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`/${page.slug}`, page.title)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleContentSelect(page.title, `/${page.slug}`)}
                        >
                          Add to Footer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Browse categories to add to your footer navigation
              </div>
              
              {categoriesLoading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="secondary">{category.product_count} tools</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /category/{category.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`/category/${category.slug}`, category.name)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleContentSelect(category.name, `/category/${category.slug}`)}
                        >
                          Add to Footer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="types" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Browse tool types to add to your footer navigation
              </div>
              
              {productStatsLoading ? (
                <div className="text-center py-4">Loading tool types...</div>
              ) : filteredProductTypes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No tool types found matching your search.' : 'No tool types available.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredProductTypes.map((type) => (
                    <div key={type.slug} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{type.name}</span>
                          <Badge variant="secondary">{type.count} tools</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /type/{type.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`/type/${type.slug}`, type.name)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleContentSelect(type.name, `/type/${type.slug}`)}
                        >
                          Add to Footer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Browse blog posts to add to your footer
              </div>
              
              {blogLoading ? (
                <div className="text-center py-4">Loading blog posts...</div>
              ) : filteredBlogPosts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No blog posts found matching your search.' : 'No blog posts available.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredBlogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          /blog/{post.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`/blog/${post.slug}`, post.title)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleContentSelect(post.title, `/blog/${post.slug}`)}
                        >
                          Add to Footer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Browse featured products to add to your footer
              </div>
              
              {productsLoading ? (
                <div className="text-center py-4">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          {product.is_free && <Badge variant="outline">Free</Badge>}
                          {product.is_featured && <Badge>Featured</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /{product.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`/${product.slug}`, product.name)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleContentSelect(product.name, `/${product.slug}`)}
                        >
                          Add to Footer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentBrowser;