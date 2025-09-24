import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentConfig {
  id: string;
  product_id: string;
  is_payment_enabled: boolean;
  payment_type: string;
  price: number | null;
  currency: string;
  payment_page_url: string | null;
  razorpay_plan_id: string | null;
  stripe_price_id: string | null;
  collect_email: boolean;
  collect_phone: boolean;
  collect_company: boolean;
  custom_fields: any;
  terms_url: string | null;
  refund_policy_url: string | null;
  trial_period_days: number;
  setup_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    slug: string;
  };
}

export interface ToolPurchase {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  custom_data: any;
  payment_type: string | null;
  amount_paid: number | null;
  currency: string;
  payment_status: string;
  payment_gateway: string | null;
  transaction_id: string | null;
  payment_date: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  trial_end_date: string | null;
  next_billing_date: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    slug: string;
  };
}

export const usePaymentConfigs = () => {
  return useQuery({
    queryKey: ['payment-configs'],
    queryFn: async (): Promise<PaymentConfig[]> => {
      const { data, error } = await supabase
        .from('tool_payment_configs')
        .select(`
          *,
          products:product_id (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePaymentConfigByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['payment-config', productId],
    queryFn: async (): Promise<PaymentConfig | null> => {
      const { data, error } = await supabase
        .from('tool_payment_configs')
        .select(`
          *,
          products:product_id (
            name,
            slug
          )
        `)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useToolPurchases = () => {
  return useQuery({
    queryKey: ['tool-purchases'],
    queryFn: async (): Promise<ToolPurchase[]> => {
      const { data, error } = await supabase
        .from('tool_purchases')
        .select(`
          *,
          products:product_id (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreatePaymentConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: any) => {
      const { error } = await supabase
        .from('tool_payment_configs')
        .upsert(config, { onConflict: 'product_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-configs'] });
    },
  });
};

export const useUpdatePaymentConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase
        .from('tool_payment_configs')
        .update(config)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-configs'] });
    },
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchase: any) => {
      const { error } = await supabase
        .from('tool_purchases')
        .insert(purchase);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-purchases'] });
    },
  });
};