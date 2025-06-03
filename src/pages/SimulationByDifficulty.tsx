import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  TrendingUp, 
  Award, 
  ArrowRight,
  Clock,
  Target,
  BookOpen,
  RotateCcw,
  BookOpenCheck,
  Star,
  Zap,
  Shield
} from 'lucide-react';

interface DifficultyData {
  level: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  characteristics: string[];
  recommendedFor: string[];
  questionCount: number;
  avgTime: string;
}

const SimulationByDifficulty: React.FC = () => {
  const navigate = useNavigate();
  const { level } = useParams<{ level: string }>();

  const difficultyData: Record<string, DifficultyData> = {
    'easy': {
      level: 'easy',
      title: 'רמה קלה',
      description: 'שאלות בסיסיות ופשוטות לבניית ביטחון עצמי',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-400 to-green-600',
      characteristics: [
        'מילות מפתח ברורות וישירות',
        'הקשר פשוט וקל להבנה',
        'אוצר מילים בסיסי',
        'מבנה משפט פשוט'
      ],
      recommendedFor: [
        'מתחילים בהכנה למבחן',
        'תלמידים שרוצים לבנות ביטחון',
        'חזרה על יסודות',
        'חימום לפני תרגול מתקדם'
      ],
      questionCount: 65,
      avgTime: '45 שניות'
    },
    'medium': {
      level: 'medium',
      title: 'רמה בינונית',
      description: 'שאלות ברמת קושי בינונית לפיתוח כישורים',
      icon: <Target className="w-8 h-8" />,
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-orange-600',
      characteristics: [
        'הקשר מורכב יותר',
        'מילים פחות נפוצות',
        'צורך בהבנה עמוקה יותר',
        'מספר רמזים בטקסט'
      ],
      recommendedFor: [
        'תלמידים עם בסיס טוב',
        'הכנה לרמת המבחן הממוצעת',
        'פיתוח אסטרטגיות פתרון',
        'שיפור מהירות פתרון'
      ],
      questionCount: 78,
      avgTime: '90 שניות'
    },
    'hard': {
      level: 'hard',
      title: 'רמה קשה',
      description: 'שאלות מתקדמות ומאתגרות לציון גבוה',
      icon: <Zap className="w-8 h-8" />,
      color: 'text-red-600',
      gradient: 'from-red-400 to-red-600',
      characteristics: [
        'מושגים מורכבים ומופשטים',
        'אוצר מילים עשיר ומתקדם',
        'הקשר דורש ניתוח עמוק',
        'מספר רמות של משמעות'
      ],
      recommendedFor: [
        'תלמידים מתקדמים',
        'שאיפה לציון גבוה',
        'חיזוק נקודות חולשה',
        'אתגר ופיתוח מתקדם'
      ],
      questionCount: 42,
      avgTime: '2 דקות'
    }
  };

  const currentDifficulty = level ? difficultyData[level] : null;

  if (!currentDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">רמת קושי לא נמצאה</h1>
          <button
            onClick={() => navigate('/simulations-entry')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            חזור לדף הכניסה
          </button>
        </div>
      </div>
    );
  }
  const handleStartPractice = (questionType?: string) => {
    // For mixed practice (when no questionType is provided), use "mixed" as the type
    const path = questionType 
      ? `/simulation/difficulty/${currentDifficulty.level}/${questionType}`
      : `/simulation/difficulty/${currentDifficulty.level}/mixed`;
    navigate(path);
  };

  const questionTypes = [
    { type: 'sentence-completion', title: 'השלמת משפטים', icon: <BookOpen className="w-5 h-5" /> },
    { type: 'restatement', title: 'ניסוח מחדש', icon: <RotateCcw className="w-5 h-5" /> },
    { type: 'reading-comprehension', title: 'הבנת הנקרא', icon: <BookOpenCheck className="w-5 h-5" /> }
  ];
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/simulations-entry')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            חזור לדף הכניסה
          </button>
          
          <div className={`bg-gradient-to-r ${currentDifficulty.gradient} text-white rounded-2xl p-8 mb-8`}>
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                {currentDifficulty.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentDifficulty.title}</h1>
                <p className="text-white text-opacity-90 text-lg">
                  {currentDifficulty.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-opacity-90">
              <div className="flex items-center">
                <Target className="w-5 h-5 ml-2" />
                <span>{currentDifficulty.questionCount} שאלות זמינות</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 ml-2" />
                <span>זמן ממוצע: {currentDifficulty.avgTime}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Practice Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">בחר סוג תרגול</h2>
            
            {/* Mixed Practice */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="w-6 h-6 ml-2 text-yellow-500" />
                תרגול מעורב (מומלץ)
              </h3>
              <p className="text-gray-600 mb-4">
                שאלות מעורבות מכל הסוגים ברמת הקושי שבחרת
              </p>
              <button
                onClick={() => handleStartPractice()}
                className={`bg-gradient-to-r ${currentDifficulty.gradient} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
              >
                התחל תרגול מעורב (15 שאלות)
              </button>
            </div>

            {/* Specific Question Types */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">תרגול לפי סוג שאלה</h3>
              <div className="space-y-3">
                {questionTypes.map((type, index) => (
                  <motion.button
                    key={type.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => handleStartPractice(type.type)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className="text-gray-600 ml-3">
                        {type.icon}
                      </div>
                      <span className="font-medium text-gray-800">{type.title}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Difficulty Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Characteristics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 ml-2 text-blue-600" />
                מאפיינים
              </h3>
              <ul className="space-y-2">
                {currentDifficulty.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{characteristic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended For */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 ml-2 text-green-600" />
                מתאים עבור
              </h3>
              <ul className="space-y-2">
                {currentDifficulty.recommendedFor.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Practice Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">מצבי תרגול מתקדמים</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">מבחן מתוזמן</h3>
                <p className="text-gray-600 text-sm mb-4">
                  תרגול עם הגבלת זמן מדויקת לרמת הקושי
                </p>
                <button 
                  onClick={() => navigate(`/simulation/difficulty/${currentDifficulty.level}/timed`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  התחל מבחן
                </button>
              </div>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">תרגול מותאם</h3>
                <p className="text-gray-600 text-sm mb-4">
                  המערכת מתאימה את הקושי בהתאם לביצועים שלך
                </p>
                <button 
                  onClick={() => navigate(`/simulation/difficulty/${currentDifficulty.level}/adaptive`)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  התחל תרגול
                </button>
              </div>
            </div>
          </div>        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default SimulationByDifficulty;
