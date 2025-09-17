import React, { useState } from 'react';
import { usePages } from '@/hooks/usePages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageBrowserProps {
  onPageSelect: (page: { title: string; url: string }) => void;
  onExternalLinkAdd: () => void;
  className?: string;
}

export const PageBrowser: React.FC<PageBrowserProps> = ({ 
  onPageSelect, 
  onExternalLinkAdd,
  className = ""
}) => {
  const { data: pages = [], isLoading } = usePages();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageSelect = (page: any) => {
    onPageSelect({
      title: page.title,
      url: `/${page.slug}`
    });
  };

  const copyPageUrl = async (slug: string) => {
    const url = `/${slug}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: "URL copied!",
      description: `Page URL ${url} copied to clipboard.`
    });
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={onExternalLinkAdd}
          variant="outline"
          size="default"
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          External Link
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredPages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No pages found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{page.title}</h4>
                      <Badge variant={page.is_published ? "default" : "secondary"} className="text-xs">
                        {page.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      /{page.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPageUrl(page.slug)}
                      className="h-8 px-3 bg-accent/10 hover:bg-accent/20 text-accent hover:text-accent border-accent/30"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Link
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePageSelect(page)}
                      className="h-8 px-3"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredPages.length > 0 && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
};