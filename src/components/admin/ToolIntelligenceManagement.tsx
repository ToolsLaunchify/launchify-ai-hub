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
      await addTool.mutateAsync({
        ...newTool,
        tags,
        priority_score: 50,
      });
      
      setNewTool({
        name: '',
        description: '',
        category: '',
        source_platform: 'manual',
        external_url: '',
        tags: '',
      });

      toast({
        title: 'Tool Added',
        description: 'Tool has been added to the discovery queue',
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
                <Button onClick={handleAddTool} className="w-full">
                  Add Tool
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

      {/* Stats Cards */}
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