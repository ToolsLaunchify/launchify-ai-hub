import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Download, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  TrendingUp,
  Target,
  Filter
} from 'lucide-react';
import { useLeads, useLeadsStats, Lead } from '@/hooks/useLeads';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SourceAnalyticsDashboard } from './SourceAnalyticsDashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';

export const LeadsManagement: React.FC = () => {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: stats, isLoading: statsLoading } = useLeadsStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');

  // Filter leads based on search term and product filter
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = filterProduct === '' || 
      lead.products?.name.toLowerCase().includes(filterProduct.toLowerCase());
    
    return matchesSearch && matchesProduct;
  }) || [];

  // Get unique products for filter
  const uniqueProducts = [...new Set(leads?.map(lead => lead.products?.name).filter(Boolean))];

  const exportToCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Product', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone || ''}"`,
        `"${lead.products?.name || ''}"`,
        `"${lead.utm_source || ''}"`,
        `"${lead.utm_medium || ''}"`,
        `"${lead.utm_campaign || ''}"`,
        `"${format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm:ss')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Leads exported successfully!');
  };

  if (leadsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Tabs defaultValue="leads" className="space-y-6">
      <TabsList>
        <TabsTrigger value="leads">Collected Leads</TabsTrigger>
        <TabsTrigger value="analytics">Source Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="leads" className="space-y-6">
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time collected leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.leadsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              Leads collected this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.leadsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              Leads collected today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to sale conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Card */}
      {stats?.topProducts && stats.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products with the most lead generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{product.product_name}</span>
                  <Badge variant="secondary">{product.lead_count} leads</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Collected Leads</CardTitle>
              <CardDescription>
                Manage and export your lead collection data
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by product..."
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No leads found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || filterProduct ? 'Try adjusting your search filters.' : 'Start collecting leads by enabling email collection on your products.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Product</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Purchase Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Date (IST)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone || '-'}</TableCell>
                      <TableCell>
                        {lead.products?.name ? (
                          <Badge variant="outline">{lead.products.name}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {lead.source_display}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.has_purchased ? (
                          <Badge variant="default" className="bg-green-600 text-white">
                            Purchased
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Not Purchased
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.has_purchased && lead.total_revenue ? (
                          <span className="font-medium text-green-600">
                            ${lead.total_revenue.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{lead.formatted_created_at}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <SourceAnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};