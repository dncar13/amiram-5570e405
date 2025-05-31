import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BoltIcon, MenuIcon, LogInIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Header auth state:", currentUser ? `Logged in as ${currentUser.email}` : "Not logged in");
    console.log("Is admin:", isAdmin);
  }, [currentUser, isAdmin]);
  
  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות בקרוב!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "שגיאה בהתנתקות",
        description: "אנא נסה שוב מאוחר יותר.",
      });
    }
  };

  const userInitials = currentUser?.displayName 
    ? `${currentUser.displayName.split(' ')[0][0]}${currentUser.displayName.split(' ')[1]?.[0] || ''}`
    : currentUser?.email?.substring(0, 2).toUpperCase() || "משתמש";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <BoltIcon className="h-8 w-8 text-electric-blue" />
          <span className="text-xl font-bold text-electric-navy">TD-Academy</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          <Link to="/" className="text-electric-slate hover:text-electric-blue transition-colors">דף הבית</Link>
          <Link to="/topics" className="text-electric-slate hover:text-electric-blue transition-colors">סימולציות</Link>
          <Link to="/about" className="text-electric-slate hover:text-electric-blue transition-colors">אודות</Link>
          
          {isAdmin && (
            <Link to="/admin" className="text-electric-blue font-medium hover:text-electric-blue/80 transition-colors">
              ניהול
            </Link>
          )}
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="h-8 w-8 bg-electric-blue/10">
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback className="bg-electric-blue/10 text-electric-blue">{userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="mr-2">החשבון שלי</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>החשבון שלי</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/account" className="w-full">החשבון שלי</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/account?tab=history" className="w-full">התקדמות</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/account?tab=saved" className="w-full">שאלות שמורות</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/account?tab=settings" className="w-full">הגדרות</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOutIcon className="ml-2 h-4 w-4" />
                  התנתקות
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white flex items-center space-x-2 space-x-reverse">
                <LogInIcon className="h-4 w-4" />
                <span>התחברות</span>
              </Button>
            </Link>
          )}
        </nav>
        
        <button 
          className="md:hidden text-electric-slate"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 absolute w-full">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-electric-slate hover:text-electric-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              דף הבית
            </Link>
            <Link 
              to="/topics" 
              className="text-electric-slate hover:text-electric-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              סימולציות
            </Link>
            <Link 
              to="/about" 
              className="text-electric-slate hover:text-electric-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              אודות
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-electric-blue font-medium hover:text-electric-blue/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ניהול
              </Link>
            )}
            
            {currentUser ? (
              <>
                <Link 
                  to="/account" 
                  className="text-electric-slate hover:text-electric-blue transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  החשבון שלי
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500 flex items-center space-x-2 space-x-reverse"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span className="mr-2">התנתקות</span>
                </Button>
              </>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="bg-electric-blue hover:bg-electric-blue/90 w-full flex items-center justify-center space-x-2 space-x-reverse">
                  <LogInIcon className="h-4 w-4" />
                  <span>התחברות</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
