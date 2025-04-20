
import React from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardProps {
  data?: {
    id: string;
    username: string;
    level: number;
    points: number;
    avatar?: string;
  }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  data = []
}) => {
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-mono-gray">No data available</p>
          </div>
        ) : (
          <ul className="divide-y divide-mono-light">
            {data.map((user, index) => {
              const initials = user.username
                ? user.username.split(' ').map(name => name[0]).join('').toUpperCase()
                : 'U';
              
              return (
                <li 
                  key={user.id}
                  className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
                >
                  <div className="font-bold text-mono-gray w-6 text-center">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10 ml-3">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-mono-black text-mono-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-mono-gray">Level {user.level}</div>
                  </div>
                  <Badge className="bg-mono-lighter text-mono-black font-normal">
                    {user.points?.toLocaleString() || 0} pts
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
