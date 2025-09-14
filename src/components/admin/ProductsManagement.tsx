import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  PenSquare, 
  Trash2, 
  Eye, 
  ExternalLink,
  Search,
  Filter,
  Upload,
  X
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  rich_description: string;
  image_url: string;
  category_id: string;
  product_type: string;
  original_price: number;
  discounted_price: number;
  currency: string;
  is_featured: boolean;
  is_free: boolean;
  is_newly_launched: boolean;
  is_popular: boolean;
  is_trending: boolean;
  is_editors_choice: boolean;
  affiliate_link: string;
  payment_link: string;
  cta_button_text: string;
  views_count: number;
  saves_count: number;
  created_at: string;
  custom_permalink: string;
  file_attachments: any[];
  video_courses: any[];
  custom_code: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [richDescription, setRichDescription] = useState('');
  const [fileAttachments, setFileAttachments] = useState<any[]>([]);
  const [videoCourses, setVideoCourses] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products', searchQuery, filterCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (filterCategory !== 'all') {
        query = query.eq('category_id', filterCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      if (error) throw error;
      return data as Category[];
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product.",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = formData.get('image_url') as string;
    
    // Handle image upload if file is selected
    if (imageFile) {
      try {
        imageUrl = await handleImageUpload(imageFile);
      } catch (error: any) {
        toast({
          title: "Image upload failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    const customPermalink = formData.get('custom_permalink') as string;
    const slug = customPermalink || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-');
    
    const productData = {
      name: formData.get('name') as string,
      slug: slug,
      description: formData.get('description') as string,
      rich_description: richDescription,
      image_url: imageUrl,
      category_id: formData.get('category_id') as string || null,
      product_type: formData.get('product_type') as string || 'software',
      original_price: formData.get('original_price') ? Number(formData.get('original_price')) : null,
      discounted_price: formData.get('discounted_price') ? Number(formData.get('discounted_price')) : null,
      currency: formData.get('currency') as string || 'USD',
      is_featured: formData.get('is_featured') === 'on',
      is_free: formData.get('is_free') === 'on',
      is_newly_launched: formData.get('is_newly_launched') === 'on',
      is_popular: formData.get('is_popular') === 'on',
      is_trending: formData.get('is_trending') === 'on',
      is_editors_choice: formData.get('is_editors_choice') === 'on',
      affiliate_link: formData.get('affiliate_link') as string,
      payment_link: formData.get('payment_link') as string,
      cta_button_text: formData.get('cta_button_text') as string || 'Learn More',
      custom_permalink: customPermalink,
      file_attachments: fileAttachments,
      video_courses: videoCourses,
      custom_code: formData.get('custom_code') as string,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ ...productData, id: editingProduct.id });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const addFileAttachment = () => {
    setFileAttachments([...fileAttachments, { type: 'url', name: '', url: '' }]);
  };

  const removeFileAttachment = (index: number) => {
    setFileAttachments(fileAttachments.filter((_, i) => i !== index));
  };

  const updateFileAttachment = (index: number, field: string, value: string | File) => {
    const updated = [...fileAttachments];
    updated[index] = { ...updated[index], [field]: value };
    setFileAttachments(updated);
  };

  const addVideoCourse = () => {
    setVideoCourses([...videoCourses, { title: '', url: '', platform: 'youtube' }]);
  };

  const removeVideoCourse = (index: number) => {
    setVideoCourses(videoCourses.filter((_, i) => i !== index));
  };

  const updateVideoCourse = (index: number, field: string, value: string) => {
    const updated = [...videoCourses];
    updated[index] = { ...updated[index], [field]: value };
    setVideoCourses(updated);
  };

  const resetForm = () => {
    setRichDescription('');
    setFileAttachments([]);
    setVideoCourses([]);
    setImageFile(null);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setRichDescription(product.rich_description || '');
    setFileAttachments(product.file_attachments || []);
    setVideoCourses(product.video_courses || []);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'No Category';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your tools and software listings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update the product information below.' : 'Create a new product listing for your platform.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name || ''}
                    required
                    placeholder="e.g., Leonardo AI"
                  />
                </div>
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select name="category_id" defaultValue={editingProduct?.category_id || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select name="product_type" defaultValue={editingProduct?.product_type || 'software'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai_tools">AI Tools</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="free_tools">Free Tools</SelectItem>
                      <SelectItem value="digital_products">Digital Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  required
                  placeholder="Brief description of the product"
                />
              </div>

              <div>
                <Label>Detailed Description (Rich Text Editor)</Label>
                <RichTextEditor
                  value={richDescription}
                  onChange={setRichDescription}
                  placeholder="Add detailed SEO-optimized description with formatting, links, and styling..."
                />
              </div>

              <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      defaultValue={editingProduct?.image_url || ''}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_upload">Or Upload Image</Label>
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="custom_permalink">Custom Permalink</Label>
                <Input
                  id="custom_permalink"
                  name="custom_permalink"
                  defaultValue={editingProduct?.custom_permalink || ''}
                  placeholder="leonardo-ai (will create domain.com/leonardo-ai)"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="original_price">Original Price (Optional)</Label>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.original_price || ''}
                    placeholder="99.99"
                  />
                </div>
                <div>
                  <Label htmlFor="discounted_price">Discounted Price (Optional)</Label>
                  <Input
                    id="discounted_price"
                    name="discounted_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.discounted_price || ''}
                    placeholder="49.99"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select name="currency" defaultValue={editingProduct?.currency || 'USD'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="affiliate_link">Affiliate Link (Optional)</Label>
                  <Input
                    id="affiliate_link"
                    name="affiliate_link"
                    type="url"
                    defaultValue={editingProduct?.affiliate_link || ''}
                    placeholder="https://affiliate-link.com"
                  />
                </div>
                <div>
                  <Label htmlFor="payment_link">Payment Page Link (Optional)</Label>
                  <Input
                    id="payment_link"
                    name="payment_link"
                    type="url"
                    defaultValue={editingProduct?.payment_link || ''}
                    placeholder="https://payment-page.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cta_button_text">CTA Button Name</Label>
                <Input
                  id="cta_button_text"
                  name="cta_button_text"
                  defaultValue={editingProduct?.cta_button_text || 'Learn More'}
                  placeholder="Learn More, Buy Now, Try Now, etc."
                />
              </div>

              {/* File Attachments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Upload Files / Document Links (Optional)</Label>
                  <Button type="button" onClick={addFileAttachment} size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add File/Link
                  </Button>
                </div>
                {fileAttachments.map((attachment, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="File/Document name"
                        value={attachment.name}
                        onChange={(e) => updateFileAttachment(index, 'name', e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={() => removeFileAttachment(index)} 
                        size="sm" 
                        variant="destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Upload File</Label>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Handle file upload to Supabase storage
                              const fileName = `${Date.now()}-${file.name}`;
                              updateFileAttachment(index, 'fileName', fileName);
                              updateFileAttachment(index, 'fileObject', file);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Or Enter URL</Label>
                        <Input
                          placeholder="https://example.com/file.pdf"
                          value={attachment.url}
                          onChange={(e) => updateFileAttachment(index, 'url', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Courses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Video Courses (Optional)</Label>
                  <Button type="button" onClick={addVideoCourse} size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video Course
                  </Button>
                </div>
                {videoCourses.map((video, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-end">
                    <Input
                      placeholder="Video title"
                      value={video.title}
                      onChange={(e) => updateVideoCourse(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Video URL"
                      value={video.url}
                      onChange={(e) => updateVideoCourse(index, 'url', e.target.value)}
                    />
                    <Select 
                      value={video.platform}
                      onValueChange={(value) => updateVideoCourse(index, 'platform', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="udemy">Udemy</SelectItem>
                        <SelectItem value="vimeo">Vimeo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={() => removeVideoCourse(index)} 
                      size="sm" 
                      variant="destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="custom_code">Custom Code (Optional)</Label>
                <Textarea
                  id="custom_code"
                  name="custom_code"
                  defaultValue={editingProduct?.custom_code || ''}
                  placeholder="Facebook Pixel code, Google Analytics, or other tracking codes"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      name="is_featured"
                      defaultChecked={editingProduct?.is_featured || false}
                    />
                    <Label htmlFor="is_featured">Featured Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_free"
                      name="is_free"
                      defaultChecked={editingProduct?.is_free || false}
                    />
                    <Label htmlFor="is_free">Free Product</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_newly_launched"
                      name="is_newly_launched"
                      defaultChecked={editingProduct?.is_newly_launched || false}
                    />
                    <Label htmlFor="is_newly_launched">Newly Launched</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_popular"
                      name="is_popular"
                      defaultChecked={editingProduct?.is_popular || false}
                    />
                    <Label htmlFor="is_popular">Popular</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_trending"
                      name="is_trending"
                      defaultChecked={editingProduct?.is_trending || false}
                    />
                    <Label htmlFor="is_trending">Trending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_editors_choice"
                      name="is_editors_choice"
                      defaultChecked={editingProduct?.is_editors_choice || false}
                    />
                    <Label htmlFor="is_editors_choice">Editor's Choice</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
          <CardDescription>
            Manage all your product listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(product.category_id)}</TableCell>
                    <TableCell>
                      {product.is_free ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : product.discounted_price ? (
                        <div>
                          <span className="font-medium">${product.discounted_price}</span>
                          {product.original_price && (
                            <span className="text-sm text-muted-foreground line-through ml-1">
                              ${product.original_price}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {product.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        {product.is_free && (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{product.views_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {(product.affiliate_link || product.payment_link) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(product.affiliate_link || product.payment_link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
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
  );
};

export default ProductsManagement;