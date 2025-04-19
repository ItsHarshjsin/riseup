
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Star, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import UserStats from "@/components/dashboard/UserStats";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
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

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-mono-gray">Please log in to view your dashboard</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Welcome back, {user.email?.split('@')[0]}</h1>
            
            {/* Main Content Area */}
            <div className="space-y-6">
              <DailyTasks />
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <UserStats />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
