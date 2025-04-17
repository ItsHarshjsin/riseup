import React from "react";
import { Calendar as CalendarIcon, Trophy, Star, Target, CheckCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ShareCard from "@/components/ShareCard";

const Dashboard = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const categories = ["Productivity", "Fitness", "Learning", "Mindfulness", "Creativity", "Social"];
  
  const tasks = [
    {
      id: 1,
      title: "Pomodoro sessions",
      description: "Complete 4 pomodoro sessions",
      category: "Productivity",
      points: 35,
    },
    {
      id: 2,
      title: "Inbox zero",
      description: "Clear your email inbox completely",
      category: "Productivity",
      points: 25,
    },
    {
      id: 3,
      title: "Day planning",
      description: "Plan your next day in detail",
      category: "Productivity",
      points: 20,
    },
  ];

  const categoryMastery = [
    { name: "Fitness", progress: 65 },
    { name: "Learning", progress: 80 },
    { name: "Mindfulness", progress: 45 },
    { name: "Productivity", progress: 72 },
  ];

  // Calendar setup
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentYear, currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentDate.getMonth());
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-2xl font-bold">Welcome back, JaneDoe</h1>
        <p className="text-sm sm:text-sm text-mono-gray">Keep up the great work! You're on a roll.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-xs font-medium text-mono-gray">Current Streak</h3>
              <div className="mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold">15</span>
                <span className="text-xs sm:text-xs text-mono-gray ml-1">days</span>
              </div>
            </div>
            <Target className="h-4 w-4 sm:h-4 sm:w-4 text-mono-gray" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-xs font-medium text-mono-gray">Level</h3>
              <div className="mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold">7</span>
              </div>
              <p className="text-xs sm:text-xs text-mono-gray mt-0.5">87.5 points to Level 8</p>
            </div>
            <Star className="h-4 w-4 sm:h-4 sm:w-4 text-mono-gray" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-xs font-medium text-mono-gray">Completed Tasks</h3>
              <div className="mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold">142</span>
              </div>
            </div>
            <CheckCircle className="h-4 w-4 sm:h-4 sm:w-4 text-mono-gray" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-xs font-medium text-mono-gray">Total Points</h3>
              <div className="mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold">2,480</span>
              </div>
            </div>
            <Trophy className="h-4 w-4 sm:h-4 sm:w-4 text-mono-gray" />
          </div>
        </Card>
      </div>

      {/* Clan Card */}
      <Card className="mb-4 sm:mb-6 bg-black text-white">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">Growth Mindset</h2>
              <p className="text-sm sm:text-sm text-gray-400">A group dedicated to constant improvement and daily growth</p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-white">
              Invite Members
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
            <div>
              <p className="text-lg sm:text-2xl font-bold">2,980</p>
              <p className="text-xs sm:text-sm text-gray-400">Total Points</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold">#28</p>
              <p className="text-xs sm:text-sm text-gray-400">Global Rank</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold">92%</p>
              <p className="text-xs sm:text-sm text-gray-400">Completion Rate</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold">3/5</p>
              <p className="text-xs sm:text-sm text-gray-400">Active Members</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
            {/* Calendar Section */}
            <div className="sm:col-span-4">
              <Card className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm h-full">
                <div className="flex justify-between items-center mb-1.5">
                  <h2 className="text-xs font-semibold">Your Streak</h2>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">15 days</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-1">
                  <button className="p-0.5 hover:bg-gray-100 rounded-full transition-colors text-xs">&lt;</button>
                  <span className="text-xs font-medium">{currentMonth} {currentYear}</span>
                  <button className="p-0.5 hover:bg-gray-100 rounded-full transition-colors text-xs">&gt;</button>
                </div>

                <div className="grid grid-cols-7 gap-[1px] text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-[8px] sm:text-[8px] font-medium text-mono-gray py-[1px]">{day}</div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        aspect-square flex items-center justify-center text-[10px] sm:text-[10px] font-medium rounded-full
                        ${day ? 'hover:bg-gray-100 cursor-pointer transition-colors' : ''}
                        ${day && day <= 17 ? 'bg-black text-white hover:bg-black/90' : ''}
                        ${!day ? 'text-mono-light' : ''}
                        min-h-[0.75rem] min-w-[0.75rem]
                      `}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Tasks Section */}
            <div className="sm:col-span-8">
              <Card className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm h-full">
                <h2 className="text-base sm:text-lg font-semibold mb-4">Daily Tasks</h2>
                <div className="flex overflow-x-auto no-scrollbar border-b mb-4">
                  {categories.filter(cat => cat !== "Productivity").map((category) => (
                    <button
                      key={category}
                      className="pb-2 px-4 text-sm font-medium whitespace-nowrap border-b-2 border-transparent hover:text-gray-900 transition-colors text-gray-500"
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start justify-between py-4 px-4 hover:bg-gray-50/50 transition-colors rounded-lg group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="pt-0.5">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded-sm border-2 border-gray-300 focus:ring-2 focus:ring-black" 
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 pt-0.5">
                        {task.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4">
          <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
            <h2 className="text-sm font-semibold mb-3 sm:mb-4">Category Mastery</h2>
            <div className="space-y-3 sm:space-y-4">
              {categoryMastery.map((category) => (
                <div key={category.name} className="space-y-1 sm:space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-xs">
                    <span>{category.name}</span>
                    <span>{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-sm">
            <h2 className="text-sm font-semibold mb-2 sm:mb-3">Recent Achievements</h2>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/50">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black flex items-center justify-center">
                <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <div>
                <p className="text-sm sm:text-sm font-medium">Streak Master</p>
                <p className="text-xs sm:text-xs text-mono-gray">15 day streak achieved</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 