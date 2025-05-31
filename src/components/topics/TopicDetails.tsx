
import { Badge } from "@/components/ui/badge";
import { HoverEffect } from "@/components/ui/hover-effect";
import { BookOpen, Clock, Award } from "lucide-react";
import React from "react";
import { IconObject } from "@/data/topicsData";

interface TopicDetailsProps {
  title: string;
  description: string;
  timeEstimate: number | string;
  totalQuestions: number;
  difficulty: string;
  icon: React.ReactNode | IconObject;
}

export function TopicDetails({
  title,
  description,
  timeEstimate,
  totalQuestions,
  difficulty,
  icon,
}: TopicDetailsProps) {
  // Helper function to render the icon
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // If icon is in our object format with type and props
    if (icon && typeof icon === 'object' && 'type' in icon) {
      const iconObj = icon as IconObject;
      const IconComponent = iconObj.type;
      return <IconComponent className="h-5 w-5 text-electric-blue" />;
    }
    
    // Fallback
    return <BookOpen className="h-5 w-5 text-electric-blue" />;
  };

  // Format time estimate to handle both string and number
  const formattedTimeEstimate = typeof timeEstimate === 'string' 
    ? timeEstimate 
    : `${timeEstimate}`;

  return (
    <>
      <div className="text-center mb-10">
        <Badge variant="outline" className="bg-electric-blue/15 text-electric-blue border-0 px-4 py-1.5 text-base mb-4">
          הכנה לסימולציה
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-electric-navy">{title}</h1>
        <p className="text-electric-slate text-lg">{description}</p>
      </div>
      
      <div className="flex items-start mb-8">
        <div className="flex-shrink-0 w-16 h-16 rounded-full electric-gradient flex items-center justify-center ml-6 shadow-md animate-pulse-glow">
          {renderIcon()}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-electric-navy">{title}</h2>
          <p className="text-electric-slate">{description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HoverEffect variant="outline">
          <div className="flex items-center bg-electric-gray/30 p-3 rounded-lg">
            <Clock className="h-5 w-5 text-electric-blue ml-2" />
            <div>
              <p className="text-sm text-muted-foreground">זמן משוער</p>
              <p className="font-medium">{formattedTimeEstimate} דקות</p>
            </div>
          </div>
        </HoverEffect>
        
        <HoverEffect variant="outline">
          <div className="flex items-center bg-electric-gray/30 p-3 rounded-lg">
            <BookOpen className="h-5 w-5 text-electric-blue ml-2" />
            <div>
              <p className="text-sm text-muted-foreground">מספר שאלות</p>
              <p className="font-medium">{totalQuestions} שאלות</p>
            </div>
          </div>
        </HoverEffect>
        
        <HoverEffect variant="outline">
          <div className="flex items-center bg-electric-gray/30 p-3 rounded-lg">
            <Award className="h-5 w-5 text-electric-blue ml-2" />
            <div>
              <p className="text-sm text-muted-foreground">דרגת קושי</p>
              <p className="font-medium">{difficulty}</p>
            </div>
          </div>
        </HoverEffect>
      </div>
    </>
  );
}
