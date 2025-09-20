-- Create table for product ratings
CREATE TABLE public.product_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for product ratings
CREATE POLICY "Product ratings are viewable by everyone" 
ON public.product_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ratings" 
ON public.product_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.product_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.product_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ratings" 
ON public.product_ratings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_product_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_ratings_updated_at
  BEFORE UPDATE ON public.product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_ratings_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_product_ratings_product_id ON public.product_ratings(product_id);
CREATE INDEX idx_product_ratings_user_id ON public.product_ratings(user_id);
CREATE INDEX idx_product_ratings_rating ON public.product_ratings(rating);