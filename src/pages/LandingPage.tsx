import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, Target, Star, Shield, Zap, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl tracking-tight">RiseUp</Link>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm hover:text-neutral-500">Sign in</Link>
            <Link 
              to="/dashboard" 
              className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-neutral-800 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl font-bold tracking-tight"
            >
              Transform Your Daily Habits into Lasting Success
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
            >
              Join a community of achievers who turn small daily actions into extraordinary results. 
              Track progress, compete in clans, and build lasting habits together.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                to="/dashboard"
                className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Start Your Journey
              </Link>
              <a
                href="#features"
                className="border-2 border-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-neutral-200 py-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-neutral-600 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-neutral-600 mt-1">Active Clans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-sm text-neutral-600 mt-1">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">92%</div>
              <div className="text-sm text-neutral-600 mt-1">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 bg-neutral-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl font-bold">Powerful Tools for Real Growth</h2>
            <p className="mt-4 text-neutral-600">
              Everything you need to build lasting habits, stay accountable, and achieve your goals with a community that supports you.
            </p>
          </motion.div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="w-5 h-5" />}
              title="Smart Goal Setting"
              description="Set SMART goals and break them down into actionable daily tasks. Watch your progress compound over time."
              color="bg-neutral-900"
            />
            <FeatureCard 
              icon={<Shield className="w-5 h-5" />}
              title="Clan Challenges"
              description="Join forces with like-minded individuals in clans. Compete, support, and grow together through daily challenges."
              color="bg-neutral-900"
            />
            <FeatureCard 
              icon={<BarChart className="w-5 h-5" />}
              title="Progress Analytics"
              description="Track your growth with detailed analytics. Understand your patterns and optimize your habits for success."
              color="bg-neutral-900"
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Your Journey to Excellence</h2>
            <p className="text-neutral-600">
              A simple yet powerful system that helps you build and maintain positive habits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              number="01"
              title="Set Your Goals"
              description="Choose your focus areas and set meaningful goals. We'll help you break them down into achievable daily tasks."
            />
            <StepCard 
              number="02"
              title="Join a Clan"
              description="Connect with others who share your goals. Participate in challenges and keep each other accountable."
            />
            <StepCard 
              number="03"
              title="Track & Improve"
              description="Monitor your progress, earn achievements, and adjust your strategies based on real data."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold">Ready to Rise Above?</h2>
            <p className="mt-4 text-neutral-400">
              Join thousands of others who are transforming their lives through consistent daily action.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-neutral-400 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <Link
                to="/dashboard"
                className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="font-semibold mb-4">RiseUp</div>
              <p className="text-sm text-neutral-600">Elevate your daily habits.</p>
            </div>
            <div>
              <div className="font-medium mb-4">Product</div>
              <FooterLinks items={["Features", "Pricing", "Integrations", "FAQ"]} />
            </div>
            <div>
              <div className="font-medium mb-4">Company</div>
              <FooterLinks items={["About", "Blog", "Careers", "Contact"]} />
            </div>
            <div>
              <div className="font-medium mb-4">Legal</div>
              <FooterLinks items={["Privacy", "Terms", "Security", "Cookies"]} />
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-16 pt-8 text-center text-sm text-neutral-500">
            © 2024 RiseUp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, title, description, color }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
    >
      <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white text-lg font-medium mb-6">
        {number}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  );
}

function FooterLinks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item}>
          <a href="#" className="text-sm text-neutral-600 hover:text-black transition-colors">
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default LandingPage;
