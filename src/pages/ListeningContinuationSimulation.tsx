import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, PlayCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Headphones, ChevronRight, Play, Pause } from 'lucide-react';

interface Props {
  setId: string;
}

const ListeningContinuationSimulation: React.FC<Props> = ({ setId = "1" }) => {
  // Sample questions for listening continuation
  const questions = [
    {
      id: 1,
      audioText: "Sarah was walking through the park when she noticed something unusual. The birds had suddenly stopped singing, and there was an eerie silence. She looked around and...",
      options: [
        "saw a beautiful rainbow appearing in the sky",
        "noticed a large hawk circling overhead",
        "heard her phone ringing loudly",
        "decided to go home immediately"
      ],
      correct: 1,
      explanation: "הנץ הגדול שחג מעל גרם לציפורים להפסיק לשיר - זו תגובה טבעית של ציפורים קטנות כשהן מזהות טורף."
    },
    {
      id: 2,
      audioText: "The meeting was supposed to start at 9 AM, but when David arrived at the conference room, he found it empty. He checked his calendar again and...",
      options: [
        "realized the meeting was actually scheduled for tomorrow",
        "saw everyone was waiting in the other conference room",
        "noticed an email saying the meeting was cancelled",
        "decided to start the meeting by himself"
      ],
      correct: 2,
      explanation: "ההמשך ההגיוני ביותר הוא שדיוויד קיבל הודעת ביטול במייל - זה מסביר למה החדר ריק."
    },
    {
      id: 3,
      audioText: "The chef carefully tasted the soup and frowned. Something was missing. He thought for a moment, then...",
      options: [
        "threw the entire pot away",
        "added a pinch of salt and some fresh herbs",
        "called for the restaurant manager",
        "served it to the customers anyway"
      ],
      correct: 1,
      explanation: "שף מקצועי יוסיף תבלינים חסרים (מלח ועשבי תיבול) כדי לתקן את הטעם - זו הפעולה הסבירה ביותר."
    },
    {
      id: 4,
      audioText: "As the plane began its descent, Emma looked out the window and saw the city lights below. The captain announced that...",
      options: [
        "they would be landing in approximately 20 minutes",
        "there was severe turbulence ahead",
        "they needed to return to the departure airport",
        "dinner would be served shortly"
      ],
      correct: 0,
      explanation: "בזמן נחיתה, ההודעה הסטנדרטית של הקפטן היא על זמן הנחיתה הצפוי - זה ההמשך ההגיוני ביותר."
    }
  ];

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

  // Audio file mapping
  const audioFiles = [
    '/audioFiles/tests/firstQ.mp3',
    '/audioFiles/tests/secentQ.mp3', 
    '/audioFiles/tests/thitdQ.mp3',
    '/audioFiles/tests/fourthQ.mp3'
  ];

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = audioFiles[currentQuestionIndex];
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Error playing audio:', err));
      }
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
      const isCorrect = selectedAnswer === currentQuestion.correct;
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
            {/* Audio Player */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <Button
                  onClick={playAudio}
                  variant="ghost"
                  size="lg"
                  className={`group relative w-20 h-20 rounded-full bg-purple-600/20 border-2 border-purple-500/40 hover:bg-purple-600/30`}
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
              {currentQuestion.options.map((option, index) => (
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
              <p className="text-slate-100 italic leading-relaxed">"{currentQuestion.audioText}"</p>
              
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
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct;
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