
import React, { useState } from "react";
import { CheckCircle, Circle, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";

const DailyTasks = () => {
  const { tasks, selectedCategory, setSelectedCategory, selectedDate, toggleTask, addTask } = useDashboard();
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

  // Filter tasks based on selected date
  const filteredTasks = tasks.filter(task => 
    task.task_date && isSameDay(new Date(task.task_date), selectedDate)
  );

  // Check if tasks can be added/completed for the selected date
  const isSelectedDateToday = isSameDay(selectedDate, new Date());

  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CardTitle className="text-xl font-bold">
            Daily Tasks
          </CardTitle>
          <span className="ml-2 text-sm text-mono-gray">
            {format(selectedDate, 'MMMM d, yyyy')}
          </span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              disabled={!isSelectedDateToday}
            >
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
              <div className="space-y-2">
                <Label htmlFor="points">Points (default: 10)</Label>
                <Input 
                  id="points" 
                  type="number"
                  value={newTask.points}
                  onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value) || 10})}
                  placeholder="Enter points value"
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
        {!isSelectedDateToday && (
          <div className="bg-mono-lighter p-2 text-sm text-center text-mono-gray">
            Tasks can only be added for today
          </div>
        )}
        
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-mono-gray">
            <p>No tasks in this category for {format(selectedDate, 'MMMM d, yyyy')}</p>
            {isSelectedDateToday && (
              <Button 
                variant="link" 
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                Add your first task
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-mono-light">
            {filteredTasks.map((task) => (
              <li 
                key={task.id}
                className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="mr-3 text-mono-black hover:text-mono-gray transition-colors"
                  disabled={!isSelectedDateToday && !task.completed}
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
