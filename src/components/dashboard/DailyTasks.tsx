
import React, { useState } from "react";
import { CheckCircle, Circle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";

const DailyTasks = () => {
  const { tasks, selectedCategory, setSelectedCategory, toggleTask, addTask } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    points: 10
  });
  
  const categories = [
    { id: "productivity", label: "Productivity" },
    { id: "fitness", label: "Fitness" },
    { id: "learning", label: "Learning" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "creativity", label: "Creativity" },
    { id: "social", label: "Social" },
  ];

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    addTask(newTask);
    setNewTask({ title: "", description: "", points: 10 });
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Daily Tasks</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <div className="border-b border-mono-light px-4 py-2 flex overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
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
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-mono-gray">
            <p>No tasks in this category yet</p>
            <Button 
              variant="link" 
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              Add your first task
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-mono-light">
            {tasks.map((task) => (
              <li 
                key={task.id}
                className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
              >
                <button 
                  onClick={() => toggleTask(task.id)}
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
                  {task.description && (
                    <p className="text-sm text-mono-gray">{task.description}</p>
                  )}
                </div>
                <div className="ml-4 text-sm font-semibold bg-mono-lighter px-2 py-1 rounded-full">
                  {task.points} pts
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;
