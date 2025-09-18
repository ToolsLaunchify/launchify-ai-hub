import { useParams } from "react-router-dom";
import { usePageBySlug } from "@/hooks/usePages";
import PageContent from "./PageContent";
import EnhancedProductDetailPage from "./EnhancedProductDetailPage";
import NotFound from "@/pages/NotFound";
import { Skeleton } from "@/components/ui/skeleton";

const SmartSlugRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading: pageLoading, error: pageError } = usePageBySlug(slug || "");

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

  // If no page found, try as a product
  return <EnhancedProductDetailPage />;
};

export default SmartSlugRouter;