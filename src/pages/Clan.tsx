import React from "react";
import { Users, Trophy, Target, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Clan = () => {
  const clanMembers = [
    { id: 1, name: "JaneDoe", level: 7, role: "Leader", avatar: "/avatars/jane.jpg" },
    { id: 2, name: "AlexChen", level: 5, role: "Member", avatar: "/avatars/alex.jpg" },
    { id: 3, name: "SarahOwen", level: 6, role: "Member", avatar: "/avatars/sarah.jpg" },
  ];

  const activeChallenges = [
    {
      id: 1,
      title: "Daily Meditation",
      description: "Meditate for at least 10 minutes every day",
      points: 100,
      progress: 65,
      participants: ["J", "A"],
    },
    {
      id: 2,
      title: "Code Challenge",
      description: "Solve one coding problem each day",
      points: 150,
      progress: 80,
      participants: ["J", "S"],
    },
  ];

  const clanStats = {
    totalPoints: "2,980",
    rank: "#28",
    completionRate: "92%",
    activeMembers: "3/5",
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Clan Header */}
      <div className="relative rounded-xl bg-black text-white p-6 md:p-8 overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Growth Mindset</h1>
              <p className="text-neutral-400">A group dedicated to constant improvement and daily growth</p>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Invite Members
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div>
              <div className="text-2xl font-bold">{clanStats.totalPoints}</div>
              <div className="text-sm text-neutral-400">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{clanStats.rank}</div>
              <div className="text-sm text-neutral-400">Global Rank</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{clanStats.completionRate}</div>
              <div className="text-sm text-neutral-400">Completion Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{clanStats.activeMembers}</div>
              <div className="text-sm text-neutral-400">Active Members</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Members</CardTitle>
                <Button variant="ghost" size="sm" className="text-mono-gray hover:text-mono-black">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clanMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-mono-light hover:border-mono-dark transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-mono-gray">Level {member.level} • {member.role}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Active Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeChallenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{challenge.title}</h3>
                        <p className="text-sm text-mono-gray">{challenge.description}</p>
                      </div>
                      <div className="text-sm font-medium">{challenge.points} pts</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex -space-x-2">
                          {challenge.participants.map((initial, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-mono-light flex items-center justify-center text-xs font-medium ring-2 ring-white"
                            >
                              {initial}
                            </div>
                          ))}
                        </div>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Tasks Completed</div>
                  <div className="text-2xl font-bold">42/50</div>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-sm text-mono-gray">
                  The clan has completed 84% of this week's tasks. Keep it up!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-mono-light">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Weekend Challenge</div>
                    <div className="text-sm text-mono-gray">In 2 days</div>
                  </div>
                  <p className="text-sm text-mono-gray mb-3">
                    Complete all daily tasks for double points
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Set Reminder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clan; 