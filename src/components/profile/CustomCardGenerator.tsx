
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Share2, Image, Edit } from "lucide-react";
import html2canvas from "html2canvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface CustomCardGeneratorProps {
  user?: User;
}

const CustomCardGenerator: React.FC<CustomCardGeneratorProps> = ({
  user = currentUser,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [cardBackground, setCardBackground] = useState<string>("bg-mono-black");
  const [cardColor, setCardColor] = useState<string>("text-mono-white");
  const [customTitle, setCustomTitle] = useState<string>(user.username);

  const initials = user.username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const topCategories = ["Productivity", "Learning", "Mindfulness"];

  const generateImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${user.username.replace(" ", "-")}-profile-card.png`;
      link.click();
      
      toast({
        title: "Success!",
        description: "Your card has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");

      // For browsers that support navigator.share
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], "profile-card.png", { type: "image/png" });

        await navigator.share({
          title: `${user.username}'s Profile Card`,
          text: "Check out my progress on RiseUp!",
          files: [file],
        });
        
        toast({
          title: "Shared!",
          description: "Your card has been shared.",
        });
      } else {
        // Fallback for browsers without share API
        const link = document.createElement("a");
        link.href = image;
        link.download = `${user.username.replace(" ", "-")}-profile-card.png`;
        link.click();
        
        toast({
          title: "Downloaded!",
          description: "Browser doesn't support sharing, so we downloaded it instead.",
        });
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast({
        title: "Error",
        description: "Failed to share image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const bgOptions = [
    { value: "bg-mono-black", label: "Black" },
    { value: "bg-mono-white border border-mono-black", label: "White" },
    { value: "bg-neutral-800", label: "Dark Gray" },
    { value: "bg-neutral-200", label: "Light Gray" },
  ];

  const textOptions = [
    { value: "text-mono-white", label: "White" },
    { value: "text-mono-black", label: "Black" },
    { value: "text-neutral-400", label: "Gray" },
  ];

  return (
    <div className="space-y-6">
      <div ref={cardRef} className={`p-5 rounded-lg max-w-md ${cardBackground} ${cardColor}`}>
        <div className="flex items-center gap-4">
          <Avatar className={`h-20 w-20 rounded-xl border-2 ${cardColor === "text-mono-white" ? "border-mono-white" : "border-mono-black"}`}>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className={`text-xl font-bold ${cardColor === "text-mono-white" ? "bg-mono-white text-mono-black" : "bg-mono-black text-mono-white"} rounded-xl`}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">{customTitle}</h2>
            <div className="flex flex-wrap gap-1">
              {topCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className={`${cardColor === "text-mono-black" ? "bg-mono-lighter" : "bg-white/10"} text-xs font-normal`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className={`border ${cardColor === "text-mono-white" ? "border-white/20" : "border-mono-light"} rounded-md p-2`}>
            <div className="text-2xl font-bold">{user.level}</div>
            <div className={`text-xs uppercase ${cardColor === "text-mono-white" ? "text-white/60" : "text-mono-gray"}`}>Level</div>
          </div>
          <div className={`border ${cardColor === "text-mono-white" ? "border-white/20" : "border-mono-light"} rounded-md p-2`}>
            <div className="text-2xl font-bold">{user.streak}</div>
            <div className={`text-xs uppercase ${cardColor === "text-mono-white" ? "text-white/60" : "text-mono-gray"}`}>Day Streak</div>
          </div>
          <div className={`border ${cardColor === "text-mono-white" ? "border-white/20" : "border-mono-light"} rounded-md p-2`}>
            <div className="text-2xl font-bold">{user.badges.length}</div>
            <div className={`text-xs uppercase ${cardColor === "text-mono-white" ? "text-white/60" : "text-mono-gray"}`}>Badges</div>
          </div>
        </div>

        {user.badges.length > 0 && (
          <div className="mt-4 space-y-1">
            <h3 className={`text-xs uppercase ${cardColor === "text-mono-white" ? "text-white/60" : "text-mono-gray"} font-medium`}>
              Top Achievements
            </h3>
            <div className="flex flex-wrap gap-1">
              {user.badges.slice(0, 3).map((badge) => (
                <Badge
                  key={badge.id}
                  className={`${
                    cardColor === "text-mono-white"
                      ? "bg-white text-mono-black"
                      : "bg-mono-black text-mono-white"
                  } text-xs`}
                >
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-4 text-center text-xs ${cardColor === "text-mono-white" ? "text-white/60" : "text-mono-gray"}`}>
          RISEUP
        </div>
      </div>

      <Card className="border-mono-light shadow-sm">
        <CardHeader className="border-b border-mono-light">
          <CardTitle className="text-lg font-medium">Customize Card</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-mono-gray mb-1">
              Custom Title
            </label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter display name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-gray mb-1">
              Background Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bgOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`h-8 ${
                    cardBackground === option.value ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setCardBackground(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-gray mb-1">
              Text Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {textOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`h-8 ${
                    cardColor === option.value ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setCardColor(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-mono-light pt-4 justify-center gap-4">
          <Button onClick={generateImage} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Download Card</span>
          </Button>
          <Button onClick={shareImage} variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share Card</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomCardGenerator;
