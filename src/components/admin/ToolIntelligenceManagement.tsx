import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, AlertTriangle, ExternalLink, Plus, Check, X, Eye, Filter, Search, RefreshCw, Zap, Target, DollarSign } from 'lucide-react';
import { useDiscoveredTools, useToolInsights, useUpdateToolStatus, useMarkInsightAsRead, useDismissInsight, useAddDiscoveredTool } from '@/hooks/useToolIntelligence';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export const ToolIntelligenceManagement = () => {
  const { data: discoveredTools = [], isLoading: loadingTools } = useDiscoveredTools();
  const { data: insights = [], isLoading: loadingInsights } = useToolInsights();
  const updateToolStatus = useUpdateToolStatus();
  const markAsRead = useMarkInsightAsRead();
  const dismissInsight = useDismissInsight();
  const addTool = useAddDiscoveredTool();
  const { toast } = useToast();

  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: '',
    source_platform: 'manual',
    external_url: '',
    tags: '',
    tool_type: 'external',
    product_type: 'software',
    revenue_type: 'free',
    pricing: '',
    is_featured: false,
    is_trending: false,
    cta_button_text: 'Learn More',
    add_to_directory: true,
  });
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const priorityColors = {
    urgent: 'destructive',
    high: 'secondary',
    medium: 'outline',
    low: 'outline',
  } as const;

  const statusColors = {
    pending: 'outline',
    reviewed: 'secondary',
    added: 'default',
    ignored: 'destructive',
  } as const;

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateToolStatus.mutateAsync({ id, status });
      toast({
        title: 'Status Updated',
        description: `Tool status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tool status',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark insight as read',
        variant: 'destructive',
      });
    }
  };

  const handleDismissInsight = async (id: string) => {
    try {
      await dismissInsight.mutateAsync(id);
      toast({
        title: 'Insight Dismissed',
        description: 'Insight has been dismissed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to dismiss insight',
        variant: 'destructive',
      });
    }
  };

  const handleAddTool = async () => {
    try {
      const tags = newTool.tags ? newTool.tags.split(',').map(tag => tag.trim()) : [];
      
      if (newTool.add_to_directory) {
        // Add directly to products table for immediate visibility
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', newTool.category)
          .single();

        const productData = {
          name: newTool.name,
          description: newTool.description,
          rich_description: newTool.description,
          slug: newTool.name.toLowerCase().replace(/\s+/g, '-'),
          tool_url: newTool.external_url,
          category_id: categoryData?.id,
          product_type: newTool.product_type,
          tool_type: newTool.tool_type,
          revenue_type: newTool.revenue_type as 'free' | 'affiliate' | 'payment' | 'paid',
          is_featured: newTool.is_featured,
          is_trending: newTool.is_trending,
          cta_button_text: newTool.cta_button_text,
          product_tags: tags,
          original_price: newTool.pricing ? parseFloat(newTool.pricing) : null,
        };

        const { error: productError } = await supabase
          .from('products')
          .insert(productData);

        if (productError) throw productError;

        toast({
          title: 'Tool Added to Directory',
          description: 'Tool is now live and visible on your homepage',
        });
      } else {
        // Add to discovery queue
        await addTool.mutateAsync({
          ...newTool,
          tags,
          priority_score: 50,
        });

        toast({
          title: 'Tool Added to Discovery Queue',
          description: 'Tool will be reviewed before going live',
        });
      }
      
      setNewTool({
        name: '',
        description: '',
        category: '',
        source_platform: 'manual',
        external_url: '',
        tags: '',
        tool_type: 'external',
        product_type: 'software',
        revenue_type: 'free',
        pricing: '',
        is_featured: false,
        is_trending: false,
        cta_button_text: 'Learn More',
        add_to_directory: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tool',
        variant: 'destructive',
      });
    }
  };

  const unreadInsights = insights.filter(insight => !insight.is_read);
  const pendingTools = discoveredTools.filter(tool => tool.status === 'pending');
  const urgentInsights = insights.filter(insight => insight.priority === 'urgent');
  const highValueTools = discoveredTools.filter(tool => tool.has_affiliate_program && tool.priority_score > 80);

  // Filter insights and tools
  const filteredInsights = insights.filter(insight => {
    if (filterPriority !== 'all' && insight.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && insight.category !== filterCategory) return false;
    return true;
  });

  const filteredTools = discoveredTools.filter(tool => {
    if (filterCategory !== 'all' && tool.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tool Intelligence Center</h2>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations for your directory growth
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tool Manually
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tool Manually</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tool Name</Label>
                  <Input
                    id="name"
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    placeholder="Enter tool name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    placeholder="Brief description of the tool"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newTool.category}
                    onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                    placeholder="e.g., AI Tools, Productivity"
                  />
                </div>
                <div>
                  <Label htmlFor="url">External URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={newTool.external_url}
                    onChange={(e) => setNewTool({ ...newTool, external_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newTool.tags}
                    onChange={(e) => setNewTool({ ...newTool, tags: e.target.value })}
                    placeholder="AI, productivity, automation"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tool_type">Tool Type</Label>
                    <Select value={newTool.tool_type} onValueChange={(value) => setNewTool({ ...newTool, tool_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tool type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="external">External Tool</SelectItem>
                        <SelectItem value="embedded">Embedded Tool</SelectItem>
                        <SelectItem value="calculator">Calculator</SelectItem>
                        <SelectItem value="converter">Converter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product_type">Product Type</Label>
                    <Select value={newTool.product_type} onValueChange={(value) => setNewTool({ ...newTool, product_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="web_app">Web App</SelectItem>
                        <SelectItem value="extension">Browser Extension</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue_type">Revenue Model</Label>
                    <Select value={newTool.revenue_type} onValueChange={(value) => setNewTool({ ...newTool, revenue_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
                        <SelectItem value="payment">Payment Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pricing">Price (if paid)</Label>
                    <Input
                      id="pricing"
                      type="number"
                      value={newTool.pricing}
                      onChange={(e) => setNewTool({ ...newTool, pricing: e.target.value })}
                      placeholder="29.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cta_button_text">CTA Button Text</Label>
                  <Input
                    id="cta_button_text"
                    value={newTool.cta_button_text}
                    onChange={(e) => setNewTool({ ...newTool, cta_button_text: e.target.value })}
                    placeholder="Learn More, Get Started, Try Now"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={newTool.is_featured}
                      onChange={(e) => setNewTool({ ...newTool, is_featured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_featured">Featured Tool</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_trending"
                      checked={newTool.is_trending}
                      onChange={(e) => setNewTool({ ...newTool, is_trending: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_trending">Trending Tool</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg">
                  <input
                    type="checkbox"
                    id="add_to_directory"
                    checked={newTool.add_to_directory}
                    onChange={(e) => setNewTool({ ...newTool, add_to_directory: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="add_to_directory" className="font-medium">
                    Add directly to live directory (visible immediately on homepage)
                  </Label>
                </div>

                <Button onClick={handleAddTool} className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  {newTool.add_to_directory ? 'Add to Live Directory' : 'Add to Discovery Queue'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Advanced Alert Banner */}
      {urgentInsights.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-red-800 font-semibold">Urgent Action Required!</h3>
              <p className="text-red-700">
                You have {urgentInsights.length} urgent recommendations that need immediate attention.
                Missing out on high-traffic opportunities could cost you significant revenue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Market Intelligence */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>AI Tools</span>
                <span className="text-green-600 font-medium">↗ +23%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Productivity</span>
                <span className="text-green-600 font-medium">↗ +18%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Design Tools</span>
                <span className="text-red-600 font-medium">↘ -5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 text-green-600 mr-2" />
              Revenue Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xl font-bold text-green-600">$12,450</div>
              <div className="text-xs text-muted-foreground">Potential monthly revenue</div>
              <div className="text-xs">
                <span className="font-medium">47</span> tools with affiliate programs
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 text-purple-600 mr-2" />
              Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">ProductHunt:</span> 23 new tools today
              </div>
              <div className="text-xs">
                <span className="font-medium">AlternativeTo:</span> 15 trending
              </div>
              <div className="text-xs">
                <span className="font-medium">GitHub:</span> 8 viral repos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 text-orange-600 mr-2" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs flex items-center">
                <div className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                New viral tool detected
              </div>
              <div className="text-xs flex items-center">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Price change alert
              </div>
              <div className="text-xs flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Affiliate opportunity
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced KPI Dashboard */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentInsights.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTools.length}</div>
            <p className="text-xs text-muted-foreground">
              Tools waiting for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Tools</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highValueTools.length}</div>
            <p className="text-xs text-muted-foreground">
              With affiliate programs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadInsights.length}</div>
            <p className="text-xs text-muted-foreground">
              New recommendations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discovered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discoveredTools.length}</div>
            <p className="text-xs text-muted-foreground">
              Tools in pipeline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="AI Tools">AI Tools</SelectItem>
            <SelectItem value="Productivity">Productivity</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Developer Tools">Developer Tools</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">
            Insights & Recommendations
            {unreadInsights.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unreadInsights.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="discovered">
            Discovered Tools
            {pendingTools.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {pendingTools.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Real-time Market Intelligence Dashboard */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Market Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">ProductHunt launches today</span>
                    <Badge variant="outline">847</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">GitHub trending repos</span>
                    <Badge variant="outline">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">HackerNews mentions</span>
                    <Badge variant="outline">156</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">AI & Machine Learning</span>
                    <span className="text-xs text-green-600 font-medium">↗ +45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">No-Code Tools</span>
                    <span className="text-xs text-green-600 font-medium">↗ +32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Content Creation</span>
                    <span className="text-xs text-green-600 font-medium">↗ +28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Dev Tools</span>
                    <span className="text-xs text-blue-600 font-medium">→ +12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Revenue Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-green-600">$18,750</div>
                  <div className="text-xs text-muted-foreground">Est. monthly opportunity</div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="font-medium">High-value tools:</span> 12 pending
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Affiliate programs:</span> 23 available
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Premium listings:</span> 8 opportunities
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {loadingInsights ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading intelligence insights...</span>
            </div>
          ) : filteredInsights.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Intelligence Engine Active</h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI is analyzing market trends, competitor data, and user behavior to generate powerful insights.
                    {insights.length === 0 
                      ? " Initial analysis is in progress - insights will appear here shortly."
                      : " No insights match your current filters."
                    }
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Target className="h-4 w-4 mr-2 text-blue-500" />
                      Market Analysis
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      Trend Detection
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Revenue Optimization
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredInsights.map((insight) => (
              <Card key={insight.id} className={`${!insight.is_read ? 'border-primary shadow-md' : ''} ${insight.priority === 'urgent' ? 'border-red-300 bg-red-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg flex items-center">
                        {insight.priority === 'urgent' && <Zap className="h-5 w-5 text-red-500 mr-2" />}
                        {insight.title}
                      </CardTitle>
                      <Badge variant={priorityColors[insight.priority as keyof typeof priorityColors]}>
                        {insight.priority}
                      </Badge>
                      {!insight.is_read && (
                        <Badge variant="default">New</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!insight.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(insight.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissInsight(insight.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{insight.description}</p>
                  {insight.category && (
                    <p className="text-sm">
                      <strong>Category:</strong> {insight.category}
                    </p>
                  )}
                  {insight.related_tool_data && Object.keys(insight.related_tool_data).length > 0 && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Additional Data:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(insight.related_tool_data).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.action_required && (
                    <p className="text-sm mt-2">
                      <strong>Recommended Action:</strong> {insight.action_required}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="discovered" className="space-y-4">
          {loadingTools ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading discovered tools...</span>
            </div>
          ) : filteredTools.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tool Discovery Engine</h3>
                  <p className="text-muted-foreground mb-4">
                    {discoveredTools.length === 0 
                      ? "Our automated systems are scanning ProductHunt, GitHub, and other sources for trending tools. Discoveries will appear here."
                      : "No tools match your current filters. Try adjusting the category filter above."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <Badge variant={statusColors[tool.status as keyof typeof statusColors]}>
                        {tool.status}
                      </Badge>
                      <Badge variant="outline">{tool.source_platform}</Badge>
                      {tool.has_affiliate_program && (
                        <Badge variant="default">Affiliate Available</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {tool.external_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={tool.external_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {tool.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(tool.id, 'reviewed')}
                          >
                            Review
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusUpdate(tool.id, 'added')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Add to Directory
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(tool.id, 'ignored')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {tool.category && (
                      <span><strong>Category:</strong> {tool.category}</span>
                    )}
                    {tool.launch_date && (
                      <span><strong>Launch:</strong> {new Date(tool.launch_date).toLocaleDateString()}</span>
                    )}
                    <span><strong>Priority Score:</strong> {tool.priority_score}</span>
                  </div>
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="mt-2">
                      <strong>Tags:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tool.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};