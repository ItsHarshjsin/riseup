
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ClanOverview from "@/components/clan/ClanOverview";
import ClanMembers from "@/components/clan/ClanMembers";
import ChallengeWheel from "@/components/clan/ChallengeWheel";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useClan } from "@/hooks/useClan";

const ClanPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userClan, 
    clanMembers,
    clanChallenges, 
    isLoadingClan, 
    isLoadingMembers,
    isLoadingChallenges,
    hasClan 
  } = useClan();
  
  if (isLoadingClan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-mono-gray">Loading clan data...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-2">Your Clan</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/clan-management")}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>{!hasClan ? "Create Clan" : "Manage Clan"}</span>
          </Button>
        </div>
        
        {!hasClan ? (
          <div className="bg-mono-lighter p-6 rounded-lg text-center space-y-4">
            <h2 className="text-xl font-medium">You're not part of a clan yet</h2>
            <p className="text-mono-gray max-w-md mx-auto">
              Join a clan to collaborate with friends, participate in challenges, and earn rewards together.
            </p>
            <Button 
              onClick={() => navigate("/clan-management")}
              className="mt-2"
            >
              Create or Join a Clan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ClanOverview 
                clan={userClan}
                challenges={clanChallenges}
                isLoading={isLoadingChallenges}
              />
              <ChallengeWheel clanId={userClan?.id} />
            </div>
            
            <div className="space-y-6">
              <ClanMembers 
                members={clanMembers}
                isLoading={isLoadingMembers}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClanPage;
