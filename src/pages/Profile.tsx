import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <div className="px-6 py-2 text-sm font-medium border-b-2 border-black">
              Profile
            </div>
            <div className="px-6 py-2 text-sm font-medium text-gray-500">
              Share Card
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Digital Share Card Section */}
          <Card className="border rounded-lg mb-4">
            <div className="border-b p-6">
              <h2 className="text-xl font-bold mb-2">Digital Share Card</h2>
              <p className="text-gray-600">
                Generate a shareable profile card to showcase your progress and achievements. 
                Download or share this card on social media.
              </p>
            </div>

            {/* Card Preview */}
            <div className="p-6">
              <div className="bg-[#000000] rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                      <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">JaneDoe</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 border border-white/20 rounded-full text-sm text-white">Productivity</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-sm text-white">Learning</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-sm text-white">Mindfulness</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="border border-white/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">7</div>
                      <div className="text-xs text-white/60">LEVEL</div>
                    </div>
                    <div className="border border-white/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">15</div>
                      <div className="text-xs text-white/60">DAY STREAK</div>
                    </div>
                    <div className="border border-white/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">2</div>
                      <div className="text-xs text-white/60">BADGES</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm text-white/60 mb-2">TOP ACHIEVEMENTS</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium">Fitness Enthusiast</span>
                      <span className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium">Streak Master</span>
                    </div>
                  </div>

                  <div className="text-sm text-white/60 text-center mt-6">
                    MONOCHROME MIND
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Generate Card Section */}
          <Card className="border rounded-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">Generate Shareable Card</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full h-11 text-sm font-medium">
                  <Download className="h-4 w-4 mr-2" />
                  Download Card
                </Button>
                <Button variant="outline" className="w-full h-11 text-sm font-medium">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Card
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Customize Card Section */}
      <div className="hidden">
        <Card className="mt-6 p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Customize Your Card</h2>
          <p className="text-gray-600 mb-6">
            Your profile card automatically highlights your top achievements and stats.
            Keep completing tasks and challenges to unlock more badges and improve your stats!
          </p>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Custom card layouts</li>
              <li>• Custom typography</li>
              <li>• Badge selection</li>
              <li>• Additional stats to display</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 