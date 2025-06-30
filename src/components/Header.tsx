import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Settings, BookOpen, GraduationCap, Archive, TrendingUp, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { getMobileOptimizedConfig } from "@/utils/mobile-performance";

const Header = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const mobileConfig = getMobileOptimizedConfig();

  // Use session for real-time updates
  const user = session?.user || currentUser;
  const isAuthenticated = !!user;

  // Mobile-optimized callbacks with useCallback to prevent re-renders
  const handleLogout = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      if (mobileConfig.enableDebugLogging) {
        console.log("🚪 Header: Initiating logout...");
      }
      await logout();
      // Don't force navigation - let AuthContext handle it
    } catch (error) {
      console.error("❌ Header: Error logging out:", error);
    }
  }, [logout, mobileConfig.enableDebugLogging]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleUserMenuClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleMenuItemClick = useCallback((path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  }, [navigate]);

  // Mobile-optimized debug logging
  if (isLoading && mobileConfig.enableDebugLogging) {
    console.log("⏳ Header: Still loading auth state...");
  }

  // Memoized user data to prevent unnecessary re-renders
  const userDisplayName = useMemo(() => {
    if (!user) return "משתמש";
    
    const metadata = user.user_metadata;
    return (
      metadata?.full_name ||
      metadata?.name ||
      user.email?.split('@')[0] ||
      "משתמש"
    );
  }, [user]);
  
  const userPhotoURL = useMemo(() => 
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
    [user]
  );

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg border border-blue-500/50 group-hover:shadow-blue-500/30 transition-all duration-300">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors duration-300">
                Amiram Academy
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Your Path to Success
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-slate-800/50"
            >
              בית
            </Link>
            <Link 
              to="/simulations-entry" 
              className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-slate-800/50"
            >
              סימולציות
            </Link>
            <Link 
              to="/reading-comprehension" 
              className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-slate-800/50"
            >
              הבנת הנקרא
            </Link>
            <Link 
              to="/about" 
              className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-slate-800/50"
            >
              אודות
            </Link>
          </nav>

          {/* User Menu / Login */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-slate-400 px-4 py-2">טוען...</div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                    onClick={handleUserMenuClick}
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="mr-2">{userDisplayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl rounded-xl backdrop-blur-sm w-56"
                  align="end"
                >
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/account");
                    }}
                  >
                    <Archive className="ml-2 h-4 w-4" />
                    החשבון שלי
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/progress-stats");
                    }}
                  >
                    <TrendingUp className="ml-2 h-4 w-4" />
                    התקדמות
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/account?tab=saved");
                    }}
                  >
                    <BookmarkCheck className="ml-2 h-4 w-4" />
                    שאילות שמורות
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-lg transition-colors duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/account");
                    }}
                  >
                    <Settings className="ml-2 h-4 w-4" />
                    הגדרות
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-300 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-xl shadow-lg border border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/30"
              >
                <Link to="/login">התחבר</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 rounded-xl transition-all duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-slate-700/50 bg-slate-800/30 rounded-xl backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                בית
              </Link>
              <Link 
                to="/simulations-entry" 
                className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                סימולציות
              </Link>
              <Link 
                to="/reading-comprehension" 
                className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                הבנת הנקרא
              </Link>
              <Link 
                to="/about" 
                className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                אודות
              </Link>
              
              {/* Mobile User Menu */}
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                {isLoading ? (
                  <div className="text-slate-400 px-4">טוען...</div>
                ) : isAuthenticated ? (
                  <>
                    <div className="flex items-center px-4 py-2 text-slate-300 space-x-3 space-x-reverse">
                      <UserAvatar user={user} size="sm" />
                      <span>{userDisplayName}</span>
                    </div>
                    <Link 
                      to="/account" 
                      className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Archive className="h-4 w-4 ml-2" />
                      החשבון שלי
                    </Link>
                    <Link 
                      to="/progress-stats" 
                      className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <TrendingUp className="h-4 w-4 ml-2" />
                      התקדמות
                    </Link>
                    <Link 
                      to="/account?tab=saved" 
                      className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookmarkCheck className="h-4 w-4 ml-2" />
                      שאילות שמורות
                    </Link>
                    <Link 
                      to="/account" 
                      className="text-slate-300 hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-slate-700/50 transition-all duration-300 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 ml-2" />
                      הגדרות
                    </Link>
                    <button 
                      onClick={(e) => {
                        handleLogout(e);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-right text-red-400 hover:text-red-300 font-medium py-3 px-4 rounded-lg hover:bg-red-900/30 transition-all duration-300 flex items-center"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      התנתקות
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg border border-blue-500/50 transition-all duration-300 mx-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    התחבר
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
