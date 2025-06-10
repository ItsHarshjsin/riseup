import * as React from 'react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Clan from "@/pages/Clan";
import ClanPage from "@/pages/ClanPage";
import ClanManagementPage from "@/pages/ClanManagementPage";
import Achievements from "@/pages/Achievements";
import Stats from "@/pages/Stats";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-mono-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/profile" replace />} />
      <Route path="/profile" element={
        user ? (
          <Layout>
            <ProfilePage />
          </Layout>
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/clan"
        element={
          user ? (
            <Layout>
              <ClanPage />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/clan-management"
        element={
          user ? (
            <Layout>
              <ClanManagementPage />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/achievements"
        element={
          user ? (
            <Layout>
              <Achievements />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/stats"
        element={
          user ? (
            <Layout>
              <Stats />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
