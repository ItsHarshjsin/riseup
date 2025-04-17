
import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types";
import { dailyTaskTemplates } from "@/data/mockData";

const DailyTasks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("productivity");
  const [tasks, setTasks] = useState<Task[]>(dailyTaskTemplates.productivity);
  
  const categories = [
    { id: "productivity", label: "Productivity" },
    { id: "fitness", label: "Fitness" },
    { id: "learning", label: "Learning" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "creativity", label: "Creativity" },
    { id: "social", label: "Social" },
  ];
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setTasks(dailyTaskTemplates[category as keyof typeof dailyTaskTemplates]);
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Daily Tasks</CardTitle>
      </CardHeader>
      <div className="border-b border-mono-light px-4 py-2 flex overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 mx-1 text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "border-b-2 border-mono-black"
                : "text-mono-gray hover:text-mono-black"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <CardContent className="p-0">
        <ul className="divide-y divide-mono-light">
          {tasks.map((task) => (
            <li 
              key={task.id}
              className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
            >
              <button 
                onClick={() => toggleTaskCompletion(task.id)}
                className="mr-3 text-mono-black hover:text-mono-gray transition-colors"
              >
                {task.completed ? (
                  <CheckCircle className="h-6 w-6 fill-mono-black" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? "line-through text-mono-gray" : ""}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-mono-gray">{task.description}</p>
              </div>
              <div className="ml-4 text-sm font-semibold bg-mono-lighter px-2 py-1 rounded-full">
                {task.points} pts
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DailyTasks;
