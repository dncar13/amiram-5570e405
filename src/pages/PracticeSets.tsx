
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Play
} from 'lucide-react';

interface PracticeSetData {
  id: number;
  title: string;
  questionCount: number;
  description: string;
  completed: boolean;
  inProgress: boolean;
  score?: number;
}

const PracticeSets: React.FC = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();

  const questionTypesData: Record<string, any> = {
    'sentence-completion': {
      title: 'השלמת משפטים',
      gradient: 'from-blue-500 via-purple-500 to-cyan-500'
    },
    'restatement': {
      title: 'ניסוח מחדש',
      gradient: 'from-green-500 via-teal-500 to-emerald-500'
    }
  };

  const difficultyLabels: Record<string, string> = {
    'easy': 'קל',
    'medium': 'בינוני', 
    'hard': 'קשה'
  };

  const currentType = type ? questionTypesData[type] : null;

  // Generate practice sets data (this would come from your data service)
  const practiceSets: PracticeSetData[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `סט תרגול ${index + 1}`,
    questionCount: 10,
    description: `שאלות ${index * 10 + 1}-${(index + 1) * 10}`,
    completed: index < 2, // First 2 sets completed
    inProgress: index === 2, // Third set in progress
    score: index < 2 ? Math.floor(Math.random() * 30) + 70 : undefined // Random score 70-100 for completed sets
  }));

  const handleStartSet = (setId: number) => {
    navigate(`/simulation/${type}/${difficulty}?set=${setId}`);
  };

  const handleBack = () => {
    navigate(`/simulation/type/${type}/${difficulty}`);
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
              חזור לאפשרויות תרגול
            </button>
            
            <div className={`bg-gradient-to-r ${currentType.gradient} text-white rounded-3xl p-8 mb-8 border border-white/20 backdrop-blur-sm shadow-2xl`}>
              <div className="flex items-center mb-6">
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 ml-4 backdrop-blur-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">סטי תרגול - {currentType.title}</h1>
                  <p className="text-white text-opacity-90 text-xl">
                    רמת קושי: {difficultyLabels[difficulty]} • בחר סט לתרגול מסודר
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {practiceSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{set.title}</h3>
                  <div className="flex items-center">
                    {set.completed && (
                      <CheckCircle className="w-6 h-6 text-green-400 ml-2" />
                    )}
                    {set.inProgress && (
                      <Clock className="w-6 h-6 text-yellow-400 ml-2" />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 mb-2">{set.description}</p>
                  <p className="text-gray-400 text-sm">{set.questionCount} שאלות</p>
                  
                  {set.completed && set.score && (
                    <div className="mt-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                      <p className="text-green-400 font-semibold">הושלם - ציון: {set.score}%</p>
                    </div>
                  )}
                  
                  {set.inProgress && (
                    <div className="mt-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <p className="text-yellow-400 font-semibold">בהתקדמות - 6/10 שאלות</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartSet(set.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                    set.completed
                      ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30 hover:from-green-500/30 hover:to-green-600/30'
                      : set.inProgress
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-yellow-600/30'
                      : `bg-gradient-to-r ${currentType.gradient} text-white border border-white/20 hover:shadow-xl`
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Play className="w-5 h-5 ml-2" />
                    {set.completed ? 'תרגל שוב' : set.inProgress ? 'המשך תרגול' : 'התחל תרגול'}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">איך עובדים הסטים?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-blue-400 mb-2">תרגול מסודר</h4>
                  <p className="text-gray-300 text-sm">כל סט מכיל 10 שאלות ברמת קושי קבועה לתרגול עמוק ומסודר</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-400 mb-2">מעקב התקדמות</h4>
                  <p className="text-gray-300 text-sm">המערכת זוכרת איפה עצרת ומאפשרת לך לחזור ולהמשיך</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-purple-400 mb-2">חזרה על חומר</h4>
                  <p className="text-gray-300 text-sm">אפשרות לחזור על סטים שהושלמו לחיזוק והעמקה</p>
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

export default PracticeSets;
