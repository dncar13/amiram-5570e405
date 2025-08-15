import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Check, X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Word {
  id: string;
  word: string;
  translation: string;
  example?: string;
  level: string;
  category: string;
}

interface FlashcardTabProps {
  words: Word[];
  onUpdateMastery?: (wordId: string, isCorrect: boolean) => void;
}

const FlashcardTab: React.FC<FlashcardTabProps> = ({ words, onUpdateMastery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<Set<string>>(new Set());
  const [correctWords, setCorrectWords] = useState<Set<string>>(new Set());
  
  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
  const reviewedCount = reviewedWords.size;
  const correctCount = correctWords.size;
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentWord) return;
      
      switch (e.key) {
        case ' ': // Space to flip
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'ArrowLeft': // Previous card
          goToPrevious();
          break;
        case 'ArrowRight': // Next card
          goToNext();
          break;
        case '1': // Mark as incorrect
          if (isFlipped) handleMarkIncorrect();
          break;
        case '2': // Mark as correct
          if (isFlipped) handleMarkCorrect();
          break;
        case 'Escape': // Reset flip
          setIsFlipped(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, isFlipped]);
  
  // Navigation functions
  const goToNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  
  // Play audio pronunciation
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  
  // Mark word as correct/incorrect
  const handleMarkCorrect = () => {
    if (!currentWord) return;
    
    const newReviewed = new Set(reviewedWords);
    const newCorrect = new Set(correctWords);
    
    newReviewed.add(currentWord.id);
    newCorrect.add(currentWord.id);
    
    setReviewedWords(newReviewed);
    setCorrectWords(newCorrect);
    
    // Update mastery in parent component
    onUpdateMastery?.(currentWord.id, true);
    
    // Auto-advance to next card
    setTimeout(goToNext, 500);
  };
  
  const handleMarkIncorrect = () => {
    if (!currentWord) return;
    
    const newReviewed = new Set(reviewedWords);
    newReviewed.add(currentWord.id);
    setReviewedWords(newReviewed);
    
    // Remove from correct if it was there
    const newCorrect = new Set(correctWords);
    newCorrect.delete(currentWord.id);
    setCorrectWords(newCorrect);
    
    // Update mastery in parent component
    onUpdateMastery?.(currentWord.id, false);
    
    // Auto-advance to next card
    setTimeout(goToNext, 500);
  };
  
  // Reset session
  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedWords(new Set());
    setCorrectWords(new Set());
  };
  
  // Level colors
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Target className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">אין מילים לתרגול</h3>
        <p className="text-gray-500">נסה לשנות את המסננים כדי למצוא מילים לתרגל</p>
      </div>
    );
  }
  
  // Session complete
  if (currentIndex >= words.length) {
    const accuracy = words.length > 0 ? (correctCount / words.length) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-green-100 rounded-full p-6 mb-6">
          <Check className="w-16 h-16 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">מעולה! סיימת את הסט</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{words.length}</div>
            <div className="text-sm text-gray-600">מילים</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-600">נכונות</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{accuracy.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">דיוק</div>
          </div>
        </div>
        <Button onClick={resetSession} className="flex items-center gap-2">
          <RotateCcw size={16} />
          התחל מחדש
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Progress header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">
              {currentIndex + 1} / {words.length}
            </span>
            <Badge className={getLevelColor(currentWord.level)}>
              {currentWord.level === 'easy' ? 'קל' : currentWord.level === 'medium' ? 'בינוני' : 'קשה'}
            </Badge>
            <Badge variant="outline">{currentWord.category}</Badge>
          </div>
          <div className="text-sm text-gray-600">
            נבדקו: {reviewedCount} | נכון: {correctCount}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Flashcard */}
      <div className="relative h-80">
        <Card 
          className={`absolute inset-0 cursor-pointer transition-all duration-300 transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            {!isFlipped ? (
              // Front side - English word
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-4xl font-bold text-gray-800" dir="ltr">
                    {currentWord.word}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(currentWord.word);
                    }}
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                    title="השמע הגייה"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
                <p className="text-gray-500 text-lg">לחץ לראות תרגום</p>
                <p className="text-sm text-gray-400">או לחץ רווח</p>
              </div>
            ) : (
              // Back side - Hebrew translation and example
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-purple-700">
                  {currentWord.translation}
                </h2>
                {currentWord.example && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">דוגמה:</p>
                    <p className="text-gray-700 italic text-lg leading-relaxed" dir="ltr">
                      "{currentWord.example}"
                    </p>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  האם זוכר/ת את המילה?
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          הקודם
        </Button>
        
        {isFlipped && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleMarkIncorrect}
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <X size={16} />
              לא זוכר (1)
            </Button>
            <Button
              onClick={handleMarkCorrect}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check size={16} />
              זוכר (2)
            </Button>
          </div>
        )}
        
        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentIndex >= words.length - 1}
          className="flex items-center gap-2"
        >
          הבא
          <ChevronRight size={16} />
        </Button>
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>⌨️ קיצורי מקלדת: רווח = הפוך | ← → = ניווט | 1 = לא זוכר | 2 = זוכר</p>
      </div>
    </div>
  );
};

export default FlashcardTab;