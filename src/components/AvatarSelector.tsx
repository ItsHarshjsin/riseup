import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Predefined black and white anime-style avatars
const PRESET_AVATARS = [
  {
    id: 1,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Sakura&backgroundColor=ffffff&hair=long01,long02,long03&hairColor=000000&eyes=variant01,variant02&mouth=variant01,variant02&skinColor=ffffff",
    alt: "Anime 1"
  },
  {
    id: 2,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Yuki&backgroundColor=ffffff&hair=long04,long05&hairColor=000000&eyes=variant03,variant04&mouth=variant03,variant04&skinColor=ffffff",
    alt: "Anime 2"
  },
  {
    id: 3,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Hiro&backgroundColor=ffffff&hair=short01,short02,short03&hairColor=000000&eyes=variant05,variant06&mouth=variant05,variant06&skinColor=ffffff",
    alt: "Anime 3"
  },
  {
    id: 4,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Kai&backgroundColor=ffffff&hair=short04,short05&hairColor=000000&eyes=variant07,variant08&mouth=variant07,variant08&skinColor=ffffff",
    alt: "Anime 4"
  },
  {
    id: 5,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Mei&backgroundColor=ffffff&hair=long06,long07&hairColor=000000&eyes=variant09,variant10&mouth=variant09,variant10&skinColor=ffffff",
    alt: "Anime 5"
  },
  {
    id: 6,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Ryu&backgroundColor=ffffff&hair=short06,short07&hairColor=000000&eyes=variant11,variant12&mouth=variant11,variant12&skinColor=ffffff",
    alt: "Anime 6"
  },
  {
    id: 7,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Rin&backgroundColor=ffffff&hair=long08,long09&hairColor=000000&eyes=variant13,variant14&mouth=variant13,variant14&skinColor=ffffff",
    alt: "Anime 7"
  },
  {
    id: 8,
    url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Akira&backgroundColor=ffffff&hair=short08,short09&hairColor=000000&eyes=variant15,variant16&mouth=variant15,variant16&skinColor=ffffff",
    alt: "Anime 8"
  }
];

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  onAvatarSelect: (avatarUrl: string) => void;
  className?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarSelect,
  className
}) => {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="text-sm font-medium">Select Your Avatar</div>
      <ScrollArea className="h-[200px] rounded-md border-2 border-black p-4 bg-white">
        <div className="grid grid-cols-4 gap-6">
          {PRESET_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onAvatarSelect(avatar.url)}
              className={cn(
                "group relative transition-all duration-200",
                "p-1 rounded-lg",
                "border-2 border-black hover:border-neutral-600",
                currentAvatar === avatar.url ? "bg-neutral-100" : "bg-white",
                "hover:scale-105 transform"
              )}
            >
              <div className="relative w-full aspect-square">
                <Avatar className="w-full h-full border-2 border-black">
                  <AvatarImage 
                    src={avatar.url} 
                    alt={avatar.alt}
                    className="grayscale contrast-150"
                  />
                  <AvatarFallback className="bg-white text-black border-2 border-black">
                    {avatar.alt.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {currentAvatar === avatar.url && (
                  <div className="absolute inset-0 border-4 border-black rounded-lg pointer-events-none" />
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AvatarSelector; 