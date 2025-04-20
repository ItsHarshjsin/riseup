
import React from "react";
import Layout from "@/components/layout/Layout";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import Leaderboard from "@/components/achievements/Leaderboard";
import { Loader2 } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";

const AchievementsPage: React.FC = () => {
  const { allBadges, userBadges, leaderboard, isLoading } = useAchievements();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-mono-gray">Loading achievements data...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BadgeGrid 
              userBadges={userBadges} 
              badges={allBadges}
            />
          </div>
          
          <div className="space-y-6">
            <Leaderboard data={leaderboard} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AchievementsPage;
