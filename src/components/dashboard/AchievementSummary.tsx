
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AchievementSummary: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch user profile and achievements
  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return {
        badges: 0,
        points: 0,
        level: 1,
        completionRate: 0
      };
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Get badge count
      const { count: badgeCount, error: badgeError } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (badgeError) throw badgeError;
      
      // Get task completion rate
      const { data: tasks, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('completed')
        .eq('user_id', user.id);
      
      if (tasksError) throw tasksError;
      
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(t => t.completed)?.length || 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        badges: badgeCount || 0,
        points: profile?.points || 0,
        level: profile?.level || 1,
        completionRate
      };
    },
    enabled: !!user?.id,
    initialData: {
      badges: 0,
      points: 0,
      level: 1,
      completionRate: 0
    }
  });
  
  return (
    <Card className="bg-black text-white border-none">
      <CardContent className="p-6">
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center">
            <Trophy className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Your Achievements</h2>
          </div>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
            <Share2 className="h-4 w-4 mr-1" />
            Share Achievements
          </Button>
        </div>
        
        <p className="text-gray-400 mb-6">Track your progress and unlock rewards</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{userStats.badges}</p>
            <p className="text-gray-400 text-sm">Total Badges</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold">{userStats.points.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Points Earned</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold">{userStats.level}</p>
            <p className="text-gray-400 text-sm">Current Level</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold">{userStats.completionRate}%</p>
            <p className="text-gray-400 text-sm">Completion Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementSummary;
