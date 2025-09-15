import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRevenueAnalytics } from '@/hooks/useRevenueAnalytics';
import { DollarSign, CreditCard, MousePointer, TrendingUp, Gift, Shuffle } from 'lucide-react';
import { format } from 'date-fns';

export const RevenueAnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading, error } = useRevenueAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading analytics data</p>
      </div>
    );
  }

  if (!analytics) return null;

  const getRevenueTypeConfig = (type: string) => {
    switch (type) {
      case 'affiliate':
        return { label: 'Affiliate', icon: DollarSign, color: 'bg-green-100 text-green-800' };
      case 'payment':
        return { label: 'Payment', icon: CreditCard, color: 'bg-blue-100 text-blue-800' };
      case 'free':
        return { label: 'Free', icon: Gift, color: 'bg-gray-100 text-gray-800' };
      case 'mixed':
        return { label: 'Mixed', icon: Shuffle, color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Unknown', icon: MousePointer, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Revenue Analytics</h2>
        <p className="text-muted-foreground">Track your revenue sources and click performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground">All-time clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Clicks</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.affiliateClicks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalClicks > 0 ? 
                Math.round((analytics.affiliateClicks / analytics.totalClicks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Clicks</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.paymentClicks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalClicks > 0 ? 
                Math.round((analytics.paymentClicks / analytics.totalClicks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Click performance by product</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Total Clicks</TableHead>
                <TableHead>Affiliate</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.clicksByProduct.slice(0, 10).map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell>{product.total_clicks}</TableCell>
                  <TableCell>{product.affiliate_clicks}</TableCell>
                  <TableCell>{product.payment_clicks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest clicks and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentClicks.slice(0, 20).map((click) => {
              const config = getRevenueTypeConfig(click.click_type);
              const Icon = config.icon;
              
              return (
                <div key={click.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{click.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(click.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Badge className={config.color}>
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};