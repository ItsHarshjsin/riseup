
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import DailyTasks from "@/components/dashboard/DailyTasks";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import UserStats from "@/components/dashboard/UserStats";
import ProfileCard from "@/components/profile/ProfileCard";
import ClanOverview from "@/components/clan/ClanOverview";
import { currentUser } from "@/data/mockData";
import { User } from "@/types";

const Index: React.FC = () => {
  const [userData, setUserData] = useState<User>(currentUser);
  
  // This would be replaced with a real Supabase query in a production app
  useEffect(() => {
    // Simulate fetching user data
    // In a real app with Supabase, we would do something like:
    // const fetchUserData = async () => {
    //   const { data, error } = await supabase
    //     .from('users')
    //     .select('*')
    //     .eq('id', user.id)
    //     .single();
    //   
    //   if (data) setUserData(data);
    // };
    // 
    // fetchUserData();
    
    // For now, we'll just use the mock data
    setUserData(currentUser);
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData.username}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCalendar />
            <UserStats />
          </div>
          
          <DailyTasks />
        </div>
        
        <div className="space-y-6">
          <ProfileCard user={userData} />
          <ClanOverview />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
