import * as React from "react";
import { useState, useEffect } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    avatar: "",
    tagline: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single() as { data: DBProfile | null; error: any };

    if (error) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (profileData) {
      const data: Profile = {
        ...profileData,
        tagline: profileData.tagline || ""
      };
      setProfile(data);
      setEditForm({
        username: data.username,
        bio: data.bio || "",
        avatar: data.avatar || "",
        tagline: data.tagline,
      });
    }
  };

  const fetchBadges = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error fetching badges",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setBadges(data.map((b) => b.badge_id));
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: editForm.username,
        bio: editForm.bio,
        avatar: editForm.avatar,
        tagline: editForm.tagline || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        username: editForm.username,
        bio: editForm.bio,
        avatar: editForm.avatar,
        tagline: editForm.tagline || ""
      };
    });

    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-xl text-mono-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Picture</label>
              <AvatarSelector
                currentAvatar={editForm.avatar}
                onSelect={(url) =>
                  setEditForm((prev) => ({ ...prev, avatar: url }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={editForm.username}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <Input
                value={editForm.tagline}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    tagline: e.target.value,
                  }))
                }
                placeholder="A short description that appears on your share card"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell us about yourself"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
