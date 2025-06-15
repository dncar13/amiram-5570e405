
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  Target,
  Zap,
  Brain,
  Cpu
} from 'lucide-react';
import { getSentenceCompletionQuestions, getRestatementQuestions } from '@/services/questionsService';

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

  // Redirect reading comprehension directly to stories page
  useEffect(() => {
    if (type === 'reading-comprehension') {
      navigate('/reading-comprehension');
    }
  }, [type, navigate]);

  // Get actual question counts dynamically
  const getSentenceCompletionCount = () => {
    return getSentenceCompletionQuestions().length;
  };

  const getRestatementCount = () => {
    return getRestatementQuestions().length;
  };

  const questionTypesData: Record<string, QuestionTypeData> = {
    'sentence-completion': {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 via-purple-500 to-cyan-500',
      tips: [
        'קרא את המשפט כולו לפני בחירת התשובה',
        'שים לב להקשר ולמשמעות הכללית',
        'בחן את כל האפשרויות לפני קבלת החלטה',
        'שים לב לדקדוק ולצורת הפועל'
      ],
      questionCount: getSentenceCompletionCount()
    },
    'restatement': {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 via-teal-500 to-emerald-500',
      tips: [
        'זהה את הרעיון המרכזי במשפט המקורי',
        'חפש ביטויים נרדפים',
        'שמור על אותה משמעות עם ניסוח שונה',
        'הימנע מביטויים חריגים או מיוחדים'
      ],
      questionCount: getRestatementCount()
    }
  };

  const currentType = type ? questionTypesData[type] : null;

  // If this is reading comprehension, the redirect should handle it
  if (type === 'reading-comprehension') {
    return null;
  }

  if (!currentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">סוג שאלה לא נמצא</h1>
          <button
            onClick={() => navigate('/simulations-entry')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            חזור לדף הכניסה
          </button>
        </div>
      </div>
    );
  }

  const handleStartPractice = (difficulty?: string) => {
    if (difficulty) {
      // Navigate to new practice options page
      navigate(`/simulation/type/${currentType.type}/${difficulty}`);
    } else {
      // Keep existing mixed practice
      navigate(`/simulation/${currentType.type}`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/simulations-entry')}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            חזור לדף הכניסה
          </button>
          
          <div className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-3xl p-8 mb-8 border border-white/20 backdrop-blur-sm shadow-2xl`}>
            <div className="flex items-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-2xl p-4 ml-4 backdrop-blur-sm">
                {currentType.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{currentType.title}</h1>
                <p className="text-white text-opacity-90 text-xl">
                  {currentType.description}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white text-opacity-90 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
              <Target className="w-6 h-6 ml-3" />
              <span className="text-lg font-medium">{currentType.questionCount} שאלות זמינות במערכת</span>
            </div>
          </div>
        </motion.div>

        {/* Practice Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Quick Practice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 ml-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">תרגול מהיר</h2>
            </div>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              התחל תרגול מיידי עם שאלות מעורבות בנושא זה
            </p>
            
            <div className="space-y-6">
              <button
                onClick={() => handleStartPractice()}
                className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-5 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20`}
              >
                <div className="flex items-center justify-center">
                  <Cpu className="w-6 h-6 ml-3" />
                  התחל תרגול (10 שאלות)
                </div>
              </button>
              
              <div className="text-center">
                <p className="text-gray-400 mb-4 font-semibold">או בחר רמת קושי ספציפית:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStartPractice('easy')}
                    className="py-4 px-4 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400 rounded-xl font-bold hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 border border-green-500/30 backdrop-blur-sm"
                  >
                    קל
                  </button>
                  <button
                    onClick={() => handleStartPractice('medium')}
                    className="py-4 px-4 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 text-yellow-400 rounded-xl font-bold hover:from-yellow-500/30 hover:to-orange-600/30 transition-all duration-300 border border-yellow-500/30 backdrop-blur-sm"
                  >
                    בינוני
                  </button>
                  <button
                    onClick={() => handleStartPractice('hard')}
                    className="py-4 px-4 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 rounded-xl font-bold hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 border border-red-500/30 backdrop-blur-sm"
                  >
                    קשה
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tips and Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-3 ml-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">טיפים לפתרון</h2>
            </div>
            <ul className="space-y-4">
              {currentType.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                  <span className="text-gray-300 text-lg leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
        >
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3 ml-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">מערכת תרגול מתקדמת</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-blue-400 mb-3">מעקב התקדמות</h3>
              <p className="text-gray-300 leading-relaxed">
                המערכת שלנו עוקבת אחר ההתקדמות שלך ומספקת משוב מיידי לשיפור הביצועים
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-green-400 mb-3">הסברים מפורטים</h3>
              <p className="text-gray-300 leading-relaxed">
                כל שאלה מגיעה עם הסבר מפורט שיעזור לך להבין את התשובה הנכונה
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default SimulationByType;
