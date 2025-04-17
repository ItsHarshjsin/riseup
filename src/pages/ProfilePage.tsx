
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileCardGenerate from "@/components/profile/ProfileCardGenerate";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import { currentUser } from "@/data/mockData";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        
        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b border-mono-light rounded-none mb-6">
            <TabsTrigger 
              value="profile" 
              className={`flex-1 rounded-none ${
                activeTab === "profile" 
                  ? "border-b-2 border-mono-black" 
                  : "text-mono-gray"
              }`}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="share"
              className={`flex-1 rounded-none ${
                activeTab === "share" 
                  ? "border-b-2 border-mono-black" 
                  : "text-mono-gray"
              }`}
            >
              Share Card
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <ProfileCard shareable={false} />
                
                <Card className="border-mono-light shadow-sm">
                  <CardHeader className="border-b border-mono-light">
                    <CardTitle className="text-xl font-bold">Focus Areas</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-mono-lighter px-3 py-2">Productivity</Badge>
                      <Badge variant="outline" className="bg-mono-lighter px-3 py-2">Learning</Badge>
                      <Badge variant="outline" className="bg-mono-lighter px-3 py-2">Mindfulness</Badge>
                      <Badge variant="outline" className="bg-mono-lighter px-3 py-2">Fitness</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-mono-light shadow-sm">
                  <CardHeader className="border-b border-mono-light">
                    <CardTitle className="text-xl font-bold">Stats at a Glance</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Level</span>
                        <span className="font-medium">{currentUser.level}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Current Streak</span>
                        <span className="font-medium">{currentUser.streak} days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Total Points</span>
                        <span className="font-medium">{currentUser.points.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Tasks Completed</span>
                        <span className="font-medium">{currentUser.completedTasks.length}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Badges Earned</span>
                        <span className="font-medium">{currentUser.badges.length}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <BadgeGrid showLocked={true} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="border-mono-light shadow-sm">
                  <CardHeader className="border-b border-mono-light">
                    <CardTitle className="text-xl font-bold">Digital Share Card</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-mono-gray mb-4">
                      Generate a shareable profile card to showcase your progress and achievements.
                      Download or share this card on social media.
                    </p>
                    <ProfileCardGenerate />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="border-mono-light shadow-sm">
                  <CardHeader className="border-b border-mono-light">
                    <CardTitle className="text-xl font-bold">Customize Your Card</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-mono-gray mb-4">
                      Your profile card automatically highlights your top achievements and stats.
                      Keep completing tasks and challenges to unlock more badges and improve your stats!
                    </p>
                    <div className="bg-mono-lighter p-4 rounded-md">
                      <h3 className="font-medium mb-2">Coming Soon</h3>
                      <ul className="list-disc list-inside text-mono-gray space-y-1 text-sm">
                        <li>Custom card layouts</li>
                        <li>Custom typography</li>
                        <li>Badge selection</li>
                        <li>Additional stats to display</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
