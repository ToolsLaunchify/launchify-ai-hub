import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/useLeads";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const SourceAnalyticsDashboard = () => {
  const { data: leads, isLoading } = useLeads();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Analyze source performance
  const sourceStats = leads?.reduce((acc, lead) => {
    const source = lead.utm_source || 'direct';
    if (!acc[source]) {
      acc[source] = {
        source,
        totalLeads: 0,
        purchasedLeads: 0,
        totalRevenue: 0,
        conversionRate: 0
      };
    }
    
    acc[source].totalLeads++;
    if (lead.has_purchased) {
      acc[source].purchasedLeads++;
      acc[source].totalRevenue += lead.total_revenue || 0;
    }
    acc[source].conversionRate = (acc[source].purchasedLeads / acc[source].totalLeads) * 100;
    
    return acc;
  }, {} as Record<string, any>) || {};

  const sourceData = Object.values(sourceStats).sort((a: any, b: any) => b.totalLeads - a.totalLeads);
  const topSources = sourceData.slice(0, 5);

  // Revenue by source for pie chart
  const revenueBySource = sourceData
    .filter((item: any) => item.totalRevenue > 0)
    .map((item: any) => ({
      name: item.source.charAt(0).toUpperCase() + item.source.slice(1),
      value: item.totalRevenue,
      leads: item.totalLeads
    }));

  const totalLeads = leads?.length || 0;
  const totalPurchases = leads?.filter(lead => lead.has_purchased).length || 0;
  const totalRevenue = leads?.reduce((sum, lead) => sum + (lead.total_revenue || 0), 0) || 0;
  const overallConversionRate = totalLeads > 0 ? (totalPurchases / totalLeads) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPurchases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Number of leads from each traffic source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="source" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalLeads" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Source Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Revenue distribution across traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Source Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Source Performance Details</CardTitle>
          <CardDescription>Detailed performance metrics for each traffic source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceData.map((source: any, index) => (
              <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="w-20 justify-center">
                    {source.source.charAt(0).toUpperCase() + source.source.slice(1)}
                  </Badge>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-4 text-sm">
                      <span><strong>{source.totalLeads}</strong> leads</span>
                      <span><strong>{source.purchasedLeads}</strong> purchases</span>
                      <span className="text-green-600"><strong>${source.totalRevenue.toFixed(2)}</strong> revenue</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Conversion Rate: {source.conversionRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <Badge 
                    variant={source.conversionRate > overallConversionRate ? "default" : "secondary"}
                    className={source.conversionRate > overallConversionRate ? "bg-green-600 text-white" : ""}
                  >
                    {source.conversionRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};