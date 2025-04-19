
import React from "react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import UserStats from "@/components/dashboard/UserStats";
import ProfileCard from "@/components/profile/ProfileCard";
import ClanOverview from "@/components/clan/ClanOverview";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCalendar />
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
    </Layout>
  );
};

export default Index;
