-- Create attachments storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- Create RLS policies for attachments bucket
CREATE POLICY "Public can view attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'attachments');

CREATE POLICY "Admins can upload attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'attachments' AND has_role(auth.uid(), 'admin'::app_role));