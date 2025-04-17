
import React from "react";
import { Link } from "react-router-dom";
import { currentUser } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Users, Award, BarChart, UserCircle, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const initials = currentUser.username
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <header className="border-b border-mono-light py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold text-mono-black">RISEUP</Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-mono-dark transition-colors">
          <Home size={18} />
          <span>Dashboard</span>
        </Link>
        <Link to="/clan" className="flex items-center gap-2 hover:text-mono-dark transition-colors">
          <Users size={18} />
          <span>Clan</span>
        </Link>
        <Link to="/achievements" className="flex items-center gap-2 hover:text-mono-dark transition-colors">
          <Award size={18} />
          <span>Achievements</span>
        </Link>
        <Link to="/stats" className="flex items-center gap-2 hover:text-mono-dark transition-colors">
          <BarChart size={18} />
          <span>Stats</span>
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <div className="font-medium text-mono-black">{currentUser.username}</div>
          <div className="text-xs text-mono-gray">Level {currentUser.level}</div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="h-10 w-10 border-2 border-mono-black cursor-pointer">
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                <AvatarFallback className="bg-mono-black text-mono-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-mono-white border-mono-light shadow-md">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile" className="flex items-center w-full">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/clan" className="flex items-center w-full">
                <Users className="mr-2 h-4 w-4" />
                <span>My Clan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/achievements" className="flex items-center w-full">
                <Award className="mr-2 h-4 w-4" />
                <span>Achievements</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/" className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
