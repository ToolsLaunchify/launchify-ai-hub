import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ResumeSection {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';
  title: string;
  content: any;
  order: number;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_id: string | null;
  sections: ResumeSection[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  templates?: {
    name: string;
    template_data: any;
  };
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string | null;
  template_data: any;
  preview_image_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export const useResumes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['resumes', user?.id],
    queryFn: async (): Promise<Resume[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_resumes' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as any) || [];
    },
    enabled: !!user,
  });
};

export const useResume = (resumeId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async (): Promise<Resume | null> => {
      if (!user || !resumeId) return null;

      const { data, error } = await supabase
        .from('user_resumes' as any)
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as any;
    },
    enabled: !!user && !!resumeId,
  });
};

export const useResumeTemplates = () => {
  return useQuery({
    queryKey: ['resume-templates'],
    queryFn: async (): Promise<ResumeTemplate[]> => {
      const { data, error } = await supabase
        .from('resume_templates' as any)
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data as any) || [];
    },
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (resumeData: {
      title: string;
      template_id?: string;
      sections?: ResumeSection[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_resumes' as any)
        .insert({
          user_id: user.id,
          title: resumeData.title,
          template_id: resumeData.template_id || null,
          sections: resumeData.sections || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      resumeId, 
      updates 
    }: { 
      resumeId: string; 
      updates: Partial<Resume> 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_resumes' as any)
        .update(updates)
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.resumeId] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_resumes' as any)
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};