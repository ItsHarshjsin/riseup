
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Star } from "lucide-react";
import { currentUser } from "@/data/mockData";

const UserStats: React.FC = () => {
  // Calculate level progress
  const levelProgress = ((currentUser.points % 500) / 500) * 100;
  
  // Create mock category stats
  const categoryStats = [
    { name: "Fitness", progress: 65, icon: <Trophy className="h-5 w-5" /> },
    { name: "Learning", progress: 80, icon: <Zap className="h-5 w-5" /> },
    { name: "Mindfulness", progress: 45, icon: <Star className="h-5 w-5" /> },
    { name: "Productivity", progress: 72, icon: <Target className="h-5 w-5" /> },
  ];
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Level {currentUser.level}</div>
            <div className="text-sm font-medium">Level {currentUser.level + 1}</div>
          </div>
          <Progress value={levelProgress} className="h-2 bg-mono-lighter" />
          <div className="text-xs text-mono-gray mt-2 text-center">
            {Math.round(500 - (currentUser.points % 500))} points until next level
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm uppercase text-mono-gray">Category Mastery</h3>
          {categoryStats.map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.name}</span>
                </div>
                <span className="text-sm font-medium">{stat.progress}%</span>
              </div>
              <Progress value={stat.progress} className="h-1.5 bg-mono-lighter" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
