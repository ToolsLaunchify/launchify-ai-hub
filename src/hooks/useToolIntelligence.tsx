import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DiscoveredTool {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  source_platform: string;
  external_url: string | null;
  source_id: string | null;
  tags: string[] | null;
  launch_date: string | null;
  pricing_info: any;
  has_affiliate_program: boolean;
  affiliate_info: any;
  status: string;
  priority_score: number;
  created_at: string;
  updated_at: string;
}

export interface ToolInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  action_required: string | null;
  related_tool_data: any;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export const useDiscoveredTools = () => {
  return useQuery({
    queryKey: ['discovered-tools'],
    queryFn: async (): Promise<DiscoveredTool[]> => {
      const { data, error } = await supabase
        .from('discovered_tools')
        .select('*')
        .order('priority_score', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useToolInsights = () => {
  return useQuery({
    queryKey: ['tool-insights'],
    queryFn: async (): Promise<ToolInsight[]> => {
      const { data, error } = await supabase
        .from('tool_insights')
        .select('*')
        .eq('is_dismissed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateToolStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('discovered_tools')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovered-tools'] });
    },
  });
};

export const useMarkInsightAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tool_insights')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-insights'] });
    },
  });
};

export const useDismissInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tool_insights')
        .update({ is_dismissed: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-insights'] });
    },
  });
};

export const useAddDiscoveredTool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tool: any) => {
      const { error } = await supabase
        .from('discovered_tools')
        .insert(tool);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovered-tools'] });
    },
  });
};