import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Brain, Trophy, TrendingUp, 
  Search, Zap, Clock, Target, Sparkles, 
  ChevronRight, Star, Flame, Users, Rocket,
  BookMarked, MessageSquare, Headphones, Globe,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVocabularyStats, VocabularyStats } from '@/services/vocabularyStatsService';
import { useAuth } from '@/context/AuthContext';

// Professional Card components with subtle depth
const Card = ({ children, className = "", elevated = false }) => (
  <div className={`bg-white rounded-xl ${elevated ? 'shadow-lg hover:shadow-xl' : 'shadow-sm hover:shadow-md'} transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 pb-2 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

// Professional Button component that works with Link
const ButtonBase = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default",
  onClick = () => {}
}) => {
  const baseClasses = "font-medium transition-all duration-200 rounded-xl inline-flex items-center justify-center";
  const sizeClasses = 
    size === "lg" ? "px-8 py-4 text-base" : 
    size === "sm" ? "px-4 py-2 text-sm" : 
    "px-6 py-3";
  
  const variantClasses = 
    variant === "primary" ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md" :
    variant === "outline" ? "border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50" :
    variant === "ghost" ? "hover:bg-gray-100" :
    variant === "secondary" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" :
    "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md";
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Professional Input component
const InputBase = ({ placeholder, value, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
  />
);

// Professional Badge component
const BadgeBase = ({ children, className = "", variant = "default" }) => {
  const variantClasses = 
    variant === "outline" ? "border border-gray-200 bg-white text-gray-600" : 
    variant === "primary" ? "bg-indigo-100 text-indigo-700" :
    "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Section - Clear Starting Point */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white mb-16">
          {/* Background Image - תמונה יותר בולטת */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: 'url(/images/vocab-hero-bg.jpg)' }}
          ></div>
          
          {/* Overlay for better text readability - פחות חזק */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-600/60"></div>
          
          {/* Background Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center py-16 px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              אוצר מילים
            </h1>
            <p className="text-xl opacity-95 mb-12 max-w-3xl mx-auto">
              בחר איך אתה רוצה להתחיל ללמוד
            </p>
            
            {/* Primary CTAs - Fixed visibility */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/vocab/quiz">
                <button className="w-full sm:w-auto text-xl px-12 py-6 bg-white text-gray-900 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all font-bold rounded-xl border-4 border-white flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  סימולציה מהירה
                </button>
              </Link>
              <Link to="/vocab/word-of-day">
                <button className="w-full sm:w-auto text-xl px-12 py-6 border-3 border-white bg-white/20 backdrop-blur hover:bg-white/30 text-white font-bold rounded-xl flex items-center justify-center gap-3">
                  <Calendar className="w-6 h-6" />
                  תרגול מילים 
                </button>
              </Link>
            </div>

            {/* Quick Stats - Simple & Clear with fallback values */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto bg-white/20 backdrop-blur rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {loading ? "..." : (stats.knownWords || 0)}
                </div>
                <div className="text-sm opacity-90">מילים שנלמדו</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                  {loading ? "..." : (stats.streak || 0)}
                  {(stats.streak || 0) > 0 && <Flame className="w-8 h-8 text-orange-300" />}
                </div>
                <div className="text-sm opacity-90">רצף יומי</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {loading ? "..." : (stats.accuracy || 0)}%
                </div>
                <div className="text-sm opacity-90">דיוק</div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Area - Focused Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          
          {/* Word of the Day - Enhanced & Prominent */}
          <Card elevated={true} className="border-2 border-purple-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <BadgeBase variant="primary">מילה ביום</BadgeBase>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-3">eloquent</div>
                <div className="text-lg text-gray-700 mb-3">רהוט, שולט בדיבור</div>
                <div className="text-gray-600 italic text-base">
                  "She gave an eloquent speech that moved the entire audience"
                </div>
              </div>
              
              <Link to="/vocab/word-of-day">
                <ButtonBase variant="primary" className="w-full text-lg py-4">
                  למד עכשיו
                  <ChevronRight className="w-5 h-5 mr-2" />
                </ButtonBase>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Dictionary - Simple & Functional */}
          <Card elevated={true} className="border-2 border-blue-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">120 מילים במילון</span>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  <InputBase 
                    placeholder="חפש מילה במילון..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12 text-lg py-4"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">מילים פופולריות:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleWords.map(word => (
                    <BadgeBase 
                      key={word} 
                      variant="outline" 
                      className="hover:bg-blue-50 cursor-pointer transition-colors text-sm px-3 py-2"
                    >
                      {word}
                    </BadgeBase>
                  ))}
                </div>
              </div>
              
              <Link to="/vocab/dictionary">
                <ButtonBase 
                  variant="outline" 
                  className="w-full text-lg py-4 border-2"
                >
                  פתח מילון מלא
                  <BookOpen className="w-5 h-5 mr-2" />
                </ButtonBase>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Progress Area - Back to original layout without emojis */}
        <Card className="mb-12 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">ההתקדמות שלך</h3>
              </div>
              <Link to="/vocab/stats">
                <ButtonBase 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  צפה בכל הסטטיסטיקות
                  <ChevronRight className="w-4 h-4 mr-1" />
                </ButtonBase>
              </Link>
            </div>
            
            {/* Main Stats Grid - 4 columns like original */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-indigo-600">
                  {loading ? "..." : stats.knownWords}
                </div>
                <div className="text-sm text-gray-500 mt-1">מילים מוכרות</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.streak}
                </div>
                <div className="text-sm text-gray-500 mt-1">ימים ברצף</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.accuracy}%
                </div>
                <div className="text-sm text-gray-500 mt-1">דיוק ממוצע</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.wordsThisWeek}
                </div>
                <div className="text-sm text-gray-500 mt-1">מילים השבוע</div>
              </div>
            </div>

            {/* Progress Bar - Visual Focus */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between text-lg font-medium text-gray-700 mb-4">
                <span>התקדמות לרמה הבאה</span>
                <span>{loading ? "..." : stats.progressToNext}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${loading ? 0 : stats.progressToNext}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Features - Minimal & Clean */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">שירותים נוספים</h3>
            <p className="text-gray-500">כלים מתקדמים לשיפור האנגלית</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { title: 'למידה חכמה', icon: Brain, status: 'בפיתוח' },
              { title: 'מאמרונים', icon: BookMarked, status: '2 שבועות' },
              { title: 'הגייה', icon: Headphones, status: '3 שבועות' },
              { title: 'שורשי מילים', icon: Globe, status: 'חודש' }
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors text-center">
                  <IconComponent className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <h4 className="font-medium text-gray-700 text-sm mb-1">{item.title}</h4>
                  <BadgeBase className="text-xs" variant="outline">
                    {item.status}
                  </BadgeBase>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community - Minimal */}
        <div className="text-center py-8 border-t border-gray-200">
          <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm">1,247 לומדים כרגע באתר</span>
          </div>
          <div className="flex justify-center gap-4">
            <BadgeBase variant="outline" className="text-xs">
              <Trophy className="w-3 h-3 ml-1 text-yellow-500" />
              אתגר השבוע
            </BadgeBase>
            <BadgeBase variant="outline" className="text-xs">
              <MessageSquare className="w-3 h-3 ml-1 text-blue-500" />
              פורום
            </BadgeBase>
          </div>
        </div>

        {/* Mobile CTA - Fixed Bottom */}
        <div className="md:hidden fixed bottom-4 right-4 left-4 z-50">
          <Link to="/vocab/quiz">
            <ButtonBase 
              variant="primary"
              size="lg" 
              className="w-full shadow-2xl text-lg py-4 bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Zap className="w-5 h-5 ml-2" />
              התחל תרגול
            </ButtonBase>
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