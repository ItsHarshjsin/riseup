import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClan } from '@/hooks/useClan';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Users, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ClanDashboard() {
  const { userClan, clanMembers, loading } = useClan();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!userClan) return null;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(userClan.invite_code || '');
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Clan Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{userClan.name}</h1>
          <p className="text-muted-foreground">{userClan.description}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Clan
        </Button>
      </div>

      {/* Invite Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Code</CardTitle>
          <CardDescription>Share this code with friends to let them join your clan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <code className="bg-muted px-4 py-2 rounded-md text-lg font-mono">
              {userClan.invite_code}
            </code>
            <Button 
              variant="outline" 
              size="icon"
              onClick={copyInviteCode}
              className="h-10 w-10"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Clan Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Clan Stats</CardTitle>
          <CardDescription>Overview of your clan's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Points</span>
              <span className="font-bold">{userClan.points}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Members</span>
              <span className="font-bold">{clanMembers.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>Your clan members</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clanMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{member.username}</div>
                  <div className="text-sm text-muted-foreground">
                    Level {member.level} • {member.points} points
                  </div>
                </div>
                <div className="text-sm font-medium">{member.role}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 