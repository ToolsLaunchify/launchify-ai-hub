import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatInTimeZone } from 'date-fns-tz';

export interface Lead {
  id: string;
  product_id: string | null;
  name: string;
  email: string;
  phone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    slug: string;
  };
  conversions?: Array<{
    id: string;
    conversion_type: string;
    revenue_amount: number | null;
    currency: string | null;
    created_at: string;
  }>;
  formatted_created_at?: string;
  source_display?: string;
  has_purchased?: boolean;
  total_revenue?: number;
}

export interface LeadsStats {
  totalLeads: number;
  leadsThisMonth: number;
  leadsToday: number;
  topProducts: Array<{
    product_name: string;
    lead_count: number;
  }>;
  conversionRate: number;
}

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          products (
            name,
            slug
          ),
          conversions (
            id,
            conversion_type,
            revenue_amount,
            currency,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      // Process leads with enhanced data
      const processedLeads = data?.map(lead => {
        // Format date to IST
        const istDate = formatInTimeZone(new Date(lead.created_at), 'Asia/Kolkata', 'MMM dd, yyyy hh:mm:ss a');
        
        // Enhanced source display
        let sourceDisplay = 'Direct';
        if (lead.utm_source) {
          sourceDisplay = lead.utm_source.charAt(0).toUpperCase() + lead.utm_source.slice(1);
          if (lead.utm_medium && lead.utm_medium !== 'none') {
            sourceDisplay += ` (${lead.utm_medium})`;
          }
          if (lead.utm_campaign) {
            sourceDisplay += ` - ${lead.utm_campaign}`;
          }
        } else if (lead.referrer) {
          if (lead.referrer.includes('youtube.com')) sourceDisplay = 'YouTube (referral)';
          else if (lead.referrer.includes('facebook.com')) sourceDisplay = 'Facebook (referral)';
          else if (lead.referrer.includes('instagram.com')) sourceDisplay = 'Instagram (referral)';
          else if (lead.referrer.includes('linkedin.com')) sourceDisplay = 'LinkedIn (referral)';
          else if (lead.referrer.includes('google.com')) sourceDisplay = 'Google (search)';
          else if (lead.referrer.includes('twitter.com')) sourceDisplay = 'Twitter (referral)';
          else sourceDisplay = 'Website (referral)';
        }

        // Calculate purchase info
        const conversions = lead.conversions || [];
        const hasPurchased = conversions.length > 0;
        const totalRevenue = conversions.reduce((sum, conv) => sum + (conv.revenue_amount || 0), 0);

        return {
          ...lead,
          formatted_created_at: istDate,
          source_display: sourceDisplay,
          has_purchased: hasPurchased,
          total_revenue: totalRevenue
        };
      }) || [];

      return processedLeads as Lead[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useLeadsStats = () => {
  return useQuery({
    queryKey: ['leads-stats'],
    queryFn: async () => {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get all leads
      const { data: allLeads, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          products (
            name
          )
        `);

      if (leadsError) {
        console.error('Error fetching leads stats:', leadsError);
        throw leadsError;
      }

      // Get conversions count for conversion rate
      const { data: conversions, error: conversionsError } = await supabase
        .from('conversions')
        .select('lead_id')
        .not('lead_id', 'is', null);

      if (conversionsError) {
        console.error('Error fetching conversions:', conversionsError);
        throw conversionsError;
      }

      const totalLeads = allLeads?.length || 0;
      const leadsThisMonth = allLeads?.filter(lead => 
        new Date(lead.created_at) >= startOfMonth
      ).length || 0;
      
      const leadsToday = allLeads?.filter(lead => 
        new Date(lead.created_at) >= startOfToday
      ).length || 0;

      // Calculate top products by lead count
      const productLeadCounts = allLeads?.reduce((acc, lead) => {
        const productName = lead.products?.name || 'Unknown Product';
        acc[productName] = (acc[productName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topProducts = Object.entries(productLeadCounts)
        .map(([product_name, lead_count]) => ({ product_name, lead_count }))
        .sort((a, b) => b.lead_count - a.lead_count)
        .slice(0, 5);

      // Calculate conversion rate (conversions with lead_id / total leads)
      const leadsWithConversions = conversions?.length || 0;
      const conversionRate = totalLeads > 0 ? (leadsWithConversions / totalLeads) * 100 : 0;

      const stats: LeadsStats = {
        totalLeads,
        leadsThisMonth,
        leadsToday,
        topProducts,
        conversionRate,
      };

      return stats;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};