import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductStats {
  ai_tools: number;
  software: number;
  free_tools: number;
  paid_tools: number;
  total: number;
}

export const useProductStats = () => {
  return useQuery({
    queryKey: ['product-stats'],
    queryFn: async (): Promise<ProductStats> => {
      // Get all products to count by type accurately
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('product_type');

      if (productError) throw productError;

      // Count products by type
      const stats = (productData || []).reduce((acc, product) => {
        const type = product.product_type || 'software';
        acc[type as keyof Omit<ProductStats, 'total'>] = (acc[type as keyof Omit<ProductStats, 'total'>] || 0) + 1;
        acc.total += 1;
        return acc;
      }, {
        ai_tools: 0,
        software: 0,
        free_tools: 0,
        paid_tools: 0,
        total: 0
      } as ProductStats);

      return stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};