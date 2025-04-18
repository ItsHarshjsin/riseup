
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Send, Copy, Check, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface InviteFriendsProps {
  clanName: string;
}

const InviteFriends: React.FC<InviteFriendsProps> = ({ clanName }) => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleAddEmail = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (emails.includes(email)) {
      toast({
        description: "This email is already in the list",
      });
      return;
    }
    
    setEmails([...emails, email]);
    setEmail("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `https://riseup.app/join-clan/${encodeURIComponent(clanName)}`;
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    toast({
      description: "Invite link copied to clipboard!",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleSendInvites = () => {
    if (emails.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invitations Sent!",
        description: `${emails.length} invitation${emails.length > 1 ? 's' : ''} sent successfully.`,
      });
      setEmails([]);
      setIsSending(false);
    }, 1500);
  };

  return (
    <Card className="shadow-sm border-mono-light">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-medium">Invite Friends to {clanName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="invite-link">Share Invite Link</Label>
          <div className="flex gap-2">
            <Input
              id="invite-link"
              value={`https://riseup.app/join-clan/${encodeURIComponent(clanName)}`}
              readOnly
              className="bg-mono-lighter"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyInviteLink}
              className="flex-shrink-0"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="invite-email">Invite via Email</Label>
          <div className="flex gap-2">
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddEmail}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {emails.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-mono-gray">Recipients:</div>
              <div className="flex flex-wrap gap-2">
                {emails.map((e) => (
                  <Badge key={e} variant="outline" className="flex items-center gap-1 bg-mono-lighter py-1 px-2">
                    {e}
                    <button 
                      onClick={() => handleRemoveEmail(e)} 
                      className="text-mono-gray hover:text-mono-black ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-mono-light pt-4">
        <Button 
          className="w-full flex items-center gap-2"
          onClick={handleSendInvites}
          disabled={emails.length === 0 || isSending}
        >
          <Send className="h-4 w-4" />
          {isSending ? "Sending..." : "Send Invitations"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteFriends;
