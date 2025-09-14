import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export const useSavedProducts = () => {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedProducts();
    } else {
      setSavedProductIds(new Set());
    }
  }, [user]);

  const fetchSavedProducts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_saved_products')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const productIds = new Set(data.map(item => item.product_id));
      setSavedProductIds(productIds);
    } catch (error) {
      console.error('Error fetching saved products:', error);
    }
  };

  const toggleSaveProduct = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save products.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const isSaved = savedProductIds.has(productId);

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('user_saved_products')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);

        if (error) throw error;

        setSavedProductIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        toast({
          title: "Product removed",
          description: "Product removed from your saved list.",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('user_saved_products')
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        setSavedProductIds(prev => new Set(prev).add(productId));

        toast({
          title: "Product saved",
          description: "Product added to your saved list.",
        });
      }
    } catch (error) {
      console.error('Error toggling save product:', error);
      toast({
        title: "Error",
        description: "Failed to update saved product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isProductSaved = (productId: string) => savedProductIds.has(productId);

  return {
    isProductSaved,
    toggleSaveProduct,
    loading,
    savedProductIds,
  };
};