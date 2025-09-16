import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { usePublishedBlogPosts } from '@/hooks/useBlog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BlogPage: React.FC = () => {
  const { data: blogPosts = [], isLoading } = usePublishedBlogPosts();
  
  // Fetch categories to display category names
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Helper function to get category name
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const featuredPost = blogPosts.find(post => post.is_featured);
  const regularPosts = blogPosts.filter(post => !post.is_featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Blog | Tools Launchify - Latest Tips, Tutorials & Industry Insights"
        metaDescription="Discover the latest articles, tutorials, and insights about productivity tools, software development, AI tools, and business growth strategies."
        keywords={['blog', 'tutorials', 'productivity tips', 'AI tools', 'software development', 'business growth']}
        canonicalUrl="/blog"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest insights, tutorials, and tips about productivity tools, 
              software development, and business growth strategies.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Featured Article</span>
              </div>
              <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="md:flex">
                  {featuredPost.featured_image_url && (
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.featured_image_url} 
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`${featuredPost.featured_image_url ? 'md:w-1/2' : 'w-full'} p-6`}>
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.published_at || featuredPost.created_at)}
                        </div>
                        {getCategoryName(featuredPost.category_id) && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {getCategoryName(featuredPost.category_id)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {calculateReadingTime(featuredPost.content || '')} min read
                        </div>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl line-clamp-2">
                        {featuredPost.title}
                      </CardTitle>
                      <CardDescription className="text-base line-clamp-3">
                        {featuredPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    {getCategoryName(featuredPost.category_id) && (
                      <div className="mb-4">
                        <Badge variant="outline" className="text-primary border-primary">
                          {getCategoryName(featuredPost.category_id)}
                        </Badge>
                      </div>
                    )}
                    
                    <Button asChild className="group">
                      <Link to={`/blog/${featuredPost.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Regular Posts Grid */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5">
                      {post.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {calculateReadingTime(post.content || '')} min
                          </div>
                          {getCategoryName(post.category_id) && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {getCategoryName(post.category_id)}
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex flex-col flex-1">
                        <div className="space-y-4 flex-1">
                          {getCategoryName(post.category_id) && (
                            <div className="flex">
                              <Badge variant="outline" className="text-primary border-primary text-xs">
                                {getCategoryName(post.category_id)}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center pt-4 mt-auto">
                          <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105">
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Articles Yet</h2>
              <p className="text-muted-foreground mb-6">
                We're working on creating amazing content for you. Check back soon!
              </p>
              <Button asChild>
                <Link to="/">
                  Explore Tools
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;