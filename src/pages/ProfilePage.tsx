
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ShareCard from "@/components/ShareCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface Profile {
  username: string;
  bio: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  refer_code: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
      fetchCategories();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setProfile(data);
    setEditForm({
      username: data.username,
      bio: data.bio || ''
    });
  };

  const fetchBadges = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_badges')
      .select('badges(*)')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching badges:', error);
      return;
    }
    
    setBadges(data.map(item => item.badges));
  };

  const fetchCategories = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_categories')
      .select('categories(name)')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    
    setCategories(data.map(item => item.categories.name));
  };

  const handleProfileUpdate = async () => {
    if (!user || !profile) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: editForm.username,
        bio: editForm.bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
      
    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
    
    setIsEditing(false);
    fetchProfile();
  };

  if (!profile) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <Card className="p-6">
          <ShareCard
            username={profile.username}
            level={profile.level}
            streak={profile.streak}
            badges={badges.length}
            achievements={badges.slice(0, 3).map(badge => badge.name)}
            categories={categories}
            profileImage={profile.avatar}
          />
        </Card>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  placeholder="Tell others about yourself"
                />
              </div>
              <Button onClick={handleProfileUpdate} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProfilePage;
