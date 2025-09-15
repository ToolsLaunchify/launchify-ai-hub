import { supabase } from '@/integrations/supabase/client';

export interface ClickTrackingData {
  product_id: string;
  click_type: 'affiliate' | 'payment' | 'view';
  user_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface ConversionData {
  product_id: string;
  click_tracking_id?: string;
  conversion_type: 'sale' | 'signup' | 'download';
  revenue_amount?: number;
  currency?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export const useClickTracking = () => {
  // Extract UTM parameters from current URL
  const getUtmParams = () => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
    };
  };

  const trackClick = async (data: ClickTrackingData) => {
    try {
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get UTM parameters and additional tracking data
      const utmParams = getUtmParams();
      const trackingData = {
        ...data,
        user_id: user?.id || data.user_id,
        ip_address: null, // Will be handled by Supabase Edge Function if needed
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        // Override with current UTM params if not provided
        utm_source: data.utm_source || utmParams.utm_source,
        utm_medium: data.utm_medium || utmParams.utm_medium,
        utm_campaign: data.utm_campaign || utmParams.utm_campaign,
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

  const trackConversion = async (data: ConversionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const utmParams = getUtmParams();
      
      const conversionData = {
        ...data,
        user_id: user?.id,
        utm_source: data.utm_source || utmParams.utm_source,
        utm_medium: data.utm_medium || utmParams.utm_medium,
        utm_campaign: data.utm_campaign || utmParams.utm_campaign,
      };

      const { error } = await supabase
        .from('conversions')
        .insert(conversionData);

      if (error) {
        console.error('Error tracking conversion:', error);
      }
    } catch (error) {
      console.error('Error in conversion tracking:', error);
    }
  };

  return { trackClick, trackConversion };
};