import React, { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import vocabData from '@/data/vocab-static.json';

const VocabQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = vocabData.quizQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnswered);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "מעולה! 🎉";
    if (percentage >= 60) return "טוב מאוד! 👍";
    if (percentage >= 40) return "לא רע, אבל יש מקום לשיפור 📚";
    return "כדאי להמשיך ללמוד 💪";
  };

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/vocab" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
            חזרה לאוצר מילים
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">תוצאות החידון</h1>
          <div className="w-32"></div>
        </div>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">
              {getScoreMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-blue-600">
              {score}/{questions.length}
            </div>
            <div className="text-xl text-slate-600">
              {Math.round((score / questions.length) * 100)}% נכונות
            </div>
            
            <Progress value={(score / questions.length) * 100} className="h-4" />
            
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={resetQuiz} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                נסה שוב
              </Button>
              <Link to="/vocab/dictionary">
                <Button variant="outline">
                  חזור למילון
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/vocab" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
          חזרה לאוצר מילים
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">חידון</h1>
        <div className="w-32"></div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>שאלה {currentQuestionIndex + 1} מתוך {questions.length}</span>
          <span>ציון: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
            <Badge variant="outline">
              {currentQuestion.type === 'translation' ? 'תרגום' :
               currentQuestion.type === 'example' ? 'דוגמה' :
               currentQuestion.type === 'synonym' ? 'מילה דומה' :
               currentQuestion.type === 'fill' ? 'השלמה' : 'שאלה'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 text-right rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-blue-500 bg-blue-50'
                    : showResult && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showResult && (
                    <div>
                      {index === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                size="lg"
              >
                אשר תשובה
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                size="lg"
              >
                {currentQuestionIndex < questions.length - 1 ? 'השאלה הבאה' : 'סיים חידון'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentQuestionIndex
                  ? 'bg-green-500 text-white'
                  : index === currentQuestionIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabQuiz;
