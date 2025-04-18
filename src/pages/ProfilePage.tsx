
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProfileCard from "@/components/profile/ProfileCard";
import CustomCardGenerator from "@/components/profile/CustomCardGenerator";
import ShareCard from "@/components/ShareCard";
import ProfileCustomization from "@/components/profile/ProfileCustomization";
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
import { User } from "@/types";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<User>(currentUser);
  
  const handleProfileUpdate = (updatedProfile: Partial<User>) => {
    setUserData({
      ...userData,
      ...updatedProfile
    });
  };
  
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
              value="customization"
              className={`flex-1 rounded-none ${
                activeTab === "customization" 
                  ? "border-b-2 border-mono-black" 
                  : "text-mono-gray"
              }`}
            >
              Customization
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
                <ProfileCard 
                  user={userData} 
                  shareable={false} 
                />
                
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
                        <span className="font-medium">{userData.level}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Current Streak</span>
                        <span className="font-medium">{userData.streak} days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Total Points</span>
                        <span className="font-medium">{userData.points.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Tasks Completed</span>
                        <span className="font-medium">{userData.completedTasks.length}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-mono-gray">Badges Earned</span>
                        <span className="font-medium">{userData.badges.length}</span>
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
          
          <TabsContent value="customization" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ProfileCustomization 
                  user={userData}
                  onUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ShareCard
                  username={userData.username}
                  level={userData.level}
                  streak={userData.streak}
                  badges={userData.badges.length}
                  achievements={userData.badges.slice(0, 3).map(badge => badge.name)}
                  profileImage={userData.avatar}
                />
              </div>
              <div className="space-y-6">
                <Card className="border-mono-light shadow-sm">
                  <CardHeader className="border-b border-mono-light">
                    <CardTitle className="text-xl font-bold">Custom Share Card</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-mono-gray mb-4">
                      Create and customize your profile card to showcase your progress and achievements.
                      Download or share this card on social media.
                    </p>
                    <CustomCardGenerator user={userData} />
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
