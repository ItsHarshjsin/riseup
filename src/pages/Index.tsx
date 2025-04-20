
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import UserStats from "@/components/dashboard/UserStats";
import ProfileCard from "@/components/profile/ProfileCard";
import ClanOverview from "@/components/clan/ClanOverview";
import AchievementSummary from "@/components/dashboard/AchievementSummary";
import { useAuth } from "@/hooks/useAuth";
import { useClan } from "@/hooks/useClan";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { userClan, clanChallenges, isLoadingClan, isLoadingChallenges } = useClan();
  
  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  // Fetch user profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
  
  if (loading || isLoadingProfile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-mono-gray">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">
          Welcome back, {profile?.username || user?.email?.split('@')[0] || 'User'}
        </h1>
        
        <AchievementSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskCalendar />
              <UserStats />
            </div>
            
            <DailyTasks />
          </div>
          
          <div className="space-y-6">
            {profile && (
              <ProfileCard user={{
                id: profile.id,
                username: profile.username,
                avatar: profile.avatar || '',
                level: profile.level,
                points: profile.points,
                streak: profile.streak,
                badges: [],
                completedTasks: [],
                createdAt: new Date(profile.created_at)
              }} />
            )}
            
            <ClanOverview 
              clan={userClan}
              challenges={clanChallenges}
              isLoading={isLoadingClan || isLoadingChallenges}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
