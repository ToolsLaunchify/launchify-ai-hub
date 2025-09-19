import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rich_description: string | null;
  image_url: string | null;
  category_id: string | null;
  product_type: string | null;
  is_free: boolean | null;
  is_featured: boolean | null;
  is_newly_launched: boolean | null;
  is_popular: boolean | null;
  is_trending: boolean | null;
  is_editors_choice: boolean | null;
  original_price: number | null;
  discounted_price: number | null;
  currency: string | null;
  affiliate_link: string | null;
  payment_link: string | null;
  cta_button_text: string | null;
  views_count: number | null;
  saves_count: number | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface UseProductsOptions {
  isFree?: boolean;
  isNewlyLaunched?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  productType?: string;
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.isFree !== undefined) {
        query = query.eq('is_free', options.isFree);
      }

      if (options.isNewlyLaunched !== undefined) {
        query = query.eq('is_newly_launched', options.isNewlyLaunched);
      }

      if (options.isFeatured !== undefined) {
        query = query.eq('is_featured', options.isFeatured);
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.productType) {
        if (options.productType === 'paid_tools') {
          // For paid tools, filter products with any pricing from any product type
          query = query.or('original_price.gt.0,discounted_price.gt.0,purchase_price.gt.0');
        } else if (options.productType === 'software') {
          // Software includes both 'software' and 'digital_products' types
          query = query.in('product_type', ['software', 'digital_products']);
        } else if (options.productType === 'free_tools') {
          // For free_tools, return empty query as we handle these statically in ModernHomepage
          return [];
        } else {
          // For other types (ai_tools), filter by exact product type
          query = query.eq('product_type', options.productType);
        }
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useFreeToolsByCategory = () => {
  return useQuery({
    queryKey: ['free-tools-by-category'],
    queryFn: async () => {
      // Get categories that have free tools
      const { data: categoriesWithFreeTools, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          products!inner(id)
        `)
        .eq('products.is_free', true)
        .is('parent_id', null);

      if (categoriesError) throw categoriesError;

      // Get all free tools grouped by category
      const { data: freeTools, error: toolsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('is_free', true)
        .order('created_at', { ascending: false });

      if (toolsError) throw toolsError;

      return {
        categories: categoriesWithFreeTools,
        products: freeTools || []
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};