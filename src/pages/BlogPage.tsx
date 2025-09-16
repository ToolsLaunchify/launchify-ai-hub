import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { usePublishedBlogPosts } from '@/hooks/useBlog';

const BlogPage: React.FC = () => {
  const { data: blogPosts = [], isLoading } = usePublishedBlogPosts();

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
        <div className="container mx-auto px-4 py-12">
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
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author_name || 'Admin'}
                        </div>
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
                    
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredPost.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
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
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-card/50 backdrop-blur-sm border-border/50">
                    {post.featured_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            {post.author_name || 'Admin'}
                          </div>
                          <Button variant="ghost" size="sm" asChild className="group/btn">
                            <Link to={`/blog/${post.slug}`}>
                              Read More
                              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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