import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

export interface UpdateBlogPostData extends CreateBlogPostData {
  id: string;
}

// Get all blog posts (admin)
export const useAllBlogPosts = () => {
  return useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    }
  });
};

// Get published blog posts (public)
export const usePublishedBlogPosts = () => {
  return useQuery({
    queryKey: ['published-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    }
  });
};

// Get blog post by slug
export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug
  });
};

// Create blog post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBlogPostData) => {
      const { data: result, error } = await supabase
        .from('blog_posts')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error creating blog post',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Update blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateBlogPostData) => {
      const { data: result, error } = await supabase
        .from('blog_posts')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating blog post',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

// Delete blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting blog post',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};