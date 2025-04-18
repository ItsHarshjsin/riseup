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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import AvatarSelector from "@/components/AvatarSelector";

// Database profile type
interface DBProfile {
  username: string;
  bio: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  refer_code: string;
  tagline?: string;
  created_at: string;
  updated_at: string;
  id: string;
}

// Application profile type
interface Profile extends Omit<DBProfile, 'tagline'> {
  tagline: string; // Make tagline required in our app
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
    bio: '',
    tagline: '',
    avatarUrl: null as string | null
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
      fetchCategories();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    type ProfileResponse = {
      data: DBProfile | null;
      error: any;
    };

    const { data: dbProfile, error }: ProfileResponse = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error || !dbProfile) {
      toast({
        title: "Error fetching profile",
        description: error?.message || "Profile not found",
        variant: "destructive"
      });
      return;
    }

    // Convert DBProfile to Profile, ensuring tagline has a default value
    const profile: Profile = {
      ...dbProfile,
      tagline: dbProfile.tagline || 'Rising to new heights'
    };
    
    setProfile(profile);
    setEditForm({
      username: profile.username,
      bio: profile.bio || '',
      tagline: profile.tagline,
      avatarUrl: profile.avatar
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

  const handleAvatarSelect = (avatarUrl: string) => {
    setEditForm(prev => ({
      ...prev,
      avatarUrl
    }));
  };

  const handleProfileUpdate = async () => {
    if (!user || !profile) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          bio: editForm.bio,
          tagline: editForm.tagline,
          avatar: editForm.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
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
            tagline={profile.tagline}
            profileImage={profile.avatar}
            onUpdate={(data) => {
              setEditForm(prev => ({ ...prev, ...data }));
            }}
          />
        </Card>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <AvatarSelector
                currentAvatar={editForm.avatarUrl}
                onAvatarSelect={handleAvatarSelect}
              />
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
                <label className="text-sm font-medium">Tagline</label>
                <Input
                  value={editForm.tagline}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    tagline: e.target.value
                  }))}
                  placeholder="Add your personal tagline"
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
              <Button 
                onClick={handleProfileUpdate} 
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProfilePage;
