import React, { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File | null) => void;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  className,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onAvatarChange(null);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={preview || currentAvatar || undefined} />
          <AvatarFallback>
            {preview || currentAvatar ? "" : "Upload"}
          </AvatarFallback>
        </Avatar>
        {(preview || currentAvatar) && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative overflow-hidden"
          asChild
        >
          <label>
            <Upload className="h-4 w-4 mr-2" />
            Choose Image
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default AvatarUpload; 