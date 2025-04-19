
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Star } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

const UserStats: React.FC = () => {
  const { user } = useAuth();
  const { categoryMastery } = useDashboard();
  
  // Calculate level progress
  const points = user?.points || 0;
  const levelProgress = ((points % 500) / 500) * 100;
  
  const categoryStats = [
    { name: "Fitness", icon: <Trophy className="h-5 w-5" /> },
    { name: "Learning", icon: <Zap className="h-5 w-5" /> },
    { name: "Mindfulness", icon: <Star className="h-5 w-5" /> },
    { name: "Productivity", icon: <Target className="h-5 w-5" /> },
  ].map(stat => ({
    ...stat,
    progress: categoryMastery.find(cm => 
      cm.category.toLowerCase() === stat.name.toLowerCase()
    )?.progress || 0
  }));
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Level {user?.level || 1}</div>
            <div className="text-sm font-medium">Level {(user?.level || 1) + 1}</div>
          </div>
          <Progress value={levelProgress} className="h-2 bg-mono-lighter" />
          <div className="text-xs text-mono-gray mt-2 text-center">
            {Math.round(500 - (points % 500))} points until next level
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
