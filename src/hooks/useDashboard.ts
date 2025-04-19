
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';

export const useDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('productivity');

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch category mastery
  const { data: categoryMastery = [], isLoading: categoryLoading } = useQuery({
    queryKey: ['category_mastery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('category_mastery')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  // Toggle task completion
  const { mutate: toggleTask } = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const { error } = await supabase
        .from('daily_tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['category_mastery'] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    tasks,
    categoryMastery,
    selectedCategory,
    setSelectedCategory,
    toggleTask,
    isLoading: tasksLoading || categoryLoading,
  };
};
