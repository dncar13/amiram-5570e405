
import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/types/questionTypes";
import QuestionCard from "./QuestionCard";
import NoQuestionsFound from "./NoQuestionsFound";
import { refreshQuestionsFromStorage } from "@/services/questionsService";

interface TopicQuestionsListProps {
  topicId?: number;
  topicName: string;
  questions: Question[];
  autoRefresh?: boolean;
}

const TopicQuestionsList = ({ 
  topicId, 
  topicName, 
  questions: initialQuestions,
  autoRefresh = false
}: TopicQuestionsListProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(initialQuestions);
  
  // Add auto-refresh to check for new questions if enabled
  useEffect(() => {
    // Initial update
    setQuestions(initialQuestions);
    setFilteredQuestions(initialQuestions);
    
    if (autoRefresh) {
      // Initial refresh
      const refreshQuestions = () => {
        const allQuestions = refreshQuestionsFromStorage();
        console.log(`TopicQuestionsList: Refreshed questions, found ${allQuestions.length} total questions`);
        
        // Filter by topic ID if specified
        let relevantQuestions = allQuestions;
        if (topicId) {
          relevantQuestions = allQuestions.filter(q => q.topicId === topicId);
          console.log(`TopicQuestionsList: Filtered to ${relevantQuestions.length} questions for topic ${topicId}`);
        }
        
        setQuestions(relevantQuestions);
        setFilteredQuestions(relevantQuestions);
      };
      
      // Set up interval to refresh questions - but do it less frequently to avoid performance issues
      const interval = setInterval(() => {
        refreshQuestions();
      }, 5000); // Changed from 2000ms to 5000ms to reduce overhead
      
      return () => clearInterval(interval);
    }
  }, [topicId, initialQuestions, autoRefresh]);
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 justify-end">
        <h2 className="text-xl font-semibold text-electric-navy">{topicName}</h2>
        <BookOpen className="h-5 w-5 text-electric-blue ml-2" />
        <Badge className="bg-electric-blue/20 text-electric-slate border-0">
          {filteredQuestions.length} שאלות
        </Badge>
      </div>
      
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard 
              key={question.id}
              currentQuestion={question}
              currentQuestionIndex={0}
              totalQuestions={filteredQuestions.length}
              selectedAnswerIndex={null}
              isAnswerSubmitted={false}
              showExplanation={false}
              isFlagged={question.flagged || false}
              onAnswerSelect={() => {}}
              onSubmitAnswer={() => {}}
              onNextQuestion={() => {}}
              onPreviousQuestion={() => {}}
              onToggleExplanation={() => {}}
              onToggleQuestionFlag={() => {}}
            />
          ))
        ) : (
          <NoQuestionsFound searchTerm="" />
        )}
      </div>
    </div>
  );
};

export default TopicQuestionsList;
