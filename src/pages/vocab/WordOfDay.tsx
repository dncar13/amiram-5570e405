import React from 'react';
import { ArrowLeft, Volume2, Share2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WordCard from '@/components/vocab/WordCard';
import vocabData from '@/data/vocab-static.json';

const WordOfDay: React.FC = () => {
  const wordOfDay = vocabData.wordOfDay;

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const shareWord = async () => {
    const shareText = `מילת היום: ${wordOfDay.word} - ${wordOfDay.translation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'מילת היום',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('הטקסט הועתק ללוח!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/vocab" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
          חזרה לאוצר מילים
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">מילת היום</h1>
        <div className="w-32"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Word Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-slate-800">{wordOfDay.word}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakWord(wordOfDay.word)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant={wordOfDay.level === 'easy' ? 'default' : 
                          wordOfDay.level === 'medium' ? 'secondary' : 'destructive'}>
              {wordOfDay.level === 'easy' ? 'קל' : 
               wordOfDay.level === 'medium' ? 'בינוני' : 'קשה'}
            </Badge>
            <Badge variant="outline">{wordOfDay.category}</Badge>
          </div>
          
          <p className="text-2xl text-blue-700 font-semibold">{wordOfDay.translation}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Example */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-slate-700 mb-2">דוגמה:</h4>
            <p className="text-lg text-slate-800 mb-2">{wordOfDay.example}</p>
            <p className="text-slate-600 italic">{wordOfDay.exampleTranslation}</p>
          </div>

          {/* Etymology */}
          {wordOfDay.etymology && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">אטימולוגיה:</h4>
              <p className="text-yellow-700">{wordOfDay.etymology}</p>
            </div>
          )}

          {/* Synonyms */}
          {wordOfDay.synonyms && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">מילים דומות:</h4>
              <div className="flex flex-wrap gap-2">
                {wordOfDay.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="outline" className="bg-white text-green-700">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          {wordOfDay.tip && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 טיפ לזכירה:</h4>
              <p className="text-blue-700">{wordOfDay.tip}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button onClick={() => speakWord(wordOfDay.word)} variant="outline" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              השמע שוב
            </Button>
            <Button onClick={shareWord} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              שתף
            </Button>
            <Link to="/vocab/dictionary">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                עיין במילון
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Navigation to Quiz */}
      <Card>
        <CardContent className="text-center py-6">
          <h3 className="text-xl font-semibold mb-3">רוצה לבחן את עצמך?</h3>
          <p className="text-slate-600 mb-4">
            נסה את החידון כדי לראות כמה טוב אתה זוכר את המילים
          </p>
          <Link to="/vocab/quiz">
            <Button size="lg">התחל חידון</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordOfDay;
