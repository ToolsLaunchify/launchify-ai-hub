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
      // Optimized single query to get categories with product counts
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          icon,
          sort_order,
          products!category_id(count)
        `)
        .is('parent_id', null)
        .order('sort_order', { ascending: true })
        .order('name');

      if (categoriesError) throw categoriesError;

      return (categories || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        product_count: category.products?.[0]?.count || 0,
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for better caching
    refetchOnWindowFocus: false,
  });
};