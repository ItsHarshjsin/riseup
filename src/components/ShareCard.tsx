import React, { useState } from 'react';
import { Download, Share2, Edit, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { currentUser } from '@/data/mockData';
import { Textarea } from '@/components/ui/textarea';
import html2canvas from 'html2canvas';

// Demo achievements data
const DEMO_ACHIEVEMENTS = [
  { id: 1, name: "Early Bird", description: "Completed 5 tasks before 9 AM" },
  { id: 2, name: "Focus Master", description: "2 hours of focused work" },
  { id: 3, name: "Streak Hero", description: "Maintained a 7-day streak" },
  { id: 4, name: "Task Champion", description: "Completed 100 tasks" },
  { id: 5, name: "Mindfulness Guru", description: "30 days of meditation" },
  { id: 6, name: "Knowledge Seeker", description: "Completed 10 learning sessions" }
];

interface ShareCardProps {
  username?: string;
  level?: number;
  streak?: number;
  badges?: number;
  tagline?: string;
  profileImage?: string;
  onUpdate?: (data: any) => void;
}

const ShareCard = ({
  username = "Master Harsh !",
  level = 1,
  streak = 0,
  badges = 0,
  tagline = "Rising to new heights",
  profileImage = currentUser.avatar,
  onUpdate = () => {}
}: ShareCardProps) => {
  const { toast } = useToast();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customCaption, setCustomCaption] = useState("Check out my progress on RiseUp!");
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

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

  const toggleAchievement = (achievement: string) => {
    setSelectedAchievements(prev => {
      if (prev.includes(achievement)) {
        return prev.filter(a => a !== achievement);
      }
      if (prev.length >= 3) {
        toast({
          title: "Maximum 3 achievements",
          description: "Please deselect an achievement first",
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, achievement];
    });
  };

  return (
    <div className="max-w-sm mx-auto space-y-3">
      {/* Preview Card */}
      <Card className="bg-black aspect-video p-4 text-white" ref={setCardRef}>
        <div className="h-full flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-lg border border-white/20">
                <AvatarImage src={profileImage} alt={username} />
                <AvatarFallback className="bg-neutral-800">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold leading-tight">{username}</h3>
                <p className="text-sm text-white/60 italic">{tagline}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-white/10 rounded-lg p-2 text-center">
              <div className="text-xl font-bold">{level}</div>
              <div className="text-xs text-white/60 uppercase">Level</div>
            </div>
            <div className="border border-white/10 rounded-lg p-2 text-center">
              <div className="text-xl font-bold">{streak}</div>
              <div className="text-xs text-white/60 uppercase">Streak</div>
            </div>
            <div className="border border-white/10 rounded-lg p-2 text-center">
              <div className="text-xl font-bold">{badges}</div>
              <div className="text-xs text-white/60 uppercase">Badges</div>
            </div>
          </div>

          {/* Achievements */}
          {selectedAchievements.length > 0 && (
            <div>
              <h4 className="text-xs text-white/60 uppercase mb-1.5">Top Achievements</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedAchievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white text-black rounded-full text-xs font-medium"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-right">
            <span className="text-xs text-white/60">RiseUp</span>
          </div>
        </div>
      </Card>

      {/* Achievement Selection */}
      <Card className="p-3">
        <h3 className="text-sm font-medium mb-2">Select Achievements (max 3)</h3>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACHIEVEMENTS.map((achievement) => (
            <button
              key={achievement.id}
              onClick={() => toggleAchievement(achievement.name)}
              className={`p-2 text-left rounded-lg border transition-colors ${
                selectedAchievements.includes(achievement.name)
                  ? 'border-black bg-black/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-gray-500">{achievement.description}</div>
                </div>
                {selectedAchievements.includes(achievement.name) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-3">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={downloadCard} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={shareCard} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="w-full"
          >
            <Edit className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </Card>

      {/* Customization */}
      {isCustomizing && (
        <Card className="p-3">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => onUpdate({ tagline: e.target.value })}
                className="w-full mt-1 px-2 py-1.5 border rounded-md text-sm"
                placeholder="Add your personal tagline"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Share Message</label>
              <Textarea
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="Enter a custom message to share"
                className="mt-1 text-sm"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ShareCard;
