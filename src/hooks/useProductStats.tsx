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

      // Count products by type, but handle free_tools specially
      const dbStats = (productData || []).reduce((acc, product) => {
        const type = product.product_type || 'software';
        if (type !== 'free_tools') {
          acc[type as keyof Omit<ProductStats, 'total' | 'free_tools'>] = (acc[type as keyof Omit<ProductStats, 'total' | 'free_tools'>] || 0) + 1;
          acc.total += 1;
        }
        return acc;
      }, {
        ai_tools: 0,
        software: 0,
        free_tools: 0,
        paid_tools: 0,
        total: 0
      } as ProductStats);

      // For free_tools, count only the 2 static tools (BMI Calculator and Percentage Calculator)
      // as these are the only ones shown in ModernHomepage for free_tools type
      dbStats.free_tools = 2;
      dbStats.total += 2;

      // Handle paid_tools by counting products with prices
      const { data: paidProducts, error: paidError } = await supabase
        .from('products')
        .select('original_price, discounted_price, purchase_price')
        .or('original_price.gt.0,discounted_price.gt.0,purchase_price.gt.0');

      if (!paidError && paidProducts) {
        dbStats.paid_tools = paidProducts.length;
      }

      return dbStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};