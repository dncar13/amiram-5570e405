import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  Trophy, 
  Target, 
  Calendar,
  Flame,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import vocabData from '@/data/vocab-static.json';
import { saveQuizResult } from '@/services/vocabularyServiceDemo';

interface QuizQuestion {
  id: string;
  word: string;
  translation: string;
  type: 'spelling' | 'meaning';
  options?: string[]; // For meaning questions
}

interface QuizResult {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface DailyQuizProps {
  onComplete?: (score: number, total: number, results: QuizResult[]) => void;
  className?: string;
}

export function DailyQuiz({ onComplete, className }: DailyQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [quizStartTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100 : 0;

  // Generate quiz questions
  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const shuffled = [...vocabData.words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 10);
    
    const quizQuestions: QuizQuestion[] = selectedWords.map((word, index) => {
      // Alternate between spelling and meaning questions
      const questionType = index % 2 === 0 ? 'spelling' : 'meaning';
      
      if (questionType === 'meaning') {
        // Generate wrong options for meaning questions
        const wrongOptions = shuffled
          .filter(w => w.id !== word.id)
          .slice(0, 3)
          .map(w => w.translation);
        
        const allOptions = [word.translation, ...wrongOptions];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        return {
          id: word.id,
          word: word.word,
          translation: word.translation,
          type: 'meaning',
          options: shuffledOptions
        };
      } else {
        return {
          id: word.id,
          word: word.word,
          translation: word.translation,
          type: 'spelling'
        };
      }
    });
    
    setQuestions(quizQuestions);
    setStartTime(Date.now());
  };

  const playAudio = useCallback(() => {
    if (!currentQuestion || currentQuestion.type !== 'spelling') return;
    
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn('שגיאה בהשמעת אודיו:', error);
    }
  }, [currentQuestion]);

  const checkAnswer = () => {
    if (!currentQuestion) return;

    const answer = currentQuestion.type === 'spelling' ? userAnswer.trim() : selectedOption;
    const correctAnswer = currentQuestion.type === 'spelling' ? currentQuestion.word : currentQuestion.translation;
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    const timeSpent = Date.now() - startTime;

    const result: QuizResult = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent
    };

    setCurrentResult(result);
    setResults(prev => [...prev, result]);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setSelectedOption('');
      setShowResult(false);
      setCurrentResult(null);
      setStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    const allResults = [...results, currentResult!];
    const correctAnswers = allResults.filter(r => r.isCorrect).length;
    const totalQuestions = questions.length;
    const totalTime = getTotalTime();
    
