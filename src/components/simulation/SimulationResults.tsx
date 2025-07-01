
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, RotateCcw, Home, TrendingUp, Clock, Target, Award, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Question } from "@/data/types/questionTypes";

interface SimulationResultsProps {
  score: number;
  totalQuestions: number;
  timeSpent?: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: Question[];
  userAnswers: Record<number, number | null>;
  onRestart: () => void;
  onReview?: () => void;
  difficulty?: string;
  type?: string;
  completionTime?: string;
}

interface QuestionAnalysis {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  questionIndex: number;
}

const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadgeColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (percentage >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getPerformanceMessage = (percentage: number): string => {
  if (percentage >= 90) return "ביצוע מעולה! 🎉";
  if (percentage >= 80) return "ביצוע טוב מאוד! 👏";
  if (percentage >= 70) return "ביצוע טוב! 👍";
  if (percentage >= 60) return "ביצוע סביר. יש מקום לשיפור.";
  return "צריך להתאמן יותר. אל תתייאש!";
};

const SimulationResults: React.FC<SimulationResultsProps> = ({
  score,
  totalQuestions,
  timeSpent,
  correctAnswers,
  incorrectAnswers,
  questions,
  userAnswers,
  onRestart,
  onReview,
  difficulty,
  type,
  completionTime
}) => {
  const navigate = useNavigate();
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Create question analysis
  const questionAnalysis: QuestionAnalysis[] = questions.map((question, index) => ({
    question,
    userAnswer: userAnswers[index] ?? null,
    isCorrect: userAnswers[index] === question.correctAnswer,
    questionIndex: index
  }));

  const formatTime = (seconds?: number): string => {
    if (!seconds) return 'לא זמין';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Results Card */}
      <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            סיום הסימולציה!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {getPerformanceMessage(percentage)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-3">
            <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-gray-600">
              <span className="text-xl font-semibold">{score}</span>
              <span className="text-sm"> מתוך </span>
              <span className="text-xl font-semibold">{totalQuestions}</span>
              <span className="text-sm"> שאלות</span>
            </div>
            <Progress value={percentage} className="w-full h-3" />
          </div>

          {/* Performance Badge */}
          <Badge 
            variant="outline" 
            className={`px-4 py-2 text-lg font-semibold ${getScoreBadgeColor(percentage)}`}
          >
            {percentage >= 80 ? 'מצוין' : percentage >= 60 ? 'טוב' : 'דורש שיפור'}
          </Badge>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600">תשובות נכונות</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
            <div className="text-sm text-gray-600">תשובות שגויות</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-600">זמן ביצוע</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
            <div className="text-sm text-gray-600">אחוז הצלחה</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRestart}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <RotateCcw className="h-4 w-4" />
          התחל מחדש
        </Button>

        {onReview && (
          <Button
            onClick={onReview}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            סקור תשובות
          </Button>
        )}

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          חזור לעמוד הבית
        </Button>
      </div>

      {/* Question Breakdown */}
      {questionAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              פירוט תשובות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {questionAnalysis.map((analysis, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    analysis.isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      שאלה #{analysis.questionIndex + 1}
                    </span>
                    <span className={`text-lg ${
                      analysis.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analysis.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {analysis.userAnswer !== null 
                      ? `תשובה: ${String.fromCharCode(65 + analysis.userAnswer)}`
                      : 'לא נענה'
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationResults;
