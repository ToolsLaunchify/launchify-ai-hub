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
      // Get all products with their types, pricing info, and revenue type
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('product_type, original_price, discounted_price, purchase_price, revenue_type');

      if (productError) throw productError;

      // Initialize stats
      const stats = {
        ai_tools: 0,
        software: 0,
        free_tools: 0,
        paid_tools: 0,
        total: 0
      } as ProductStats;

      // Count database products
      (productData || []).forEach(product => {
        const type = product.product_type || 'software';
        
        // Count free_tools from database
        if (type === 'free_tools') {
          stats.free_tools += 1;
          stats.total += 1;
          return;
        }
        
        // Count by product type
        if (type === 'ai_tools') {
          stats.ai_tools += 1;
        } else if (type === 'software') {
          stats.software += 1;
        } else if (type === 'digital_products') {
          // Digital products count as software in the UI
          stats.software += 1;
        }
        
        // Count paid tools based on revenue_type or pricing
        const isPaid = product.revenue_type === 'payment' || 
                      product.revenue_type === 'affiliate' ||
                      (product.original_price && product.original_price > 0) ||
                      (product.discounted_price && product.discounted_price > 0) ||
                      (product.purchase_price && product.purchase_price > 0);
        
        if (isPaid) {
          stats.paid_tools += 1;
        }
        
        stats.total += 1;
      });

      return stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};