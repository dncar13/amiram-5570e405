import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, BookOpen, Brain } from 'lucide-react';

interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
  level: string;
  category: string;
  etymology?: string;
  synonyms?: string[];
  tip?: string;
}

interface WordCardProps {
  word: Word;
  showTranslation?: boolean;
  onToggleTranslation?: () => void;
  onPronounce?: () => void;
  isWordOfDay?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  showTranslation = true, 
  onToggleTranslation,
  onPronounce,
  isWordOfDay = false 
}) => {
  const handlePronounce = () => {
    if (onPronounce) {
      onPronounce();
    } else {
      // Web Speech API fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return level;
    }
  };

  return (
    <Card className={`w-full ${isWordOfDay ? 'border-2 border-blue-500 shadow-lg' : 'hover:shadow-md'} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold text-slate-800">
              {word.word}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePronounce}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(word.level)}`}>
            {getLevelText(word.level)}
          </div>
        </div>
        {showTranslation && (
          <p className="text-lg text-slate-600 font-medium mt-2">
            {word.translation}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Example */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">דוגמה:</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border">
            <p className="text-slate-800 italic">{word.example}</p>
          </div>
        </div>

        {/* Word of Day extras */}
        {isWordOfDay && (
          <>
            {word.tip && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">טיפ לזכירה:</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">{word.tip}</p>
                </div>
              </div>
            )}
            
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-700">מילים דומות:</span>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md border border-purple-200"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Toggle translation button */}
        {onToggleTranslation && (
          <Button
            variant="outline"
            onClick={onToggleTranslation}
            className="w-full"
          >
            {showTranslation ? 'הסתר תרגום' : 'הצג תרגום'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WordCard;
