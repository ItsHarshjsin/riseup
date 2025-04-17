import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface ShareCardProps {
  username: string;
  level: number;
  streak: number;
  badges: number;
  achievements: string[];
  categories: string[];
  profileImage?: string;
}

const ShareCard = ({
  username,
  level,
  streak,
  badges,
  achievements,
  categories,
  profileImage
}: ShareCardProps) => {
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
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt={username} className="object-cover rounded-lg" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
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
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-black">{level}</div>
                <div className="text-xs text-gray-600">LEVEL</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-black">{streak}</div>
                <div className="text-xs text-gray-600">DAY STREAK</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-black">{badges}</div>
                <div className="text-xs text-gray-600">BADGES</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="text-sm text-white/60 mb-2">TOP ACHIEVEMENTS</div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement) => (
                  <span key={achievement} className="px-3 py-1 bg-black border border-white/20 rounded-full text-sm text-white">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white/80 font-mono transform -rotate-6">
                RiseUp!
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