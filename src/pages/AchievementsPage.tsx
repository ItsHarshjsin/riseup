
import React from "react";
import Layout from "@/components/layout/Layout";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import Leaderboard from "@/components/achievements/Leaderboard";

const AchievementsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BadgeGrid />
          </div>
          
          <div className="space-y-6">
            <Leaderboard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AchievementsPage;
