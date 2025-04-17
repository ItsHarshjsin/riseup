
import React from "react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import UserStats from "@/components/dashboard/UserStats";
import ProfileCard from "@/components/profile/ProfileCard";
import ClanOverview from "@/components/clan/ClanOverview";
import { currentUser } from "@/data/mockData";

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser.username}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCalendar />
            <UserStats />
          </div>
          
          <DailyTasks />
        </div>
        
        <div className="space-y-6">
          <ProfileCard />
          <ClanOverview />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
