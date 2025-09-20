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
      // Special handling for free_tools - return virtual Calculator category
      if (productType === 'free_tools') {
        return [{
          id: 'calculator',
          name: 'Calculator',
          slug: 'calculator',
          description: 'Essential calculation tools',
          icon: '🧮',
          sort_order: 1,
          parent_id: null,
          product_count: 2
        }];
      }

      // Get all top-level categories
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

      // For each category, count products based on the product type
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          let count = 0;

          if (productType === 'paid_tools') {
            // For paid tools, count products with any pricing from any product type
            const { count: paidCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .or('original_price.gt.0,discounted_price.gt.0,purchase_price.gt.0');
            count = paidCount || 0;
          } else if (productType === 'software') {
            // Software includes both 'software' and 'digital_products' types
            const { count: softwareCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .in('product_type', ['software', 'digital_products']);
            count = softwareCount || 0;
          } else if (productType === 'ai_tools') {
            // AI tools only includes 'ai_tools' type
            const { count: aiCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('product_type', 'ai_tools');
            count = aiCount || 0;
          }

          return {
            ...category,
            product_count: count
          };
        })
      );

      // Only return categories that have products for this type
      return categoriesWithCounts.filter(cat => cat.product_count > 0);
    },
    enabled: !!productType,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};