
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { Clan } from "@/types";
import { currentClan } from "@/data/mockData";

interface ClanMembersProps {
  clan?: Clan;
}

const ClanMembers: React.FC<ClanMembersProps> = ({ 
  clan = currentClan 
}) => {
  // Sort members by points
  const sortedMembers = [...clan.members].sort((a, b) => b.points - a.points);
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Clan Members</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-mono-light">
          {sortedMembers.map((member, index) => {
            const initials = member.username
              .split(' ')
              .map(name => name[0])
              .join('')
              .toUpperCase();
              
            return (
              <li 
                key={member.id}
                className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
              >
                <div className="font-bold text-mono-gray w-6 text-center">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10 ml-3">
                  <AvatarImage src={member.avatar} alt={member.username} />
                  <AvatarFallback className="bg-mono-black text-mono-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-1">
                  <div className="font-medium">{member.username}</div>
                  <div className="text-xs text-mono-gray">Level {member.level}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Flame className="h-4 w-4" />
                    <span>{member.streak}</span>
                  </div>
                  <Badge className="bg-mono-lighter text-mono-black font-normal">
                    {member.points.toLocaleString()} pts
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClanMembers;
