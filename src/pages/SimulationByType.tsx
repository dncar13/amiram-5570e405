import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  RotateCcw, 
  BookOpenCheck, 
  ArrowRight,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';

interface QuestionTypeData {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  tips: string[];
  questionCount: number;
}

const SimulationByType: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  const questionTypesData: Record<string, QuestionTypeData> = {
    'sentence-completion': {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      tips: [
        'קרא את המשפט כולו לפני בחירת התשובה',
        'שים לב להקשר ולמשמעות הכללית',
        'בחן את כל האפשרויות לפני קבלת החלטה',
        'שים לב לדקדוק ולצורת הפועל'
      ],
      questionCount: 45
    },
    'restatement': {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
      tips: [
        'זהה את הרעיון המרכזי במשפט המקורי',
        'חפש ביטויים נרדפים',
        'שמור על אותה משמעות עם ניסוח שונה',
        'הימנע מביטויים חריגים או מיוחדים'
      ],
      questionCount: 38
    },
    'reading-comprehension': {
      type: 'reading-comprehension',
      title: 'הבנת הנקרא',
      description: 'שאלות הבנת הנקרא עם קטעים',
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
      tips: [
        'קרא את הקטע בעיון לפני מעבר לשאלות',
        'זהה את הרעיון המרכזי והפרטים התומכים',
        'שים לב לקשרים בין חלקי הטקסט',
        'חזור לקטע כדי לאמת את התשובות'
      ],
      questionCount: 52
    }
  };

  const currentType = type ? questionTypesData[type] : null;

  if (!currentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">סוג שאלה לא נמצא</h1>
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

  const handleStartPractice = (difficulty?: string) => {
    // Special handling for reading comprehension - redirect to story selection
    if (currentType?.type === 'reading-comprehension') {
      navigate('/reading-comprehension');
      return;
    }
    
    const path = difficulty 
      ? `/simulation/${currentType.type}/${difficulty}`
      : `/simulation/${currentType.type}`;
    navigate(path);
  };

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
          
          <div className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-2xl p-8 mb-8`}>
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                {currentType.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentType.title}</h1>
                <p className="text-white text-opacity-90 text-lg">
                  {currentType.description}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white text-opacity-90">
              <Target className="w-5 h-5 ml-2" />
              <span>{currentType.questionCount} שאלות זמינות</span>
            </div>
          </div>
        </motion.div>

        {/* Practice Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Quick Practice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">תרגול מהיר</h2>
            <p className="text-gray-600 mb-6">
              {currentType?.type === 'reading-comprehension' 
                ? 'בחר סיפור ותתחיל סימולציה של שאלות הבנת הנקרא'
                : 'התחל תרגול מיידי עם שאלות מעורבות בנושא זה'
              }
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleStartPractice()}
                className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 ml-2" />
                  {currentType?.type === 'reading-comprehension' 
                    ? 'בחר סיפור לתרגול'
                    : 'התחל תרגול (10 שאלות)'
                  }
                </div>
              </button>
              
              {currentType?.type !== 'reading-comprehension' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStartPractice('easy')}
                    className="py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    קל
                  </button>
                  <button
                    onClick={() => handleStartPractice('medium')}
                    className="py-3 px-4 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                  >
                    בינוני
                  </button>
                  <button
                    onClick={() => handleStartPractice('hard')}
                    className="py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    קשה
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tips and Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 ml-3 text-blue-600" />
              טיפים לפתרון
            </h2>
            <ul className="space-y-3">
              {currentType.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Practice Modes - Only show for non-reading-comprehension types */}
        {currentType?.type !== 'reading-comprehension' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">מצבי תרגול</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">תרגול מתוזמן</h3>
                  <p className="text-gray-600 text-sm">
                    תרגול עם הגבלת זמן כמו במבחן האמיתי
                  </p>
                  <button 
                    onClick={() => navigate(`/simulation/${currentType.type}/timed`)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    התחל
                  </button>
                </div>
              </div>

              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">תרגול ממוקד</h3>
                  <p className="text-gray-600 text-sm">
                    תרגול ללא הגבלת זמן עם הסברים מפורטים
                  </p>
                  <button 
                    onClick={() => navigate(`/simulation/${currentType.type}/practice`)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    התחל
                  </button>
                </div>
              </div>

              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">תרגול מותאם אישית</h3>
                  <p className="text-gray-600 text-sm">
                    תרגול מותאם לרמה שלך עם AI מתקדם
                  </p>
                  <button 
                    onClick={() => navigate(`/simulation/${currentType.type}/adaptive`)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    התחל
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default SimulationByType;
