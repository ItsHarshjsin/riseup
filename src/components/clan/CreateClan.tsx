
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CreateClanProps {
  onCreated: (name: string, description: string) => void;
  isCreating?: boolean;
}

const CreateClan: React.FC<CreateClanProps> = ({ onCreated, isCreating = false }) => {
  const [clanName, setClanName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clanName.trim()) {
      return;
    }
    
    onCreated(clanName, description);
  };

  return (
    <Card className="shadow-sm border-mono-light">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-medium">Create a New Clan</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="clan-name">Clan Name</Label>
            <Input
              id="clan-name"
              value={clanName}
              onChange={(e) => setClanName(e.target.value)}
              placeholder="Enter clan name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clan-description">Description</Label>
            <Textarea
              id="clan-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your clan all about?"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-mono-light pt-4">
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Clan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateClan;
