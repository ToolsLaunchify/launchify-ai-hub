import { useParams } from "react-router-dom";
import { usePageBySlug } from "@/hooks/usePages";
import { useProducts } from "@/hooks/useProducts";
import PageContent from "./PageContent";
import EnhancedProductDetailPage from "./EnhancedProductDetailPage";
import NotFound from "@/pages/NotFound";
import { Skeleton } from "@/components/ui/skeleton";

const SmartSlugRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading: pageLoading, error: pageError } = usePageBySlug(slug || "");
  const { data: products } = useProducts({});
  
  // Check if slug matches an embedded tool
  const embeddedTool = products?.find(p => p.slug === slug && p.is_embedded_tool && p.tool_url);

  // Show loading while checking if it's a page
  if (pageLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // If we found a page, render it
  if (page && !pageError) {
    return <PageContent />;
  }

  // If slug matches an embedded tool, redirect to tool URL
  if (embeddedTool && embeddedTool.tool_url) {
    window.location.href = embeddedTool.tool_url;
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Redirecting to {embeddedTool.name}...</p>
      </div>
    );
  }

  // If no page found, try as a product
  return <EnhancedProductDetailPage />;
};

export default SmartSlugRouter;