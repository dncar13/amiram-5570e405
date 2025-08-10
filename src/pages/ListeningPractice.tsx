import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2 } from "lucide-react";
import { getQuestionsByType } from '@/services/questionsService';

interface Question {
  id: string;
  question_text: string;
  answer_options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  topic_id: number;
  type: string;
  audio_url?: string;
  stable_id?: string;
  metadata?: Record<string, unknown>;
}

const ListeningPractice: React.FC = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get page configuration based on route
  const getPageInfo = useCallback(() => {
    const path = location.pathname;
    
    if (path.includes('/comprehension')) {
      return {
        types: ['listening_comprehension'],
        topics: [23],
        title: 'הבנת הנשמע',
        description: 'שאלות הבנת הנשמע עם קטעי אודיו',
        audioFolder: 'listening-comprehension'
      };
    }
    
    if (path.includes('/word-formation')) {
      return {
        types: ['word_formation'],
        topics: [21],
        title: 'Word Formation עם השמע',
        description: 'שאלות Word Formation בהקשר של הבנת השמע',
        audioFolder: 'word-formation'
      };
    }
    
    if (path.includes('/grammar-context')) {
      return {
        types: ['grammar_in_context'],
        topics: [22],
        title: 'Grammar in Context עם השמע',
        description: 'שאלות דקדוק בהקשר של הבנת השמע',
        audioFolder: 'grammar-context'
      };
    }
    
    return {
      types: ['word_formation', 'grammar_in_context', 'listening_comprehension'],
      topics: [21, 22, 23],
      title: 'תרגול מעורב',
      description: 'כל סוגי השאלות',
      audioFolder: 'tests'
    };
  }, [location.pathname]);

  // Audio controls - show script or play appropriate audio
  const playAudio = () => {
    if (!audioRef.current || !currentQuestion) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // For questions with audio_script, always show the script first
    if (currentQuestion.metadata?.audio_script) {
      const script = currentQuestion.metadata.audio_script as string;
      alert(`🎧 הטקסט הנכון לשאלה:\n\n"${script}"\n\n💡 זה הטקסט שאמור להיות באודיו. האודיו הנוכחי אינו תואם לשאלה.`);
      return;
    }

    // Fallback to existing audio files only if no script
    let audioSrc = '';
    if (currentQuestion.audio_url) {
      audioSrc = currentQuestion.audio_url;
    } else {
      const { audioFolder } = getPageInfo();
      const audioIndex = currentQuestionIndex % 4;
      const legacy = [
        `/audioFiles/${audioFolder}/firstQ.mp3`,
        `/audioFiles/${audioFolder}/secentQ.mp3`, 
        `/audioFiles/${audioFolder}/thitdQ.mp3`,
        `/audioFiles/${audioFolder}/fourthQ.mp3`
      ];
      audioSrc = legacy[audioIndex];
    }

    if (audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error playing audio:', err);
          alert(`לא ניתן להשמיע אודיו: ${audioSrc}`);
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Fetch questions from database
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { types } = getPageInfo();
      
      // Always use hardcoded questions for now (database integration disabled)
      const hardcodedQuestions = [
        {
          id: "demo_1",
          question_text: "What's the correct form? 'The new manager is very _____ and works well with teams.'",
          answer_options: ["collaborative", "collaboration", "collaborating", "collaboratively"],
          correct_answer: "0",
          explanation: "כאן נדרש תואר (adjective) לתיאור המנהל. 'collaborative' הוא התואר הנכון.",
          difficulty: "medium",
          topic_id: 15,
          type: "word_formation"
        },
        {
          id: "demo_2", 
          question_text: "Complete: 'The company's _____ policy has led to increased employee satisfaction.'",
          answer_options: ["flexible", "flexibility", "flexibly", "flexing"],
          correct_answer: "1",
          explanation: "לפני 'policy' נדרש שם עצם. 'flexibility' הוא שם העצם הנכון.",
          difficulty: "medium",
          topic_id: 21,
          type: "word_formation"
        },
        {
          id: "demo_5",
          question_text: "What is the main reason Sarah wants to go to the farmers market?",
          answer_options: ["To meet Mike for breakfast", "To buy vegetables for a dinner party", "To sell her own produce", "To try the new coffee stand"],
          correct_answer: "1",
          explanation: "שרה מזכירה במפורש שהיא צריכה ירקות טריים למסיבת ארוחת ערב שהיא מארחת.",
          difficulty: "easy",
          topic_id: 23,
          type: "listening_comprehension",
          audio_url: "/audioFiles/comprehension/lec_4aa6ee856a45.mp3",
          metadata: {
            audio_script: "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting.",
            audio_url: "/audioFiles/comprehension/lec_4aa6ee856a45.mp3"
          }
        },
        {
          id: "demo_6",
          question_text: "According to the lecture, how many hours of sleep do students need for optimal academic performance?",
          answer_options: ["Six hours", "At least eight hours", "Exactly seven hours", "No specific amount mentioned"],
          correct_answer: "1", 
          explanation: "המרצה מציין במפורש שסטודנטים שישנים לפחות שמונה שעות מציגים ביצועים טובים יותר במבחנים.",
          difficulty: "easy",
          topic_id: 23,
          type: "listening_comprehension",
          audio_url: "/audioFiles/comprehension/lec_29057a221e8f.mp3",
          metadata: {
            audio_script: "Good morning, class. Today we'll discuss the importance of sleep for academic performance. Recent studies show that students who get at least eight hours of sleep perform significantly better on exams than those who sleep less. The brain uses sleep time to consolidate memories and process information from the day. During deep sleep, neural connections are strengthened, making it easier to recall information later.",
            audio_url: "/audioFiles/comprehension/lec_29057a221e8f.mp3"
          }
        }
      ];
      
      // Filter hardcoded questions by current page type
      const filteredQuestions = hardcodedQuestions.filter(q => types.includes(q.type));
      setQuestions(filteredQuestions);
      console.log(`✅ Using ${filteredQuestions.length} fallback questions for ${types.join(', ')}`);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('שגיאה בטעינת השאלות');
    } finally {
      setLoading(false);
    }
  }, [getPageInfo]);  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentQuestionIndex];
  const { title, description } = getPageInfo();
  const correctAnswerIndex = currentQuestion ? parseInt(currentQuestion.correct_answer || '0') : 0;

  // Safety check
  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-white">טוען שאלות...</div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };
  
  const checkAnswer = () => {
    if (selectedAnswer === null || showResult) return;
    const isCorrectNow = selectedAnswer === correctAnswerIndex;
    setShowResult(true);
    setScore(prev => ({ correct: prev.correct + (isCorrectNow ? 1 : 0), total: prev.total + 1 }));
    stopAudio();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      stopAudio();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    stopAudio();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="animate-pulse">טוען שאלות...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="text-red-400">{error}</div>
            <Button onClick={fetchQuestions} className="mt-4">
              נסה שוב
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-white">לא נמצאו שאלות</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isCorrect = selectedAnswer === correctAnswerIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-blue-200">{description}</p>
          <div className="mt-4">
            <Badge variant="outline" className="text-white border-white">
              שאלה {currentQuestionIndex + 1} מתוך {questions.length}
            </Badge>
          </div>
        </div>

        {!isStarted ? (
          <Card className="max-w-2xl mx-auto p-8 bg-slate-800/80 border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                <Headphones className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-slate-300 mb-6">{description}</p>
              <Button onClick={() => setIsStarted(true)} className="bg-purple-600 hover:bg-purple-700">
                התחל
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Progress Header */}
            <Card className="bg-slate-800/80 border-slate-700 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-slate-400">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</div>
                {score.total > 0 && (
                  <div className="text-sm text-slate-400">ניקוד: {score.correct}/{score.total}</div>
                )}
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </Card>

            {/* Question Card */}
            <Card className="max-w-4xl mx-auto p-6 bg-slate-800/80 border-slate-700">
              {/* Audio Controls */}
              <div className="mb-6 text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Button
                    onClick={playAudio}
                    variant="ghost"
                    size="lg"
                    className="group relative w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-500/40 hover:bg-purple-600/30"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-purple-300" />
                    ) : (
                      <Play className="w-8 h-8 text-purple-300" />
                    )}
                  </Button>
                  <Button onClick={stopAudio} variant="ghost" size="sm" className="text-slate-400 hover:text-purple-300">
                    <RotateCcw className="w-4 h-4" />
                    אפס
                  </Button>
                </div>

                {/* Show audio script if available */}
                {currentQuestion?.metadata?.audio_script && (
                  <div className="mb-4 p-4 bg-amber-50/90 border border-amber-200 rounded-lg">
                    <div className="text-sm text-amber-800 font-medium mb-2 flex items-center">
                      📜 הטקסט לאודיו (זה מה שהשאלה מבוססת עליו):
                    </div>
                    <div className="text-gray-800 italic font-light text-sm">
                      "{currentQuestion.metadata.audio_script as string}"
                    </div>
                    <div className="text-xs text-amber-600 mt-2">
                      💡 האודיו הנוכחי זמני - זה הטקסט הנכון לשאלה
                    </div>
                  </div>
                )}

                {duration > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-slate-400">{Math.floor(currentTime/60)}:{String(Math.floor(currentTime%60)).padStart(2,'0')}</span>
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }} />
                      </div>
                      <span className="text-sm text-slate-400">{Math.floor(duration/60)}:{String(Math.floor(duration%60)).padStart(2,'0')}</span>
                    </div>
                  </div>
                )}

                <div className="text-purple-300 text-sm">
                  {isPlaying ? 'מושמע כעת...' : 'לחץ Play להשמעת הקטע'}
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {currentQuestion.question_text}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.answer_options.map((option, index) => {
                  if (showResult) {
                    const isSelected = index === selectedAnswer;
                    const isCorrectOpt = index === correctAnswerIndex;
                    const cls = isCorrectOpt
                      ? 'w-full p-4 text-right rounded-lg border bg-green-600 border-green-500 text-white'
                      : isSelected
                      ? 'w-full p-4 text-right rounded-lg border bg-red-600 border-red-500 text-white'
                      : 'w-full p-4 text-right rounded-lg border bg-slate-700 border-slate-600 text-gray-300';
                    return (
                      <div key={index} className={cls}>
                        <span className="font-semibold ml-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </div>
                    );
                  } else {
                    const selected = index === selectedAnswer;
                    const base = 'w-full p-4 text-right rounded-lg border transition-all duration-200 ';
                    const cls = selected
                      ? base + 'bg-purple-600/20 border-purple-500 text-white'
                      : base + 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500';
                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={cls}
                        variant="ghost"
                      >
                        <span className="font-semibold ml-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    );
                  }
                })}
              </div>

              {/* Feedback */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה'}
                    </span>
                  </div>
                  <p className="text-gray-300">{currentQuestion.explanation}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                {!showResult ? (
                  <Button onClick={checkAnswer} className="bg-purple-600 hover:bg-purple-700 text-white">
                    בדוק תשובה
                  </Button>
                ) : (
                  currentQuestionIndex < questions.length - 1 && (
                    <Button onClick={nextQuestion} className="bg-purple-600 hover:bg-purple-700 text-white">
                      השאלה הבאה
                    </Button>
                  )
                )}

                <Button
                  onClick={resetQuestion}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  אפס שאלה
                </Button>
              </div>
            </Card>

            {/* Question Info */}
            <div className="text-center text-sm text-gray-400">
              <p>שאלות דמו לתרגול הבנת השמע</p>
              <p className="mt-1">
                Topic ID: {currentQuestion?.topic_id} | Type: {currentQuestion?.type}
              </p>
            </div>
          </>
        )}

        {/* Audio Element */}
        <audio 
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />
      </main>

      <Footer />
    </div>
  );
};

export default ListeningPractice;
