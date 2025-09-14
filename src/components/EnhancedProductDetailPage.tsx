import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  ArrowUp
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

  const videoId = video.url ? getVideoId(video.url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder.svg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            {video.title}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              className="w-full h-full rounded-b-lg"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-b-lg flex items-center justify-center">
              <Play className="h-16 w-16 text-muted-foreground" />
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
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
      <div 
        className="h-full bg-gradient-primary transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

const FloatingCTA: React.FC<{ product: Product; onCTAClick: () => void }> = ({ product, onCTAClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <Button
        size="lg"
        className="shadow-2xl bg-gradient-primary hover:scale-105 transition-transform"
        onClick={onCTAClick}
      >
        {product.cta_button_text || 'Get Started'}
        <ExternalLink className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 left-6 z-40 shadow-lg"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
};

const EnhancedProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const handleCTAClick = () => {
    if (product?.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else if (product?.payment_link) {
      window.open(product.payment_link, '_blank');
    }
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleDownload = (file: any) => {
    if (file.url) {
      window.open(file.url, '_blank');
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

  // Generate dynamic features based on product type and category
  const generateFeatures = () => {
    const baseFeatures = [
      { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance" },
      { icon: Shield, title: "Secure & Safe", description: "Enterprise-grade security standards" },
      { icon: CheckCircle, title: "Easy to Use", description: "Intuitive interface for all skill levels" },
    ];

    if (product?.product_type === 'ai_tools') {
      baseFeatures.push({ icon: Star, title: "AI-Powered", description: "Advanced machine learning capabilities" });
    } else if (product?.product_type === 'software') {
      baseFeatures.push({ icon: Globe, title: "Cross-Platform", description: "Works on all major platforms" });
    } else {
      baseFeatures.push({ icon: Gift, title: "Premium Quality", description: "High-quality digital content" });
    }

    return baseFeatures;
  };

  const keyFeatures = generateFeatures();

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
            {/* Product Image */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted shadow-2xl">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {product.is_featured && (
                    <Badge className="bg-gradient-accent shadow-lg">Featured</Badge>
                  )}
                  {product.is_free && (
                    <Badge className="bg-gradient-primary shadow-lg">Free</Badge>
                  )}
                  {product.is_newly_launched && (
                    <Badge variant="secondary" className="shadow-lg">New Launch</Badge>
                  )}
                  {product.is_trending && (
                    <Badge variant="outline" className="shadow-lg">Trending</Badge>
                  )}
                  {product.is_editors_choice && (
                    <Badge className="bg-gradient-hero shadow-lg">Editor's Choice</Badge>
                  )}
                </div>
              </div>
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
                      {product.original_price && product.original_price !== product.discounted_price && (
                        <span className="text-2xl text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                      {product.discounted_price && (
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(product.discounted_price)}
                        </span>
                      )}
                      {product.original_price && product.discounted_price && product.original_price !== product.discounted_price && (
                        <Badge className="bg-green-500 text-white">
                          Save {Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 text-lg py-6 bg-gradient-primary hover:scale-105 transition-transform shadow-xl"
                  onClick={handleCTAClick}
                >
                  <span>{product.cta_button_text || 'Get Started'}</span>
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="py-6 hover:scale-105 transition-transform">
                  <Bookmark className="mr-2 h-5 w-5" />
                  Save Tool
                </Button>
                <Button variant="outline" size="lg" className="py-6 hover:scale-105 transition-transform">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              About <span className="text-primary">{product.name}</span>
            </h2>
            
            {product.rich_description && (
              <Card className="mb-12 border-primary/20">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.rich_description }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-glow group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful <span className="text-primary">Features</span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <span>Core Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    product.product_type === 'ai_tools' ? "Advanced AI-powered functionality" : "Professional-grade capabilities",
                    "Intuitive user interface",
                    "Real-time processing",
                    "Cross-platform compatibility",
                    "24/7 customer support",
                    product.is_free ? "Completely free to use" : "Premium features included"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    <span>Key Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Increase productivity significantly",
                    "Save hours of manual work",
                    "Improve accuracy and quality",
                    "Scale operations efficiently",
                    "Get results faster",
                    "Access premium support"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      {(product.file_attachments?.length > 0 || product.video_courses?.length > 0) && (
        <section id="resources" className="py-16 bg-gradient-to-br from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Resources & <span className="text-primary">Downloads</span>
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* File Attachments */}
                {product.file_attachments && product.file_attachments.length > 0 && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Download className="h-5 w-5 text-primary" />
                        <span>Downloads & Files</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.file_attachments.map((file: any, index: number) => (
                        <div key={index} className="group border rounded-lg p-4 hover:border-primary/40 transition-colors hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{file.name || `Download ${index + 1}`}</p>
                                <p className="text-sm text-muted-foreground">{file.description || 'Additional resource file'}</p>
                                {file.size && <p className="text-xs text-muted-foreground">{file.size}</p>}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary hover:scale-105 transition-transform"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Video Courses */}
                {product.video_courses && product.video_courses.length > 0 && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span>Video Tutorials</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.video_courses.map((video: any, index: number) => (
                        <div key={index} className="group border rounded-lg overflow-hidden hover:border-primary/40 transition-colors hover:shadow-md">
                          <div className="relative">
                            <img 
                              src={video.url ? getVideoThumbnail(video.url) : '/placeholder.svg'}
                              alt={video.title || `Video ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                                onClick={() => handleVideoClick(video)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Play Video
                              </Button>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              {video.duration || '0:00'}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1">{video.title || `Video Tutorial ${index + 1}`}</h4>
                            <p className="text-sm text-muted-foreground">{video.description || 'Learn how to get the most out of this tool'}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Details Section */}
      <section id="details" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Product <span className="text-primary">Details</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Product Type</span>
                    <span className="font-medium capitalize">{product.product_type?.replace('_', ' ') || 'Software'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category?.name || 'General'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Launch Date</span>
                    <span className="font-medium">{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="font-medium">{product.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Support</span>
                    <span className="font-medium">24/7 Available</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Web Browser</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span>Mobile Devices</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Lock className="h-5 w-5 text-primary" />
                    <span>Secure Access</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Headphones className="h-5 w-5 text-primary" />
                    <span>Customer Support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to get started with <span className="text-primary">{product.name}</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from this amazing tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg py-6 px-8 bg-gradient-primary hover:scale-105 transition-transform shadow-xl"
                onClick={handleCTAClick}
              >
                <span>{product.cta_button_text || 'Get Started Now'}</span>
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="py-6 px-8 hover:scale-105 transition-transform">
                <Bookmark className="mr-2 h-5 w-5" />
                Save for Later
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{(product.views_count || 0).toLocaleString()}+ users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Top rated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Secure & trusted</span>
              </div>
            </div>
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
    </div>
  );
};

export default EnhancedProductDetailPage;