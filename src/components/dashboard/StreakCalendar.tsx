
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Flame } from "lucide-react";
import { currentUser } from "@/data/mockData";

const StreakCalendar: React.FC = () => {
  // Create completed days based on user data
  const today = new Date();
  const completedDays: Date[] = [];
  
  // Create streak days (past days with tasks completed)
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Add day to streak if it's within the user's streak
    if (i < currentUser.streak) {
      completedDays.push(date);
    } else {
      // Add some random days for visualization
      if (Math.random() > 0.6) {
        completedDays.push(date);
      }
    }
  }
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Your Streak</CardTitle>
        <div className="flex items-center gap-2 bg-mono-lighter px-3 py-1 rounded-full">
          <Flame className="h-5 w-5" />
          <span className="font-semibold">{currentUser.streak} days</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          mode="multiple"
          selected={completedDays}
          className="border-none"
          disabled={{
            after: today
          }}
          modifiers={{
            completed: completedDays
          }}
          modifiersClassNames={{
            completed: "bg-mono-black text-mono-white hover:bg-mono-dark"
          }}
          onSelect={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
