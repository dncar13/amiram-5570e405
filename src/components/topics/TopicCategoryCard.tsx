
import { useState } from "react";
import React from "react"; 
import { ChevronDown, ChevronUp, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topic, Category, IconObject } from "@/data/types/topicTypes";
import { Badge } from "@/components/ui/badge";
import TopicCard from "@/components/TopicCard";
import { Link } from "react-router-dom";
import TopicProgressSummary from "./TopicProgressSummary";
import { LucideIcon } from "lucide-react";

interface TopicCategoryCardProps {
  category: Category;
  topics: (Topic & { isAvailable: boolean })[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isPremium: boolean;
  isLoggedIn: boolean;
  showComprehensiveCard?: boolean;
}

interface TopicItemProps {
  topic: Topic & { isAvailable: boolean };
  isPremium: boolean;
}

const TopicCategoryCard = ({
  category,
  topics,
  isExpanded,
  onToggleExpand,
  isPremium,
  isLoggedIn,
  showComprehensiveCard = false
}: TopicCategoryCardProps) => {
  const renderIcon = (icon: React.ReactNode | IconObject | LucideIcon) => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    if (icon && typeof icon === 'object' && 'type' in icon) {
      const iconObj = icon as IconObject;
      const IconComponent = iconObj.type;
      return <IconComponent className="h-5 w-5 text-white" />;
    }
    
    // Handle LucideIcon case
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="h-5 w-5 text-white" />;
    }
    
    if (category.id === 1) return <Zap className="h-5 w-5 text-white" />;
    if (category.id === 6) return <BookOpen className="h-5 w-5 text-white" />;
    
    return null;
  };

  // Make sure topics is always an array
  const topicsArray = Array.isArray(topics) ? topics : [];
  
  const availableTopicsCount = topicsArray.filter(topic => topic.isAvailable).length;
  const totalTopicsCount = topicsArray.length;

  const isComprehensiveCategory = category.id === 6;

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
      isComprehensiveCategory ? 'border-2 border-electric-orange' : ''
    }`}>
      <div 
        className={`p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${
          isComprehensiveCategory ? 'bg-electric-orange/10' : ''
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 shadow-sm ${
            isComprehensiveCategory ? 'bg-electric-orange' : 'electric-gradient'
          }`}>
            {renderIcon(category.icon)}
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg text-electric-navy font-assistant">{category.title}</h3>
            <p className="text-sm text-electric-slate font-assistant">{availableTopicsCount} מתוך {totalTopicsCount} נושאים זמינים</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 transition-transform duration-300 hover:scale-105">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-electric-slate" />
          ) : (
            <ChevronDown className="h-5 w-5 text-electric-slate" />
          )}
        </Button>
      </div>
      
      <div className="h-px bg-gray-100"></div>
      
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-3 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showComprehensiveCard && (
            <div className="py-2 h-full">
              <TopicProgressSummary />
            </div>
          )}
          {topicsArray.map((topic) => (
            <div key={topic.id} className="py-2 h-full">
              <TopicCard
                id={topic.id}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                questionCount={topic.totalQuestions}
                isAvailable={topic.isAvailable}
                isPremium={!topic.isAvailable && isPremium === true}
                subtopicCount={topic.subtopics?.length || 0}
                isComprehensive={topic.id === 25}
                completedPercentage={topic.completedPercentage}
                targetQuestions={topic.targetQuestions}
                hideCounter={false}
              />
            </div>
          ))}
        </div>
      </div>
      
      {!isExpanded && (
        <div className="p-5 pt-2">
          <p className="text-sm text-electric-slate text-right font-assistant">{category.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-end">
            {topicsArray.slice(0, 3).map(topic => (
              <Badge 
                key={topic.id} 
                variant="outline" 
                className="bg-electric-gray/30 text-electric-slate border-0 font-assistant"
              >
                {topic.title}
              </Badge>
            ))}
            {topicsArray.length > 3 && (
              <Badge 
                variant="outline" 
                className="bg-electric-gray/30 text-electric-slate border-0 font-assistant"
              >
                +{topicsArray.length - 3} נוספים
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCategoryCard;
