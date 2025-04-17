
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Users } from "lucide-react";
import { clans, users } from "@/data/mockData";

const Leaderboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("individual");
  
  // Sort users by points
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  
  // Sort clans by points
  const sortedClans = [...clans].sort((a, b) => b.points - a.points);
  
  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="bg-mono-black text-mono-white p-1 rounded-full">
            <Trophy className="h-4 w-4" />
          </div>
        );
      case 2:
        return (
          <div className="bg-mono-dark text-mono-white p-1 rounded-full">
            <Medal className="h-4 w-4" />
          </div>
        );
      case 3:
        return (
          <div className="bg-mono-gray text-mono-white p-1 rounded-full">
            <Medal className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="font-bold text-mono-gray w-6 text-center">
            {position}
          </div>
        );
    }
  };
  
  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Leaderboards</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="individual" onValueChange={setSelectedTab}>
          <TabsList className="w-full border-b border-mono-light rounded-none">
            <TabsTrigger 
              value="individual" 
              className={`flex-1 rounded-none ${
                selectedTab === "individual" 
                  ? "border-b-2 border-mono-black" 
                  : "text-mono-gray"
              }`}
            >
              Individual
            </TabsTrigger>
            <TabsTrigger 
              value="clan"
              className={`flex-1 rounded-none ${
                selectedTab === "clan" 
                  ? "border-b-2 border-mono-black" 
                  : "text-mono-gray"
              }`}
            >
              Clans
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-0">
            <ul className="divide-y divide-mono-light">
              {sortedUsers.map((user, index) => {
                const initials = user.username
                  .split(' ')
                  .map(name => name[0])
                  .join('')
                  .toUpperCase();
                  
                return (
                  <li 
                    key={user.id}
                    className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
                  >
                    {getPositionBadge(index + 1)}
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
                      {user.points.toLocaleString()} pts
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </TabsContent>
          
          <TabsContent value="clan" className="mt-0">
            <ul className="divide-y divide-mono-light">
              {sortedClans.map((clan, index) => (
                <li 
                  key={clan.id}
                  className="p-4 flex items-center hover:bg-mono-lighter transition-colors"
                >
                  {getPositionBadge(index + 1)}
                  <div className="h-10 w-10 ml-3 bg-mono-lighter rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{clan.name}</div>
                    <div className="text-xs text-mono-gray">{clan.members.length} members</div>
                  </div>
                  <Badge className="bg-mono-lighter text-mono-black font-normal">
                    {clan.points.toLocaleString()} pts
                  </Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
