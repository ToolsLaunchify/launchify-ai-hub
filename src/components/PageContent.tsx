import React from 'react';
import { useParams } from 'react-router-dom';
import { usePageBySlug } from '@/hooks/usePages';
import { SEOHead } from '@/components/SEOHead';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { sanitizeHtml } from '@/lib/sanitize';

const PageContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log('PageContent - Loading page with slug:', slug);
  const { data: page, isLoading, error } = usePageBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            {error ? 'Failed to load page content.' : 'Page not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={page.meta_title || page.title}
        metaDescription={page.meta_description || `${page.title} - Tools Launchify`}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {page.title}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </header>
            
            <div 
              className="prose-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content || '') }} 
            />
          </article>
        </div>
      </div>
    </>
  );
};

export default PageContent;