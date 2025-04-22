import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-mono-white transition-colors duration-300">
      {!isLandingPage && <Header />}
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
        <div className="w-full h-full rounded-lg transition-all duration-300">
          {children}
        </div>
      </main>
      <footer className="border-t border-mono-light py-4 px-6">
        <div className="container mx-auto max-w-7xl text-center text-mono-gray text-sm">
          © {new Date().getFullYear()} RiseUp. All rights reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
