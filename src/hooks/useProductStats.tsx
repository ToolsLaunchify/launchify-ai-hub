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
      // Get all products with their types and pricing info
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('product_type, original_price, discounted_price, purchase_price');

      if (productError) throw productError;

      // Initialize stats
      const stats = {
        ai_tools: 0,
        software: 0,
        free_tools: 2, // Only the 2 static tools (BMI and Percentage calculators)
        paid_tools: 0,
        total: 2 // Start with 2 for the static free tools
      } as ProductStats;

      // Count database products
      (productData || []).forEach(product => {
        const type = product.product_type || 'software';
        
        // Skip free_tools from database as we only show static tools for this type
        if (type === 'free_tools') return;
        
        // Count by product type
        if (type === 'ai_tools') {
          stats.ai_tools += 1;
        } else if (type === 'software') {
          stats.software += 1;
        } else if (type === 'digital_products') {
          // Digital products count as software in the UI
          stats.software += 1;
        }
        
        // Count paid tools (products with any price > 0)
        const hasPricing = (product.original_price && product.original_price > 0) ||
                          (product.discounted_price && product.discounted_price > 0) ||
                          (product.purchase_price && product.purchase_price > 0);
        
        if (hasPricing) {
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