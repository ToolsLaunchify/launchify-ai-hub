-- Phase 1: Database Schema Enhancement

-- Add "paid" to revenue_type enum
ALTER TYPE revenue_type ADD VALUE IF NOT EXISTS 'paid';

-- Create sub_categories table for organizing tool types
CREATE TABLE IF NOT EXISTS public.sub_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sub_categories
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for sub_categories
CREATE POLICY "Sub-categories are viewable by everyone" 
ON public.sub_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage sub-categories" 
ON public.sub_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add embedded tool fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_embedded_tool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tool_url TEXT,
ADD COLUMN IF NOT EXISTS tool_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS adsense_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC,
ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT,
ADD COLUMN IF NOT EXISTS tool_type TEXT DEFAULT 'external';

-- Create trigger for sub_categories updated_at
CREATE TRIGGER update_sub_categories_updated_at
BEFORE UPDATE ON public.sub_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create orders table for paid tool purchases
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sub-categories for Free Tools
INSERT INTO public.sub_categories (name, slug, description, sort_order) VALUES
('Converter', 'converter', 'Convert between different formats and units', 1),
('Calculator', 'calculator', 'Calculate various financial and mathematical values', 2),
('Tracker', 'tracker', 'Track habits, expenses, and personal metrics', 3),
('Planner', 'planner', 'Plan budgets, schedules, and goals', 4),
('Generator', 'generator', 'Generate codes, passwords, and content', 5),
('Analyzer', 'analyzer', 'Analyze data, text, and performance metrics', 6)