
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Target } from "lucide-react";
import { Clan } from "@/types";
import { currentClan } from "@/data/mockData";

interface ClanOverviewProps {
  clan?: Clan;
}

const ClanOverview: React.FC<ClanOverviewProps> = ({ 
  clan = currentClan 
}) => {
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{clan.name}</CardTitle>
            <CardDescription className="text-mono-gray mt-1">
              {clan.description}
            </CardDescription>
          </div>
          <Badge className="bg-mono-black text-mono-white flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>{clan.points.toLocaleString()} pts</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-mono-gray" />
            <span className="font-medium">{clan.members.length} Members</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm uppercase text-mono-gray font-medium">Active Challenges</h3>
            <div className="space-y-3">
              {clan.challenges.map(challenge => (
                <div key={challenge.id} className="flex items-start gap-3 p-3 border border-mono-light rounded-md">
                  <Target className="h-5 w-5 text-mono-black mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-mono-black">{challenge.title}</h4>
                    <p className="text-sm text-mono-gray truncate">{challenge.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {challenge.assignedTo.map(memberId => {
                        const member = clan.members.find(m => m.id === memberId);
                        if (!member) return null;
                        
                        const initials = member.username
                          .split(' ')
                          .map(name => name[0])
                          .join('')
                          .toUpperCase();
                        
                        return (
                          <Avatar key={member.id} className="h-6 w-6 border border-mono-light">
                            <AvatarImage src={member.avatar} alt={member.username} />
                            <AvatarFallback className="bg-mono-black text-mono-white text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>
                  </div>
                  <Badge className="bg-mono-lighter text-mono-black font-normal">
                    {challenge.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClanOverview;
