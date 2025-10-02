import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Star, 
  TrendingUp, 
  Calendar, 
  Award,
  BarChart3,
  Eye,
  Bookmark,
  Settings,
  Grid3X3,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ModernProductCard from '@/components/ModernProductCard';
import MyResumes from '@/components/MyResumes';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { savedProductIds } = useSavedProducts();

  // Fetch user's saved products
  const { data: savedProducts = [], isLoading: savedLoading } = useQuery({
    queryKey: ['saved-products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_saved_products')
        .select(`
          id,
          created_at,
          products (
            id,
            name,
            slug,
            description,
            image_url,
            is_free,
            is_featured,
            original_price,
            discounted_price,
            currency,
            cta_button_text,
            created_at,
            views_count,
            category:categories (
              id,
              name,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recommended products based on user's saved categories
  const { data: recommendations = [], isLoading: recLoading } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user || savedProducts.length === 0) {
        // Fallback to featured products
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            description,
            image_url,
            is_free,
            is_featured,
            original_price,
            discounted_price,
            currency,
            cta_button_text,
            created_at,
            views_count,
            category:categories (
              id,
              name,
              slug
            )
          `)
          .eq('is_featured', true)
          .limit(4);

        if (error) throw error;
        return data || [];
      }

      // Get categories from saved products
      const savedCategories = savedProducts
        .map(sp => sp.products?.category?.id)
        .filter(Boolean);

      if (savedCategories.length === 0) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          is_free,
          is_featured,
          original_price,
          discounted_price,
          currency,
          cta_button_text,
          created_at,
          views_count,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .in('category_id', savedCategories)
        .not('id', 'in', `(${savedProducts.map(sp => sp.products?.id).filter(Boolean).join(',')})`)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user analytics
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: savedCount } = await supabase
        .from('user_saved_products')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      const { data: resumeCount } = await supabase
        .from('user_resumes')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      return {
        savedCount: savedCount?.length || 0,
        resumeCount: resumeCount?.length || 0,
        joinDate: user.created_at,
        profileLevel: Math.floor((savedCount?.length || 0) / 5) + 1,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getGreeting()}, {user.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome to your personal dashboard
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Tools</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.savedCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Tools in your collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.resumeCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Professional resumes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Level</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {userStats?.profileLevel || 1}</div>
              <Progress 
                value={((userStats?.savedCount || 0) % 5) * 20} 
                className="mt-2" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {5 - ((userStats?.savedCount || 0) % 5)} saves to next level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats?.joinDate ? formatDate(userStats.joinDate) : 'Recently'}
              </div>
              <p className="text-xs text-muted-foreground">
                Discovery journey started
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="saved">Saved Tools</TabsTrigger>
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Explore and discover new tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link to="/browse">
                      <Grid3X3 className="w-6 h-6 mb-2" />
                      Browse All
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link to="/type/ai-tools">
                      <Star className="w-6 h-6 mb-2" />
                      AI Tools
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link to="/tools">
                      <Bookmark className="w-6 h-6 mb-2" />
                      Free Tools
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto flex-col py-4">
                    <Link to="/saved">
                      <Heart className="w-6 h-6 mb-2" />
                      Saved
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Saves */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recently Saved</CardTitle>
                    <CardDescription>
                      Your latest tool discoveries
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/saved">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {savedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : savedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedProducts.slice(0, 3).map((item) => (
                      <ModernProductCard 
                        key={item.id} 
                        product={item.products! as any} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved tools yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/browse">Start Exploring</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Saved Tools</CardTitle>
                <CardDescription>
                  Manage your tool collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : savedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProducts.map((item) => (
                      <ModernProductCard 
                        key={item.id} 
                        product={item.products! as any} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No saved tools</h3>
                    <p className="text-muted-foreground mb-6">
                      Save tools you're interested in to build your personal collection
                    </p>
                    <Button asChild>
                      <Link to="/browse">Discover Tools</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resumes" className="space-y-6">
            <MyResumes />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>
                  Personalized tool suggestions based on your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((product) => (
                      <ModernProductCard 
                        key={product.id} 
                        product={product as any} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Save some tools to get personalized recommendations
                    </p>
                    <Button asChild>
                      <Link to="/browse">Start Exploring</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;