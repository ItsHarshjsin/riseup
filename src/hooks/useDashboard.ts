
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

export const useDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('productivity');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuth();

  // Format the selected date to ISO string for database queries
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedCategory, formattedDate],
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

  // Fetch category mastery
  const { data: categoryMastery = [], isLoading: categoryMasteryLoading } = useQuery({
    queryKey: ['categoryMastery'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('category_mastery')
        .select('*')
        .eq('user_id', user.id);

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
            completed: false,
            created_at: new Date().toISOString(),
            task_date: formattedDate
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
      
      // Check if this task is for today
      const today = format(new Date(), 'yyyy-MM-dd');
      if (task.task_date !== today && !task.completed) {
        throw new Error('Tasks can only be completed on their assigned day');
      }

      const completed = !task.completed;
      const completed_at = completed ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('daily_tasks')
        .update({ 
          completed,
          completed_at
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['categoryMastery'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
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
    selectedDate,
    setSelectedDate,
    toggleTask,
    addTask,
    isLoading: tasksLoading,
    categoryMastery,
    categoryMasteryLoading
  };
};
