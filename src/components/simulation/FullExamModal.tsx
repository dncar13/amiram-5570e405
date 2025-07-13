import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Question } from '@/data/types/questionTypes';
import { getAllQuestions } from '@/services/questionsService';
import { useToast } from '@/hooks/use-toast';
import { saveActivity } from '@/hooks/useActivityHistory';

interface FullExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  timeRemaining: number; // in seconds (180 minutes = 10800 seconds)
  isExamStarted: boolean;
  isExamCompleted: boolean;
  examStartTime: Date | null;
}

const EXAM_DURATION = 180 * 60; // 180 minutes in seconds

export const FullExamModal: React.FC<FullExamModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const questionContainerRef = useRef<HTMLDivElement>(null);
  
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    timeRemaining: EXAM_DURATION,
    isExamStarted: false,
    isExamCompleted: false,
    examStartTime: null
  });

  const [showWarning, setShowWarning] = useState(false);

  // Initialize exam questions
  const initializeExam = useCallback(async () => {
    try {
      const allQuestions = await getAllQuestions();
      console.log(`[FullExam] Total questions available: ${allQuestions.length}`);
      
      if (allQuestions.length < 80) {
        toast({
          title: "שגיאה",
          description: "אין מספיק שאלות למבחן מלא",
          variant: "destructive"
        });
        return;
      }

      // Shuffle and take 80 questions
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const examQuestions = shuffled.slice(0, 80);
      
      console.log(`[FullExam] Selected ${examQuestions.length} questions for exam`);
      
      setExamState({
        questions: examQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(80).fill(null),
        timeRemaining: EXAM_DURATION,
        isExamStarted: false,
        isExamCompleted: false,
        examStartTime: null
      });
    } catch (error) {
      console.error('Error loading questions for full exam:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת שאלות למבחן",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Timer effect
  useEffect(() => {
    if (!examState.isExamStarted || examState.isExamCompleted) return;

    const timer = setInterval(() => {
      setExamState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - finish exam
          return {
            ...prev,
            timeRemaining: 0,
            isExamCompleted: true
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.isExamStarted, examState.isExamCompleted]);

  // Initialize exam when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeExam();
    }
  }, [isOpen, initializeExam]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scroll to top of question
  const scrollToQuestion = useCallback(() => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  // Start exam
  const startExam = () => {
    setExamState(prev => ({
      ...prev,
      isExamStarted: true,
      examStartTime: new Date()
    }));
    
    // Scroll to first question after starting
    setTimeout(() => {
      scrollToQuestion();
    }, 200);
    
    toast({
      title: "המבחן התחיל!",
      description: "בהצלחה! זכור: לא ניתן לחזור לשאלה קודמת",
      variant: "default"
    });
  };

  // Handle answer selection
  const selectAnswer = (answerIndex: number) => {
    if (examState.isExamCompleted) return;

    setExamState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return {
        ...prev,
        selectedAnswers: newAnswers
      };
    });
  };

  // Move to next question
  const nextQuestion = () => {
    if (examState.currentQuestionIndex < examState.questions.length - 1) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      
      // Scroll to top of next question after state update
      setTimeout(() => {
        scrollToQuestion();
      }, 100);
    } else {
      // Last question - finish exam
      finishExam();
    }
  };

  // Finish exam - Updated to save to history
  const finishExam = () => {
    setExamState(prev => ({
      ...prev,
      isExamCompleted: true
    }));

    // Calculate score
    const correctAnswers = examState.selectedAnswers.reduce((count, answer, index) => {
      if (answer !== null && examState.questions[index]?.correctAnswer === answer) {
        return count + 1;
      }
      return count;
    }, 0);

    const answeredQuestions = examState.selectedAnswers.filter(answer => answer !== null).length;
    const score = Math.round((correctAnswers / examState.questions.length) * 100);
    const timeSpentMinutes = Math.round((EXAM_DURATION - examState.timeRemaining) / 60);

    // Save to activity history
    const examResult = {
      date: new Date().toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      topic: 'מבחן מלא - אמיר"ם',
      questionId: 'full-exam',
      status: score >= 60 ? 'correct' : 'wrong' as 'correct' | 'wrong',
      time: timeSpentMinutes.toString(),
      score,
      correctAnswers,
      totalAnswered: answeredQuestions,
      isCompleted: true
    };

    // Save the activity
    const saved = saveActivity(examResult);
    
    if (saved) {
      console.log('[FullExam] Exam results saved to history:', examResult);
      toast({
        title: "המבחן הושלם ונשמר!",
        description: `הציון שלך: ${score}% (${correctAnswers}/${examState.questions.length}) נשמר בהיסטוריה`,
        variant: "default"
      });
    } else {
      console.error('[FullExam] Failed to save exam results');
      toast({
        title: "המבחן הושלם!",
        description: `הציון שלך: ${score}% (${correctAnswers}/${examState.questions.length}) - שגיאה בשמירה`,
        variant: "destructive"
      });
    }
  };

  // Handle modal close with warning
  const handleClose = () => {
    if (examState.isExamStarted && !examState.isExamCompleted) {
      setShowWarning(true);
    } else {
      onClose();
    }
  };

  // Force close exam
  const forceClose = () => {
    setShowWarning(false);
    onClose();
  };

  const currentQuestion = examState.questions[examState.currentQuestionIndex];
  const currentAnswer = examState.selectedAnswers[examState.currentQuestionIndex];
  const questionNumber = examState.currentQuestionIndex + 1;
  const isLastQuestion = examState.currentQuestionIndex === examState.questions.length - 1;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={handleClose}
          />
            {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full md:max-w-4xl md:max-h-[90vh] md:rounded-lg bg-white shadow-2xl overflow-hidden"
          >            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-2 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold">מבחן אמיר"ם מלא</h2>
                  {examState.isExamStarted && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-lg font-mono font-bold">
                        {formatTime(examState.timeRemaining)}
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {examState.isExamStarted && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>שאלה {questionNumber} מתוך {examState.questions.length}</span>
                    <span>עדיין לא ניתן לחזור אחורה</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(questionNumber / examState.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>            {/* Content */}
            <div className="p-1 md:p-2 max-h-[calc(100vh-120px)] md:max-h-[calc(90vh-160px)] overflow-y-auto">
              {!examState.isExamStarted ? (
                // Pre-exam screen
                <div className="text-center space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <AlertTriangle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 mb-3">כללי המבחן</h3>
                    <div className="text-right space-y-2 text-sm text-gray-700">
                      <p>• המבחן כולל 80 שאלות מעורבות</p>
                      <p>• זמן המבחן: 180 דקות (3 שעות)</p>
                      <p>• כל שאלה מוצגת פעם אחת בלבד</p>
                      <p>• לא ניתן לדלג או לחזור לשאלה קודמת</p>
                      <p>• אין הסברים תוך כדי המבחן</p>
                      <p>• המבחן מתקדם אוטומatically לשאלה הבאה</p>
                      <p className="font-bold text-red-600">• לא ניתן לעצור את המבחן לאחר התחלה!</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={startExam}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200"
                  >
                    התחל מבחן מלא
                  </button>
                </div>
              ) : examState.isExamCompleted ? (
                // Post-exam screen
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800">המבחן הושלם!</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="space-y-1 text-base">
                      <p>זמן שנותר: {formatTime(examState.timeRemaining)}</p>
                      <p>התוצאות נשמרו בהיסטוריה שלך</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-2 rounded-lg font-bold hover:from-blue-700 hover:to-purple-800 transition-all duration-200"
                  >
                    סגור
                  </button>
                </div>
              ) : (
                // During exam - show current question
                currentQuestion && (
                  <div ref={questionContainerRef} className="space-y-3">                    {/* Reading Comprehension Layout */}
                    {currentQuestion.type === 'reading-comprehension' ? (
                      <>                        {/* Mobile Layout - Stack vertically */}
                        <div className="md:hidden space-y-1">
                          {/* Reading Passage - Fixed height with scroll */}
                          <div className="bg-gray-50 rounded-none md:rounded-lg p-2 h-[35vh] overflow-y-auto">
                            <h3 className="text-base font-bold text-gray-800 mb-1 sticky top-0 bg-gray-50">קטע הקריאה</h3>
                            <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left', lineHeight: '1.4' }}>
                              {currentQuestion.passageText || currentQuestion.text || "No passage available"}
                            </div>
                          </div>

                          {/* Question - Remaining space */}
                          <div className="bg-blue-50 rounded-none md:rounded-lg p-2">
                            <h3 className="text-base font-bold text-gray-800 mb-1">
                              שאלה {questionNumber}: הבנת הנקרא
                            </h3>
                            <div className="text-gray-700 leading-relaxed text-sm mb-2 whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left', lineHeight: '1.4' }}>
                              {currentQuestion.text}
                            </div>

                            <div className="space-y-1">
                              {currentQuestion.options?.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectAnswer(index)}
                                  className={`w-full text-left p-2 text-sm rounded-none md:rounded-lg border-2 transition-all duration-200 ${
                                    currentAnswer === index
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                  dir="ltr"
                                  style={{ lineHeight: '1.3' }}
                                >
                                  <span className="font-bold ml-1">{String.fromCharCode(65 + index)}.</span>
                                  <span style={{ textAlign: 'left' }}>{option}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout - Side by side */}
                        <div className="hidden md:grid grid-cols-2 gap-3 h-[70vh]">
                          {/* Reading Passage */}
                          <div className="bg-gray-50 rounded-lg p-3 overflow-y-auto">
                            <h3 className="text-base font-bold text-gray-800 mb-2">קטע הקריאה</h3>
                            <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left' }}>
                              {currentQuestion.passageText || currentQuestion.text || "No passage available"}
                            </div>
                          </div>

                          {/* Question */}
                          <div className="flex flex-col">
                            <div className="bg-blue-50 rounded-lg p-3 mb-2">
                              <h3 className="text-base font-bold text-gray-800 mb-2">
                                שאלה {questionNumber}: הבנת הנקרא
                              </h3>
                              <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left' }}>
                                {currentQuestion.text}
                              </div>
                            </div>

                            <div className="space-y-2 flex-1">
                              {currentQuestion.options?.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectAnswer(index)}
                                  className={`w-full text-left p-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                                    currentAnswer === index
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                  dir="ltr"
                                >
                                  <span className="font-bold ml-2">{String.fromCharCode(65 + index)}.</span>
                                  <span style={{ textAlign: 'left' }}>{option}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (                      /* Other Question Types */
                      <>
                        <div className="bg-gray-50 rounded-none md:rounded-lg p-2 md:p-2">
                          <h3 className="text-base md:text-sm font-bold text-gray-800 mb-1 md:mb-1">
                            שאלה {questionNumber}: {currentQuestion.type === 'restatement' ? 'ניסוח מחדש' :
                                                  currentQuestion.type === 'sentence-completion' ? 'השלמת משפטים' : 'אוצר מילים'}
                          </h3>
                          <div className="text-gray-700 leading-relaxed text-sm md:text-xs whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left', lineHeight: '1.4' }}>
                            {currentQuestion.text}
                          </div>
                        </div>

                        <div className="space-y-1 md:space-y-1">
                          {currentQuestion.options?.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => selectAnswer(index)}
                              className={`w-full text-left p-2 md:p-1.5 text-sm md:text-xs rounded-none md:rounded-lg border-2 transition-all duration-200 ${
                                currentAnswer === index
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              dir="ltr"
                              style={{ lineHeight: '1.3' }}
                            >
                              <span className="font-bold ml-1 md:ml-1">{String.fromCharCode(65 + index)}.</span>
                              <span style={{ textAlign: 'left' }}>{option}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-2 md:pt-2 px-2 md:px-0">
                      <div className="text-sm md:text-xs text-gray-500">
                        {currentAnswer !== null ? 'תשובה נבחרה' : 'בחר תשובה'}
                      </div>
                      
                      <button
                        onClick={nextQuestion}
                        disabled={currentAnswer === null}
                        className={`flex items-center space-x-2 md:space-x-1 px-4 py-2 md:px-3 md:py-1.5 text-sm md:text-xs rounded-lg font-bold transition-all duration-200 ${
                          currentAnswer !== null
                            ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>{isLastQuestion ? 'סיים מבחן' : 'שאלה הבאה'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Warning Modal */}
          {showWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center z-10"
            >
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="text-center space-y-4">
                  <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800">אזהרה!</h3>
                  <p className="text-gray-600">
                    אתה בתוך מבחן. אם תצא עכשיו, המבחן יפסל ולא תוכל לחזור אליו.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowWarning(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                    >
                      המשך במבחן
                    </button>
                    <button
                      onClick={forceClose}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                    >
                      צא ממבחן
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default FullExamModal;
