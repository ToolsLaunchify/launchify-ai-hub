-- Create tables for Tool Intelligence System

-- Table to track external tools discovered from various sources
CREATE TABLE public.discovered_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  source_platform TEXT NOT NULL, -- 'producthunt', 'github', 'manual', etc.
  external_url TEXT,
  source_id TEXT, -- ID from the source platform
  tags TEXT[],
  launch_date DATE,
  pricing_info JSONB DEFAULT '{}'::jsonb,
  has_affiliate_program BOOLEAN DEFAULT false,
  affiliate_info JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'added', 'ignored'
  priority_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track tool intelligence insights and recommendations
CREATE TABLE public.tool_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL, -- 'missing_popular', 'new_competitor', 'affiliate_opportunity', etc.
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  action_required TEXT,
  related_tool_data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for enhanced payment configurations per tool
CREATE TABLE public.tool_payment_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  is_payment_enabled BOOLEAN DEFAULT false,
  payment_type TEXT DEFAULT 'one_time', -- 'one_time', 'monthly', 'yearly', 'custom'
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  payment_page_url TEXT,
  razorpay_plan_id TEXT,
  stripe_price_id TEXT,
  collect_email BOOLEAN DEFAULT true,
  collect_phone BOOLEAN DEFAULT false,
  collect_company BOOLEAN DEFAULT false,
  custom_fields JSONB DEFAULT '[]'::jsonb,
  terms_url TEXT,
  refund_policy_url TEXT,
  trial_period_days INTEGER DEFAULT 0,
  setup_fee NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track customer purchases and leads
CREATE TABLE public.tool_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  custom_data JSONB DEFAULT '{}'::jsonb,
  payment_type TEXT,
  amount_paid NUMERIC,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_gateway TEXT, -- 'razorpay', 'stripe', 'paypal', etc.
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  subscription_id TEXT,
  subscription_status TEXT,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discovered_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_payment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discovered_tools
CREATE POLICY "Admins can manage discovered tools" 
ON public.discovered_tools 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tool_insights
CREATE POLICY "Admins can manage tool insights" 
ON public.tool_insights 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tool_payment_configs
CREATE POLICY "Admins can manage payment configs" 
ON public.tool_payment_configs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Payment configs are viewable for payment processing" 
ON public.tool_payment_configs 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for tool_purchases
CREATE POLICY "Admins can view all purchases" 
ON public.tool_purchases 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create purchases" 
ON public.tool_purchases 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_discovered_tools_status ON public.discovered_tools(status);
CREATE INDEX idx_discovered_tools_category ON public.discovered_tools(category);
CREATE INDEX idx_tool_insights_priority ON public.tool_insights(priority, is_read);
CREATE INDEX idx_tool_payment_configs_product ON public.tool_payment_configs(product_id);
CREATE INDEX idx_tool_purchases_product ON public.tool_purchases(product_id);
CREATE INDEX idx_tool_purchases_email ON public.tool_purchases(customer_email);

-- Create triggers for updated_at
CREATE TRIGGER update_discovered_tools_updated_at
BEFORE UPDATE ON public.discovered_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tool_insights_updated_at
BEFORE UPDATE ON public.tool_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tool_payment_configs_updated_at
BEFORE UPDATE ON public.tool_payment_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tool_purchases_updated_at
BEFORE UPDATE ON public.tool_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();