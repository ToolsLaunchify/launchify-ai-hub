import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export interface AdvancedAnalyticsData {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  clicksBySource: { source: string; clicks: number; conversions: number; revenue: number }[];
  clicksByProduct: { 
    product_id: string; 
    product_name: string; 
    clicks: number; 
    conversions: number; 
    revenue: number;
    revenue_type: string;
  }[];
  recentActivity: {
    id: string;
    click_type: string;
    product_name: string;
    utm_source: string;
    created_at: string;
  }[];
  conversionRate: number;
  chartData: {
    date: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

export const useAdvancedAnalytics = (dateRange?: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ['advanced-analytics', dateRange],
    queryFn: async (): Promise<AdvancedAnalyticsData> => {
      // Set default date range to last 30 days if not provided
      const endDate = dateRange?.end || new Date();
      const startDate = dateRange?.start || subDays(endDate, 30);

      // Get click tracking data
      const { data: clickData, error: clickError } = await supabase
        .from('click_tracking')
        .select(`
          *,
          products!inner(name, revenue_type)
        `)
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString());

      if (clickError) throw clickError;

      // Get conversion data
      const { data: conversionData, error: conversionError } = await supabase
        .from('conversions')
        .select(`
          *,
          products!inner(name, revenue_type)
        `)
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString());

      if (conversionError) throw conversionError;

      // Calculate total metrics
      const totalClicks = clickData?.length || 0;
      const totalConversions = conversionData?.length || 0;
      const totalRevenue = conversionData?.reduce((sum, conv) => sum + (conv.revenue_amount || 0), 0) || 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      // Group clicks by source
      const sourceMap = new Map();
      clickData?.forEach(click => {
        const source = click.utm_source || 'direct';
        if (!sourceMap.has(source)) {
          sourceMap.set(source, { source, clicks: 0, conversions: 0, revenue: 0 });
        }
        sourceMap.get(source).clicks++;
      });

      // Add conversion data to source map
      conversionData?.forEach(conv => {
        const source = conv.utm_source || 'direct';
        if (sourceMap.has(source)) {
          sourceMap.get(source).conversions++;
          sourceMap.get(source).revenue += conv.revenue_amount || 0;
        }
      });

      const clicksBySource = Array.from(sourceMap.values()).sort((a, b) => b.clicks - a.clicks);

      // Group clicks by product
      const productMap = new Map();
      clickData?.forEach(click => {
        const productId = click.product_id;
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            product_id: productId,
            product_name: click.products?.name || 'Unknown',
            clicks: 0,
            conversions: 0,
            revenue: 0,
            revenue_type: click.products?.revenue_type || 'free'
          });
        }
        productMap.get(productId).clicks++;
      });

      // Add conversion data to product map
      conversionData?.forEach(conv => {
        const productId = conv.product_id;
        if (productMap.has(productId)) {
          productMap.get(productId).conversions++;
          productMap.get(productId).revenue += conv.revenue_amount || 0;
        }
      });

      const clicksByProduct = Array.from(productMap.values()).sort((a, b) => b.clicks - a.clicks);

      // Recent activity (last 20 clicks)
      const recentActivity = clickData
        ?.slice(-20)
        .reverse()
        .map(click => ({
          id: click.id,
          click_type: click.click_type,
          product_name: click.products?.name || 'Unknown',
          utm_source: click.utm_source || 'direct',
          created_at: click.created_at
        })) || [];

      // Chart data - group by day
      const chartMap = new Map();
      const days = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        days.push(dateStr);
        chartMap.set(dateStr, { date: dateStr, clicks: 0, conversions: 0, revenue: 0 });
      }

      clickData?.forEach(click => {
        const dateStr = new Date(click.created_at).toISOString().split('T')[0];
        if (chartMap.has(dateStr)) {
          chartMap.get(dateStr).clicks++;
        }
      });

      conversionData?.forEach(conv => {
        const dateStr = new Date(conv.created_at).toISOString().split('T')[0];
        if (chartMap.has(dateStr)) {
          chartMap.get(dateStr).conversions++;
          chartMap.get(dateStr).revenue += conv.revenue_amount || 0;
        }
      });

      const chartData = days.map(day => chartMap.get(day));

      return {
        totalClicks,
        totalConversions,
        totalRevenue,
        clicksBySource,
        clicksByProduct,
        recentActivity,
        conversionRate,
        chartData
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};