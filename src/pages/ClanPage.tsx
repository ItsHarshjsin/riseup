import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useClan } from '@/hooks/useClan';
import { Loader2 } from 'lucide-react';

function CreateClanTab() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createClan } = useClan();

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createClan.mutateAsync({
      name: name.trim(),
      description: description.trim()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Clan</CardTitle>
        <CardDescription>
          Start your own clan and invite others to join you on your journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Clan Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={createClan.isPending}
          />
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Clan Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createClan.isPending}
          />
        </div>
        <Button
          onClick={handleCreate}
          className="w-full"
          disabled={!name.trim() || createClan.isPending}
        >
          {createClan.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Clan'
          )}
        </Button>
        {createClan.error && (
          <p className="text-sm text-red-500 mt-2">
            {createClan.error instanceof Error ? createClan.error.message : 'An error occurred'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function JoinClanTab() {
  const [inviteCode, setInviteCode] = useState('');
  const { joinClan } = useClan();

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    await joinClan.mutateAsync(inviteCode.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join a Clan</CardTitle>
        <CardDescription>
          Enter an invite code to join an existing clan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          disabled={joinClan.isPending}
        />
        <Button
          onClick={handleJoin}
          className="w-full"
          disabled={!inviteCode.trim() || joinClan.isPending}
        >
          {joinClan.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Clan'
          )}
        </Button>
        {joinClan.error && (
          <p className="text-sm text-red-500 mt-2">
            {joinClan.error instanceof Error ? joinClan.error.message : 'An error occurred'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ClanDashboard({ clan }: { clan: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{clan.name}</CardTitle>
          <CardDescription>{clan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Clan Points</p>
              <p className="text-2xl font-bold">{clan.points}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Invite Code</p>
              <p className="text-2xl font-mono">{clan.invite_code}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clan.members?.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {member.avatar && (
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClanPage() {
  const { userClan, isLoading } = useClan();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (userClan) {
    return <ClanDashboard clan={userClan} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Clan</TabsTrigger>
          <TabsTrigger value="join">Join Clan</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-4">
          <CreateClanTab />
        </TabsContent>
        <TabsContent value="join" className="mt-4">
          <JoinClanTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
