
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
import { Users, Trophy, Target, Loader2 } from "lucide-react";
import { Clan, Challenge } from "@/types";

interface ClanOverviewProps {
  clan?: Clan | null;
  challenges?: Challenge[];
  isLoading?: boolean;
}

const ClanOverview: React.FC<ClanOverviewProps> = ({ 
  clan, 
  challenges = [],
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="border-mono-light shadow-sm">
        <CardHeader className="border-b border-mono-light">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardHeader>
      </Card>
    );
  }
  
  if (!clan) {
    return (
      <Card className="border-mono-light shadow-sm">
        <CardHeader className="border-b border-mono-light">
          <CardTitle className="text-2xl font-bold">No Clan</CardTitle>
          <CardDescription className="text-mono-gray mt-1">
            Join or create a clan to see details here
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const activeChallenges = challenges.filter(c => !c.completed).slice(0, 3);
  
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
            <span>{clan.points?.toLocaleString() || 0} pts</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-mono-gray" />
            <span className="font-medium">Members</span>
          </div>
          
          {activeChallenges.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm uppercase text-mono-gray font-medium">Active Challenges</h3>
              <div className="space-y-3">
                {activeChallenges.map(challenge => (
                  <div key={challenge.id} className="flex items-start gap-3 p-3 border border-mono-light rounded-md">
                    <Target className="h-5 w-5 text-mono-black mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-mono-black">{challenge.title}</h4>
                      <p className="text-sm text-mono-gray truncate">{challenge.description}</p>
                      {challenge.assignedTo && challenge.assignedTo.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {challenge.assignedTo.map(memberId => (
                            <Avatar key={memberId} className="h-6 w-6 border border-mono-light">
                              <AvatarFallback className="bg-mono-black text-mono-white text-xs">
                                U
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge className="bg-mono-lighter text-mono-black font-normal">
                      {challenge.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-mono-gray">No active challenges</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClanOverview;
