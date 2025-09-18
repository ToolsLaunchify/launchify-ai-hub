import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface SubCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent_category_id?: string
  sort_order: number
  icon?: string
  created_at: string
  updated_at: string
}

export const useSubCategories = () => {
  return useQuery({
    queryKey: ['sub-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data as SubCategory[]
    }
  })
}

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subCategory: Omit<SubCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sub_categories')
        .insert(subCategory)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
    }
  })
}

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SubCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('sub_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
    }
  })
}

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sub_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] })
    }
  })
}