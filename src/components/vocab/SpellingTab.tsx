import { useState, useEffect, useRef, useCallback } from 'react';
import { updateVocabularyProgress } from '@/services/vocabularyStatsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Lightbulb,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpellingTabProps {
  words: Array<{
    id: string;
    word: string;
    translation: string;
    example?: string;
    level: string;
    category: string;
  }>;
  onWordMastered: (wordId: string, masteryLevel: number) => void;
  className?: string;
}

interface SpellingResult {
  isCorrect: boolean;
  userInput: string;
  correctWord: string;
  attempts: number;
}

export function SpellingTab({ words, onWordMastered, className }: SpellingTabProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<SpellingResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isAudioSupported, setIsAudioSupported] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + (showResult ? 1 : 0)) / words.length) * 100;

  // בדיקה האם יש תמיכה ב-Speech Synthesis
  useEffect(() => {
    const hasSpeechSupport = 'speechSynthesis' in window;
    setIsAudioSupported(hasSpeechSupport);
    if (!hasSpeechSupport) {
      console.warn('Speech Synthesis API לא נתמך בדפדפן זה');
    }
  }, []);

  // פוקוס על השדה כשעוברים למילה חדשה
  useEffect(() => {
    if (!showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex, showResult]);

  const playAudio = useCallback(() => {
    if (!currentWord) return;
    
    try {
      // Use Web Speech API directly instead of MP3 files
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech Synthesis API לא נתמך בדפדפן זה');
        setIsAudioSupported(false);
      }
    } catch (error) {
      console.warn('שגיאה בהשמעת אודיו:', error);
      setIsAudioSupported(false);
    }
  }, [currentWord]);

  // השמעה רק כשלוחצים על הכפתור - לא אוטומטית
  // useEffect(() => {
  //   if (currentWord && !showResult) {
  //     playAudio();
  //   }
  // }, [currentWordIndex, currentWord, showResult, playAudio]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '');
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const checkSpelling = async () => {
    if (!currentWord || !userInput.trim()) return;

    const normalizedInput = normalizeText(userInput);
    const normalizedCorrect = normalizeText(currentWord.word);
    const isCorrect = normalizedInput === normalizedCorrect;
    const similarity = calculateSimilarity(normalizedInput, normalizedCorrect);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const spellingResult: SpellingResult = {
      isCorrect,
      userInput: userInput.trim(),
      correctWord: currentWord.word,
      attempts: newAttempts
    };

    setResult(spellingResult);
    setShowResult(true);

    // עדכון ציון
    const newScore = { 
      correct: score.correct + (isCorrect ? 1 : 0), 
      total: score.total + 1 
    };
    setScore(newScore);

    // עדכון רמת שליטה בהתבסס על ביצועים
    if (isCorrect) {
      let masteryLevel = 1; // רמה בסיסית
      
      if (newAttempts === 1) {
        masteryLevel = 3; // מצוין - נכון במנסה הראשון
      } else if (newAttempts === 2) {
        masteryLevel = 2; // טוב - נכון בניסיון השני
      } else if (similarity > 0.8) {
        masteryLevel = 1; // בסיסי - קרוב לנכון
      }

      onWordMastered(currentWord.id, masteryLevel);
      setCompletedWords(prev => new Set([...prev, currentWord.id]));
    }
    
    // עדכן את הסטטיסטיקות גם עבור שאלות כתיב
    try {
      await updateVocabularyProgress(currentWord.id, isCorrect, isCorrect, undefined);
    } catch (error) {
      console.error('Failed to update vocabulary progress:', error);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
      setResult(null);
      setAttempts(0);
      setShowHint(false);
    }
  };

  const resetCurrentWord = () => {
    setUserInput('');
    setShowResult(false);
    setResult(null);
    setAttempts(0);
    setShowHint(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        if (result?.isCorrect) {
          nextWord();
        } else {
          resetCurrentWord();
        }
      } else {
        checkSpelling();
      }
    } else if (e.key === ' ' && e.ctrlKey) {
      e.preventDefault();
      playAudio();
    }
  };

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">כל הכבוד! סיימת את תרגיל הכתיב</h3>
        <p className="text-muted-foreground mb-4">
          ציון סופי: {score.correct}/{score.total} ({Math.round((score.correct / Math.max(score.total, 1)) * 100)}%)
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {completedWords.size} מילים הושלמו בהצלחה
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* התקדמות */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>מילה {currentWordIndex + 1} מתוך {words.length}</span>
          <span>ציון: {score.correct}/{score.total}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* כרטיס המילה */}
      <Card className="relative">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={playAudio}
              disabled={!isAudioSupported}
              title="השמע שוב (Ctrl + Space)"
            >
              {isAudioSupported ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <span className="text-lg">🎧 לחץ להשמעה וכתוב את המילה</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* תרגום והדרכה */}
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-blue-600">
              {currentWord.translation}
            </p>
            <p className="text-sm text-muted-foreground">
              לחץ על כפתור הרמקול להשמעת המילה ואז כתוב אותה באנגלית
            </p>
          </div>

          {/* שדה הקלט */}
          <div className="space-y-3">
            <Input
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="כתוב את המילה כאן..."
              disabled={showResult && result?.isCorrect}
              className="text-center text-lg font-mono"
              autoComplete="off"
              spellCheck={false}
            />

            {/* רמז */}
            {showHint && !showResult && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3" dir="rtl">
                <p className="text-sm text-yellow-800 text-right">
                  <Lightbulb className="inline h-4 w-4 ml-1" />
                  המילה מתחילה ב: <span className="font-mono font-bold">{currentWord.word[0].toUpperCase()}</span>
                  {currentWord.word.length > 1 && (
                    <span> ויש בה {currentWord.word.length} אותיות</span>
                  )}
                </p>
              </div>
            )}

            {/* תוצאה */}
            {showResult && result && (
              <div className={cn(
                "rounded-lg p-4 border",
                result.isCorrect 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    result.isCorrect ? "text-green-800" : "text-red-800"
                  )}>
                    {result.isCorrect ? "נכון! כל הכבוד!" : "לא נכון, נסה שוב"}
                  </span>
                </div>
                
                {!result.isCorrect && (
                  <div className="space-y-1 text-sm">
                    <p className="text-red-700">
                      כתבת: <span className="font-mono bg-red-100 px-1 rounded">{result.userInput}</span>
                    </p>
                    <p className="text-green-700">
                      נכון: <span className="font-mono bg-green-100 px-1 rounded">{result.correctWord}</span>
                    </p>
                    {result.attempts > 1 && (
                      <p className="text-muted-foreground">
                        ניסיון {result.attempts}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-center gap-3">
            {!showResult ? (
              <>
                <Button onClick={checkSpelling} disabled={!userInput.trim()}>
                  בדוק
                </Button>
                <Button variant="outline" onClick={toggleHint}>
                  <Lightbulb className="h-4 w-4 mr-1" />
                  רמז
                </Button>
              </>
            ) : (
              <>
                {result?.isCorrect ? (
                  <Button onClick={nextWord} className="gap-2">
                    {currentWordIndex < words.length - 1 ? (
                      <>
                        המילה הבאה
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "סיום"
                    )}
                  </Button>
                ) : (
                  <Button onClick={resetCurrentWord} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    נסה שוב
                  </Button>
                )}
              </>
            )}
          </div>

          {/* הוראות שימוש */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>💡 טיפים: לחץ על 🎧 להשמעה | Ctrl + Space להשמעה חוזרת | Enter לבדיקה/המשך</p>
            {!isAudioSupported && (
              <p className="text-orange-600">⚠️ הדפדפן לא תומך בהשמעת אודיו</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
