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

const queryClient = new QueryClient();

const App: React.FC = () => {
  const isAuthenticated = true; // This should be handled by your auth system

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={
              isAuthenticated ? (
                <Layout>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Dashboard />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/clan"
              element={
                isAuthenticated ? (
                  <Layout>
                    <ClanPage />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/clan-management"
              element={
                isAuthenticated ? (
                  <Layout>
                    <ClanManagementPage />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/achievements"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Achievements />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/stats"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Stats />
                  </Layout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
