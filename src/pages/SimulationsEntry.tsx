import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  List, 
  RotateCcw, 
  BookOpenCheck, 
  Clock, 
  TrendingUp,
  Star,
  History,
  User,
  Lock,
  ChevronRight,
  PlayCircle,
  Target,
  Award
} from 'lucide-react';

interface SimulationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  path: string;
  requiresAuth?: boolean;
  isPremium?: boolean;
}

interface QuestionTypeOption {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface DifficultyOption {
  level: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const SimulationsEntry: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(false); // This should come from your auth context
  const [isPremium] = useState(false); // This should come from your auth context

  const simulationOptions: SimulationOption[] = [
    {
      id: 'full-simulation',
      title: 'סימולציה מלאה',
      description: '30 שאלות מעורבות מכל הקטגוריות - כמו במבחן האמיתי',
      icon: <PlayCircle className="w-8 h-8" />,
      gradient: 'from-blue-500 to-purple-600',
      path: '/simulation/full',
    },
    {
      id: 'practice-by-type',
      title: 'תרגול לפי סוג שאלה',
      description: 'השלמת משפטים, ניסוח מחדש, הבנת הנקרא',
      icon: <Target className="w-8 h-8" />,
      gradient: 'from-green-500 to-teal-600',
      path: '/simulation/by-type',
    },
    {
      id: 'practice-by-difficulty',
      title: 'תרגול לפי רמת קושי',
      description: 'קל/בינוני/קשה עם דירוג AI מתקדם',
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-600',
      path: '/simulation/by-difficulty',
    },
    {
      id: 'history',
      title: 'היסטוריה ושאלות שמורות',
      description: 'צפיה בתוצאות קודמות ושאלות שמרת',
      icon: <History className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-600',
      path: '/simulation/history',
      requiresAuth: true,
    },
  ];

  const questionTypes: QuestionTypeOption[] = [
    {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      type: 'reading-comprehension',
      title: 'הבנת הנקרא',
      description: 'שאלות הבנת הנקרא עם קטעים',
      icon: <BookOpenCheck className="w-6 h-6" />,
      color: 'text-purple-600',
    },
  ];

  const difficultyLevels: DifficultyOption[] = [
    {
      level: 'easy',
      title: 'קל',
      description: 'שאלות בסיסיות ופשוטות',
      color: 'text-green-600',
      gradient: 'from-green-400 to-green-600',
    },
    {
      level: 'medium',
      title: 'בינוני',
      description: 'שאלות ברמת קושי בינונית',
      color: 'text-yellow-600',
      gradient: 'from-yellow-400 to-orange-600',
    },
    {
      level: 'hard',
      title: 'קשה',
      description: 'שאלות מתקדמות ומאתגרות',
      color: 'text-red-600',
      gradient: 'from-red-400 to-red-600',
    },
  ];

  const handleOptionClick = (option: SimulationOption) => {
    if (option.requiresAuth && !isAuthenticated) {
      // Handle authentication required
      navigate('/login');
      return;
    }

    if (option.isPremium && !isPremium) {
      // Handle premium required
      navigate('/premium');
      return;
    }

    navigate(option.path);
  };

  const handleQuestionTypeClick = (type: string) => {
    navigate(`/simulation/type/${type}`);
  };

  const handleDifficultyClick = (level: string) => {
    navigate(`/simulation/difficulty/${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            דף כניסה לסימולציות
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            בחר את סוג התרגול המתאים לך והתחל להתכונן למבחן הפסיכומטרי
          </p>
        </motion.div>

        {/* Main Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {simulationOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${option.gradient} p-8 text-white shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105`}>
                {/* Lock overlay for protected content */}
                {((option.requiresAuth && !isAuthenticated) || (option.isPremium && !isPremium)) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">
                        {option.requiresAuth && !isAuthenticated ? 'נדרשת התחברות' : 'גרסה פרימיום'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    {option.icon}
                  </div>
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{option.title}</h3>
                <p className="text-white text-opacity-90 leading-relaxed">
                  {option.description}
                </p>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Question Types */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="w-6 h-6 ml-3 text-green-600" />
              תרגול לפי סוג שאלה
            </h2>
            <div className="space-y-4">
              {questionTypes.map((type, index) => (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group"
                  onClick={() => handleQuestionTypeClick(type.type)}
                >
                  <div className={`${type.color} ml-4`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{type.title}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Difficulty Levels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 ml-3 text-orange-600" />
              תרגול לפי רמת קושי
            </h2>
            <div className="space-y-4">
              {difficultyLevels.map((difficulty, index) => (
                <motion.div
                  key={difficulty.level}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => handleDifficultyClick(difficulty.level)}
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${difficulty.gradient} text-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{difficulty.title}</h3>
                        <p className="text-white text-opacity-90 text-sm">
                          {difficulty.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-5 h-5 ml-2" />
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Star className="w-6 h-6 ml-3 text-yellow-600" />
            הסטטיסטיקות שלך
          </h2>
          
          {isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-gray-600">סימולציות הושלמו</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
                <div className="text-gray-600">אחוז הצלחה ממוצע</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-gray-600">שאלות נענו</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                <div className="text-gray-600">שאלות שמורות</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                התחבר כדי לראות את הסטטיסטיקות שלך
              </h3>
              <p className="text-gray-600 mb-6">
                עקוב אחר ההתקדמות שלך ושמור שאלות למטרות תרגול
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                התחבר עכשיו
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationsEntry;