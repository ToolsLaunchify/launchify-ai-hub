import React, { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  file_attachments: any[] | null;
  video_courses: any[] | null;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const EnhancedProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');

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

  const keyFeatures = [
    { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance" },
    { icon: Shield, title: "Secure & Safe", description: "Enterprise-grade security standards" },
    { icon: CheckCircle, title: "Easy to Use", description: "Intuitive interface for all skill levels" },
    { icon: Star, title: "Regular Updates", description: "Continuous improvements and new features" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
                  className="w-full h-96 object-cover"
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
                    <Badge variant="outline" className="text-sm px-3 py-1 capitalize">{product.product_type}</Badge>
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
              <div className="flex items-center space-x-8 text-sm">
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
                  className="flex-1 text-lg py-6 bg-gradient-primary hover:opacity-90 shadow-xl"
                  onClick={handleCTAClick}
                >
                  <span>{product.cta_button_text || 'Get Started'}</span>
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="py-6">
                  <Bookmark className="mr-2 h-5 w-5" />
                  Save Tool
                </Button>
                <Button variant="outline" size="lg" className="py-6">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Rich Description */}
            {product.rich_description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About {product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: product.rich_description }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
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
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Features & Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Core Features</h3>
                    <ul className="space-y-3">
                      {[
                        "Advanced AI-powered functionality",
                        "Intuitive user interface",
                        "Real-time processing capabilities",
                        "Cross-platform compatibility",
                        "24/7 customer support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Benefits</h3>
                    <ul className="space-y-3">
                      {[
                        "Increase productivity by 50%",
                        "Save hours of manual work",
                        "Improve accuracy and quality",
                        "Scale your operations efficiently",
                        "Get results in minutes, not hours"
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* File Attachments */}
              {product.file_attachments && product.file_attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Downloads & Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.file_attachments.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Video Courses */}
              {product.video_courses && product.video_courses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Video Tutorials</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.video_courses.map((video: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground">{video.duration}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Bonus Section */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>Bonus Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Exclusive Templates", description: "10+ ready-to-use templates" },
                      { title: "Community Access", description: "Join our private community" },
                      { title: "Priority Support", description: "Get help when you need it" }
                    ].map((bonus, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">{bonus.title}</h4>
                        <p className="text-sm text-muted-foreground">{bonus.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{product.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{product.product_type || 'Software'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Launch Date:</span>
                    <span className="font-medium">{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing Model:</span>
                    <span className="font-medium">{product.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Views:</span>
                    <span className="font-medium">{(product.views_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saves:</span>
                    <span className="font-medium">{(product.saves_count || 0).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support & Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Regular updates included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Community forum access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Video tutorials included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Final CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started with {product.name}?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already using this powerful tool to transform their workflow.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 shadow-xl"
              onClick={handleCTAClick}
            >
              <span>{product.cta_button_text || 'Get Started Now'}</span>
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedProductDetailPage;