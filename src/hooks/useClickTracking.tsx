import { supabase } from '@/integrations/supabase/client';

export interface ClickTrackingData {
  product_id: string;
  click_type: 'affiliate' | 'payment' | 'view';
  user_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export const useClickTracking = () => {
  const trackClick = async (data: ClickTrackingData) => {
    try {
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get additional tracking data
      const trackingData = {
        ...data,
        user_id: user?.id || data.user_id,
        ip_address: null, // Will be handled by Supabase Edge Function if needed
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      };

      const { error } = await supabase
        .from('click_tracking')
        .insert(trackingData);

      if (error) {
        console.error('Error tracking click:', error);
      }
    } catch (error) {
      console.error('Error in click tracking:', error);
    }
  };

  return { trackClick };
};