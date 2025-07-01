
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Brain, FileText, Volume2, PenTool, Eye, EyeOff, Bookmark, BookmarkCheck } from "lucide-react";
import { Question } from "@/data/types/questionTypes";

interface UnifiedQuestionCardProps {
  question: Question;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  showSaveButton?: boolean;
  isAnswered?: boolean;
  userAnswer?: number;
  isCorrect?: boolean;
  showUserAnswer?: boolean;
}

const getTypeIcon = (type: Question['type']) => {
  switch (type) {
    case 'reading-comprehension': {
      const Icon = BookOpen;
      return <Icon className="h-4 w-4" />;
    }
    case 'sentence-completion': {
      const Icon = FileText;
      return <Icon className="h-4 w-4" />;
    }
    case 'restatement': {
      const Icon = Brain;
      return <Icon className="h-4 w-4" />;
    }
    case 'vocabulary': {
      const Icon = PenTool;
      return <Icon className="h-4 w-4" />;
    }
    case 'grammar': {
      const Icon = FileText;
      return <Icon className="h-4 w-4" />;
    }
    case 'writing': {
      const Icon = PenTool;
      return <Icon className="h-4 w-4" />;
    }
    case 'listening': {
      const Icon = Volume2;
      return <Icon className="h-4 w-4" />;
    }
    default: {
      const Icon = Brain;
      return <Icon className="h-4 w-4" />;
    }
  }
};

const getTypeLabel = (type: Question['type']) => {
  const labels = {
    'reading-comprehension': 'הבנת הנקרא',
    'sentence-completion': 'השלמת משפטים',
    'restatement': 'ניסוח מחדש',
    'vocabulary': 'אוצר מילים',
    'grammar': 'דקדוק',
    'writing': 'כתיבה',
    'listening': 'הבנת הנשמע',
    'comprehensive': 'כללי'
  };
  return labels[type] || type;
};

const getDifficultyColor = (difficulty: Question['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDifficultyLabel = (difficulty: Question['difficulty']) => {
  const labels = {
    easy: 'קל',
    medium: 'בינוני',
    hard: 'קשה'
  };
  return labels[difficulty] || difficulty;
};

const UnifiedQuestionCard: React.FC<UnifiedQuestionCardProps> = ({
  question,
  showAnswer = false,
  onToggleAnswer,
  isSaved = false,
  onToggleSave,
  showSaveButton = true,
  isAnswered = false,
  userAnswer,
  isCorrect,
  showUserAnswer = false
}) => {
  return (
    <Card className="w-full mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-3">
              שאלה #{question.id}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium border"
              >
                {getTypeIcon(question.type)}
                {getTypeLabel(question.type)}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`px-2 py-1 text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}
              >
                {getDifficultyLabel(question.difficulty)}
              </Badge>

              {question.metadata?.estimatedTime && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {question.metadata.estimatedTime} דק'
                </Badge>
              )}

              {isAnswered && (
                <Badge 
                  variant="outline" 
                  className={`px-2 py-1 text-xs font-medium ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {isCorrect ? '✓ נכון' : '✗ שגוי'}
                </Badge>
              )}
            </div>
          </div>

          {showSaveButton && onToggleSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSave}
              className="flex-shrink-0"
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-blue-600" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Passage Text (for reading comprehension) */}
        {question.passageText && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">
              {question.passageTitle || 'קטע לקריאה'}
            </h4>
            <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
              {question.passageText}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-800 font-medium leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm">אפשרויות תשובה:</h4>
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors ${
                showAnswer && index === question.correctAnswer
                  ? 'bg-green-50 border-green-300 text-green-900'
                  : showUserAnswer && index === userAnswer && userAnswer !== question.correctAnswer
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              <span className="font-medium text-sm mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {showAnswer && index === question.correctAnswer && (
                <span className="mr-2 text-green-600 font-bold">✓</span>
              )}
              {showUserAnswer && index === userAnswer && userAnswer !== question.correctAnswer && (
                <span className="mr-2 text-red-600 font-bold">✗</span>
              )}
            </div>
          ))}
        </div>

        {/* Show/Hide Answer Button */}
        {onToggleAnswer && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAnswer}
              className="flex items-center gap-2"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  הסתר תשובה
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  הצג תשובה
                </>
              )}
            </Button>
          </div>
        )}

        {/* Explanation */}
        {showAnswer && question.explanation && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">הסבר:</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Tips */}
        {question.tips && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-900 mb-2">טיפים:</h4>
            <p className="text-yellow-800 text-sm leading-relaxed">
              {question.tips}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedQuestionCard;
