
import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Flame, CalendarCheck } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CompletedTaskDay {
  date: Date;
  count: number;
}

const TaskCalendar: React.FC = () => {
  const { user } = useAuth();
  const { tasks, addTask, toggleTask } = useDashboard();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Fetch completed task data from Supabase
  const { data: completedTaskDays = [], isLoading } = useQuery({
    queryKey: ['completedTasks', user?.id],
    queryFn: async (): Promise<CompletedTaskDay[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('completed', true)
        .not('completed_at', 'is', null);
        
      if (error) throw error;
      
      // Group tasks by completion date
      const tasksByDate = (data || []).reduce((acc: Record<string, number>, task: any) => {
        if (task.completed_at) {
          const dateKey = format(new Date(task.completed_at), 'yyyy-MM-dd');
          acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
      }, {});
      
      return Object.entries(tasksByDate).map(([dateStr, count]) => ({
        date: new Date(dateStr),
        count
      }));
    },
    enabled: !!user?.id
  });
  
  // Get streak information
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return { streak: 0 };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    initialData: { streak: 0 }
  });
  
  // Create dates array for the calendar
  const completedDates = completedTaskDays.map(day => day.date);
  
  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Check if tasks can be added/completed for the selected date
  const isSelectedDateToday = selectedDate ? isSameDay(selectedDate, new Date()) : false;
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Task Calendar</CardTitle>
        <div className="flex items-center gap-2 bg-mono-lighter px-3 py-1 rounded-full">
          <Flame className="h-5 w-5" />
          <span className="font-semibold">{userProfile?.streak || 0} days</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="border-none"
          modifiers={{
            completed: completedDates
          }}
          modifiersClassNames={{
            completed: "bg-mono-black text-mono-white hover:bg-mono-dark"
          }}
          footer={
            <div className="mt-3 pt-3 border-t border-mono-light text-center">
              {isSelectedDateToday ? (
                <p className="text-sm text-mono-black">You can add tasks for today</p>
              ) : (
                <p className="text-sm text-mono-gray">Tasks can only be completed on the current day</p>
              )}
            </div>
          }
        />
      </CardContent>
    </Card>
  );
};

export default TaskCalendar;
