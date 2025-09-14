import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import KeyFeaturesSection from '@/components/KeyFeaturesSection';
import ProductGallery from '@/components/ProductGallery';
import RelatedProducts from '@/components/RelatedProducts';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ExternalLink, 
  Bookmark, 
  Star, 
  Clock, 
  Eye, 
  Heart, 
  Share2,
  Download,
  Play,
  Gift,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Trophy,
  ChevronRight,
  FileText,
  PlayCircle,
  X,
  Smartphone,
  Globe,
  Lock,
  Headphones,
  ArrowUp,
  BookmarkPlus,
  BookmarkCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rich_description: string | null;
  image_url: string | null;
  category_id: string | null;
  product_type: string | null;
  is_free: boolean | null;
  is_featured: boolean | null;
  is_newly_launched: boolean | null;
  is_popular: boolean | null;
  is_trending: boolean | null;
  is_editors_choice: boolean | null;
  original_price: number | null;
  discounted_price: number | null;
  currency: string | null;
  affiliate_link: string | null;
  payment_link: string | null;
  cta_button_text: string | null;
  views_count: number | null;
  saves_count: number | null;
  file_attachments: any;
  video_courses: any;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const VideoModal: React.FC<{ video: any; isOpen: boolean; onClose: () => void }> = ({ video, isOpen, onClose }) => {
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = video?.url ? getVideoId(video.url) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            {video?.title || 'Video'}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video?.title || 'Video'}
              className="w-full h-full rounded-b-lg"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-b-lg flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Invalid video URL</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-secondary/20 z-50">
      <div 
        className="h-full bg-gradient-primary transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

const FloatingCTA: React.FC<{ product: Product; onCTAClick: () => void }> = ({ product, onCTAClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onCTAClick}
        size="lg"
        variant="hero"
        className="shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full px-6 py-3"
      >
        <Download className="mr-2 h-5 w-5" />
        {product.cta_button_text || 'Get Started'}
      </Button>
    </div>
  );
};

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      size="icon"
      className="fixed bottom-6 left-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
};

const EnhancedProductDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Check if product is saved on component mount
  useEffect(() => {
    if (user && product) {
      const savedProducts = JSON.parse(localStorage.getItem(`saved_products_${user.id}`) || '[]');
      setIsSaved(savedProducts.includes(product.id));
    }
  }, [user, product]);

  const handleCTAClick = () => {
    if (product?.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else if (product?.payment_link) {
      window.open(product.payment_link, '_blank');
    } else {
      toast({
        title: "No link available",
        description: "This product doesn't have a direct link configured.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save products for later.",
        variant: "destructive"
      });
      return;
    }

    const savedProducts = JSON.parse(localStorage.getItem(`saved_products_${user.id}`) || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updatedSaved = savedProducts.filter((id: string) => id !== product?.id);
      localStorage.setItem(`saved_products_${user.id}`, JSON.stringify(updatedSaved));
      setIsSaved(false);
      toast({
        title: "Removed from saved",
        description: "Product removed from your saved list."
      });
    } else {
      // Add to saved
      const updatedSaved = [...savedProducts, product?.id];
      localStorage.setItem(`saved_products_${user.id}`, JSON.stringify(updatedSaved));
      setIsSaved(true);
      toast({
        title: "Saved for later",
        description: "Product added to your saved list."
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Check out this tool',
      text: product?.description || 'Amazing tool I found',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Thank you for sharing!"
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard."
      });
    }
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleDownload = (file: any) => {
    if (file?.url) {
      window.open(file.url, '_blank');
      toast({
        title: "Download started",
        description: `Downloading ${file.title || 'file'}...`
      });
    } else {
      toast({
        title: "Download not available",
        description: "This file doesn't have a valid download link.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return product?.currency === 'USD' ? `$${price}` : `₹${price}`;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const launch = new Date(date);
    const diffTime = Math.abs(now.getTime() - launch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getVideoThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return '/placeholder.svg';
  };

  // Extract real features from rich_description if available
  const extractFeaturesFromDescription = () => {
    if (!product?.rich_description) return [];

    const features = [];
    const description = product.rich_description.toLowerCase();
    
    // Look for common feature keywords in the description
    const featureMap = [
      { keywords: ['fast', 'speed', 'quick', 'rapid'], icon: Zap, title: "Fast Performance" },
      { keywords: ['secure', 'security', 'safe', 'protection'], icon: Shield, title: "Secure & Safe" },
      { keywords: ['easy', 'simple', 'intuitive', 'user-friendly'], icon: CheckCircle, title: "Easy to Use" },
      { keywords: ['ai', 'artificial intelligence', 'machine learning', 'smart'], icon: Star, title: "AI-Powered" },
      { keywords: ['cross-platform', 'multi-platform', 'compatible'], icon: Globe, title: "Cross-Platform" },
      { keywords: ['premium', 'quality', 'professional', 'advanced'], icon: Trophy, title: "Premium Quality" },
      { keywords: ['support', 'help', 'assistance', 'customer service'], icon: Headphones, title: "Great Support" },
      { keywords: ['mobile', 'responsive', 'smartphone', 'tablet'], icon: Smartphone, title: "Mobile-Friendly" }
    ];

    featureMap.forEach(feature => {
      if (feature.keywords.some(keyword => description.includes(keyword))) {
        features.push({
          icon: feature.icon,
          title: feature.title,
          description: "Based on product description"
        });
      }
    });

    return features.slice(0, 4); // Limit to 4 features
  };

  const keyFeatures = extractFeaturesFromDescription();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <FloatingCTA product={product} onCTAClick={handleCTAClick} />
      <BackToTop />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tools</span>
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Product Image Gallery */}
            <div className="space-y-6">
              <ProductGallery 
                images={product.image_url ? [product.image_url] : ['/placeholder.svg']} 
                productName={product.name} 
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {product.category && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">{product.category.name}</Badge>
                  )}
                  {product.product_type && (
                    <Badge variant="outline" className="text-sm px-3 py-1 capitalize">{product.product_type.replace('_', ' ')}</Badge>
                  )}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {product.name}
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{timeAgo(product.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Eye className="h-5 w-5" />
                  <span>{(product.views_count || 0).toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Heart className="h-5 w-5" />
                  <span>{(product.saves_count || 0).toLocaleString()} saves</span>
                </div>
              </div>

              {/* Pricing */}
              {!product.is_free && (product.original_price || product.discounted_price) && (
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                    <div className="flex items-center space-x-4">
                      {product.discounted_price && (
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(product.discounted_price)}
                        </span>
                      )}
                      {product.original_price && (
                        <span className={`text-xl ${product.discounted_price ? 'line-through text-muted-foreground' : 'font-bold text-primary'}`}>
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleCTAClick} 
                  size="lg" 
                  className="flex-1 min-w-48 text-lg py-6"
                  variant="hero"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {product.cta_button_text || 'Download'}
                </Button>
                <Button 
                  onClick={handleSave}
                  variant="premium" 
                  size="lg" 
                  className="text-lg py-6"
                >
                  {isSaved ? (
                    <BookmarkCheck className="mr-2 h-5 w-5" />
                  ) : (
                    <BookmarkPlus className="mr-2 h-5 w-5" />
                  )}
                  {isSaved ? 'Saved' : 'Save Tool'}
                </Button>
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  size="lg" 
                  className="text-lg py-6"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      {product.rich_description && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Overview</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.rich_description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Only show if we have extracted features */}
      {keyFeatures.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Features mentioned in the product description.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => (
                <Card key={index} className="border-none bg-gradient-to-br from-card/50 to-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section - Only show if there are actual resources */}
      {((product.file_attachments && product.file_attachments.length > 0) || 
        (product.video_courses && product.video_courses.length > 0)) && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Resources & Downloads</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access all the resources you need to get started.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* File Downloads */}
              {product.file_attachments && product.file_attachments.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-6 w-6" />
                      <span>File Downloads</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {product.file_attachments.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{file.title || `File ${index + 1}`}</h4>
                          <p className="text-sm text-muted-foreground">
                            {file.description || 'Download file'}
                          </p>
                        </div>
                         <Button 
                          onClick={() => handleDownload(file)}
                          variant="outline" 
                          size="sm"
                          disabled={!file.url}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Video Tutorials */}
              {product.video_courses && product.video_courses.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PlayCircle className="h-6 w-6" />
                      <span>Video Tutorials</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {product.video_courses.map((video: any, index: number) => (
                      <div key={index} className="relative group cursor-pointer rounded-lg overflow-hidden">
                        <div 
                          onClick={() => handleVideoClick(video)}
                          className="relative"
                        >
                          <img
                            src={getVideoThumbnail(video.url)}
                            alt={video.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{video.title}</h4>
                          {video.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Details Section - Always show basic product info */}
      <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Product Details</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Technical specifications and additional information.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Category</h4>
                    <p className="capitalize">{product.category?.name || 'General'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Type</h4>
                    <p className="capitalize">{product.product_type?.replace('_', ' ') || 'Software'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Launch Date</h4>
                    <p>{new Date(product.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Pricing</h4>
                    <p>{product.is_free ? 'Free' : 'Premium'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Views</h4>
                    <p>{(product.views_count || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Saves</h4>
                    <p>{(product.saves_count || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Web-based Platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span>Mobile Responsive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Secure & Reliable</span>
                </div>
                {product.is_free && (
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5 text-primary" />
                    <span>Free to Use</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from this amazing tool.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleCTAClick} 
              size="lg" 
              className="text-lg py-6 px-8"
              variant="hero"
            >
              <Download className="mr-2 h-5 w-5" />
              {product.cta_button_text || 'Get Started Now'}
            </Button>
            <Button 
              onClick={handleSave}
              variant="outline" 
              size="lg" 
              className="text-lg py-6 px-8"
            >
              {isSaved ? (
                <BookmarkCheck className="mr-2 h-5 w-5" />
              ) : (
                <BookmarkPlus className="mr-2 h-5 w-5" />
              )}
              {isSaved ? 'Saved for Later' : 'Save for Later'}
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
        />
      )}

      {/* Related Products Section */}
      <RelatedProducts currentProduct={product} maxProducts={3} />
    </div>
  );
};

export default EnhancedProductDetailPage;