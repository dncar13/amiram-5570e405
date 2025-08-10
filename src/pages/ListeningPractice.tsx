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

  // Audio controls - exactly like continuation system
  const playAudio = () => {
    if (!audioRef.current || !currentQuestion) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    let audioSrc = '';

    // Check if question has specific audio_url
    if (currentQuestion.audio_url) {
      audioSrc = currentQuestion.audio_url;
    }
    // Check for audio_url in metadata
    else if (currentQuestion.metadata?.audio_url) {
      audioSrc = currentQuestion.metadata.audio_url as string;
    }
    // Use fallback audio based on question type and stable_id
    else {
      const { audioFolder } = getPageInfo();
      
      // Map stable_id to specific audio file
      let audioIndex = 0;
      if (currentQuestion.stable_id?.includes('lc_')) {
        // For listening comprehension, cycle through audio files
        audioIndex = currentQuestionIndex % 4;
      } else if (currentQuestion.stable_id?.includes('wf_')) {
        // For word formation, use consistent audio
        audioIndex = (currentQuestionIndex + 1) % 4;
      } else if (currentQuestion.stable_id?.includes('gc_')) {
        // For grammar context, use different audio
        audioIndex = (currentQuestionIndex + 2) % 4;
      } else {
        // Default cycling
        audioIndex = currentQuestionIndex % 4;
      }
      
      const legacy = [
        `/audioFiles/${audioFolder}/firstQ.mp3`,
        `/audioFiles/${audioFolder}/secentQ.mp3`, 
        `/audioFiles/${audioFolder}/thitdQ.mp3`,
        `/audioFiles/${audioFolder}/fourthQ.mp3`
      ];
      
      audioSrc = legacy[audioIndex];
      console.log(`🔊 Using audio ${audioIndex + 1} for ${currentQuestion.stable_id}:`, audioSrc);
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
      
      // Use hardcoded questions that work
      const hardcodedQuestions: Question[] = [
        {
          id: "demo_1",
          question_text: "The company's ______ to expand internationally was met with enthusiasm from investors.",
          answer_options: ["decision", "decide", "decisively", "decisive"],
          correct_answer: "0",
          explanation: "נדרש שם עצם אחרי 's possessive. 'decision' היא צורת שם העצם של 'decide'.",
          difficulty: "easy",
          topic_id: 21,
          type: "word_formation"
        },
        {
          id: "demo_2",
          question_text: "The scientist made a ______ discovery that changed our understanding of genetics.",
          answer_options: ["revolutionary", "revolution", "revolutionize", "revolutionarily"],
          correct_answer: "0",
          explanation: "נדרש שם תואר לתאר את 'discovery'. 'revolutionary' פירושו מהפכני.",
          difficulty: "medium",
          topic_id: 21,
          type: "word_formation"
        },
        {
          id: "demo_3",
          question_text: "If I ______ you, I would accept the job offer.",
          answer_options: ["was", "were", "am", "will be"],
          correct_answer: "1",
          explanation: "במשפט תנאי מסוג שני, משתמשים ב-'were' לכל הגופים אחרי If.",
          difficulty: "medium",
          topic_id: 22,
          type: "grammar_in_context"
        },
        {
          id: "demo_4",
          question_text: "The team worked ______ to meet the deadline.",
          answer_options: ["tire", "tirelessly", "tiring", "tireless"],
          correct_answer: "1",
          explanation: "נדרש תואר הפועל לתאר איך הם עבדו. 'tirelessly' = ללא לאות.",
          difficulty: "easy",
          topic_id: 22,
          type: "grammar_in_context"
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
          metadata: {
            audio_script: "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting."
          }
        },
        {
          id: "demo_6",
          question_text: "According to the speaker, what happens during deep sleep?",
          answer_options: ["Students dream about their studies", "Neural connections are strengthened", "The body produces more energy", "The brain creates new memories"],
          correct_answer: "1",
          explanation: "הדובר מציין שבמהלך שינה עמוקה, הקשרים העצביים מתחזקים, מה שמקל על היזכרות במידע.",
          difficulty: "medium",
          topic_id: 23,
          type: "listening_comprehension",
          metadata: {
            audio_script: "Today we'll discuss the importance of sleep for academic performance. During deep sleep, neural connections are strengthened, making it easier to recall information later."
          }
        }
      ];
      
      // Filter hardcoded questions by current page type
      const filteredQuestions = hardcodedQuestions.filter(q => types.includes(q.type));
      setQuestions(filteredQuestions);
      console.log(`✅ Using ${filteredQuestions.length} hardcoded questions for ${types.join(', ')}`);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('שגיאה בטעינת השאלות');
    } finally {
      setLoading(false);
    }
  }, [getPageInfo]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentQuestionIndex];
  const { title, description } = getPageInfo();

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };
  
  const checkAnswer = () => {
    if (selectedAnswer === null || showResult) return;
    const correctAnswerIndex = parseInt(currentQuestion.correct_answer || '0');
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

  const correctAnswerIndex = parseInt(currentQuestion.correct_answer || '0');
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
