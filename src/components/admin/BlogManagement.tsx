import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Save, BookOpen, Eye, EyeOff, Star } from 'lucide-react';
import { useAllBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, type BlogPost } from '@/hooks/useBlog';
import { useToast } from '@/hooks/use-toast';

const BlogManagement: React.FC = () => {
  const { data: blogPosts = [], isLoading } = useAllBlogPosts();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    tags: [] as string[],
    is_published: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    author_name: '',
    og_image_url: '',
    twitter_image_url: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      tags: [],
      is_published: false,
      is_featured: false,
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      author_name: '',
      og_image_url: '',
      twitter_image_url: '',
    });
    setEditingPost(null);
  };

  const openDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image_url: post.featured_image_url || '',
        tags: post.tags || [],
        is_published: post.is_published,
        is_featured: post.is_featured,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        canonical_url: post.canonical_url || '',
        author_name: post.author_name || '',
        og_image_url: post.og_image_url || '',
        twitter_image_url: post.twitter_image_url || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null
      };

      if (editingPost) {
        await updateBlogPost.mutateAsync({ id: editingPost.id, ...submitData });
        toast({ title: 'Blog post updated successfully!' });
      } else {
        await createBlogPost.mutateAsync(submitData);
        toast({ title: 'Blog post created successfully!' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Failed to save blog post',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await deleteBlogPost.mutateAsync(deletePostId);
      toast({ title: 'Blog post deleted successfully!' });
      setDeletePostId(null);
    } catch (error) {
      toast({
        title: 'Failed to delete blog post',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Blog Management</h2>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog content, publish posts, and track engagement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    /blog/{post.slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.is_featured && (
                      <Badge variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletePostId(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {blogPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No blog posts found. Create your first blog post to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the blog post details below.' : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Blog Post Title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="blog-post-url"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of the blog post..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload
                  value={formData.featured_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                  bucket="blog-images"
                  folder="featured"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    placeholder="Author Name"
                    value={formData.author_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="tech, programming, tutorial"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">SEO & Social Media Settings</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    placeholder="SEO title for search engines (60 characters)"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.meta_title.length}/60 characters
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="Brief description for search engines (150-160 characters)"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.meta_description.length}/160 characters
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input
                    id="canonical-url"
                    placeholder="https://yoursite.com/blog/post-url"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Helps prevent duplicate content issues
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og-image">Open Graph Image URL</Label>
                  <Input
                    id="og-image"
                    placeholder="https://yoursite.com/og-image.jpg"
                    value={formData.og_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_image_url: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Image for social media sharing (Facebook, LinkedIn)
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter-image">Twitter Image URL</Label>
                  <Input
                    id="twitter-image"
                    placeholder="https://yoursite.com/twitter-image.jpg"
                    value={formData.twitter_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_image_url: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Image optimized for Twitter sharing
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="published">Publish post</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="featured">Featured post</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createBlogPost.isPending || updateBlogPost.isPending || !formData.title.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {createBlogPost.isPending || updateBlogPost.isPending ? 'Saving...' : (editingPost ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBlogPost.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagement;