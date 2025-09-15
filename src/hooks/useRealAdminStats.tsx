import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  recentActivity: {
    id: string;
    action: string;
    detail: string;
    time: string;
    type: 'product' | 'user' | 'click' | 'conversion';
  }[];
}

export const useRealAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Get product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get user count (from user_roles table)
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Get click count from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: clickCount } = await supabase
        .from('click_tracking')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get conversion count from last 30 days
      const { count: conversionCount } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate conversion rate
      const conversionRate = clickCount && clickCount > 0 ? (conversionCount || 0) / clickCount * 100 : 0;

      // Get recent products for activity
      const { data: recentProducts } = await supabase
        .from('products')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Get recent users for activity
      const { data: recentUsers } = await supabase
        .from('user_roles')
        .select('created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(2);

      // Get recent clicks for activity
      const { data: recentClicks } = await supabase
        .from('click_tracking')
        .select('created_at, click_type, products(name)')
        .order('created_at', { ascending: false })
        .limit(2);

      // Build recent activity array
      const recentActivity: AdminStats['recentActivity'] = [];

      // Add recent products
      recentProducts?.forEach((product) => {
        recentActivity.push({
          id: `product-${product.name}`,
          action: 'New product added',
          detail: product.name,
          time: getTimeAgo(new Date(product.created_at)),
          type: 'product'
        });
      });

      // Add recent users
      recentUsers?.forEach((user, index) => {
        recentActivity.push({
          id: `user-${user.user_id}-${index}`,
          action: 'User registered',
          detail: 'New user joined',
          time: getTimeAgo(new Date(user.created_at)),
          type: 'user'
        });
      });

      // Add recent clicks
      recentClicks?.forEach((click, index) => {
        recentActivity.push({
          id: `click-${index}`,
          action: `${click.click_type} click`,
          detail: (click.products as any)?.name || 'Unknown product',
          time: getTimeAgo(new Date(click.created_at)),
          type: 'click'
        });
      });

      // Sort by time and limit to 5 most recent
      recentActivity.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      return {
        totalProducts: productCount || 0,
        totalUsers: userCount || 0,
        totalClicks: clickCount || 0,
        totalConversions: conversionCount || 0,
        conversionRate,
        recentActivity: recentActivity.slice(0, 5)
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}

function parseTimeAgo(timeAgo: string): number {
  const [amount, unit] = timeAgo.split(' ');
  const value = parseInt(amount);
  
  switch (unit) {
    case 'minutes': return value;
    case 'hours': return value * 60;
    case 'days': return value * 60 * 24;
    default: return 0;
  }
}