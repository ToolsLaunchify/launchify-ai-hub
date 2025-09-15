import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RevenueAnalytics {
  totalClicks: number;
  affiliateClicks: number;
  paymentClicks: number;
  clicksByProduct: Array<{
    product_id: string;
    product_name: string;
    affiliate_clicks: number;
    payment_clicks: number;
    total_clicks: number;
  }>;
  recentClicks: Array<{
    id: string;
    product_id: string;
    click_type: string;
    created_at: string;
    product?: {
      name: string;
    };
  }>;
}

export const useRevenueAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['revenue-analytics', dateRange],
    queryFn: async (): Promise<RevenueAnalytics> => {
      // Build date filter
      let query = supabase.from('click_tracking').select(`
        *,
        products!inner(name)
      `);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data: clickData, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate analytics
      const totalClicks = clickData.length;
      const affiliateClicks = clickData.filter(c => c.click_type === 'affiliate').length;
      const paymentClicks = clickData.filter(c => c.click_type === 'payment').length;

      // Group by product
      const productClicksMap = new Map();
      
      clickData.forEach(click => {
        const productId = click.product_id;
        if (!productClicksMap.has(productId)) {
          productClicksMap.set(productId, {
            product_id: productId,
            product_name: click.products?.name || 'Unknown',
            affiliate_clicks: 0,
            payment_clicks: 0,
            total_clicks: 0
          });
        }
        
        const productStats = productClicksMap.get(productId);
        productStats.total_clicks++;
        
        if (click.click_type === 'affiliate') {
          productStats.affiliate_clicks++;
        } else if (click.click_type === 'payment') {
          productStats.payment_clicks++;
        }
      });

      const clicksByProduct = Array.from(productClicksMap.values())
        .sort((a, b) => b.total_clicks - a.total_clicks);

      // Get recent clicks (last 50)
      const recentClicks = clickData.slice(0, 50).map(click => ({
        id: click.id,
        product_id: click.product_id,
        click_type: click.click_type,
        created_at: click.created_at,
        product: click.products
      }));

      return {
        totalClicks,
        affiliateClicks,
        paymentClicks,
        clicksByProduct,
        recentClicks
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};