import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  parent_id: string | null;
  product_count?: number;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategoriesByProductType = (productType: string) => {
  return useQuery({
    queryKey: ['categories-by-product-type', productType],
    queryFn: async (): Promise<Category[]> => {
      // Special handling for free_tools - return empty since we only show static tools
      if (productType === 'free_tools') {
        return [];
      }

      // Handle paid_tools by finding categories with products that have prices
      if (productType === 'paid_tools') {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select(`
            id,
            name,
            slug,
            description,
            icon,
            sort_order,
            parent_id
          `)
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (categoriesError) throw categoriesError;

        const categoriesWithCounts = await Promise.all(
          (categoriesData || []).map(async (category) => {
            const { count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .or('original_price.gt.0,discounted_price.gt.0,purchase_price.gt.0');

            return {
              ...category,
              product_count: count || 0
            };
          })
        );

        return categoriesWithCounts.filter(cat => cat.product_count > 0);
      }

      // For ai_tools and software, get categories that have products of the specified type
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          icon,
          sort_order,
          parent_id
        `)
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Get product counts for each category with this product type
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('product_type', productType);

          return {
            ...category,
            product_count: count || 0
          };
        })
      );

      // Filter out categories with no products and return
      return categoriesWithCounts.filter(cat => cat.product_count > 0);
    },
    enabled: !!productType,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};