import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage, generateYouTubeThumbnail, validateFileType, validateFileSize } from '@/lib/fileStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { RevenueTypeIndicator } from '@/components/RevenueTypeIndicator';
import { ProductAnalyticsWidget } from '@/components/admin/ProductAnalyticsWidget';
import { BulkActionsToolbar } from '@/components/admin/BulkActionsToolbar';
import { ProductStatusIndicator } from '@/components/admin/ProductStatusIndicator';
import { useRevenueAnalytics } from '@/hooks/useRevenueAnalytics';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  X,
  Bookmark,
  Copy,
  BarChart3
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
  // Revenue tracking
  revenue_type?: 'affiliate' | 'payment' | 'free' | 'mixed';
  collect_email?: boolean;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  canonical_url?: string;
  og_image_url?: string;
  alt_text?: string;
  schema_markup?: any;
  focus_keyword?: string;
  related_keywords?: string[];
  content_score?: number;
  seo_title?: string;
  social_title?: string;
  social_description?: string;
  twitter_image_url?: string;
  structured_data_type?: string;
  faq_data?: any[];
  howto_data?: any[];
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
  const [filterProductType, setFilterProductType] = useState('all');
  const [richDescription, setRichDescription] = useState('');
  const [fileAttachments, setFileAttachments] = useState<any[]>([]);
  const [videoCourses, setVideoCourses] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch revenue analytics for sorting by clicks
  const { data: revenueAnalytics } = useRevenueAnalytics();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products', searchQuery, filterCategory, filterProductType],
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

      if (filterProductType !== 'all') {
        if (filterProductType === 'free_tools') {
          // For free tools, show products marked as free regardless of product_type
          query = query.eq('is_free', true);
        } else {
          query = query.eq('product_type', filterProductType);
        }
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
      setDeletingProductId(null);
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      setDeletingProductId(null);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  });

  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProductMutation.mutate(deletingProductId);
    }
  };

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

    // Enhanced validation with auto-fixing for file attachments
    const validatedAttachments = [];
    
    for (const att of fileAttachments) {
      const hasFile = att.fileObject instanceof File;
      const hasValidUrl = att.url && att.url.trim() !== '' && att.url.startsWith('http');
      
      // Auto-fix name if missing but file/URL exists
      let attachmentName = att.name && att.name.trim() !== '' ? att.name : '';
      
      if (!attachmentName && hasFile) {
        attachmentName = att.fileObject.name;
      } else if (!attachmentName && hasValidUrl) {
        const urlParts = att.url.split('/');
        attachmentName = urlParts[urlParts.length - 1] || 'Downloaded File';
      }
      
      // Check if attachment has valid data
      if (!attachmentName || (!hasFile && !hasValidUrl)) {
        toast({
          title: "Invalid attachments",
          description: "Please provide a name and either upload a file or enter a valid URL for all attachments, or remove incomplete ones.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the attachment with fixed name
      validatedAttachments.push({
        ...att,
        name: attachmentName,
        title: attachmentName // Keep both for compatibility
      });
    }
    
    // Update fileAttachments with validated data
    setFileAttachments(validatedAttachments);

    // Process file attachments - upload files to storage
    const processedFileAttachments = [];
    
    console.log('Processing file attachments:', fileAttachments);
    
    for (const attachment of validatedAttachments) {
      console.log('Processing attachment:', attachment);
      
      if (attachment.fileObject && attachment.fileObject instanceof File) {
        // Validate file
        const sizeValidation = validateFileSize(attachment.fileObject);
        if (!sizeValidation.isValid) {
          toast({
            title: "File too large",
            description: sizeValidation.message,
            variant: "destructive",
          });
          return;
        }

        console.log('Uploading file:', attachment.fileObject.name);
        
        // Upload file to storage
        const fileUrl = await uploadFileToStorage(attachment.fileObject, 'attachments');
        
        console.log('Upload result:', fileUrl);
        
        if (fileUrl && fileUrl.trim() !== '') {
          const processedAttachment = {
            id: attachment.id || Math.random().toString(36).substring(2),
            title: attachment.name || attachment.fileObject.name, // Keep both for compatibility
            name: attachment.name || attachment.fileObject.name,
            url: fileUrl,
            size: attachment.fileObject.size,
            type: attachment.fileObject.type,
            description: attachment.description || ''
          };
          
          console.log('Added processed attachment:', processedAttachment);
          processedFileAttachments.push(processedAttachment);
        } else {
          // Upload failed - show error and stop form submission
          console.error('Upload failed for:', attachment.fileObject.name);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${attachment.name || attachment.fileObject.name}. Please try again.`,
            variant: "destructive",
          });
          return;
        }
      } else if (attachment.url && attachment.url.trim() !== '' && attachment.url.startsWith('http') && attachment.name && attachment.name.trim() !== '') {
        // Keep URL-based attachments
        const processedAttachment = {
          id: attachment.id || Math.random().toString(36).substring(2),
          title: attachment.name, // Keep both for compatibility
          name: attachment.name,
          url: attachment.url,
          size: 0,
          type: 'url',
          description: attachment.description || ''
        };
        
        console.log('Added URL-based attachment:', processedAttachment);
        processedFileAttachments.push(processedAttachment);
      } else {
        console.warn('Skipping invalid attachment:', attachment);
      }
    }
    
    console.log('Final processed file attachments:', processedFileAttachments);

    // Process video courses - add thumbnails for YouTube videos
    const processedVideoCourses = videoCourses.map(video => ({
      id: video.id || Math.random().toString(36).substring(2),
      title: video.title,
      url: video.url,
      platform: video.platform || 'youtube',
      thumbnail: video.url ? generateYouTubeThumbnail(video.url) : undefined
    }));

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
      revenue_type: formData.get('revenue_type') as 'affiliate' | 'payment' | 'free' | 'mixed' || 'free',
      collect_email: formData.get('collect_email') === 'true',
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
      file_attachments: processedFileAttachments,
      video_courses: processedVideoCourses,
      custom_code: formData.get('custom_code') as string,
      // SEO fields
      meta_title: formData.get('meta_title') as string,
      meta_description: formData.get('meta_description') as string,
      keywords: (formData.get('keywords') as string)?.split(',').map(k => k.trim()).filter(k => k) || [],
      canonical_url: formData.get('canonical_url') as string,
      og_image_url: formData.get('og_image_url') as string,
      // Advanced SEO fields
      focus_keyword: formData.get('focus_keyword') as string,
      related_keywords: (formData.get('related_keywords') as string)?.split(',').map(k => k.trim()).filter(k => k) || [],
      seo_title: formData.get('seo_title') as string,
      social_title: formData.get('social_title') as string,
      social_description: formData.get('social_description') as string,
      twitter_image_url: formData.get('twitter_image_url') as string,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ ...productData, id: editingProduct.id });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const addFileAttachment = () => {
    setFileAttachments([...fileAttachments, { 
      id: Math.random().toString(36).substring(2),
      type: 'url', 
      name: '', 
      title: '', // Ensure both name and title are initialized
      url: '',
      description: '',
      fileObject: null 
    }]);
  };

  const removeFileAttachment = (index: number) => {
    setFileAttachments(fileAttachments.filter((_, i) => i !== index));
  };

  const updateFileAttachment = async (index: number, field: string, value: string | File | null) => {
    const updated = [...fileAttachments];
    
    if (field === 'fileObject' && value instanceof File) {
      // Immediately update the name when a file is selected
      updated[index] = { 
        ...updated[index], 
        [field]: value,
        name: value.name,
        title: value.name
      };
      setFileAttachments(updated);
      
      // Upload the file
      try {
        const uploadedUrl = await uploadFileToStorage(value, 'attachments');
        if (uploadedUrl) {
          updated[index] = {
            ...updated[index],
            url: uploadedUrl,
            size: value.size,
            type: value.type
          };
          setFileAttachments(updated);
          
          toast({
            title: 'File uploaded successfully',
            description: `${value.name} has been uploaded`,
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: 'Failed to upload file. Please try again.',
          variant: "destructive",
        });
        return;
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
      
      // Keep title and name in sync for compatibility
      if (field === 'name') {
        updated[index] = { ...updated[index], title: value as string };
      } else if (field === 'title') {
        updated[index] = { ...updated[index], name: value as string };
      }
      
      setFileAttachments(updated);
    }
  };

  const addVideoCourse = () => {
    setVideoCourses([...videoCourses, { 
      id: Math.random().toString(36).substring(2),
      title: '', 
      url: '', 
      platform: 'youtube' 
    }]);
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
    
    // Load attachments with proper structure - ensure both title and name are available
    const attachments = (product.file_attachments || []).map(att => ({
      ...att,
      id: att.id || Math.random().toString(36).substring(2),
      name: att.name || att.title || '', // Use name or fallback to title
      title: att.title || att.name || '', // Ensure title is also available
      description: att.description || '',
      fileObject: null // No file object for existing attachments
    })).filter(att => 
      att && 
      (att.name && att.name.trim() !== '') && 
      (att.url && att.url.trim() !== '')
    );
    
    console.log('Loading attachments for edit:', attachments);
    setFileAttachments(attachments);
    
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

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      for (const productId of selectedProducts) {
        await supabase.from('products').delete().eq('id', productId);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
      toast({
        title: "Products deleted",
        description: `${selectedProducts.length} products have been deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete products.",
        variant: "destructive",
      });
    }
  };

  const handleBulkEdit = async (field: string, value: any) => {
    try {
      for (const productId of selectedProducts) {
        await supabase
          .from('products')
          .update({ [field === 'category' ? 'category_id' : field]: value })
          .eq('id', productId);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
      toast({
        title: "Products updated",
        description: `${selectedProducts.length} products have been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update products.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = (product: Product) => {
    setEditingProduct({
      ...product,
      id: '',
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
    });
    setRichDescription(product.rich_description || '');
    setFileAttachments(product.file_attachments || []);
    setVideoCourses(product.video_courses || []);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  // Sort products with analytics integration
  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      
      // Handle analytics-based sorting
      if (sortBy === 'affiliate_clicks') {
        const aClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === a.id)?.affiliate_clicks || 0;
        const bClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === b.id)?.affiliate_clicks || 0;
        return order * (bClicks - aClicks);
      }
      
      if (sortBy === 'payment_clicks') {
        const aClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === a.id)?.payment_clicks || 0;
        const bClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === b.id)?.payment_clicks || 0;
        return order * (bClicks - aClicks);
      }
      
      if (sortBy === 'total_clicks') {
        const aClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === a.id)?.total_clicks || 0;
        const bClicks = revenueAnalytics?.clicksByProduct?.find(p => p.product_id === b.id)?.total_clicks || 0;
        return order * (bClicks - aClicks);
      }
      
      // Handle standard sorting
      if (sortBy === 'name') {
        return order * a.name.localeCompare(b.name);
      } else if (sortBy === 'views_count') {
        return order * ((a.views_count || 0) - (b.views_count || 0));
      } else if (sortBy === 'saves_count') {
        return order * ((a.saves_count || 0) - (b.saves_count || 0));
      }
      return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
  }, [products, sortBy, sortOrder, revenueAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your tools and software listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </Button>
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
                    <SelectItem value="paid_tools">Paid Tools</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">📍 Where will this appear?</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>AI Tools:</strong> Appears in "AI Tools" tab</p>
                    <p><strong>Software:</strong> Appears in "Software" tab</p>
                    <p><strong>Free Tools:</strong> Appears in "Free Tools" tab</p>
                    <p><strong>Paid Tools:</strong> Appears in "Paid Tools" tab</p>
                    <p className="text-amber-600 dark:text-amber-500 pt-1"><strong>💡 Smart Display:</strong> Products can appear in multiple tabs based on "Is Free" toggle and pricing below</p>
                  </div>
                </div>
              </div>

              {/* Revenue Type Selection */}
              <div>
                <Label htmlFor="revenue_type">Revenue Type *</Label>
                <Select name="revenue_type" defaultValue={editingProduct?.revenue_type || 'free'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affiliate">Affiliate Commission</SelectItem>
                    <SelectItem value="payment">Direct Payment Page</SelectItem>
                    <SelectItem value="free">Free Product</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground mt-1">
                  This determines which link gets priority and helps track revenue sources
                </div>
              </div>

              {/* Email Collection Setting */}
              <div>
                <Label htmlFor="collect_email">Email Collection</Label>
                <Select name="collect_email" defaultValue={editingProduct?.collect_email ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email collection option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No Need Email</SelectItem>
                    <SelectItem value="true">Collect Email</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground mt-1">
                  If enabled, users must provide name and email before accessing the product
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
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mov,.avi"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size with type-specific limits
                                const sizeValidation = validateFileSize(file);
                                if (!sizeValidation.isValid) {
                                  toast({
                                    title: "File too large",
                                    description: sizeValidation.message,
                                    variant: "destructive",
                                  });
                                  e.target.value = ''; // Clear the input
                                  return;
                                }
                                
                                // Update file and auto-populate name
                                updateFileAttachment(index, 'fileObject', file);
                              }
                            }}
                        />
                        {attachment.fileObject && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Selected: {attachment.fileObject.name} ({(attachment.fileObject.size / 1024 / 1024).toFixed(1)} MB)
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm">Or Enter URL</Label>
                        <Input
                          placeholder="https://example.com/file.pdf"
                          value={attachment.url}
                          onChange={(e) => {
                            const url = e.target.value;
                            updateFileAttachment(index, 'url', url);
                            // Clear file when URL is entered
                            if (url && url.trim() !== '') {
                              updateFileAttachment(index, 'fileObject', null);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Description (Optional)</Label>
                      <Input
                        placeholder="Brief description of the file"
                        value={attachment.description || ''}
                        onChange={(e) => updateFileAttachment(index, 'description', e.target.value)}
                      />
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

              {/* SEO Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SEO Optimization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meta_title">Meta Title (Recommended: 50-60 characters)</Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      defaultValue={editingProduct?.meta_title || ''}
                      placeholder={`${editingProduct?.name || 'Product Name'} - Tools Launchify`}
                      maxLength={60}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alt_text">Image Alt Text</Label>
                    <Input
                      id="alt_text"
                      name="alt_text"
                      defaultValue={editingProduct?.alt_text || ''}
                      placeholder="Screenshot of the product interface"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description (Recommended: 150-160 characters)</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    defaultValue={editingProduct?.meta_description || ''}
                    placeholder="Brief description of your product for search engines"
                    maxLength={160}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="keywords">SEO Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      defaultValue={editingProduct?.keywords?.join(', ') || ''}
                      placeholder="productivity, automation, workflow"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="canonical_url">Canonical URL (Optional)</Label>
                    <Input
                      id="canonical_url"
                      name="canonical_url"
                      defaultValue={editingProduct?.canonical_url || ''}
                      placeholder="https://example.com/product-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_image_url">Social Media Image URL (Optional)</Label>
                  <Input
                    id="og_image_url"
                    name="og_image_url"
                    defaultValue={editingProduct?.og_image_url || ''}
                    placeholder="URL for custom social media sharing image"
                  />
                </div>

                {/* Advanced SEO Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="focus_keyword">Focus Keyword</Label>
                    <Input
                      id="focus_keyword"
                      name="focus_keyword"
                      defaultValue={editingProduct?.focus_keyword || ''}
                      placeholder="Main keyword to target"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="seo_title">SEO Title (If different from Meta Title)</Label>
                    <Input
                      id="seo_title"
                      name="seo_title"
                      defaultValue={editingProduct?.seo_title || ''}
                      placeholder="Alternative title for search engines"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="related_keywords">Related Keywords (comma-separated)</Label>
                  <Input
                    id="related_keywords"
                    name="related_keywords"
                    defaultValue={editingProduct?.related_keywords?.join(', ') || ''}
                    placeholder="LSI keywords, synonyms, related terms"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="social_title">Social Media Title</Label>
                    <Input
                      id="social_title"
                      name="social_title"
                      defaultValue={editingProduct?.social_title || ''}
                      placeholder="Title for social media sharing"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter_image_url">Twitter Image URL</Label>
                    <Input
                      id="twitter_image_url"
                      name="twitter_image_url"
                      defaultValue={editingProduct?.twitter_image_url || ''}
                      placeholder="Custom image for Twitter cards"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="social_description">Social Media Description</Label>
                  <Textarea
                    id="social_description"
                    name="social_description"
                    defaultValue={editingProduct?.social_description || ''}
                    placeholder="Description for social media sharing"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Flags</h3>
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
                  Save Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Analytics Widget */}
      {showAnalytics && <ProductAnalyticsWidget />}

      {/* Filters */}
      <div className="flex items-center space-x-4 flex-wrap gap-2">
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
        <Select value={filterProductType} onValueChange={setFilterProductType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ai_tools">AI Tools</SelectItem>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="free_tools">Free Tools</SelectItem>
            <SelectItem value="paid_tools">Paid Tools</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">📅 Recently Added</SelectItem>
            <SelectItem value="name">🔤 Name</SelectItem>
            <SelectItem value="views_count">👁️ Most Views</SelectItem>
            <SelectItem value="saves_count">🔖 Most Saves</SelectItem>
            <SelectItem value="affiliate_clicks">💰 Most Affiliate Clicks</SelectItem>
            <SelectItem value="payment_clicks">💳 Most Payment Clicks</SelectItem>
            <SelectItem value="total_clicks">📊 Total Clicks</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Revenue</TableHead>
                   <TableHead>Price</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-center">Views</TableHead>
                   <TableHead className="text-center">Saves</TableHead>
                   <TableHead className="text-center">Affiliate</TableHead>
                   <TableHead className="text-center">Payment</TableHead>
                   <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </TableCell>
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
                      <Badge variant="outline">
                        {product.product_type === 'ai_tools' ? 'AI Tools' :
                         product.product_type === 'software' ? 'Software' :
                         product.product_type === 'free_tools' ? 'Free Tools' :
                         product.product_type === 'paid_tools' ? 'Paid Tools' :
                         product.product_type || 'Software'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RevenueTypeIndicator 
                        revenueType={(product.revenue_type as 'affiliate' | 'payment' | 'free') || 'free'} 
                        size="sm" 
                      />
                    </TableCell>
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
                      <ProductStatusIndicator
                        hasAffiliateLink={!!product.affiliate_link}
                        hasPaymentLink={!!product.payment_link}
                        revenueType={product.revenue_type}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{product.views_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                        <span>{product.saves_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`/${product.slug || product.id}`, '_blank')}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                          title="Edit"
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

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedProducts.length}
        onBulkDelete={handleBulkDelete}
        onBulkEdit={handleBulkEdit}
        onClearSelection={() => setSelectedProducts([])}
        categories={categories}
      />
    </div>
  );
};

export default ProductsManagement;