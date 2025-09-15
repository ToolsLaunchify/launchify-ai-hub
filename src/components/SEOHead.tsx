import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImageUrl?: string;
  productData?: {
    name: string;
    description?: string;
    image_url?: string;
    original_price?: number;
    discounted_price?: number;
    currency?: string;
    category?: { name: string };
    is_free?: boolean;
    rating?: number;
    reviews_count?: number;
    seo_title?: string;
    social_title?: string;
    social_description?: string;
    twitter_image_url?: string;
    focus_keyword?: string;
    related_keywords?: string[];
  };
  structuredData?: any;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  metaTitle,
  metaDescription,
  keywords = [],
  canonicalUrl,
  ogImageUrl,
  productData,
  structuredData
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;
  
  // Generate structured data for products
  const generateProductStructuredData = () => {
    if (!productData) return null;

    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productData.name,
      "description": productData.description || metaDescription,
      "image": productData.image_url || ogImageUrl,
      "brand": {
        "@type": "Brand",
        "name": "Tools Launchify"
      },
      "category": productData.category?.name,
      "url": currentUrl
    };

    // Add pricing information
    if (productData.original_price || productData.discounted_price || productData.is_free) {
      baseStructuredData["offers"] = {
        "@type": "Offer",
        "price": productData.is_free ? "0" : (productData.discounted_price || productData.original_price || "0"),
        "priceCurrency": productData.currency || "USD",
        "availability": "https://schema.org/InStock",
        "url": currentUrl
      };
    }

    // Add rating if available
    if (productData.rating && productData.reviews_count) {
      baseStructuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": productData.rating,
        "reviewCount": productData.reviews_count
      };
    }

    return baseStructuredData;
  };

  const finalStructuredData = structuredData || generateProductStructuredData();

  // Enhanced meta title and description using SEO fields
  const finalTitle = productData?.seo_title || metaTitle || title || 'Tools Launchify - Discover Amazing Tools';
  const finalDescription = productData?.social_description || metaDescription || 'Discover amazing tools and boost your productivity with our curated collection of the best digital tools.';
  const finalSocialTitle = productData?.social_title || finalTitle;
  const finalTwitterImage = productData?.twitter_image_url || ogImageUrl || productData?.image_url || `${siteUrl}/placeholder.svg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Keywords */}
      {(keywords.length > 0 || productData?.related_keywords?.length) && (
        <meta name="keywords" content={[...keywords, ...(productData?.related_keywords || [])].join(', ')} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={productData ? 'product' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalSocialTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImageUrl || productData?.image_url || `${siteUrl}/placeholder.svg`} />
      <meta property="og:site_name" content="Tools Launchify" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={finalSocialTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead;