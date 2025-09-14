-- Create table for user saved products
CREATE TABLE public.user_saved_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_saved_products ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved products" 
ON public.user_saved_products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save products" 
ON public.user_saved_products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved products" 
ON public.user_saved_products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can manage all saved products
CREATE POLICY "Admins can manage all saved products" 
ON public.user_saved_products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));