    // Save quiz result
    try {
      await saveQuizResult(correctAnswers, totalQuestions, totalTime, allResults);
      console.log('Quiz result saved successfully');
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
    
    if (onComplete) {
      onComplete(correctAnswers, totalQuestions, allResults);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setSelectedOption('');
    setResults([]);
    setShowResult(false);
    setCurrentResult(null);
    setIsFinished(false);
    generateQuestions();
  };

  const calculateScore = () => {
    const correctAnswers = results.filter(r => r.isCorrect).length + (currentResult?.isCorrect ? 1 : 0);
    return correctAnswers;
  };

  const getTotalTime = () => {
    const totalMs = Date.now() - quizStartTime;
    return Math.round(totalMs / 1000);
  };

  const getScoreEmoji = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🥇';
    if (percentage >= 70) return '🥈';
    if (percentage >= 60) return '🥉';
    return '💪';
  };

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Sparkles className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">מכין חידון יומי מותאם אישית...</p>
        </div>
      </div>
    );
  }

  // Finished state
  if (isFinished) {
    const finalScore = calculateScore();
    const totalTime = getTotalTime();
    const scorePercentage = (finalScore / questions.length) * 100;
    
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Trophy className="h-8 w-8 text-yellow-500" />
              חידון יומי הושלם!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl mb-4">
              {getScoreEmoji(finalScore, questions.length)}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{finalScore}</div>
                <div className="text-sm text-muted-foreground">תשובות נכונות</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{Math.round(scorePercentage)}%</div>
                <div className="text-sm text-muted-foreground">דיוק</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">{totalTime}s</div>
                <div className="text-sm text-muted-foreground">זמן כולל</div>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={scorePercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {finalScore} מתוך {questions.length} שאלות נענו נכון
              </p>
            </div>

            {/* Results breakdown */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-right">פירוט תוצאות:</h4>
              {[...results, currentResult!].map((result, index) => (
                <div key={index} className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  result.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-center gap-2">
                    {result.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{result.question.word}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold">{result.question.translation}</div>
                    {!result.isCorrect && (
                      <div className="text-red-600">שלך: {result.userAnswer}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={resetQuiz} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                חידון חדש
              </Button>
              <Button onClick={() => window.location.reload()}>
                סיום
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>שאלה {currentIndex + 1} מתוך {questions.length}</span>
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            חידון יומי
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3">
            {currentQuestion?.type === 'spelling' ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={playAudio}
                  title="השמע את המילה"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <span>🎧 האזן וכתוב את המילה</span>
              </>
            ) : (
              <>
                <Target className="h-5 w-5 text-blue-500" />
                <span>🎯 בחר את התרגום הנכון</span>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion?.type === 'spelling' ? (
            // Spelling question
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">
                  התרגום: <span className="font-semibold text-blue-600">{currentQuestion.translation}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  לחץ על הרמקול להשמעה וכתוב את המילה באנגלית
                </p>
              </div>

              {!showResult ? (
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="כתוב את המילה כאן..."
                  className="text-center text-lg font-mono"
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                />
              ) : currentResult && (
                <div className={cn(
                  "rounded-lg p-4 border text-center",
                  currentResult.isCorrect 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {currentResult.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={cn(
                      "font-semibold",
                      currentResult.isCorrect ? "text-green-800" : "text-red-800"
                    )}>
                      {currentResult.isCorrect ? "נכון! מעולה!" : "לא נכון"}
                    </span>
                  </div>
                  
                  {!currentResult.isCorrect && (
                    <div className="space-y-1 text-sm">
                      <p className="text-red-700">
                        כתבת: <span className="font-mono bg-red-100 px-2 py-1 rounded">{currentResult.userAnswer}</span>
                      </p>
                      <p className="text-green-700">
                        נכון: <span className="font-mono bg-green-100 px-2 py-1 rounded">{currentResult.question.word}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Meaning question
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold font-mono mb-2">{currentQuestion?.word}</h3>
                <p className="text-sm text-muted-foreground">בחר את התרגום הנכון</p>
              </div>

              {!showResult ? (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion?.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedOption === option ? "default" : "outline"}
                      onClick={() => setSelectedOption(option)}
                      className="h-auto p-4 text-right justify-start"
                    >
                      <span className="font-semibold ml-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              ) : currentResult && (
                <div className={cn(
                  "rounded-lg p-4 border text-center",
                  currentResult.isCorrect 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {currentResult.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={cn(
                      "font-semibold",
                      currentResult.isCorrect ? "text-green-800" : "text-red-800"
                    )}>
                      {currentResult.isCorrect ? "נכון! מעולה!" : "לא נכון"}
                    </span>
                  </div>
                  
                  <p className="text-green-700 text-sm">
                    תשובה נכונה: <span className="font-semibold">{currentResult.question.translation}</span>
                  </p>
                  {!currentResult.isCorrect && (
                    <p className="text-red-700 text-sm">
                      בחרת: <span className="font-semibold">{currentResult.userAnswer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            {!showResult ? (
              <Button 
                onClick={checkAnswer} 
                disabled={
                  currentQuestion?.type === 'spelling' 
                    ? !userAnswer.trim() 
                    : !selectedOption
                }
              >
                בדוק תשובה
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                {currentIndex < questions.length - 1 ? 'השאלה הבאה' : 'סיים חידון'}
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="text-xs text-muted-foreground text-center">
            💡 טיפ: {currentQuestion?.type === 'spelling' ? 'לחץ Enter לבדיקה מהירה' : 'בחר תשובה ולחץ "בדוק תשובה"'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
