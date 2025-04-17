import React from "react";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements = () => {
  const categories = ["All", "Productivity", "Fitness", "Learning", "Mindfulness"];
  
  const achievements = [
    {
      id: 1,
      title: "Streak Master",
      description: "Maintain a 15-day streak",
      icon: <Trophy className="h-5 w-5" />,
      progress: 100,
      completed: true,
      date: "2024-03-15",
      category: "Productivity",
      points: 500,
    },
    {
      id: 2,
      title: "Learning Pioneer",
      description: "Complete 50 learning tasks",
      icon: <Star className="h-5 w-5" />,
      progress: 80,
      completed: false,
      category: "Learning",
      points: 1000,
    },
    {
      id: 3,
      title: "Focus Champion",
      description: "Complete 100 pomodoro sessions",
      icon: <Target className="h-5 w-5" />,
      progress: 65,
      completed: false,
      category: "Productivity",
      points: 750,
    },
  ];

  const milestones = [
    {
      level: 5,
      title: "Getting Started",
      completed: true,
      rewards: ["Basic Badge", "Profile Customization"],
    },
    {
      level: 10,
      title: "Rising Star",
      completed: false,
      rewards: ["Advanced Badge", "Custom Themes"],
    },
    {
      level: 15,
      title: "Elite Member",
      completed: false,
      rewards: ["Elite Badge", "Create Custom Challenges"],
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="rounded-xl bg-black text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Achievements</h1>
            <p className="text-neutral-400">Track your progress and unlock rewards</p>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Share Achievements
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-neutral-400">Total Badges</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2,480</div>
            <div className="text-sm text-neutral-400">Points Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-neutral-400">Current Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-neutral-400">Completion Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="All" className="w-full">
                <TabsList className="w-full mb-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements
                        .filter(
                          (achievement) =>
                            category === "All" || achievement.category === category
                        )
                        .map((achievement) => (
                          <div
                            key={achievement.id}
                            className="p-4 rounded-lg border border-mono-light hover:border-mono-dark transition-colors"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  achievement.completed ? "bg-black" : "bg-mono-light"
                                }`}>
                                  <div className={achievement.completed ? "text-white" : "text-mono-dark"}>
                                    {achievement.icon}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{achievement.title}</h3>
                                  <p className="text-sm text-mono-gray">
                                    {achievement.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {achievement.points} pts
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.level}
                    className={`relative pl-8 pb-6 ${
                      index !== milestones.length - 1
                        ? "border-l-2 border-mono-light"
                        : ""
                    }`}
                  >
                    <div
                      className={`absolute left-0 w-4 h-4 -translate-x-[9px] rounded-full border-2 ${
                        milestone.completed
                          ? "bg-black border-black"
                          : "bg-white border-mono-light"
                      }`}
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Level {milestone.level}</h3>
                        <div className="text-sm text-mono-gray">
                          {milestone.completed ? "Completed" : "Locked"}
                        </div>
                      </div>
                      <p className="text-sm font-medium">{milestone.title}</p>
                      <div className="space-y-1">
                        {milestone.rewards.map((reward, i) => (
                          <div
                            key={i}
                            className="text-sm text-mono-gray flex items-center gap-2"
                          >
                            <Award className="h-4 w-4" />
                            {reward}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Achievement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Next Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border border-mono-light space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-mono-light">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Elite Status</h3>
                    <p className="text-sm text-mono-gray">
                      Reach level 15 to unlock special features
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>7/15</span>
                  </div>
                  <Progress value={47} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 