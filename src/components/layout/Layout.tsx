
import React from "react";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-mono-white text-mono-black flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="border-t border-mono-light py-4 px-6 text-center text-mono-gray text-sm">
        <p>© 2025 Monochrome Mind. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
