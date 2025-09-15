import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  source: string;
}

export const useNewsletterSubscribe = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'footer_signup' })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This email is already subscribed to our newsletter.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Successfully subscribed!',
        description: 'Thanks for subscribing to our newsletter. You\'ll receive updates about the latest tools and launches.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Subscription failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async (): Promise<NewsletterSubscriber[]> => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUnsubscribeNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'unsubscribed', 
          unsubscribed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
    },
  });
};