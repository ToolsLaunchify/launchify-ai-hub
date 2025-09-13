-- Fix RLS policy issue by adding policies for user_roles table

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage all user roles
CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));