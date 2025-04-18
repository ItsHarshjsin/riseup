
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Camera, Check, X, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { currentUser } from "@/data/mockData";

interface ProfileCustomizationProps {
  user?: User;
  onUpdate?: (updatedProfile: Partial<User>) => void;
}

const ProfileCustomization: React.FC<ProfileCustomizationProps> = ({
  user = currentUser,
  onUpdate = () => {},
}) => {
  const { toast } = useToast();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState("Tell others about yourself");
  const [profileImage, setProfileImage] = useState<string | null>(user.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.includes("image")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    // Create a local URL for the image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
        setUploadingImage(false);
        toast({
          title: "Image uploaded",
          description: "Your profile image has been updated locally",
        });
      }
    };
    reader.readAsDataURL(file);

    // In a real app, we'd upload this to Supabase storage
    // For demonstration, we're just updating it locally
  };

  const handleSaveChanges = () => {
    // Validate inputs
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    // Update the profile
    const updatedProfile = {
      ...user,
      username,
      avatar: profileImage || user.avatar,
    };

    // Call the onUpdate function with the updated profile
    onUpdate(updatedProfile);

    // Show success message
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });

    // Exit editing mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form values
    setUsername(user.username);
    setProfileImage(user.avatar);
    setBio("Tell others about yourself");
    setIsEditing(false);
  };

  const initials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-mono-light shadow-sm">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 rounded-xl border-4 border-mono-white shadow-md">
              <AvatarImage src={profileImage || ""} alt={username} />
              <AvatarFallback className="bg-mono-black text-mono-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-md">
                    <Camera size={16} />
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                </label>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="text-center text-sm text-mono-gray">
              {uploadingImage ? "Uploading..." : "Click to change profile picture"}
            </div>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          {isEditing ? (
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
            />
          ) : (
            <div className="py-2 text-lg font-semibold">{username}</div>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium">
            Bio
          </Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself"
              className="min-h-[100px] w-full"
            />
          ) : (
            <div className="py-2 text-sm text-mono-gray">{bio}</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-mono-light pt-4 flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-1"
            >
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSaveChanges}
              className="gap-1 bg-mono-black text-mono-white"
            >
              <Check size={16} />
              <span>Save Changes</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCustomization;
