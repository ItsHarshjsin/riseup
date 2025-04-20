
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { 
  Award, 
  Zap, 
  Brain, 
  Heart, 
  Dumbbell, 
  Flame, 
  Lightbulb, 
  Users,
  LucideIcon
} from "lucide-react";
import { Badge, Category } from "@/types";

interface BadgeGridProps {
  allBadges: any[]; // Allow any badge array format
  userBadges: Badge[];
  showLocked?: boolean;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  allBadges = [],
  userBadges = [],
  showLocked = true
}) => {
  // Create some locked badges for UI showcase
  const lockedBadges: Omit<Badge, "unlockedAt">[] = [
    {
      id: "locked1",
      name: "30-Day Streak",
      description: "Maintain a 30-day streak",
      icon: "flame",
      category: "productivity",
    },
    {
      id: "locked2",
      name: "Challenge Master",
      description: "Complete 50 challenges",
      icon: "zap",
      category: "productivity",
    },
    {
      id: "locked3",
      name: "Fitness Pro",
      description: "Complete 100 fitness tasks",
      icon: "dumbbell",
      category: "fitness",
    },
  ];
  
  const getBadgeIcon = (icon: string): LucideIcon => {
    switch (icon) {
      case 'award':
        return Award;
      case 'zap':
        return Zap;
      case 'brain':
        return Brain;
      case 'heart':
        return Heart;
      case 'dumbbell':
        return Dumbbell;
      case 'flame':
        return Flame;
      case 'users':
        return Users;
      case 'lightbulb':
      default:
        return Lightbulb;
    }
  };
  
  const getBadgeCategoryStyle = (category: Category) => {
    switch (category) {
      case 'fitness':
        return 'bg-mono-black text-mono-white';
      case 'productivity':
        return 'bg-mono-dark text-mono-white';
      case 'learning':
        return 'bg-mono-gray text-mono-white';
      case 'mindfulness':
        return 'bg-mono-light text-mono-black';
      default:
        return 'bg-mono-lighter text-mono-black';
    }
  };
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Your Achievements</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userBadges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon || 'award');
            
            return (
              <div 
                key={badge.id}
                className="border border-mono-light rounded-lg p-4 text-center hover:bg-mono-lighter transition-colors"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-mono-black text-mono-white mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-mono-black">{badge.name}</h3>
                <p className="text-xs text-mono-gray mt-1">{badge.description}</p>
                <BadgeComponent 
                  className={`mt-3 ${getBadgeCategoryStyle(badge.category)}`}
                >
                  {badge.category}
                </BadgeComponent>
              </div>
            );
          })}
          
          {/* Show all badges that are not unlocked */}
          {showLocked && allBadges
            .filter(badge => !userBadges.some(ub => ub.id === badge.id))
            .map((badge) => {
              const Icon = getBadgeIcon(badge.icon || 'award');
              
              return (
                <div 
                  key={badge.id}
                  className="border border-mono-light rounded-lg p-4 text-center opacity-50 hover:opacity-70 transition-opacity"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-mono-light text-mono-gray mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-mono-gray">{badge.name}</h3>
                  <p className="text-xs text-mono-gray mt-1">{badge.description}</p>
                  <BadgeComponent 
                    className="mt-3 bg-mono-lighter text-mono-gray"
                  >
                    {badge.category}
                  </BadgeComponent>
                  <div className="text-xs text-mono-gray mt-2">
                    Locked
                  </div>
                </div>
              );
            })}
          
          {/* If not a lot of badges, show some additional locked ones */}
          {showLocked && allBadges.length < 3 && lockedBadges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon || 'award');
            
            return (
              <div 
                key={badge.id}
                className="border border-mono-light rounded-lg p-4 text-center opacity-50 hover:opacity-70 transition-opacity"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-mono-light text-mono-gray mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-mono-gray">{badge.name}</h3>
                <p className="text-xs text-mono-gray mt-1">{badge.description}</p>
                <BadgeComponent 
                  className="mt-3 bg-mono-lighter text-mono-gray"
                >
                  {badge.category}
                </BadgeComponent>
                <div className="text-xs text-mono-gray mt-2">
                  Locked
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeGrid;
