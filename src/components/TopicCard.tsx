
import { Link } from "react-router-dom";
import { BadgeCheck, Lock, Clock, HelpCircle, Layers, BookOpen, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { IconObject } from "@/data/topicsData";
import { Progress } from "@/components/ui/progress";
import React from "react";

interface TopicCardProps {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode | IconObject;
  questionCount: number;
  isAvailable: boolean;
  isPremium: boolean;
  subtopicCount?: number;
  isComprehensive?: boolean;
  completedPercentage?: number;
  targetQuestions?: number;
  hideCounter?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  title,
  description,
  icon,
  questionCount,
  isAvailable,
  isPremium,
  subtopicCount = 0,
  isComprehensive = false,
  completedPercentage = 0,
  targetQuestions = 50,
  hideCounter = false
}) => {
  const getDifficulty = (id: number) => {
    if (id <= 3 || id === 9 || id === 14 || id === 15 || id === 21 || id === 23) return "מתחילים";
    if (id === 25) return "מקיף";
    if (id === 2 || id === 5 || id === 11 || id === 13 || id === 17 || id === 18 || id === 22) return "מתקדם";
    return "בינוני";
  };
  
  const getEstimatedTime = (count: number) => {
    return Math.round(count * 0.3); // ~20 seconds per question
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    if (icon && typeof icon === 'object' && 'type' in icon) {
      const iconObj = icon as IconObject;
      const IconComponent = iconObj.type;
      return <IconComponent className="h-5 w-5 text-electric-blue" />;
    }
    
    if (isComprehensive) return <BookOpen className="h-5 w-5 text-electric-orange" />;
    return <Zap className="h-5 w-5 text-electric-blue" />;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 30) return "bg-electric-blue";
    return "bg-amber-500";
  };

  return (
    <Card 
      className={`topic-card h-full transition-all duration-300 hover:shadow-lg ${
        !isAvailable ? "opacity-80 grayscale" : "hover:translate-y-[-5px]"
      } ${
        isComprehensive ? "border-2 border-electric-orange" : ""
      }`}
    >
      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            {isPremium && (
              <Badge className="bg-electric-orange text-white border-0">
                פרימיום
              </Badge>
            )}
            {!hideCounter && (
              <Badge variant="outline" className="bg-electric-gray/50 text-electric-slate border-0">
                {getDifficulty(id)}
              </Badge>
            )}
          </div>
          <div className="flex-grow text-right">
            <CardTitle className="text-xl flex items-center gap-2 justify-end">
              <span>{title}</span>
              <span className={`p-1.5 rounded-full ${
                isComprehensive ? "bg-electric-orange/10 text-electric-orange" : "bg-electric-blue/10 text-electric-blue"
              }`}>
                {renderIcon()}
              </span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 text-right">
        <div className="flex flex-col h-full">
          <p className="text-electric-slate mb-4">{description}</p>
          
          {completedPercentage > 0 && !hideCounter && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{completedPercentage}%</span>
                <span className="text-electric-slate">התקדמות</span>
              </div>
              <Progress 
                value={completedPercentage} 
                className="h-2" 
                indicatorClassName={getProgressColor(completedPercentage)}
              />
            </div>
          )}
          
          <div className="flex flex-row-reverse items-center justify-between text-sm text-muted-foreground mt-auto">
            {hideCounter ? (
              <div className="flex flex-row-reverse items-center gap-1">
                <HelpCircle className="h-4 w-4 text-electric-blue/70" />
                <span>שאלות זמינות</span>
              </div>
            ) : (
              <>
                <div className="flex flex-row-reverse items-center gap-1">
                  <HelpCircle className="h-4 w-4 text-electric-blue/70" />
                  <span>{questionCount} מתוך {targetQuestions} שאלות</span>
                </div>
                <div className="flex flex-row-reverse items-center gap-1">
                  <Clock className="h-4 w-4 text-electric-blue/70" />
                  <span>~{getEstimatedTime(questionCount)} דקות</span>
                </div>
                {subtopicCount > 0 && (
                  <div className="flex flex-row-reverse items-center gap-1">
                    <Layers className="h-4 w-4 text-electric-blue/70" />
                    <span>{subtopicCount} {isComprehensive ? "חלקים" : "תת-נושאים"}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        {hideCounter ? (
          <Link to="/questions" className="w-full">
            <Button 
              className="w-full font-medium transition-all hover:shadow-md bg-electric-blue hover:bg-blue-600"
            >
              צפייה בשאלות
            </Button>
          </Link>
        ) : isAvailable ? (
          <Link to={`/topics/${id}/intro`} className="w-full">
            <Button 
              className={`w-full font-medium transition-all hover:shadow-md ${
                isComprehensive 
                  ? "bg-electric-orange hover:bg-orange-600" 
                  : "bg-electric-blue hover:bg-blue-600"
              }`}
            >
              {isComprehensive ? "התחל מבחן מקיף" : "התחל סימולציה"}
            </Button>
          </Link>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button disabled className="w-full flex items-center justify-center gap-2 bg-slate-300">
                    <Lock className="h-4 w-4" />
                    <span>לא זמין</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-electric-navy text-white">
                <p>נדרשת {isPremium ? 'חבילת פרימיום' : 'התחברות'} כדי לפתוח נושא זה</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default TopicCard;
