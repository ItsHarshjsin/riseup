
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mono-white flex flex-col">
      <header className="border-b border-mono-light py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-mono-black">RiseUp</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-mono-black hover:text-mono-gray transition-colors">
            Login
          </Link>
          <Button asChild className="bg-mono-black text-mono-white hover:bg-mono-dark transition-all">
            <Link to="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="min-h-[90vh] flex flex-col justify-center items-center px-4 py-20 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
              Rise Beyond <span className="text-mono-black border-b-4 border-mono-black">Limits</span>
            </h1>
            <p className="text-xl md:text-2xl text-mono-gray mb-10 max-w-2xl mx-auto">
              Track habits, build consistent streaks, and achieve personal growth with your own supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-mono-black text-mono-white hover:bg-mono-dark transition-all">
                <Link to="/dashboard" className="flex items-center gap-2 text-lg">
                  Start Your Journey <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-mono-black hover:bg-mono-lighter transition-all">
                <a href="#features" className="flex items-center gap-2 text-lg">
                  Learn More <ArrowDown className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <a href="#features" className="animate-bounce p-2">
              <ArrowDown className="h-8 w-8" />
            </a>
          </motion.div>
        </section>
        
        <section id="features" className="py-20 px-4 bg-mono-lighter">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="container mx-auto max-w-6xl"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">The Minimalist Path to Excellence</h2>
              <p className="text-xl text-mono-gray max-w-2xl mx-auto">
                Personal growth shouldn't be complicated. RiseUp simplifies your journey with a focused, monochrome approach.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="p-8 bg-mono-white border-2 border-mono-light hover:border-mono-black transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-6 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Daily Progress</h3>
                <p className="text-mono-gray text-center">Track your improvement with streak-based habit monitoring. Every day counts.</p>
              </motion.div>
              
              <motion.div variants={fadeIn} className="p-8 bg-mono-white border-2 border-mono-light hover:border-mono-black transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-6 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Clan System</h3>
                <p className="text-mono-gray text-center">Join forces with like-minded individuals. Even two members can form a powerful clan.</p>
              </motion.div>
              
              <motion.div variants={fadeIn} className="p-8 bg-mono-white border-2 border-mono-light hover:border-mono-black transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-6 border-2 border-mono-black rounded-full flex items-center justify-center">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Recognition</h3>
                <p className="text-mono-gray text-center">Earn badges and climb leaderboards as you consistently improve across different areas.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        <section className="py-24 px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="container mx-auto max-w-6xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeIn}>
                <h2 className="text-4xl font-bold mb-6">Share Your Growth Journey</h2>
                <p className="text-xl text-mono-gray mb-8">
                  Generate sleek, shareable profile cards that showcase your achievements and progress in an elegant black and white design.
                </p>
                <div className="space-y-6 mb-8">
                  <motion.div 
                    variants={fadeIn}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="text-xl font-medium">Customizable Profile Cards</h3>
                      <p className="text-mono-gray">Highlight your best achievements and current streaks</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="text-xl font-medium">Social Media Ready</h3>
                      <p className="text-mono-gray">Perfectly formatted for Instagram, Twitter, and LinkedIn</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-mono-black mt-0.5" />
                    <div>
                      <h3 className="text-xl font-medium">Professional Minimalist Design</h3>
                      <p className="text-mono-gray">Elegant black and white aesthetics that stand out</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                className="border-4 border-mono-black p-10 bg-mono-white relative"
              >
                <div className="aspect-square max-w-md mx-auto flex flex-col items-center justify-center">
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-4 border-mono-black bg-mono-white"></div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 border-4 border-mono-black bg-mono-white"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 border-4 border-mono-black bg-mono-white"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-4 border-mono-black bg-mono-white"></div>
                  
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto border-2 border-mono-black rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold">7</span>
                    </div>
                    <h3 className="text-2xl font-bold">Day Streak</h3>
                    <p className="text-mono-gray">Continue your journey to build lasting habits</p>
                    <div className="pt-4 border-t border-mono-light">
                      <p className="font-mono text-sm">@username • Level 5</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        <section className="py-20 px-4 bg-mono-black text-mono-white">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="container mx-auto max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold mb-8">Ready to Rise Up?</h2>
            <p className="text-xl mb-10 opacity-80">
              Join thousands of others who are transforming their habits and achieving personal growth one day at a time.
            </p>
            <Button asChild size="lg" className="bg-mono-white text-mono-black hover:bg-mono-light transition-all">
              <Link to="/dashboard" className="flex items-center gap-2 text-lg">
                Start Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
      
      <footer className="border-t border-mono-light py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">RiseUp</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-mono-gray hover:text-mono-black transition-colors">Privacy</a>
              <a href="#" className="text-mono-gray hover:text-mono-black transition-colors">Terms</a>
              <a href="#" className="text-mono-gray hover:text-mono-black transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-mono-gray text-sm">
            <p>© 2025 RiseUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
