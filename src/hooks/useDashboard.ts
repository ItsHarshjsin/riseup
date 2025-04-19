
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('productivity');
  const { user } = useAuth();

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedCategory],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('category', selectedCategory)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Add new task
  const { mutate: addTask } = useMutation({
    mutationFn: async (newTask: { title: string; description: string; points: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('daily_tasks')
        .insert([
          {
            user_id: user.id,
            title: newTask.title,
            description: newTask.description,
            category: selectedCategory,
            points: newTask.points || 10,
            completed: false
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task added',
        description: 'Your new task has been added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding task',
        description: error.message,
        variant: 'destructive',
      });
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
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: 'Task updated',
        description: 'Task status has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    tasks,
    selectedCategory,
    setSelectedCategory,
    toggleTask,
    addTask,
    isLoading: tasksLoading,
  };
};
