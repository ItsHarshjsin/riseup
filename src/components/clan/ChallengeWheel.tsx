
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw, Check, Loader2 } from "lucide-react";
import { Task, Category } from "@/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ChallengeWheelProps {
  clanId?: string;
}

const ChallengeWheel: React.FC<ChallengeWheelProps> = ({ clanId }) => {
  const [spinning, setSpinning] = useState(false);
  const [challenges, setChallenges] = useState<Task[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { mutate: acceptChallenge } = useMutation({
    mutationFn: async (task: Task) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('daily_tasks')
        .insert([
          {
            user_id: user.id,
            title: task.title,
            description: task.description,
            category: task.category,
            points: task.points,
            completed: false,
            task_date: new Date().toISOString().split('T')[0]
          }
        ]);
        
      if (error) throw error;
      
      return task;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setChallenges(prevChallenges => 
        prevChallenges.filter(c => c.id !== task.id)
      );
      toast({
        title: 'Challenge accepted',
        description: `"${task.title}" has been added to your daily tasks.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error accepting challenge',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const spinWheel = async () => {
    if (!clanId || !user) {
      toast({
        title: 'Error',
        description: 'You need to be in a clan to spin the wheel',
        variant: 'destructive',
      });
      return;
    }
    
    setSpinning(true);
    
    try {
      // Get random challenges for different categories
      const categories = ['productivity', 'fitness', 'learning', 'mindfulness', 'creativity', 'social'];
      const randomCategories = [...categories]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      const promises = randomCategories.map(async (category) => {
        const { data, error } = await supabase
          .from('daily_tasks')
          .select('*')
          .eq('category', category)
          .eq('user_id', user.id)
          .limit(20);
          
        if (error) throw error;
        
        const filteredTasks = data.filter(task => !task.completed);
        if (filteredTasks.length === 0) return null;
        
        // Select a random task
        return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
      });
      
      const results = await Promise.all(promises);
      const randomTasks = results.filter(task => task !== null) as Task[];
      
      // If we don't have 3 tasks, create some default ones
      if (randomTasks.length < 3) {
        const defaultTasks = [
          {
            id: `temp-${Math.random()}`,
            title: 'Complete a workout session',
            description: 'Do at least 20 minutes of exercise',
            category: 'fitness' as Category,
            points: 20,
            completed: false,
            user_id: user.id,
            created_at: new Date().toISOString(),
            task_date: new Date().toISOString().split('T')[0]
          },
          {
            id: `temp-${Math.random()}`,
            title: 'Learn something new',
            description: 'Spend 30 minutes learning a new skill',
            category: 'learning' as Category,
            points: 15,
            completed: false,
            user_id: user.id,
            created_at: new Date().toISOString(),
            task_date: new Date().toISOString().split('T')[0]
          },
          {
            id: `temp-${Math.random()}`,
            title: 'Meditate',
            description: 'Practice 10 minutes of mindfulness',
            category: 'mindfulness' as Category,
            points: 10,
            completed: false,
            user_id: user.id,
            created_at: new Date().toISOString(),
            task_date: new Date().toISOString().split('T')[0]
          }
        ];
        
        // Add default tasks to fill up to 3
        for (let i = randomTasks.length; i < 3; i++) {
          randomTasks.push(defaultTasks[i]);
        }
      }
      
      setChallenges(randomTasks);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      toast({
        title: 'Error',
        description: 'Failed to spin the wheel',
        variant: 'destructive',
      });
    } finally {
      setSpinning(false);
    }
  };
  
  const getCategoryColor = (category: Category) => {
    // Monochrome variants for different categories
    switch (category) {
      case 'fitness':
        return 'bg-mono-black text-mono-white';
      case 'productivity':
        return 'bg-mono-dark text-mono-white';
      case 'learning':
        return 'bg-mono-gray text-mono-white';
      default:
        return 'bg-mono-lighter text-mono-black';
    }
  };
  
  if (!clanId) {
    return null;
  }
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Challenge Wheel</CardTitle>
        <CardDescription className="text-mono-gray">
          Spin the wheel to get random challenges from your clan
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-center">
          <Button 
            onClick={spinWheel}
            disabled={spinning}
            className="py-6 px-8 bg-mono-black hover:bg-mono-dark text-mono-white flex items-center gap-2"
          >
            {spinning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Spinning...</span>
              </>
            ) : (
              <>
                <RotateCw className="h-5 w-5" />
                <span>Spin the Wheel</span>
              </>
            )}
          </Button>
        </div>
        
        {challenges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-center">Your Challenges</h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div 
                  key={challenge.id}
                  className="p-4 border border-mono-light rounded-md flex items-start gap-3"
                >
                  <Badge className={getCategoryColor(challenge.category)}>
                    {challenge.category}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <p className="text-sm text-mono-gray">{challenge.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-1 h-8"
                    onClick={() => acceptChallenge(challenge)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    <span>Accept</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeWheel;
