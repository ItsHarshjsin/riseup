
import React from "react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import UserStats from "@/components/dashboard/UserStats";
import ProfileCard from "@/components/profile/ProfileCard";
import ClanOverview from "@/components/clan/ClanOverview";
import AchievementSummary from "@/components/dashboard/AchievementSummary";
import { useAuth } from "@/hooks/useAuth";

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-mono-gray">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">
          Welcome back, {user?.email?.split('@')[0] || 'User'}
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
            <ProfileCard user={{
              id: user?.id || '',
              username: user?.email?.split('@')[0] || 'User',
              avatar: '',
              level: 1,
              points: 0,
              streak: 0,
              badges: [],
              completedTasks: [],
              createdAt: new Date()
            }} />
            <ClanOverview />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
