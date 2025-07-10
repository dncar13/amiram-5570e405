/**
 * StoryTopicSelector Component
 * 
 * Allows users to select reading comprehension topics for mixed simulations.
 * All reading comprehension questions will come from the selected topic.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { RTLWrapper } from '@/components/ui/rtl-wrapper';
import { 
  READING_COMPREHENSION_TOPICS, 
  MIXED_TOPIC, 
  ReadingTopic, 
  getAllReadingTopicsWithMixed 
} from '@/data/readingComprehensionTopics';
import { questionCountService } from '@/services/questionCountService';
import { cn } from '@/lib/utils';

interface StoryTopicSelectorProps {
  selectedTopicId: number | null;
  onTopicSelect: (topicId: number | null) => void;
  onContinue: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  showQuestionCounts?: boolean;
  availableTopics?: ReadingTopic[];
}

export const StoryTopicSelector: React.FC<StoryTopicSelectorProps> = ({
  selectedTopicId,
  onTopicSelect,
  onContinue,
  isLoading = false,
  disabled = false,
  className = '',
  showQuestionCounts = false,
  availableTopics
}) => {
  const [topicCounts, setTopicCounts] = useState<Record<number, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  
  // Use provided topics or default to all topics
  const topicsToShow = availableTopics || getAllReadingTopicsWithMixed();
  
  // Load question counts if requested
  useEffect(() => {
    if (showQuestionCounts) {
      setIsLoadingCounts(true);
      
      // Load actual question counts from the database
      questionCountService.getAllTopicCounts('reading-comprehension')
        .then(counts => {
          setTopicCounts(counts);
        })
        .catch(error => {
          console.error('Error loading question counts:', error);
          // Fallback to mock data if service fails
          const fallbackCounts: Record<number, number> = {
            0: 50, // Mixed - all topics combined
            1: 8,  // Philosophy
            2: 12, // Science
            3: 15, // Society
            4: 6,  // Economy
            5: 10, // Technology
            6: 14, // Environment
            7: 9,  // History
            8: 7,  // Psychology
            9: 5   // Education
          };
          setTopicCounts(fallbackCounts);
        })
        .finally(() => {
          setIsLoadingCounts(false);
        });
    }
  }, [showQuestionCounts]);

  const handleTopicSelect = (topicId: number) => {
    if (disabled) return;
    onTopicSelect(topicId === selectedTopicId ? null : topicId);
  };

  const selectedTopic = topicsToShow.find(topic => topic.id === selectedTopicId);

  return (
    <RTLWrapper>
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-200 flex items-center justify-center gap-2">
              <Book className="h-6 w-6 text-blue-400" />
              בחר נושא לקטע הקריאה
            </CardTitle>
            <p className="text-slate-400 mt-2">
              כל שאלות הבנת הנקרא יבואו מהנושא שתבחר
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Topic Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicsToShow.map((topic) => {
                const isSelected = selectedTopicId === topic.id;
                const IconComponent = topic.icon;
                const questionCount = topicCounts[topic.id];
                
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic.id)}
                    className={cn(
                      "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                      isSelected
                        ? "border-blue-400 bg-blue-900/30 shadow-lg"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700/70",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      </div>
                    )}
                    
                    {/* Question count badge */}
                    {showQuestionCounts && (
                      <div className="absolute top-2 right-2">
                        {isLoadingCounts ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                            {questionCount || 0}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Topic content */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={cn(
                        "p-3 rounded-full",
                        isSelected ? "bg-blue-500/20" : "bg-slate-600/30"
                      )}>
                        <IconComponent className={cn(
                          "h-8 w-8",
                          isSelected ? "text-blue-400" : "text-slate-400"
                        )} />
                      </div>
                      
                      <div>
                        <h3 className={cn(
                          "font-semibold text-lg",
                          isSelected ? "text-blue-300" : "text-slate-200"
                        )}>
                          {topic.nameHebrew}
                        </h3>
                        <p className={cn(
                          "text-sm mt-1",
                          isSelected ? "text-blue-200" : "text-slate-400"
                        )}>
                          {topic.descriptionHebrew}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Selected topic info */}
            {selectedTopic && (
              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-blue-300">
                      נבחר: {selectedTopic.nameHebrew}
                    </h4>
                    <p className="text-sm text-blue-200">
                      {selectedTopic.descriptionHebrew}
                    </p>
                    {showQuestionCounts && topicCounts[selectedTopic.id] && (
                      <p className="text-xs text-blue-300 mt-1">
                        {topicCounts[selectedTopic.id]} שאלות זמינות
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Warning for insufficient questions */}
            {selectedTopic && showQuestionCounts && topicCounts[selectedTopic.id] < 5 && (
              <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <div>
                    <h4 className="font-semibold text-amber-300">
                      מספר שאלות מוגבל
                    </h4>
                    <p className="text-sm text-amber-200">
                      לנושא זה יש מספר מוגבל של שאלות. ייתכן שיתווספו שאלות מנושאים אחרים במידת הצורך.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Continue button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={onContinue}
                disabled={!selectedTopicId || disabled || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מכין סימולציה...
                  </>
                ) : (
                  'התחל סימולציה'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RTLWrapper>
  );
};

export default StoryTopicSelector;