import React from "react";
import { BarChart2, TrendingUp, Calendar, Clock, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Stats = () => {
  const timeRanges = ["Week", "Month", "Quarter", "Year"];
  
  const categories = [
    { name: "Productivity", progress: 72, tasksCompleted: 142, streak: 15 },
    { name: "Fitness", progress: 65, tasksCompleted: 98, streak: 12 },
    { name: "Learning", progress: 80, tasksCompleted: 156, streak: 20 },
    { name: "Mindfulness", progress: 45, tasksCompleted: 64, streak: 8 },
  ];

  const weeklyActivity = [
    { day: "Mon", completed: 8, total: 10 },
    { day: "Tue", completed: 7, total: 10 },
    { day: "Wed", completed: 9, total: 10 },
    { day: "Thu", completed: 6, total: 10 },
    { day: "Fri", completed: 8, total: 10 },
    { day: "Sat", completed: 5, total: 10 },
    { day: "Sun", completed: 4, total: 10 },
  ];

  const achievements = [
    {
      title: "Perfect Week",
      date: "March 15, 2024",
      points: 500,
    },
    {
      title: "Learning Streak",
      date: "March 14, 2024",
      points: 300,
    },
    {
      title: "Early Bird",
      date: "March 13, 2024",
      points: 200,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="rounded-xl bg-black text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Statistics Overview</h1>
            <p className="text-neutral-400">Track your progress and analyze your growth</p>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-neutral-400">Completion Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-neutral-400">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">460</div>
            <div className="text-sm text-neutral-400">Tasks Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2,480</div>
            <div className="text-sm text-neutral-400">Total Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Category Progress</CardTitle>
                <Tabs defaultValue="Week" className="w-auto">
                  <TabsList>
                    {timeRanges.map((range) => (
                      <TabsTrigger key={range} value={range} className="text-xs">
                        {range}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-mono-gray">
                          <span>{category.tasksCompleted} tasks</span>
                          <span>{category.streak} day streak</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{category.progress}%</div>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 h-32">
                {weeklyActivity.map((day) => (
                  <div key={day.day} className="flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-mono-light rounded-md" style={{ height: `${(day.completed / day.total) * 100}%` }} />
                    <div className="text-xs text-mono-gray mt-2">{day.day}</div>
                    <div className="text-xs font-medium">{day.completed}/{day.total}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-mono-light">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-mono-light">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Most Productive Time</div>
                      <div className="text-sm text-mono-gray">9:00 AM - 11:00 AM</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-mono-light">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-mono-light">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Most Active Day</div>
                      <div className="text-sm text-mono-gray">Wednesday</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-mono-light"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-mono-light">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-mono-gray">{achievement.date}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{achievement.points} pts</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stats; 