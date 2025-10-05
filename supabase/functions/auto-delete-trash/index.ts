import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting auto-delete trash cleanup...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate the date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString();

    console.log(`Cutoff date for auto-deletion: ${cutoffDate}`);

    // Find products that have been in trash for 90+ days
    const { data: expiredProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, deleted_at')
      .eq('is_deleted', true)
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoffDate);

    if (fetchError) {
      console.error('Error fetching expired products:', fetchError);
      throw fetchError;
    }

    if (!expiredProducts || expiredProducts.length === 0) {
      console.log('No expired products found in trash');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expired products to delete',
          deletedCount: 0,
          deletedProducts: [],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${expiredProducts.length} expired products to delete`);

    // Permanently delete the expired products
    const productIds = expiredProducts.map(p => p.id);
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', productIds);

    if (deleteError) {
      console.error('Error deleting expired products:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${expiredProducts.length} expired products`);
    
    // Log the deleted products
    const deletedProductSummary = expiredProducts.map(p => ({
      id: p.id,
      name: p.name,
      deletedAt: p.deleted_at,
      daysInTrash: Math.floor((Date.now() - new Date(p.deleted_at).getTime()) / (1000 * 60 * 60 * 24))
    }));

    console.log('Deleted products:', JSON.stringify(deletedProductSummary, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted ${expiredProducts.length} expired products`,
        deletedCount: expiredProducts.length,
        deletedProducts: deletedProductSummary,
        cutoffDate,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-delete-trash function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
