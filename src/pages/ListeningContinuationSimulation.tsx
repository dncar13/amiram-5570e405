import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, PlayCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Headphones, ChevronRight, Play, Pause } from 'lucide-react';
import { Question } from '@/data/types/questionTypes';
import { getQuestionsByType } from '@/services/questionsService';

interface Props {
  setId: string;
}

const ListeningContinuationSimulation: React.FC<Props> = ({ setId = "1" }) => {
  const [questions, setQuestions] = useState<(Question & { audioUrl?: string; metadata?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        
        if (setId === "smoketest") {
          // Load our smoke test questions
          const allQuestions = await getQuestionsByType('listening_continuation');
          const smokeTestQuestions = allQuestions.filter(q => 
            (q.metadata as any)?.listening_set === 'smoketest'
          );
          
          // Map audioUrl from metadata if it exists there
            const questionsWithAudio = smokeTestQuestions.map(q => ({
            ...q,
            audioUrl: (q as any).audioUrl || (q.metadata as any)?.audio_url
          }));
          
          setQuestions(questionsWithAudio);
        } else {
          // Use hardcoded questions for set 1 (backward compatibility)
          const hardcodedQuestions: Question[] = [
            {
              id: "1",
              type: "listening",
              text: "Sarah was walking through the park when she noticed something unusual. The birds had suddenly stopped singing, and there was an eerie silence. She looked around and...",
              options: [
                "saw a beautiful rainbow appearing in the sky",
                "noticed a large hawk circling overhead",
                "heard her phone ringing loudly",
                "decided to go home immediately"
              ],
              correctAnswer: 1,
              explanation: "הנץ הגדול שחג מעל גרם לציפורים להפסיק לשיר - זו תגובה טבעית של ציפורים קטנות כשהן מזהות טורף.",
              difficulty: "medium"
            },
            {
              id: "2", 
              type: "listening",
              text: "The meeting was supposed to start at 9 AM, but when David arrived at the conference room, he found it empty. He checked his calendar again and...",
              options: [
                "realized the meeting was actually scheduled for tomorrow",
                "saw everyone was waiting in the other conference room",
                "noticed an email saying the meeting was cancelled",
                "decided to start the meeting by himself"
              ],
              correctAnswer: 2,
              explanation: "ההמשך ההגיוני ביותר הוא שדיוויד קיבל הודעת ביטול במייל - זה מסביר למה החדר ריק.",
              difficulty: "easy"
            },
            {
              id: "3",
              type: "listening", 
              text: "The chef carefully tasted the soup and frowned. Something was missing. He thought for a moment, then...",
              options: [
                "threw the entire pot away",
                "added a pinch of salt and some fresh herbs",
                "called for the restaurant manager",
                "served it to the customers anyway"
              ],
              correctAnswer: 1,
              explanation: "שף מקצועי יוסיף תבלינים חסרים (מלח ועשבי תיבול) כדי לתקן את הטעם - זו הפעולה הסבירה ביותר.",
              difficulty: "medium"
            },
            {
              id: "4",
              type: "listening",
              text: "As the plane began its descent, Emma looked out the window and saw the city lights below. The captain announced that...",
              options: [
                "they would be landing in approximately 20 minutes",
                "there was severe turbulence ahead", 
                "they needed to return to the departure airport",
                "dinner would be served shortly"
              ],
              correctAnswer: 0,
              explanation: "בזמן נחיתה, ההודעה הסטנדרטית של הקפטן היא על זמן הנחיתה הצפוי - זה ההמשך ההגיוני ביותר.",
              difficulty: "easy"
            }
          ];
          setQuestions(hardcodedQuestions);
        }
        
      } catch (err) {
        console.error('Failed to load listening continuation questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [setId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle loading and error states
  if (loading) {
    return (
      <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/40 p-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-slate-300">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
            Loading questions...
          </div>
        </div>
      </Card>
    );
  }
  
  if (error || questions.length === 0) {
    return (
      <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/40 p-8">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'No questions found'}</p>
          <p className="text-slate-300">Please check if the listening continuation questions are available.</p>
        </div>
      </Card>
    );
  }

  const playAudio = () => {
    if (!audioRef.current || !currentQuestion) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    let audioSrc = '';

    if (currentQuestion.audioUrl) {
      audioSrc = currentQuestion.audioUrl;        // Primary source
    } else if (setId === '1') {
      // Legacy fallback only for set 1
      const legacy = [
        '/audioFiles/tests/firstQ.mp3',
        '/audioFiles/tests/secentQ.mp3',
        '/audioFiles/tests/thitdQ.mp3',
        '/audioFiles/tests/fourthQ.mp3'
      ];
      audioSrc = legacy[currentQuestionIndex] || '';
    } else {
      console.warn('No audioUrl for this question (no fallback for non-legacy sets).');
      return;
    }

    if (audioSrc) {
      console.log(`🔊 Playing audio for set ${setId}:`, audioSrc);
      audioRef.current.src = audioSrc;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error playing audio:', err);
          console.log('Attempted to play:', audioSrc);
        });
    } else {
      console.log('No audio source available for question:', currentQuestion.id);
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Audio event handlers
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

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer !== null) {
      setShowFeedback(true);
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      resetAudio(); // Reset audio when moving to next question
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore({ correct: 0, total: 0 });
    setIsStarted(false);
    resetAudio();
  };

  const startSimulation = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/40 p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <Headphones className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">השלמת קטע שמע - סט {setId}</h3>
          <p className="text-slate-300 mb-6">
            4 קטעי שמע קצרים (~20 שניות). בכל קטע תשמעו את ההתחלה ותבחרו את ההמשך המתאים ביותר.
          </p>
          <Button
            onClick={startSimulation}
            className="bg-purple-600 hover:bg-purple-700 inline-flex items-center gap-2"
          >
            התחל סימולציה
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/40 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-slate-400">
            קטע {currentQuestionIndex + 1} מתוך {questions.length}
          </div>
          {score.total > 0 && (
            <div className="text-sm text-slate-400">
              ניקוד: {score.correct}/{score.total}
            </div>
          )}
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Main Content */}
      <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/40 p-6">
        {!showFeedback ? (
          <>
            {/* Missing Audio Alert */}
            {!currentQuestion.audioUrl && setId !== '1' && (
              <Card className="mb-4 p-3 bg-yellow-600/10 border-yellow-500/30">
                <p className="text-yellow-300 text-sm text-center">
                  ⚠️ Audio missing for this item
                </p>
              </Card>
            )}

            {/* Audio Player */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <Button
                  onClick={playAudio}
                  variant="ghost"
                  size="lg"
                  className={`group relative w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-500/40 hover:bg-purple-600/30 ${
                    (!currentQuestion.audioUrl && setId !== '1') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!currentQuestion.audioUrl && setId !== '1'}
                >
                  {isPlaying ? (
                    <Pause size={32} className="text-purple-300" />
                  ) : (
                    <Play size={32} className="text-purple-300" />
                  )}
                </Button>
              </div>
              
              {/* Audio Progress Bar */}
              {duration > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-slate-400">{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{formatTime(duration)}</span>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={resetAudio}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-purple-300"
                    >
                      <RotateCcw size={16} className="ml-1" />
                      אפס
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="text-center text-slate-400 text-sm">
                {isPlaying ? "מנגן קטע שמע..." : "לחץ להשמעת הקטע"}
              </div>
            </div>

            {/* Instructions */}
            <Card className="mb-6 p-3 bg-slate-700/50 border-slate-600/40">
              <p className="text-slate-300 text-sm text-center">
                האזן לקטע ובחר את ההמשך המתאים ביותר
              </p>
            </Card>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-right rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-semibold text-slate-400 ml-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* Check Button */}
            <Button
              onClick={checkAnswer}
              disabled={selectedAnswer === null}
              className={`w-full ${
                selectedAnswer === null
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              בדוק תשובה
            </Button>
          </>
        ) : (
          <>
            {/* Feedback Phase */}
            <Card className="mb-6 p-4 bg-slate-700/50 border-slate-600/40">
              <div className="flex items-center mb-3">
                <Volume2 className="w-5 h-5 text-slate-400 ml-2" />
                <span className="font-semibold text-slate-300">טקסט הקטע:</span>
              </div>
              <p className="text-slate-100 italic leading-relaxed">"{currentQuestion.text}"</p>
              
              <Button
                onClick={playAudio}
                variant="ghost"
                className="mt-3 text-sm text-purple-400 hover:text-purple-300 h-auto p-0"
              >
                {isPlaying ? <Pause size={16} className="ml-1" /> : <Play size={16} className="ml-1" />}
                {isPlaying ? 'עצור' : 'השמע שוב'}
              </Button>
            </Card>

            {/* Answer Review */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options?.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer;
                const isSelected = index === selectedAnswer;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? 'border-green-500/60 bg-green-600/10'
                        : isSelected
                        ? 'border-red-500/60 bg-red-600/10'
                        : 'border-slate-700 bg-slate-800/20 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <span className="font-semibold text-slate-400 ml-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className={`${isCorrect ? 'text-green-300' : isSelected ? 'text-red-300' : 'text-slate-500'}`}>
                          {option}
                        </span>
                      </div>
                      {isCorrect && <CheckCircle size={20} className="text-green-400" />}
                      {isSelected && !isCorrect && <XCircle size={20} className="text-red-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <Card className="mb-6 p-4 bg-purple-600/10 border-purple-500/30">
              <h3 className="font-semibold text-purple-300 mb-2">הסבר:</h3>
              <p className="text-slate-200">{currentQuestion.explanation}</p>
            </Card>

            {/* Navigation */}
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={nextQuestion}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center justify-center"
              >
                לקטע הבא
                <ArrowRight size={20} className="mr-2" />
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className="text-center p-4 bg-green-600/10 border-green-500/30">
                  <p className="text-lg font-semibold text-green-300 mb-2">
                    סיימת את הסימולציה! 🎉
                  </p>
                  <p className="text-slate-300">
                    ציון סופי: {score.correct}/{score.total} ({Math.round((score.correct/score.total) * 100)}%)
                  </p>
                </Card>
                <Button
                  onClick={resetQuiz}
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                >
                  התחל מחדש
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Audio element with event handlers */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />
    </div>
  );
};

export default ListeningContinuationSimulation;