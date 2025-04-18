
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from './profile/Logo';

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
  const initials = username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={profileImage} alt={username} />
            <AvatarFallback className="bg-white/10">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold mb-2">{username}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span 
                  key={category} 
                  className="px-3 py-1 rounded-full text-sm bg-white/10"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{level}</div>
            <div className="text-xs text-white/60 uppercase">Level</div>
          </div>
          <div className="border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-white/60 uppercase">Day Streak</div>
          </div>
          <div className="border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{badges}</div>
            <div className="text-xs text-white/60 uppercase">Badges</div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <div className="text-sm text-white/60 uppercase mb-2">Top Achievements</div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <span
                  key={achievement}
                  className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Logo */}
        <Logo />
      </div>
    </div>
  );
};

export default ShareCard;
