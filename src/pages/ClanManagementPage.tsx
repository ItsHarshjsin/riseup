import * as React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClanMembers from "@/components/clan/ClanMembers";
import CreateClan from "@/components/clan/CreateClan";
import InviteFriends from "@/components/clan/InviteFriends";
import CreateChallenge from "@/components/clan/CreateChallenge";
import { Users, UserPlus, Trophy, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useClan } from "@/hooks/useClan";

const ClanManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    userClan, 
    clanMembers, 
    isLoadingClan, 
    isLoadingMembers,
    createClan,
    createChallenge,
    inviteUser,
    isCreating,
    hasClan
  } = useClan();
  
  // Set initial active tab based on clan status
  useEffect(() => {
    if (!hasClan && !isLoadingClan) {
      setActiveTab("create");
    }
  }, [hasClan, isLoadingClan]);
  
  const handleClanCreated = (name: string, description: string) => {
    createClan.mutate({ name, description });
    setActiveTab("invite");
  };
  
  const handleChallengeCreated = (challenge: { 
    title: string; 
    description: string; 
    category: string; 
    points: number; 
    deadline: Date | null;
    participants: string[];
  }) => {
    createChallenge.mutate(challenge);
    setActiveTab("overview");
  };
  
  const handleInviteSent = (email: string) => {
    inviteUser.mutate(email);
  };
  
  if (isLoadingClan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-mono-gray">Loading clan data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clan Management</h1>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/clan")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Clan
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {hasClan && (
            <>
              <TabsTrigger value="overview">
                <Users className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="invite">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </TabsTrigger>
              <TabsTrigger value="challenges">
                <Trophy className="h-4 w-4 mr-2" />
                Challenges
              </TabsTrigger>
            </>
          )}
          {!hasClan && (
            <TabsTrigger value="create">Create Clan</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <ClanMembers 
            members={clanMembers}
            isLoading={isLoadingMembers}
            showControls
          />
        </TabsContent>
        
        <TabsContent value="invite" className="mt-6">
          <InviteFriends 
            clanName={userClan?.name || ''} 
            onInvite={handleInviteSent}
          />
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-6">
          <CreateChallenge 
            onSubmit={handleChallengeCreated}
            isLoading={isCreating}
          />
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <CreateClan 
            onSubmit={handleClanCreated}
            isLoading={isCreating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClanManagementPage;
