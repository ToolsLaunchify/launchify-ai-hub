import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      // Convert array to object for easier access
      const settings: SiteSettings = {};
      data?.forEach(item => {
        settings[item.setting_key] = item.setting_value;
      });

      return settings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value 
        }, { 
          onConflict: 'setting_key' 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
};