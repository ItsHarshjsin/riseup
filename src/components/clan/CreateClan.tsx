
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
import { useToast } from "@/hooks/use-toast";

interface CreateClanProps {
  onCreated: (clanName: string) => void;
}

const CreateClan: React.FC<CreateClanProps> = ({ onCreated }) => {
  const [clanName, setClanName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clanName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a clan name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Your clan "${clanName}" has been created.`,
      });
      onCreated(clanName);
      setIsSubmitting(false);
    }, 1000);
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
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Clan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateClan;
