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
      // Get categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('sort_order', { ascending: true })
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};