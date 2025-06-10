import { useState } from 'react';
import { useLobby } from '@/hooks/useLobby';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CreateClan() {
  const {
    onlineUsers,
    userChallenges,
    isLoading,
    createChallenge,
    respondToChallenge,
    completeChallenge,
  } = useLobby();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    category: '',
    points: 0,
  });

  const handleCreateChallenge = async () => {
    if (!selectedUser) return;
    
    await createChallenge.mutateAsync({
      challengedId: selectedUser,
      ...challengeForm,
    });

    setSelectedUser(null);
    setChallengeForm({
      title: '',
      description: '',
      category: '',
      points: 0,
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Online Users Section */}
        <div className="lg:col-span-4">
          <Card className="p-4">
            <h2 className="text-2xl font-bold mb-4">Online Users</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center">Loading users...</div>
                ) : onlineUsers.length === 0 ? (
                  <div className="text-center text-muted-foreground">No users online</div>
                ) : (
                  onlineUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.username}</p>
                          <Badge
                            variant={
                              user.status === 'online'
                                ? 'success'
                                : user.status === 'in_challenge'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="mt-1"
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedUser(user.id)}
                              disabled={user.status !== 'online'}
                            >
                              Challenge
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Challenge {user.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <Input
                                placeholder="Challenge Title"
                                value={challengeForm.title}
                                onChange={(e) =>
                                  setChallengeForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                              />
                              <Textarea
                                placeholder="Challenge Description"
                                value={challengeForm.description}
                                onChange={(e) =>
                                  setChallengeForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                              />
                              <Input
                                placeholder="Category (e.g., Fitness, Study, Skills)"
                                value={challengeForm.category}
                                onChange={(e) =>
                                  setChallengeForm((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                  }))
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Points (1-100)"
                                value={challengeForm.points}
                                min={1}
                                max={100}
                                onChange={(e) =>
                                  setChallengeForm((prev) => ({
                                    ...prev,
                                    points: parseInt(e.target.value) || 0,
                                  }))
                                }
                              />
                              <Button 
                                className="w-full" 
                                onClick={handleCreateChallenge}
                                disabled={!challengeForm.title || challengeForm.points <= 0}
                              >
                                Send Challenge
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Active Challenges Section */}
        <div className="lg:col-span-8">
          <Card className="p-4">
            <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center">Loading challenges...</div>
                ) : userChallenges.length === 0 ? (
                  <div className="text-center text-muted-foreground">No active challenges</div>
                ) : (
                  userChallenges.map((challenge) => (
                    <Card key={challenge.id} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{challenge.title}</h3>
                            <Badge>{challenge.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {challenge.description}
                          </p>
                          {challenge.category && (
                            <Badge variant="outline" className="mt-2">
                              {challenge.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{challenge.points} points</Badge>
                          </div>
                          <div className="space-x-2">
                            {challenge.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    respondToChallenge.mutate({
                                      challengeId: challenge.id,
                                      accept: false,
                                    })
                                  }
                                >
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    respondToChallenge.mutate({
                                      challengeId: challenge.id,
                                      accept: true,
                                    })
                                  }
                                >
                                  Accept
                                </Button>
                              </>
                            )}
                            {challenge.status === 'accepted' && (
                              <Button
                                size="sm"
                                onClick={() => completeChallenge.mutate(challenge.id)}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
} 