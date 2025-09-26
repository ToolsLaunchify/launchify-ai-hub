-- Create resume_templates table
CREATE TABLE public.resume_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_image_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_resumes table
CREATE TABLE public.user_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  template_id UUID REFERENCES public.resume_templates(id),
  sections JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume_collaborations table
CREATE TABLE public.resume_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID NOT NULL REFERENCES public.user_resumes(id) ON DELETE CASCADE,
  collaborator_id UUID NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ats_scores table
CREATE TABLE public.ats_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID NOT NULL REFERENCES public.user_resumes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resume_templates
CREATE POLICY "Resume templates are viewable by everyone" 
ON public.resume_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage resume templates" 
ON public.resume_templates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_resumes
CREATE POLICY "Users can view their own resumes" 
ON public.user_resumes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes" 
ON public.user_resumes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
ON public.user_resumes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
ON public.user_resumes 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all resumes" 
ON public.user_resumes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for resume_collaborations
CREATE POLICY "Users can view collaborations for their resumes" 
ON public.resume_collaborations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_resumes 
    WHERE id = resume_collaborations.resume_id 
    AND user_id = auth.uid()
  ) OR auth.uid() = collaborator_id
);

CREATE POLICY "Resume owners can manage collaborations" 
ON public.resume_collaborations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_resumes 
    WHERE id = resume_collaborations.resume_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for ats_scores
CREATE POLICY "Users can view ATS scores for their resumes" 
ON public.ats_scores 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_resumes 
    WHERE id = ats_scores.resume_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "System can create ATS scores" 
ON public.ats_scores 
FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_resume_templates_updated_at
  BEFORE UPDATE ON public.resume_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_resumes_updated_at
  BEFORE UPDATE ON public.user_resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default resume templates
INSERT INTO public.resume_templates (name, description, template_data, is_premium) VALUES
('Modern Professional', 'A clean, modern template perfect for most industries', '{"style": "modern", "colors": {"primary": "#2563eb", "secondary": "#64748b"}}', false),
('Classic Traditional', 'A traditional template for conservative industries', '{"style": "classic", "colors": {"primary": "#1f2937", "secondary": "#6b7280"}}', false),
('Creative Designer', 'A bold template for creative professionals', '{"style": "creative", "colors": {"primary": "#7c3aed", "secondary": "#a855f7"}}', true),
('Tech Minimalist', 'A minimal template for tech professionals', '{"style": "minimal", "colors": {"primary": "#059669", "secondary": "#10b981"}}', false),
('Executive Premium', 'An elegant template for senior positions', '{"style": "executive", "colors": {"primary": "#dc2626", "secondary": "#ef4444"}}', true);