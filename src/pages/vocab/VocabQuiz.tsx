import React, { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import vocabData from '@/data/vocab-static.json';

const VocabQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = vocabData.quizQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Initialize arrays if not done yet
  if (answeredQuestions.length === 0) {
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setUserAnswers(new Array(questions.length).fill(null));
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const newAnswered = [...answeredQuestions];
    const newUserAnswers = [...userAnswers];
    
    newAnswered[currentQuestionIndex] = true;
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    
    setAnsweredQuestions(newAnswered);
    setUserAnswers(newUserAnswers);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1]);
      setShowResult(answeredQuestions[currentQuestionIndex + 1]);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      setShowResult(answeredQuestions[currentQuestionIndex - 1]);
    }
  };

  const jumpToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(userAnswers[questionIndex]);
    setShowResult(answeredQuestions[questionIndex]);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setUserAnswers(new Array(questions.length).fill(null));
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
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header with better navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link to="/vocab" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">חזרה לאוצר מילים</span>
            <span className="sm:hidden">חזרה</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">חידון</h1>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>שאלה {currentQuestionIndex + 1} מתוך {questions.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span>ציון: {score}/{answeredQuestions.filter(Boolean).length}</span>
              </div>
            </div>
          </div>
          <div className="w-16 sm:w-32"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar - Mobile optimized */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <Card className="xl:sticky xl:top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  ניווט שאלות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 sm:grid-cols-10 xl:grid-cols-4 gap-1 sm:gap-2 mb-4">
                  {questions.map((_, index) => {
                    const isAnswered = answeredQuestions[index];
                    const isCurrent = index === currentQuestionIndex;
                    const isCorrect = isAnswered && userAnswers[index] === questions[index].correctAnswer;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => jumpToQuestion(index)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-105 ${
                          isCurrent
                            ? 'bg-blue-500 text-white ring-2 ring-blue-300 shadow-lg'
                            : isAnswered
                            ? isCorrect
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-slate-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                {/* Progress Statistics */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">התקדמות</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <div className="font-bold text-green-700">{score}</div>
                      <div className="text-green-600">נכונות</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <div className="font-bold text-blue-700">{answeredQuestions.filter(Boolean).length - score}</div>
                      <div className="text-blue-600">שגויות</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <Card className="mb-4 sm:mb-6">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm sm:text-base">{currentQuestionIndex + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl mb-1">
                        {currentQuestion.question}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {currentQuestion.type === 'translation' ? 'תרגום' :
                           currentQuestion.type === 'example' ? 'דוגמה' :
                           currentQuestion.type === 'synonym' ? 'מילה דומה' :
                           currentQuestion.type === 'fill' ? 'השלמה' : 'שאלה'}
                        </Badge>
                        {showResult && (
                          <Badge className={selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {selectedAnswer === currentQuestion.correctAnswer ? 'נכון!' : 'שגוי'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`p-3 sm:p-4 text-right rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800 shadow-lg'
                              : 'border-red-500 bg-red-50 text-red-800 shadow-lg'
                            : 'border-blue-500 bg-blue-50 shadow-md'
                          : showResult && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-800 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                      } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-medium">{option}</span>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs sm:text-sm font-bold text-slate-600">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {showResult && (
                            <div>
                              {index === currentQuestion.correctAnswer ? (
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                              ) : selectedAnswer === index ? (
                                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                    שאלה קודמת
                  </Button>

                  <div className="flex gap-3 order-1 sm:order-2">
                    {!showResult ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                        size="lg"
                        className="px-6 sm:px-8"
                      >
                        אשר תשובה
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        size="lg"
                        className="px-6 sm:px-8"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'השאלה הבאה' : 'סיים חידון'}
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1 || !showResult}
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto order-3"
                  >
                    שאלה הבאה
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Quick Navigation */}
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 rotate-180" />
              <span className="text-xs">קודמת</span>
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
              <div className="w-16 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1 || !showResult}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <span className="text-xs">הבאה</span>
              <ArrowLeft className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="xl:hidden h-20"></div>
      </div>
      <Footer />
    </>
  );
};

export default VocabQuiz;
