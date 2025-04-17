
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Share2 } from "lucide-react";
import { User } from "@/types";
import { currentUser } from "@/data/mockData";
import html2canvas from "html2canvas";

interface ProfileCardGenerateProps {
  user?: User;
}

const ProfileCardGenerate: React.FC<ProfileCardGenerateProps> = ({ user = currentUser }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const initials = user.username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  const topCategories = ["Productivity", "Learning", "Mindfulness"];
  
  const generateImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 2
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${user.username.replace(' ', '-')}-profile-card.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };
  
  const shareImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 2
      });
      
      const image = canvas.toDataURL("image/png");
      
      // For browsers that support navigator.share
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], "profile-card.png", { type: "image/png" });
        
        await navigator.share({
          title: `${user.username}'s Profile Card`,
          text: "Check out my progress on Monochrome Mind!",
          files: [file]
        });
      } else {
        // Fallback for browsers without share API
        const link = document.createElement("a");
        link.href = image;
        link.download = `${user.username.replace(' ', '-')}-profile-card.png`;
        link.click();
      }
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div ref={cardRef} className="bg-white p-5 rounded-lg max-w-md">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 rounded-xl border-2 border-mono-black">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-xl font-bold bg-mono-black text-mono-white rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <div className="flex flex-wrap gap-1">
              {topCategories.map(category => (
                <Badge key={category} variant="outline" className="bg-mono-lighter text-xs font-normal">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="border border-mono-light rounded-md p-2">
            <div className="text-2xl font-bold">{user.level}</div>
            <div className="text-xs uppercase text-mono-gray">Level</div>
          </div>
          <div className="border border-mono-light rounded-md p-2">
            <div className="text-2xl font-bold">{user.streak}</div>
            <div className="text-xs uppercase text-mono-gray">Day Streak</div>
          </div>
          <div className="border border-mono-light rounded-md p-2">
            <div className="text-2xl font-bold">{user.badges.length}</div>
            <div className="text-xs uppercase text-mono-gray">Badges</div>
          </div>
        </div>
        
        {user.badges.length > 0 && (
          <div className="mt-4 space-y-1">
            <h3 className="text-xs uppercase text-mono-gray font-medium">Top Achievements</h3>
            <div className="flex flex-wrap gap-1">
              {user.badges.slice(0, 3).map(badge => (
                <Badge key={badge.id} className="bg-mono-black text-mono-white text-xs">
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center text-xs text-mono-gray">
          MONOCHROME MIND
        </div>
      </div>
      
      <Card className="border-mono-light shadow-sm">
        <CardHeader className="border-b border-mono-light text-center">
          <h3 className="text-lg font-medium">Generate Shareable Card</h3>
        </CardHeader>
        <CardContent className="p-4 flex justify-center gap-4">
          <Button 
            onClick={generateImage}
            variant="outline" 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Card</span>
          </Button>
          <Button 
            onClick={shareImage}
            variant="outline" 
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Card</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCardGenerate;
