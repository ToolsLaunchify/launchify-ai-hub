import { useParams } from "react-router-dom";
import { usePageBySlug } from "@/hooks/usePages";
import PageContent from "./PageContent";
import EnhancedProductDetailPage from "./EnhancedProductDetailPage";
import NotFound from "@/pages/NotFound";

const SmartSlugRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading: pageLoading, error: pageError } = usePageBySlug(slug || "");

  // Show loading while checking if it's a page
  if (pageLoading) {
    return <PageContent />;
  }

  // If we found a page, render it
  if (page && !pageError) {
    return <PageContent />;
  }

  // If no page found, try as a product
  return <EnhancedProductDetailPage />;
};

export default SmartSlugRouter;