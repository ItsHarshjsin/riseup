
import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';

interface ShareCardProps {
  username?: string;
  level?: number;
  streak?: number;
  badges?: number;
  achievements?: string[];
  categories?: string[];
  profileImage?: string;
}

const ShareCard = ({
  username = currentUser.username,
  level = currentUser.level,
  streak = currentUser.streak,
  badges = currentUser.badges.length,
  achievements = currentUser.badges.slice(0, 3).map(badge => badge.name),
  categories = ["Productivity", "Learning", "Mindfulness"],
  profileImage = currentUser.avatar
}: ShareCardProps) => {
  const initials = username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

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
      <div className="border-2 border-black rounded-lg overflow-hidden">
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

      {/* Generate Card Section */}
      <Card className="border rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Generate Shareable Card</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Card
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Card
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShareCard;
