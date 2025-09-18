import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { useSubCategories } from '@/hooks/useSubCategories'

interface Tool {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  is_embedded_tool: boolean
  tool_url?: string
  tool_config: Record<string, any>
  adsense_config: Record<string, any>
  sub_category_id?: string
  purchase_price?: number
  revenue_type: 'free' | 'affiliate' | 'payment' | 'paid'
  tool_type: 'external' | 'embedded'
  is_featured: boolean
  created_at: string
  updated_at: string
}

const ToolsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'embedded' | 'external'>('all')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_embedded_tool: false,
    tool_url: '',
    tool_config: '{}',
    adsense_config: '{}',
    sub_category_id: '',
    purchase_price: '',
    revenue_type: 'free' as 'free' | 'affiliate' | 'payment' | 'paid',
    tool_type: 'embedded' as 'external' | 'embedded',
    is_featured: false
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: subCategories = [] } = useSubCategories()

  // Fetch tools (embedded products)
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, image_url, is_embedded_tool,
          tool_url, tool_config, adsense_config, sub_category_id,
          purchase_price, revenue_type, tool_type, is_featured,
          created_at, updated_at
        `)
        .eq('is_embedded_tool', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Tool[]
    }
  })

  const createToolMutation = useMutation({
    mutationFn: async (toolData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...toolData,
          is_embedded_tool: true,
          tool_config: JSON.parse(toolData.tool_config || '{}'),
          adsense_config: JSON.parse(toolData.adsense_config || '{}'),
          purchase_price: toolData.purchase_price ? parseFloat(toolData.purchase_price) : null
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      toast({ title: 'Tool created successfully!' })
      resetForm()
    },
    onError: (error) => {
      toast({ title: 'Error creating tool', description: error.message, variant: 'destructive' })
    }
  })

  const updateToolMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          tool_config: JSON.parse(updates.tool_config || '{}'),
          adsense_config: JSON.parse(updates.adsense_config || '{}'),
          purchase_price: updates.purchase_price ? parseFloat(updates.purchase_price) : null
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      toast({ title: 'Tool updated successfully!' })
      resetForm()
    },
    onError: (error) => {
      toast({ title: 'Error updating tool', description: error.message, variant: 'destructive' })
    }
  })

  const deleteToolMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      toast({ title: 'Tool deleted successfully!' })
    },
    onError: (error) => {
      toast({ title: 'Error deleting tool', description: error.message, variant: 'destructive' })
    }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      is_embedded_tool: false,
      tool_url: '',
      tool_config: '{}',
      adsense_config: '{}',
      sub_category_id: '',
      purchase_price: '',
      revenue_type: 'free',
      tool_type: 'embedded',
      is_featured: false
    })
    setEditingTool(null)
    setIsDialogOpen(false)
  }

  const openEditDialog = (tool: Tool) => {
    setEditingTool(tool)
    setFormData({
      name: tool.name,
      slug: tool.slug,
      description: tool.description || '',
      image_url: tool.image_url || '',
      is_embedded_tool: tool.is_embedded_tool,
      tool_url: tool.tool_url || '',
      tool_config: JSON.stringify(tool.tool_config, null, 2),
      adsense_config: JSON.stringify(tool.adsense_config, null, 2),
      sub_category_id: tool.sub_category_id || '',
      purchase_price: tool.purchase_price?.toString() || '',
      revenue_type: tool.revenue_type,
      tool_type: tool.tool_type,
      is_featured: tool.is_featured
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTool) {
      updateToolMutation.mutate({ id: editingTool.id, ...formData })
    } else {
      createToolMutation.mutate(formData)
    }
  }

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || tool.tool_type === filterType
    return matchesSearch && matchesFilter
  })

  const getSubCategoryName = (id?: string) => {
    return subCategories.find(cat => cat.id === id)?.name || 'None'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Tools Management</h2>
          <p className="text-muted-foreground">Create and manage your embedded tools</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTool ? 'Edit Tool' : 'Create New Tool'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tool Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="currency-converter"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/tool-image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="tool_url">Tool URL Path</Label>
                  <Input
                    id="tool_url"
                    value={formData.tool_url}
                    onChange={(e) => setFormData({ ...formData, tool_url: e.target.value })}
                    placeholder="/currency-converter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sub_category_id">Sub Category</Label>
                  <Select value={formData.sub_category_id} onValueChange={(value) => setFormData({ ...formData, sub_category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="revenue_type">Revenue Type</Label>
                  <Select value={formData.revenue_type} onValueChange={(value: any) => setFormData({ ...formData, revenue_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free (AdSense)</SelectItem>
                      <SelectItem value="paid">Paid (Razorpay)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.revenue_type === 'paid' && (
                <div>
                  <Label htmlFor="purchase_price">Purchase Price (INR)</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    placeholder="299.00"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Tool</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tool_config">Tool Configuration (JSON)</Label>
                  <Textarea
                    id="tool_config"
                    value={formData.tool_config}
                    onChange={(e) => setFormData({ ...formData, tool_config: e.target.value })}
                    rows={4}
                    placeholder='{"theme": "default", "features": []}'
                  />
                </div>
                <div>
                  <Label htmlFor="adsense_config">AdSense Configuration (JSON)</Label>
                  <Textarea
                    id="adsense_config"
                    value={formData.adsense_config}
                    onChange={(e) => setFormData({ ...formData, adsense_config: e.target.value })}
                    rows={4}
                    placeholder='{"adSlots": [], "enabled": true}'
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createToolMutation.isPending || updateToolMutation.isPending}>
                  {editingTool ? 'Update Tool' : 'Create Tool'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            <SelectItem value="embedded">Embedded Tools</SelectItem>
            <SelectItem value="external">External Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tools ({filteredTools.length})</CardTitle>
          <CardDescription>Manage your embedded tools and web apps</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading tools...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Revenue Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {tool.image_url && (
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">/{tool.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSubCategoryName(tool.sub_category_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tool.revenue_type === 'paid' ? 'default' : 'secondary'}>
                        {tool.revenue_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tool.purchase_price ? `₹${tool.purchase_price}` : 'Free'}
                    </TableCell>
                    <TableCell>
                      {tool.is_featured && <Badge>Featured</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {tool.tool_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(tool.tool_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(tool)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this tool?')) {
                              deleteToolMutation.mutate(tool.id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ToolsManagement