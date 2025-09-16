import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/SEOHead';
import { useBlogPostBySlug } from '@/hooks/useBlog';
import RichTextDisplay from '@/components/ui/rich-text-display';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || '');

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={post.meta_title || `${post.title} | Tools Launchify Blog`}
        metaDescription={post.meta_description || post.excerpt || ''}
        keywords={post.tags || []}
        canonicalUrl={post.canonical_url || `/blog/${post.slug}`}
        ogImageUrl={post.og_image_url || post.featured_image_url || undefined}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            {/* Article Header */}
            <article className="space-y-8">
              <header className="space-y-6">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.published_at || post.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author_name || 'Admin'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {calculateReadingTime(post.content || '')} min read
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShare}
                    className="ml-auto"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator />
              </header>

              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="aspect-video overflow-hidden rounded-lg border">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <RichTextDisplay content={post.content || ''} />
              </div>

              {/* Footer */}
              <footer className="border-t pt-8 space-y-6">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full text-sm font-bold">
                      {(post.author_name || 'Admin').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{post.author_name || 'Admin'}</p>
                      <p className="text-sm text-muted-foreground">Content Creator</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center pt-6">
                  <Button asChild>
                    <Link to="/blog">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      More Articles
                    </Link>
                  </Button>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;