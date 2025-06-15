
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';

interface PracticeOptionData {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const PracticeOptions: React.FC = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();

  const questionTypesData: Record<string, PracticeOptionData> = {
    'sentence-completion': {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'שאלות השלמת משפטים ומילים חסרות',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      gradient: 'from-blue-500 via-purple-500 to-cyan-500'
    },
    'restatement': {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות',
      icon: <Target className="w-8 h-8" />,
      color: 'text-green-600',
      gradient: 'from-green-500 via-teal-500 to-emerald-500'
    }
  };

  const currentType = type ? questionTypesData[type] : null;

  const difficultyLabels: Record<string, string> = {
    'easy': 'קל',
    'medium': 'בינוני', 
    'hard': 'קשה'
  };

  const handleQuickPractice = () => {
    navigate(`/simulation/${type}/${difficulty}?limit=10`);
  };

  const handleChooseSet = () => {
    navigate(`/simulation/type/${type}/${difficulty}/sets`);
  };

  const handleBack = () => {
    navigate(`/simulation/type/${type}`);
  };

  if (!currentType || !difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">שגיאה</h1>
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
              onClick={handleBack}
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors duration-300"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              חזור לבחירת רמת קושי
            </button>
            
            <div className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-3xl p-8 mb-8 border border-white/20 backdrop-blur-sm shadow-2xl`}>
              <div className="flex items-center mb-6">
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 ml-4 backdrop-blur-sm">
                  {currentType.icon}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{currentType.title}</h1>
                  <p className="text-white text-opacity-90 text-xl">
                    רמת קושי: {difficultyLabels[difficulty]}
                  </p>
                </div>
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
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 ml-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">תרגול מהיר</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                התחל תרגול מיידי עם 10 שאלות רנדומליות ברמת קושי {difficultyLabels[difficulty]}
              </p>
              
              <button
                onClick={handleQuickPractice}
                className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-5 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20`}
              >
                <div className="flex items-center justify-center">
                  <Zap className="w-6 h-6 ml-3" />
                  התחל תרגול (10 שאלות)
                </div>
              </button>
            </motion.div>

            {/* Choose Sets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-3 ml-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">תרגול מתקדם</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                בחר סט ספציפי לתרגול מסודר ומעקב התקדמות מדויק
              </p>
              
              <button
                onClick={handleChooseSet}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/20"
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="w-6 h-6 ml-3" />
                  בחר סט תרגול
                </div>
              </button>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">מה ההבדל?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-blue-400 mb-3">תרגול מהיר</h4>
                  <ul className="text-gray-300 text-right space-y-2">
                    <li>• 10 שאלות רנדומליות</li>
                    <li>• זמין מיד ללא הכנה</li>
                    <li>• מושלם להתחלה</li>
                    <li>• בדיקה מהירה של הרמה</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">תרגול מתקדם</h4>
                  <ul className="text-gray-300 text-right space-y-2">
                    <li>• סטים מסודרים של שאלות</li>
                    <li>• מעקב התקדמות מדויק</li>
                    <li>• אפשרות לחזור למקום שעצרת</li>
                    <li>• למידה מתמדת וממוקדת</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PracticeOptions;
