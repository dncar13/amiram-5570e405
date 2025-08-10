import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

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
    }
  };

  // Fetch questions from database
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { types, topics } = getPageInfo();

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .in('topic_id', topics)
        .in('type', types)
        .eq('ai_generated', true)
        .like('stable_id', 'demo_%')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching questions:', error);
        setError('שגיאה בטעינת השאלות');
        return;
      }

      if (!data || data.length === 0) {
        setError('לא נמצאו שאלות מהסוג הזה');
        return;
      }

      // Convert database questions to our Question interface
      const convertedQuestions: Question[] = data.map(q => ({
        id: q.id,
        question_text: q.question_text,
        answer_options: Array.isArray(q.answer_options) ? q.answer_options : 
                       typeof q.answer_options === 'string' ? JSON.parse(q.answer_options) : [],
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic_id: q.topic_id,
        type: q.type,
        audio_url: (q as Record<string, unknown>).audio_url as string | undefined,
        stable_id: q.stable_id,
        metadata: q.metadata as Record<string, unknown>
      }));

      setQuestions(convertedQuestions);
      console.log(`✅ Loaded ${data.length} questions for ${types.join(', ')}`);

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

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
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

        {/* Question Card */}
        <Card className="max-w-4xl mx-auto p-6 bg-slate-800/50 border-slate-700">
          {/* Audio Controls - Same as Continuation */}
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Button
                onClick={playAudio}
                size="lg"
                className={`rounded-full w-16 h-16 ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </Button>
              
              <Button
                onClick={stopAudio}
                variant="outline"
                size="sm"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
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
              let buttonClass = "w-full p-4 text-left rounded-lg border transition-all duration-200 ";
              
              if (showResult) {
                if (index === correctAnswerIndex) {
                  buttonClass += "bg-green-600 border-green-500 text-white";
                } else if (index === selectedAnswer && index !== correctAnswerIndex) {
                  buttonClass += "bg-red-600 border-red-500 text-white";
                } else {
                  buttonClass += "bg-slate-700 border-slate-600 text-gray-300";
                }
              } else {
                buttonClass += "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500";
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'
              }`}
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

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={resetQuestion}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              נסה שוב
            </Button>

            {showResult && currentQuestionIndex < questions.length - 1 && (
              <Button
                onClick={nextQuestion}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                השאלה הבאה
              </Button>
            )}
          </div>
        </Card>

        {/* Question Info */}
        <div className="text-center text-sm text-gray-400">
          <p>שאלות דמו לתרגול הבנת השמע</p>
          <p className="mt-1">
            Topic ID: {currentQuestion?.topic_id} | Type: {currentQuestion?.type}
          </p>
        </div>

        {/* Audio Element - Same as Continuation */}
        <audio 
          ref={audioRef}
          onTimeUpdate={() => {}}
          onLoadedMetadata={() => {}}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />
      </main>

      <Footer />
    </div>
  );
};

export default ListeningPractice;
