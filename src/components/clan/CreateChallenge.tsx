
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Users, Trophy, Target } from "lucide-react";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Clan, User, Category } from "@/types";
import { currentClan } from "@/data/mockData";

interface CreateChallengeProps {
  clan?: Clan;
  onCreated: () => void;
}

const CreateChallenge: React.FC<CreateChallengeProps> = ({
  clan = currentClan,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("productivity");
  const [points, setPoints] = useState(100);
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a challenge title",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one participant",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Your challenge "${title}" has been created.`,
      });
      onCreated();
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  return (
    <Card className="shadow-sm border-mono-light">
      <CardHeader className="border-b border-mono-light">
        <CardTitle className="text-xl font-medium">Create a New Challenge</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="challenge-title">Challenge Title</Label>
            <Input
              id="challenge-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter challenge title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenge-description">Description</Label>
            <Textarea
              id="challenge-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenge..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value: Category) => setCategory(value)}
              >
                <SelectTrigger id="challenge-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenge-points">Points</Label>
              <Input
                id="challenge-points"
                type="number"
                min={10}
                max={1000}
                step={10}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </Label>
            <div className="bg-mono-lighter rounded-md p-4 space-y-2">
              {clan.members.map((member: User) => {
                const isSelected = selectedMembers.includes(member.id);
                const initials = member.username
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase();
                
                return (
                  <div 
                    key={member.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      isSelected ? "bg-mono-black text-mono-white" : "hover:bg-mono-light"
                    }`}
                    onClick={() => toggleMember(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.username} />
                        <AvatarFallback className={isSelected ? "bg-mono-white text-mono-black" : "bg-mono-black text-mono-white"}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>{member.username}</div>
                    </div>
                    <div className="text-xs">
                      {isSelected ? "Selected" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-mono-light pt-4">
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Trophy className="h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Challenge"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateChallenge;
