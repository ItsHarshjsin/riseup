
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
import { RotateCw, Check } from "lucide-react";
import { Task, Category } from "@/types";
import { dailyTaskTemplates } from "@/data/mockData";

const ChallengeWheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [challenges, setChallenges] = useState<Task[]>([]);
  
  const spinWheel = () => {
    setSpinning(true);
    setTimeout(() => {
      // Get random challenges from different categories
      const categories = Object.keys(dailyTaskTemplates) as Category[];
      const randomChallenges: Task[] = [];
      
      // Select 3 random categories
      const randomCategories = [...categories]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      // Get one random task from each category
      randomCategories.forEach(category => {
        const tasks = dailyTaskTemplates[category];
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        randomChallenges.push(randomTask);
      });
      
      setChallenges(randomChallenges);
      setSpinning(false);
    }, 1500);
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
                <RotateCw className="h-5 w-5 animate-spin" />
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
                  <Button size="sm" variant="outline" className="mt-1 h-8">
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
