
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Loader2 } from "lucide-react";
import { User } from "@/types";

interface ClanMembersProps {
  members?: User[];
  isLoading?: boolean;
}

const ClanMembers: React.FC<ClanMembersProps> = ({ 
  members = [],
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="border-mono-light shadow-sm">
        <CardHeader className="border-b border-mono-light">
          <CardTitle className="text-xl font-bold">Clan Members</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  // Sort members by points
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Clan Members</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-mono-gray">No members found</p>
          </div>
        ) : (
          <ul className="divide-y divide-mono-light">
            {sortedMembers.map((member, index) => {
              const initials = member.username
                ? member.username.split(' ').map(name => name[0]).join('').toUpperCase()
                : 'U';
                
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
                    <div className="text-xs text-mono-gray">Level {member.level} • {member.role}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="h-4 w-4" />
                      <span>{member.streak || 0}</span>
                    </div>
                    <Badge className="bg-mono-lighter text-mono-black font-normal">
                      {member.points?.toLocaleString() || 0} pts
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ClanMembers;
