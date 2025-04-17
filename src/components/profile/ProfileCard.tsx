
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { currentUser } from "@/data/mockData";

interface ProfileCardProps {
  user?: User;
  shareable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user = currentUser,
  shareable = true 
}) => {
  const initials = user.username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  // Top categories based on completed tasks
  const topCategories = ["Productivity", "Learning", "Mindfulness"];
  
  return (
    <Card className="border-mono-light shadow-sm overflow-hidden">
      <div className="h-24 bg-mono-black"></div>
      <CardHeader className="pt-0 flex flex-row space-y-0">
        <Avatar className="h-24 w-24 rounded-xl border-4 border-mono-white -mt-12 shadow-md">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="text-xl font-bold bg-mono-black text-mono-white rounded-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 pt-2">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex flex-wrap gap-2">
            {topCategories.map(category => (
              <Badge key={category} variant="outline" className="bg-mono-lighter font-normal">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold">{user.level}</div>
            <div className="text-xs uppercase text-mono-gray">Level</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">{user.streak}</div>
            <div className="text-xs uppercase text-mono-gray">Day Streak</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold">{user.badges.length}</div>
            <div className="text-xs uppercase text-mono-gray">Badges</div>
          </div>
        </div>
        
        {user.badges.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm uppercase text-mono-gray font-medium">Top Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.slice(0, 3).map(badge => (
                <Badge key={badge.id} className="bg-mono-black text-mono-white">
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {shareable && (
        <CardFooter className="border-t border-mono-light pt-4 flex justify-between">
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={16} />
            <span>Download</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 size={16} />
            <span>Share</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCard;
