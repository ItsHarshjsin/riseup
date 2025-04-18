
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentClan, currentUser } from "@/data/mockData";
import ClanMembers from "@/components/clan/ClanMembers";
import CreateClan from "@/components/clan/CreateClan";
import InviteFriends from "@/components/clan/InviteFriends";
import CreateChallenge from "@/components/clan/CreateChallenge";
import { Users, UserPlus, Trophy, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ClanManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasClan, setHasClan] = useState(!!currentUser.clanId);
  const [clanName, setClanName] = useState(currentClan?.name || "");
  
  const handleClanCreated = (name: string) => {
    setHasClan(true);
    setClanName(name);
    setActiveTab("invite");
  };
  
  const handleChallengeCreated = () => {
    setActiveTab("overview");
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-2">Clan Management</h1>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/clan")}
          >
            <Home className="h-4 w-4" />
            <span>Back to Clan</span>
          </Button>
        </div>
        
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 lg:grid-cols-4 w-full">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2"
              disabled={!hasClan}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invite" 
              className="flex items-center gap-2"
              disabled={!hasClan}
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Invite Friends</span>
            </TabsTrigger>
            <TabsTrigger 
              value="challenge" 
              className="flex items-center gap-2"
              disabled={!hasClan}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Create Challenge</span>
            </TabsTrigger>
            {!hasClan && (
              <TabsTrigger 
                value="create" 
                className="flex items-center gap-2 col-span-4"
              >
                Create a New Clan
              </TabsTrigger>
            )}
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ClanMembers />
                </div>
                <div>
                  {/* Maybe add clan stats or challenge progress here */}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="invite" className="m-0">
              <div className="max-w-md mx-auto">
                <InviteFriends clanName={clanName} />
              </div>
            </TabsContent>
            
            <TabsContent value="challenge" className="m-0">
              <div className="max-w-2xl mx-auto">
                <CreateChallenge onCreated={handleChallengeCreated} />
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="m-0">
              <div className="max-w-md mx-auto">
                <CreateClan onCreated={handleClanCreated} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClanManagementPage;
