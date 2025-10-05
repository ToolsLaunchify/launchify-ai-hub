import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRevenueAnalytics } from '@/hooks/useRevenueAnalytics';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MousePointerClick, DollarSign, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const ProductAnalyticsWidget: React.FC = () => {
  const { data: analytics, isLoading } = useRevenueAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const conversionRate = analytics.totalClicks > 0
    ? ((analytics.affiliateClicks + analytics.paymentClicks) / analytics.totalClicks * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">All product interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.affiliateClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">Potential commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Clicks</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.paymentClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">Direct payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Products with the most clicks and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Total Clicks</TableHead>
                <TableHead className="text-center">Affiliate</TableHead>
                <TableHead className="text-center">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.clicksByProduct.slice(0, 10).map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{product.total_clicks}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{product.affiliate_clicks}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{product.payment_clicks}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {analytics.clicksByProduct.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No click data available yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
