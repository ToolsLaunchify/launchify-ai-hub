import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async (): Promise<Page[]> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .order('title');

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAllPages = () => {
  return useQuery({
    queryKey: ['all-pages'],
    queryFn: async (): Promise<Page[]> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async (): Promise<Page | null> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pages')
        .insert(page)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['all-pages'] });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Page> & { id: string }) => {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['all-pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', data.slug] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['all-pages'] });
    },
  });
};