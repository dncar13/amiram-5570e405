import React from 'react';
import { Question } from '@/data/types/questionTypes';
import { Button } from '@/components/ui/button';

interface ResultsQuestionReviewProps {
  questionsData: Question[];
  userAnswers: (number | null)[];
  questionFlags: boolean[];
  onNavigateToQuestion: (index: number) => void;
}

const ResultsQuestionReview = ({
  questionsData,
  userAnswers,
  questionFlags,
  onNavigateToQuestion
}: ResultsQuestionReviewProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border">
      <h3 className="text-xl font-bold text-foreground mb-4">Question Review</h3>
      <div className="space-y-3">
        {questionsData.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          const isFlagged = questionFlags[index];
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Q{index + 1}</span>
                <div className={`w-3 h-3 rounded-full ${
                  userAnswer === null ? 'bg-gray-400' :
                  isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isFlagged && <span className="text-yellow-500">🚩</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToQuestion(index)}
              >
                Review
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsQuestionReview;