import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  product_count: number;
}

export const useCategoryStats = () => {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: async (): Promise<CategoryWithCount[]> => {
      // Get categories with their product counts
      const { data: rawData, error: queryError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          icon,
          sort_order
        `)
        .is('parent_id', null)
        .order('sort_order', { ascending: true })
        .order('name');

      if (queryError) throw queryError;

      // Get product counts separately for each category
      const categoriesWithCounts = await Promise.all(
        (rawData || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          if (countError) throw countError;

          return {
            ...category,
            product_count: count || 0,
          };
        })
      );

      return categoriesWithCounts;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for better caching
    refetchOnWindowFocus: false,
  });
};