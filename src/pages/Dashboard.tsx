import * as React from "react";
import { useEffect } from "react";
import DailyTasks from "@/components/dashboard/DailyTasks";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import UserStats from "@/components/dashboard/UserStats";
import AchievementSummary from "@/components/dashboard/AchievementSummary";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-xl text-mono-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.email?.split('@')[0]}</h1>
      
      <AchievementSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskCalendar />
            <UserStats />
          </div>
          
          <DailyTasks />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          {/* You can add sidebar components here if needed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
