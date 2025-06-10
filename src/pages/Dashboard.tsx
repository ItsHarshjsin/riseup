import * as React from "react";
import { useEffect } from "react";
import DailyTasks from "@/components/dashboard/DailyTasks";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import UserStats from "@/components/dashboard/UserStats";
import AchievementSummary from "@/components/dashboard/AchievementSummary";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    isLoading: dashboardLoading,
    categoryMasteryLoading,
    tasks,
    categoryMastery
  } = useDashboard();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while auth or dashboard data is loading
  if (authLoading || dashboardLoading || categoryMasteryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-xl text-mono-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Show error state if no data is available
  if (!tasks || !categoryMastery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-500">Unable to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
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
