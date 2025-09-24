import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Package, 
  Users, 
  BarChart3, 
  Plus,
  PenSquare,
  Trash2,
  Eye,
  TrendingUp,
  Star,
  Bookmark,
  Mail,
  BookOpen,
  Settings2,
  ShoppingCart,
  Brain,
  CreditCard
} from 'lucide-react';
import ProductsManagement from '@/components/admin/ProductsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import PagesManagement from '@/components/admin/PagesManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import FooterManagement from '@/components/admin/FooterManagement';
import { AdvancedAnalyticsDashboard } from '@/components/admin/AdvancedAnalyticsDashboard';
import { LeadsManagement } from '@/components/admin/LeadsManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import { ToolIntelligenceManagement } from '@/components/admin/ToolIntelligenceManagement';
import { PaymentManagement } from '@/components/admin/PaymentManagement';
import { useRealAdminStats } from '@/hooks/useRealAdminStats';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: adminStats, isLoading: statsLoading } = useRealAdminStats();

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Real stats data from database
  const stats = [
    { 
      title: 'Total Products', 
      value: adminStats?.totalProducts.toLocaleString() || '0', 
      change: 'Live data', 
      icon: Package,
      color: 'text-blue-600'
    },
    { 
      title: 'Total Users', 
      value: adminStats?.totalUsers.toLocaleString() || '0', 
      change: 'Live data', 
      icon: Users,
      color: 'text-green-600'
    },
    { 
      title: 'Monthly Clicks', 
      value: adminStats?.totalClicks.toLocaleString() || '0', 
      change: 'Last 30 days', 
      icon: Eye,
      color: 'text-purple-600'
    },
    { 
      title: 'Conversion Rate', 
      value: `${adminStats?.conversionRate.toFixed(1) || '0'}%`, 
      change: `${adminStats?.totalConversions || 0} conversions`, 
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tools platform from one central location
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap gap-1 mb-8 bg-muted/50 p-2 rounded-lg h-auto justify-start">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Settings className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <PenSquare className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger 
              value="blog" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger 
              value="footer" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Settings2 className="h-4 w-4" />
              Footer
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="leads" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Mail className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger 
              value="newsletter" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Mail className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="tool-intelligence" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <Brain className="h-4 w-4" />
              Tool Intelligence
            </TabsTrigger>
            <TabsTrigger 
              value="payment-management" 
              className="flex items-center gap-2 bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-all px-3 py-2 text-sm whitespace-nowrap"
            >
              <CreditCard className="h-4 w-4" />
              Payment Management
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('products')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('categories')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Users
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions on your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminStats?.recentActivity.length ? adminStats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'product' ? 'bg-blue-500' :
                          activity.type === 'user' ? 'bg-green-500' :
                          activity.type === 'click' ? 'bg-purple-500' :
                          'bg-primary'
                        }`}></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.detail}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <PagesManagement />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer">
            <FooterManagement />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <LeadsManagement />
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          {/* Tool Intelligence Tab */}
          <TabsContent value="tool-intelligence">
            <ToolIntelligenceManagement />
          </TabsContent>

          {/* Payment Management Tab */}
          <TabsContent value="payment-management">
            <PaymentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;