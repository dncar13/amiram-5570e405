import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Brain, Trophy, TrendingUp, 
  Search, Zap, Clock, Target, Sparkles, 
  ChevronRight, Star, Flame, Users, Rocket,
  BookMarked, MessageSquare, Headphones, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVocabularyStats, VocabularyStats } from '@/services/vocabularyStatsService';
import { useAuth } from '@/context/AuthContext';

const VocabMain: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<VocabularyStats>({
    totalWords: 120,
    knownWords: 0,
    streak: 0,
    accuracy: 0,
    wordsThisWeek: 0,
    progressToNext: 0,
    learnedToday: 0,
    totalSaved: 0,
    needsReview: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const vocabularyStats = await getVocabularyStats();
        setStats(vocabularyStats);
      } catch (error) {
        console.error('Error loading vocabulary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser]); // Reload when user changes

  // מילים לדוגמה לתצוגה
  const sampleWords = ['eloquent', 'perseverance', 'serendipity', 'resilient'];
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-10">
        
        {/* Hero Section - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 md:p-12 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            
            {/* Header */}
            <div className="text-center md:text-right mb-6 md:mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
                אוצר מילים
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-lg md:text-xl opacity-95">
                תרגלו אוצר מילים בדקה - בוסט בטוח לאנגלית שלכם
              </p>
            </div>
            
            {/* KPIs - Mobile Stack */}
            <div className="grid grid-cols-3 gap-3 md:flex md:gap-6 md:justify-center bg-white/20 backdrop-blur rounded-xl md:rounded-2xl p-4 mb-6 md:mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.totalWords}</div>
                <div className="text-xs md:text-sm opacity-90">מילים במאגר</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-300">
                  {loading ? "..." : stats.knownWords}
                </div>
                <div className="text-xs md:text-sm opacity-90">מוכרות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-300 flex items-center justify-center">
                  {loading ? "..." : stats.streak}
                  <Flame className="w-5 h-5 md:w-6 md:h-6 mr-1" />
                </div>
                <div className="text-xs md:text-sm opacity-90">רצף</div>
              </div>
            </div>

            {/* Main CTAs - Mobile First */}
            <div className="space-y-3 md:flex md:flex-wrap md:gap-4 md:justify-center md:space-y-0">
              <Link to="/vocab/quiz" className="block md:inline-block">
                <Button size="lg" className="w-full md:w-auto bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl shadow-xl transform hover:scale-105 transition-all">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  סימולציה מהירה
                </Button>
              </Link>
              <Link to="/vocab/dictionary" className="block md:inline-block">
                <Button size="lg" variant="outline" className="w-full md:w-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 font-bold text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  פתח מילון
                </Button>
              </Link>
              <Link to="/vocab/word-of-day" className="flex items-center justify-center md:justify-start text-white/90 hover:text-white font-medium text-lg py-2">
                מילה ביום
                <ChevronRight className="w-5 h-5 mr-1" />
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* Main Features Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* מילה ביום */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Calendar className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700 text-xs">יומי</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl mt-2">מילה ביום</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 md:p-4">
                <div className="text-lg md:text-xl font-bold text-gray-800">eloquent</div>
                <div className="text-sm md:text-base text-gray-600">רהוט, שולט בדיבור</div>
                <div className="text-xs md:text-sm text-gray-500 mt-2 italic">
                  "She gave an eloquent speech..."
                </div>
              </div>
              <Link to="/vocab/word-of-day">
                <Button className="w-full group-hover:shadow-lg transition-all">
                  תרגל עכשיו
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-[-4px] transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* מילון */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700 text-xs">120 מילים</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl mt-2">מילון</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <Input 
                  placeholder="חפש מילה..."
                  className="pr-10 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {sampleWords.slice(0, 3).map(word => (
                  <Badge key={word} variant="outline" className="hover:bg-blue-50 cursor-pointer text-xs">
                    {word}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-blue-50 text-xs">+117</Badge>
              </div>
              <Link to="/vocab/dictionary">
                <Button variant="outline" className="w-full group-hover:shadow-lg transition-all">
                  פתח מילון מלא
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* סימולציה מהירה */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 overflow-hidden relative bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
            <div className="absolute top-2 left-2">
              <span className="flex h-2 w-2 md:h-3 md:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500"></span>
              </span>
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                <Badge className="bg-green-100 text-green-700 text-xs">מומלץ</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl mt-2">סימולציה מהירה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg md:text-xl font-bold text-green-600">10</div>
                  <div className="text-xs text-gray-600">שאלות</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg md:text-xl font-bold text-orange-600">60</div>
                  <div className="text-xs text-gray-600">שניות</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg md:text-xl font-bold text-purple-600">100</div>
                  <div className="text-xs text-gray-600">נקודות</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                <Link to="/vocab/quiz?level=easy" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm text-green-600 border-green-300 hover:bg-green-50 py-2">
                    קל
                  </Button>
                </Link>
                <Link to="/vocab/quiz?level=medium" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm text-yellow-600 border-yellow-300 hover:bg-yellow-50 py-2">
                    בינוני
                  </Button>
                </Link>
                <Link to="/vocab/quiz?level=hard" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm text-red-600 border-red-300 hover:bg-red-50 py-2">
                    קשה
                  </Button>
                </Link>
              </div>
              
              <Link to="/vocab/quiz">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 group-hover:shadow-lg transition-all">
                  התחל חידון
                  <Trophy className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Future Features Section - Mobile Optimized */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Rocket className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
              בקרוב באוצר המילים
            </h2>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 text-sm w-fit">
              עדכון Q1 2025
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* SRS Learning */}
            <Card className="border-dashed border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors">
              <CardContent className="p-4 md:p-6 text-center">
                <Brain className="w-10 h-10 md:w-12 md:h-12 mx-auto text-purple-500 mb-3" />
                <h3 className="font-bold mb-2 text-sm md:text-base">למידה חכמה SRS</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  אלגוריתם שזוכר מה קשה לכם ומתאמן בהתאם
                </p>
                <Badge className="mt-3 text-xs" variant="outline">בפיתוח</Badge>
              </CardContent>
            </Card>

            {/* Context Reading */}
            <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <CardContent className="p-4 md:p-6 text-center">
                <BookMarked className="w-10 h-10 md:w-12 md:h-12 mx-auto text-blue-500 mb-3" />
                <h3 className="font-bold mb-2 text-sm md:text-base">מאמרונים בהקשר</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  קטעי קריאה עם המילים שאתם לומדים
                </p>
                <Badge className="mt-3 text-xs" variant="outline">2 שבועות</Badge>
              </CardContent>
            </Card>

            {/* Pronunciation */}
            <Card className="border-dashed border-2 border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
              <CardContent className="p-4 md:p-6 text-center">
                <Headphones className="w-10 h-10 md:w-12 md:h-12 mx-auto text-green-500 mb-3" />
                <h3 className="font-bold mb-2 text-sm md:text-base">הגייה ודיבור</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  תרגול הגייה עם בינה מלאכותית
                </p>
                <Badge className="mt-3 text-xs" variant="outline">3 שבועות</Badge>
              </CardContent>
            </Card>

            {/* Root Words */}
            <Card className="border-dashed border-2 border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors">
              <CardContent className="p-4 md:p-6 text-center">
                <Globe className="w-10 h-10 md:w-12 md:h-12 mx-auto text-orange-500 mb-3" />
                <h3 className="font-bold mb-2 text-sm md:text-base">שורשים ותחיליות</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  למדו משפחות מילים שלמות
                </p>
                <Badge className="mt-3 text-xs" variant="outline">חודש</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Section - Simplified */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <span className="flex items-center gap-2 text-lg md:text-xl">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                ההתקדמות שלך
              </span>
              <Button variant="ghost" size="sm" className="text-sm w-fit">
                צפה בכל הסטטיסטיקות
                <ChevronRight className="w-4 h-4 mr-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center justify-center">
                  <Star className="w-6 h-6 md:w-8 md:h-8 ml-1 text-yellow-500" />
                  {loading ? "..." : stats.knownWords}
                </div>
                <div className="text-xs md:text-sm text-gray-600">מילים מוכרות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 flex items-center justify-center">
                  <Flame className="w-6 h-6 md:w-8 md:h-8 ml-1 text-orange-500" />
                  {loading ? "..." : stats.streak}
                </div>
                <div className="text-xs md:text-sm text-gray-600">ימים ברצף</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">
                  {loading ? "..." : stats.accuracy}%
                </div>
                <div className="text-xs md:text-sm text-gray-600">דיוק ממוצע</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">
                  {loading ? "..." : stats.wordsThisWeek}
                </div>
                <div className="text-xs md:text-sm text-gray-600">מילים השבוע</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 md:mt-6">
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
                <span>התקדמות לרמה הבאה</span>
                <span>{loading ? "..." : stats.progressToNext}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 md:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${loading ? 0 : stats.progressToNext}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Section - Simplified */}
        <div className="text-center py-6 md:py-8">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span>1,247 לומדים כרגע באתר</span>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-3">
            <Badge variant="outline" className="px-3 py-2 text-xs md:text-sm">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 ml-1 text-yellow-500" />
              אתגר השבוע: 50 מילים חדשות
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-xs md:text-sm">
              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 ml-1 text-blue-500" />
              פורום לומדים
            </Badge>
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="md:hidden fixed bottom-4 right-4 left-4 z-50">
          <Link to="/vocab/quiz">
            <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl rounded-xl py-4">
              <Zap className="w-5 h-5 ml-2" />
              סימולציה מהירה
            </Button>
          </Link>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="md:hidden h-20"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VocabMain;