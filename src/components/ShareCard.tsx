
import React, { useState } from 'react';
import { Download, Share2, Camera, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { currentUser } from '@/data/mockData';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  username?: string;
  level?: number;
  streak?: number;
  badges?: number;
  achievements?: string[];
  categories?: string[];
  profileImage?: string;
  onUpdate?: (data: any) => void;
}

const ShareCard = ({
  username = currentUser.username,
  level = currentUser.level,
  streak = currentUser.streak,
  badges = currentUser.badges.length,
  achievements = currentUser.badges.slice(0, 3).map(badge => badge.name),
  categories = ["Productivity", "Learning", "Mindfulness"],
  profileImage = currentUser.avatar,
  onUpdate = () => {}
}: ShareCardProps) => {
  const { toast } = useToast();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customCaption, setCustomCaption] = useState("Check out my progress on RiseUp!");
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  const initials = username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const downloadCard = async () => {
    if (!cardRef) return;
    
    try {
      const canvas = await html2canvas(cardRef, {
        backgroundColor: "#000000",
        scale: 2
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${username.replace(' ', '-')}-share-card.png`;
      link.click();
      
      toast({
        title: "Success!",
        description: "Your share card has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to download card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareCard = async () => {
    if (!cardRef) return;
    
    try {
      const canvas = await html2canvas(cardRef, {
        backgroundColor: "#000000",
        scale: 2
      });
      
      const image = canvas.toDataURL("image/png");
      
      // For browsers that support navigator.share
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], "share-card.png", { type: "image/png" });
        
        await navigator.share({
          title: `${username}'s RiseUp Card`,
          text: customCaption,
          files: [file]
        });
        
        toast({
          title: "Shared!",
          description: "Your card has been shared.",
        });
      } else {
        // Fallback for browsers without share API
        const link = document.createElement("a");
        link.href = image;
        link.download = `${username.replace(' ', '-')}-share-card.png`;
        link.click();
        
        toast({
          title: "Downloaded!",
          description: "Your browser doesn't support sharing directly, so we downloaded it instead.",
        });
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast({
        title: "Error",
        description: "Failed to share card. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Digital Share Card</h2>
        <p className="text-gray-600">
          Generate a shareable profile card to showcase your progress and achievements. 
          Download or share this card on social media.
        </p>
      </div>

      {/* Preview Card */}
      <div className="border-2 border-black rounded-lg overflow-hidden" ref={setCardRef}>
        <div className="bg-black text-white p-6">
          <div className="flex flex-col space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-lg border border-white/20">
                <AvatarImage src={profileImage} alt={username} />
                <AvatarFallback className="bg-neutral-800 text-white text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold mb-2">{username}</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span key={category} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{level}</div>
                <div className="text-xs text-white/60">LEVEL</div>
              </div>
              <div className="border border-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-white/60">DAY STREAK</div>
              </div>
              <div className="border border-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{badges}</div>
                <div className="text-xs text-white/60">BADGES</div>
              </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div>
                <div className="text-sm text-white/60 mb-2">TOP ACHIEVEMENTS</div>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement) => (
                    <span key={achievement} className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Brand */}
            <div className="text-right">
              <div className="text-sm text-white/60">
                RiseUp
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Section */}
      {isCustomizing && (
        <Card className="border rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">Customize Sharing Message</h3>
            <Textarea
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="Enter a custom message to share with your card"
              className="min-h-[100px] w-full mb-4"
            />
          </div>
        </Card>
      )}

      {/* Generate Card Section */}
      <Card className="border rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Generate Shareable Card</h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={downloadCard}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Card
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={shareCard}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Card
            </Button>
          </div>
          <Button 
            variant="ghost" 
            className="w-full text-sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isCustomizing ? "Hide Customization" : "Customize Share Message"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ShareCard;
