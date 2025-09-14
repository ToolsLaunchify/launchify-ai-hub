import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className }) => {
  return (
    <div 
      className={cn(
        "rich-text-display prose prose-lg max-w-none",
        // Headings
        "prose-headings:scroll-mt-20",
        "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:mt-12 prose-h1:text-primary prose-h1:leading-tight",
        "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-foreground prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
        "prose-h3:text-2xl prose-h3:font-medium prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground",
        "prose-h4:text-xl prose-h4:font-medium prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-foreground",
        "prose-h5:text-lg prose-h5:font-medium prose-h5:mb-2 prose-h5:mt-4 prose-h5:text-foreground",
        "prose-h6:text-base prose-h6:font-medium prose-h6:mb-2 prose-h6:mt-4 prose-h6:text-muted-foreground",
        
        // Paragraphs and text
        "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground",
        
        // Links
        "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all",
        
        // Lists
        "prose-ul:text-muted-foreground prose-ul:mb-6",
        "prose-ol:text-muted-foreground prose-ol:mb-6",
        "prose-li:mb-2 prose-li:leading-relaxed",
        "prose-li:marker:text-primary",
        
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8",
        "prose-blockquote:text-foreground prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:not-italic",
        
        // Code
        "prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-foreground",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto",
        
        // Images
        "prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border",
        
        // Tables
        "prose-table:border-collapse prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden",
        "prose-th:bg-muted prose-th:font-semibold prose-th:text-foreground prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-3",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-td:text-muted-foreground",
        "prose-tbody:prose-tr:border-t prose-tbody:prose-tr:border-border",
        "prose-tr:hover:bg-muted/50 prose-tr:transition-colors",
        
        // HR
        "prose-hr:border-border prose-hr:my-8",
        
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;