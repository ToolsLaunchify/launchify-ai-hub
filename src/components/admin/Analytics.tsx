import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Star, 
  Bookmark, 
  Package, 
  Users,
  Calendar
} from 'lucide-react';

const Analytics: React.FC = () => {
  // Fetch products analytics
  const { data: productsAnalytics, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-analytics-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('views_count, saves_count, is_featured, is_free, created_at');
      if (error) throw error;
      return data;
    }
  });

  // Fetch categories analytics
  const { data: categoriesCount, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-analytics-categories'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch users analytics
  const { data: usersCount, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-analytics-users'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const isLoading = productsLoading || categoriesLoading || usersLoading;

  // Calculate metrics
  const totalProducts = productsAnalytics?.length || 0;
  const totalViews = productsAnalytics?.reduce((sum, product) => sum + (product.views_count || 0), 0) || 0;
  const totalSaves = productsAnalytics?.reduce((sum, product) => sum + (product.saves_count || 0), 0) || 0;
  const featuredProducts = productsAnalytics?.filter(product => product.is_featured).length || 0;
  const freeProducts = productsAnalytics?.filter(product => product.is_free).length || 0;

  // Get recent products (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentProducts = productsAnalytics?.filter(product => 
    new Date(product.created_at) > thirtyDaysAgo
  ).length || 0;

  const topMetrics = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      change: `+${recentProducts} this month`
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-600",
      change: "All time views"
    },
    {
      title: "Total Saves",
      value: totalSaves.toLocaleString(),
      icon: Bookmark,
      color: "text-purple-600",
      change: "User bookmarks"
    },
    {
      title: "Featured Products",
      value: featuredProducts.toLocaleString(),
      icon: Star,
      color: "text-yellow-600",
      change: `${Math.round((featuredProducts / totalProducts) * 100)}% of total`
    }
  ];

  const additionalMetrics = [
    {
      title: "Free Products",
      value: freeProducts,
      total: totalProducts,
      percentage: totalProducts > 0 ? Math.round((freeProducts / totalProducts) * 100) : 0,
      color: "bg-green-500"
    },
    {
      title: "Paid Products", 
      value: totalProducts - freeProducts,
      total: totalProducts,
      percentage: totalProducts > 0 ? Math.round(((totalProducts - freeProducts) / totalProducts) * 100) : 0,
      color: "bg-blue-500"
    },
    {
      title: "Categories",
      value: categoriesCount || 0,
      total: null,
      percentage: null,
      color: "bg-purple-500"
    },
    {
      title: "Registered Users",
      value: usersCount || 0,
      total: null,
      percentage: null,
      color: "bg-orange-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Platform performance and insights</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Breakdown of your product catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalMetrics.slice(0, 2).map((metric) => (
              <div key={metric.title}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.value} {metric.percentage !== null && `(${metric.percentage}%)`}
                  </span>
                </div>
                {metric.percentage !== null && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${metric.color}`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>General platform statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalMetrics.slice(2).map((metric) => (
              <div key={metric.title} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                <Badge variant="outline">{metric.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Performance Insights</span>
          </CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalViews}</div>
              <div className="text-sm text-muted-foreground">Total Page Views</div>
              <div className="text-xs mt-1">
                Avg: {totalProducts > 0 ? Math.round(totalViews / totalProducts) : 0} views per product
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalSaves}</div>
              <div className="text-sm text-muted-foreground">Total Saves</div>
              <div className="text-xs mt-1">
                Avg: {totalProducts > 0 ? Math.round(totalSaves / totalProducts) : 0} saves per product
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalViews > 0 ? ((totalSaves / totalViews) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Save Rate</div>
              <div className="text-xs mt-1">
                Saves per view ratio
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Last 30 days summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-3xl font-bold text-gradient-primary mb-2">
              {recentProducts}
            </div>
            <div className="text-muted-foreground">
              New products added this month
            </div>
            {recentProducts > 0 && (
              <Badge variant="outline" className="mt-2">
                {Math.round((recentProducts / totalProducts) * 100)}% growth
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;