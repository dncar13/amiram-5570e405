
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  user: {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
    user_metadata?: {
      avatar_url?: string;
      picture?: string;
      full_name?: string;
      name?: string;
    };
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  // Enhanced user data extraction for both old and new user structures
  const getDisplayName = () => {
    return (
      user.displayName ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      null
    );
  };
  
  const getPhotoURL = () => {
    return (
      user.photoURL ||
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null
    );
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const photoURL = getPhotoURL();
  const displayName = getDisplayName();

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {photoURL && (
        <AvatarImage 
          src={photoURL} 
          alt={displayName || user.email || 'משתמש'}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {photoURL ? (
          <User className="h-4 w-4" />
        ) : (
          getInitials()
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
