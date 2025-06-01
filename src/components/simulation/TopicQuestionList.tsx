
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// Updated import path to use the questions version
import { Question } from "@/data/questionsData";
import { Topic } from "@/data/types/topicTypes";
import { FileText, Star, RefreshCw, ExternalLink } from "lucide-react";
import { refreshQuestionsFromStorage } from "@/services/questions";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface TopicQuestionListProps {
  topicId: number;
  topic: Topic;
}

const TopicQuestionList: React.FC<TopicQuestionListProps> = ({ topicId, topic }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { hasAccessToTopic } = useAuth();
  
  // Load questions with multiple refresh attempts to ensure we get the latest data
  const loadQuestions = () => {
    // Clear any cached data first
    localStorage.removeItem(`questions_cache_${topicId}`);
    
    // First attempt
    let allQuestions = refreshQuestionsFromStorage();
    
    // Filter questions for this specific topic
    let filteredQuestions = allQuestions.filter(q => q.topicId === topicId);
    
    // Set initial questions
    setQuestions(filteredQuestions);
    
    // Second attempt after a short delay
    setTimeout(() => {
      allQuestions = refreshQuestionsFromStorage();
      filteredQuestions = allQuestions.filter(q => q.topicId === topicId);
      setQuestions(filteredQuestions);
      console.log(`Loaded ${filteredQuestions.length} questions for topic ${topicId} (second attempt)`, filteredQuestions);
    }, 500);
    
    console.log(`Loaded ${filteredQuestions.length} questions for topic ${topicId} (initial attempt)`, filteredQuestions);
  };
  
  // Load questions on component mount and topicId change
  useEffect(() => {
    loadQuestions();
    
    // Set up an interval to refresh questions regularly
    const refreshInterval = setInterval(() => {
      const freshQuestions = refreshQuestionsFromStorage().filter(q => q.topicId === topicId);
      if (freshQuestions.length !== questions.length) {
        setQuestions(freshQuestions);
        console.log(`Updated questions count: ${freshQuestions.length}`);
      }
    }, 2000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [topicId]);
    const startSimulation = () => {
    // Check if user has access to this topic
    if (!hasAccessToTopic(topicId)) {
      // toast({
      //   title: "נדרש מנוי פרימיום",
      //   description: "רק נושא 1 פתוח לכולם. שאר הנושאים דורשים מנוי פרימיום",
      //   variant: "destructive",
      // });
      return;
    }
    
    // Force refresh questions directly from source data
    const latestQuestions = refreshQuestionsFromStorage();
    console.log(`Starting simulation with ${latestQuestions.filter(q => q.topicId === topicId).length} questions`);
    
    // Clear any cached progress for this topic
    localStorage.removeItem(`simulation_progress_${topicId}`);
    
    // Navigate to simulation page with a special timestamp parameter to force a fresh load
    const timestamp = new Date().getTime();
    navigate(`/simulation/${topicId}?refresh=${timestamp}`);
  };
  
  const handleRefresh = () => {
    loadQuestions();
    toast({
      title: "רשימת השאלות עודכנה",
      description: `נטענו ${questions.length} שאלות בנושא זה`,
      variant: "default",
    });
  };
  
  const viewAllQuestions = () => {
    navigate(`/topics/${topicId}/questions`);
  };
  
  // Check if the topic is accessible to everyone (topic 1) or only to premium users
  const isFreeTopic = topicId === 1;
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-electric-navy flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            className="h-8 w-8 p-0"
            title="רענן שאלות"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full electric-gradient flex items-center justify-center shadow-sm">
              {topic.icon && React.isValidElement(topic.icon) ? (
                topic.icon
              ) : (
                <FileText className="h-4 w-4 text-white" />
              )}
            </div>
            {topic.title} - {questions.length} שאלות
            {isFreeTopic && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                חינמי
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-electric-slate mb-4 text-right">
          {topic.description}
        </div>
        
        <div className="space-y-3 mb-4">
          {questions.length > 0 ? (
            <>
              {questions.slice(0, 3).map((question, index) => (
                <div key={question.id} className="p-2 bg-electric-gray/20 rounded text-sm text-electric-navy text-right">
                  {index + 1}. {question.text.length > 80 ? `${question.text.substring(0, 80)}...` : question.text}
                </div>
              ))}
              
              {questions.length > 3 && (
                <div className="text-sm text-electric-slate text-right">
                  + עוד {questions.length - 3} שאלות...
                </div>
              )}
            </>
          ) : (
            <div className="p-2 bg-electric-gray/20 rounded text-sm text-electric-navy text-right">
              אין שאלות בנושא זה כרגע.
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            size="sm"
            className={`${isFreeTopic ? 'bg-electric-blue' : 'bg-amber-500'} hover:opacity-90`}
            onClick={startSimulation}
            disabled={questions.length === 0}
          >
            <Star className="h-4 w-4 ml-1" />
            {isFreeTopic ? 'התחל סימולציה' : 'זמין לפרימיום'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-electric-blue"
            onClick={viewAllQuestions}
          >
            <ExternalLink className="h-4 w-4 ml-1" />
            הצג הכל
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicQuestionList;
