
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  user: {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
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

  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
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

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user.photoURL && (
        <AvatarImage 
          src={user.photoURL} 
          alt={user.displayName || user.email || 'משתמש'}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {user.photoURL ? (
          <User className="h-4 w-4" />
        ) : (
          getInitials()
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
