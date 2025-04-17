
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mono-white flex flex-col">
      <header className="border-b border-mono-light py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-mono-black">MONOCHROME MIND</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-mono-black hover:text-mono-gray transition-colors">
            Login
          </Link>
          <Button asChild className="bg-mono-black text-mono-white hover:bg-mono-dark">
            <Link to="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold leading-tight mb-6">
                  Build Better Habits, Together
                </h1>
                <p className="text-xl text-mono-gray mb-8">
                  Monochrome Mind helps you track habits, build streaks, and team up with others to achieve your personal growth goals.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="font-medium">Daily Progress Tracking</h3>
                      <p className="text-mono-gray">Monitor your improvement with streak-based tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="font-medium">Join Small Clans</h3>
                      <p className="text-mono-gray">Create or join a clan, even with just 2 members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="font-medium">Shareable Profile Cards</h3>
                      <p className="text-mono-gray">Generate sleek black-and-white profile cards to share your progress</p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-mono-black text-mono-white hover:bg-mono-dark">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Start Your Journey <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="border-2 border-mono-black p-8 bg-mono-white">
                <div className="aspect-square max-w-md mx-auto flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto border-2 border-mono-black rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">7</span>
                    </div>
                    <h3 className="text-xl font-bold">Day Streak</h3>
                    <p className="text-mono-gray">Continue your journey to build lasting habits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-mono-lighter">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-12">The Minimalist Approach to Self-Improvement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-mono-white border border-mono-light">
                <div className="w-12 h-12 mx-auto mb-4 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Track Daily Tasks</h3>
                <p className="text-mono-gray">Complete daily tasks tailored to your improvement areas</p>
              </div>
              <div className="p-6 bg-mono-white border border-mono-light">
                <div className="w-12 h-12 mx-auto mb-4 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Build Your Clan</h3>
                <p className="text-mono-gray">Create challenges and grow alongside friends</p>
              </div>
              <div className="p-6 bg-mono-white border border-mono-light">
                <div className="w-12 h-12 mx-auto mb-4 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Earn Recognition</h3>
                <p className="text-mono-gray">Collect badges and climb leaderboards as you improve</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-mono-light py-4 px-6 text-center text-mono-gray text-sm">
        <p>© 2025 Monochrome Mind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
