
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Flame, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { currentUser } from "@/data/mockData";

const statsCards = [
  {
    title: "Today's Progress",
    value: "50%",
    subtitle: "2 of 4 habits completed",
    icon: <Activity className="h-5 w-5 text-purple-500" />,
    bgColor: "bg-purple-50",
  },
  {
    title: "Current Streak",
    value: "3",
    subtitle: "Your longest active streak",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    bgColor: "bg-orange-50",
  },
  {
    title: "Completion Rate",
    value: "50%",
    subtitle: "Average daily completion",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    bgColor: "bg-blue-50",
  },
  {
    title: "Best Streak",
    value: "14",
    subtitle: "Your all-time best",
    icon: <Trophy className="h-5 w-5 text-red-500" />,
    bgColor: "bg-red-50",
  },
];

const habits = [
  {
    id: 1,
    title: "Drink Water",
    description: "Drink 8 glasses of water daily",
    streak: 3,
    completed: true,
    icon: "💧",
  },
  {
    id: 2,
    title: "Exercise",
    description: "Workout for 30 minutes",
    streak: 2,
    completed: true,
    icon: "💪",
  },
  {
    id: 3,
    title: "Read",
    description: "Read for 20 minutes",
    streak: 1,
    completed: false,
    icon: "📚",
  },
  {
    id: 4,
    title: "Meditate",
    description: "Meditate for 10 minutes",
    streak: 0,
    completed: false,
    icon: "🧘",
  },
];

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            Welcome back, {currentUser.username}
          </motion.h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Add Habit
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg border border-mono-light ${card.bgColor}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="rounded-full p-2 bg-white">{card.icon}</div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
              <p className="text-sm text-mono-gray">{card.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
            <Progress value={50} className="mb-2" />
            <p className="text-sm text-mono-gray text-right">2/4 completed</p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white border border-mono-light rounded-lg flex items-center justify-between hover:border-mono-dark transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-medium">{habit.title}</h3>
                    <p className="text-sm text-mono-gray">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-sm text-mono-gray">Streak</span>
                    <div className="font-semibold">{habit.streak} days</div>
                  </div>
                  <Button
                    variant={habit.completed ? "default" : "outline"}
                    className={habit.completed ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {habit.completed ? "Completed" : "Complete"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
