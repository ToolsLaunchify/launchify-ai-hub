import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, TrendingUp, TrendingDown, DollarSign, MousePointer, Target, Eye, ExternalLink } from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { RevenueTypeIndicator } from '@/components/RevenueTypeIndicator';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const PRESET_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [customRangeOpen, setCustomRangeOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>();

  const { data: analytics, isLoading, error } = useAdvancedAnalytics(dateRange);

  const handlePresetRange = (days: number) => {
    setDateRange({
      start: subDays(new Date(), days),
      end: new Date()
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted"></CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading analytics data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          {PRESET_RANGES.map((range) => (
            <Button
              key={range.days}
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(range.days)}
              className={cn(
                dateRange.start.getTime() === subDays(new Date(), range.days).getTime() &&
                dateRange.end.toDateString() === new Date().toDateString()
                  ? "bg-primary text-primary-foreground"
                  : ""
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
        
        <Popover open={customRangeOpen} onOpenChange={setCustomRangeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Custom Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <p className="text-sm font-medium">Select Date Range</p>
              <p className="text-xs text-muted-foreground">
                {format(dateRange.start, 'MMM dd, yyyy')} - {format(dateRange.end, 'MMM dd, yyyy')}
              </p>
            </div>
            <Calendar
              mode="range"
              selected={{ from: dateRange.start, to: dateRange.end }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ start: range.from, end: range.to });
                } else if (range?.from) {
                  setDateRange({ start: range.from, end: range.from });
                }
              }}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
            <div className="p-3 border-t flex gap-2">
              <Button
                size="sm"
                onClick={() => setCustomRangeOpen(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCustomRangeOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(analytics.conversionRate)} conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Revenue per Click</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.totalClicks > 0 ? analytics.totalRevenue / analytics.totalClicks : 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Clicks, conversions, and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Clicks distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.clicksBySource}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                  label={({ source, percent }) => `${source} (${(percent * 100).toFixed(0)}%)`}
                >
                  {analytics.clicksBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources" className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-glow">Traffic Sources</TabsTrigger>
          <TabsTrigger value="products" className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-glow">Product Performance</TabsTrigger>
          <TabsTrigger value="activity" className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-glow">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources Performance</CardTitle>
              <CardDescription>Detailed breakdown of clicks and conversions by source</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.clicksBySource.map((source) => (
                    <TableRow key={source.source}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="capitalize">
                          {source.source}
                        </Badge>
                      </TableCell>
                      <TableCell>{source.clicks.toLocaleString()}</TableCell>
                      <TableCell>{source.conversions.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(source.revenue)}</TableCell>
                      <TableCell>
                        {formatPercentage(source.clicks > 0 ? (source.conversions / source.clicks) * 100 : 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Performance metrics for each product</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Revenue Type</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.clicksByProduct.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell>
                        <RevenueTypeIndicator 
                          revenueType={product.revenue_type as 'affiliate' | 'payment' | 'free'} 
                          size="sm" 
                        />
                      </TableCell>
                      <TableCell>{product.clicks.toLocaleString()}</TableCell>
                      <TableCell>{product.conversions.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>
                        {formatPercentage(product.clicks > 0 ? (product.conversions / product.clicks) * 100 : 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest clicks and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {activity.click_type === 'affiliate' && <ExternalLink className="h-4 w-4 text-green-600" />}
                        {activity.click_type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                        {activity.click_type === 'view' && <Eye className="h-4 w-4 text-gray-600" />}
                        <span className="capitalize font-medium">{activity.click_type}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span>{activity.product_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline" className="capitalize">
                        {activity.utm_source}
                      </Badge>
                      <span>{format(new Date(activity.created_at), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};