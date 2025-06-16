
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FullExamModal } from '@/components/simulation/FullExamModal';
import { 
  PlayCircle, 
  Clock, 
  Target,
  ArrowRight,
  Settings,
  Trophy,
  BarChart3,
  AlertCircle,
  CheckCircle,
  BookOpen,
  RotateCcw,
  BookOpenCheck,
  ChevronLeft,
  Info,
  Shield
} from 'lucide-react';

interface SimulationSettings {
  timeLimit: number;
  questionCount: number;
  includeTypes: string[];
  difficulty: string;
}

const FullSimulation: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SimulationSettings>({
    timeLimit: 60, // 60 minutes as per real AmirAM exam
    questionCount: 80, // 80 questions as per real AmirAM exam
    includeTypes: ['sentence-completion', 'restatement', 'reading-comprehension'],
    difficulty: 'mixed'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showExamStructure, setShowExamStructure] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const questionTypes = [
    { 
      type: 'sentence-completion', 
      title: 'השלמת משפטים', 
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-blue-400',
      count: '27-28'
    },
    { 
      type: 'restatement', 
      title: 'ניסוח מחדש', 
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'text-green-400',
      count: '26-27'
    },
    { 
      type: 'reading-comprehension', 
      title: 'הבנת הנקרא', 
      icon: <BookOpenCheck className="w-5 h-5" />,
      color: 'text-purple-400',
      count: '26-27',
      details: '6-7 קטעי קריאה, כל אחד עם 3-5 שאלות'
    }
  ];
  const handleStartSimulation = () => {
    // Open the exam modal instead of navigating
    setIsExamModalOpen(true);
  };

  const handleBackClick = () => {
    navigate("/simulations-entry");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-400 hover:text-blue-300 mb-6 font-medium transition-colors"
            >
              <ChevronLeft className="w-5 h-5 ml-1" />
              חזרה לרשימת הסימולציות
            </button>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-8 shadow-2xl border border-slate-600/50">
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4 backdrop-blur-sm">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">סימולציה מלאה</h1>
                  <p className="text-white text-opacity-90 text-lg">
                    ממש כמו במבחן אמיר"ם האמיתי
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-red-500/20 text-red-200 px-3 py-1 rounded-lg text-sm font-medium border border-red-400/30">
                      🎯 מצב מבחן - ללא הסברים במהלך המבחן
                    </span>
                    <span className="bg-amber-500/20 text-amber-200 px-3 py-1 rounded-lg text-sm font-medium border border-amber-400/30">
                      ⚡ אין חזרה לאחור
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Main exam stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-opacity-90 text-lg">
                <div className="flex items-center">
                  <Target className="w-6 h-6 ml-3 text-yellow-300" />
                  <span className="font-bold">📝 80 שאלות</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 ml-3 text-blue-300" />
                  <span className="font-bold">⏰ 60 דקות</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Simulation Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Question Types Breakdown */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-600/50">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">מבנה המבחן</h2>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {questionTypes.map((type, index) => (
                    <motion.div
                      key={type.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`${type.color} ml-3`}>
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-200 text-lg">{type.title}</h3>
                            {type.details && (
                              <p className="text-sm text-slate-400 mt-1">{type.details}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-slate-100">{type.count}</div>
                          <div className="text-xs text-slate-400">שאלות</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Exam Structure Info Button */}
                <button
                  onClick={() => setShowExamStructure(!showExamStructure)}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-300 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center mb-6"
                >
                  <Info className="w-5 h-5 ml-2" />
                  מידע על מבנה המבחן
                  <ArrowRight className={`w-5 h-5 mr-2 transition-transform ${showExamStructure ? 'rotate-90' : ''}`} />
                </button>

                {showExamStructure && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 mb-6 backdrop-blur-sm"
                  >
                    <h3 className="font-semibold text-blue-300 mb-4 flex items-center">
                      <Shield className="w-5 h-5 ml-2" />
                      כללים חשובים
                    </h3>
                    <ul className="space-y-2 text-blue-200/90 text-sm">
                      <li>• כל שאלה מוצגת פעם אחת בלבד</li>
                      <li>• לא ניתן לדלג או לחזור לשאלה קודמת</li>
                      <li>• אין הסברים תוך כדי המבחן</li>
                      <li>• התוצאות נשמרות בהיסטוריה האישית שלך</li>
                      <li>• המבחן מתקדם אוטומטי (אך ניתן לענות מהר יותר)</li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                      <p className="text-green-300 text-sm font-medium">
                        🎯 זהו הדימוי הקרוב ביותר למבחן אמיר"ם האמיתי – התנסו כדי להגיע מוכנים!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Start Button */}
                <button
                  onClick={handleStartSimulation}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center border border-blue-500/50"
                >
                  <PlayCircle className="w-6 h-6 ml-2" />
                  התחל מבחן מלא
                </button>
              </div>

              {/* Pre-Simulation Checklist */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-600/50">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">רשימת בדיקה לפני המבחן</h2>
                
                <div className="space-y-4">
                  {[
                    'מקום שקט ללא הפרעות',
                    'מחשב או טלפון עם חיבור יציב לאינטרנט',
                    'מספיק זמן פנוי (כ-70 דקות)',
                    'מצב רוח טוב וריכוז מלא',
                    'כוס מים ומשהו קל לנשנוש'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-400/30"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 ml-3" />
                      <span className="text-slate-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Settings */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-600/50">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-slate-700/30 p-2 rounded-lg transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                    <Settings className="w-5 h-5 ml-2 text-blue-400" />
                    הגדרות מבחן
                  </h3>
                  <ArrowRight className={`w-5 h-5 text-slate-400 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
                </button>

                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Fixed settings display */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                      <div className="space-y-3 text-sm text-slate-300">
                        <div className="flex justify-between">
                          <span>זמן מבחן:</span>
                          <span className="font-semibold text-slate-100">60 דקות (קבוע)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>מספר שאלות:</span>
                          <span className="font-semibold text-slate-100">80 שאלות (קבוע)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>סוגי שאלות:</span>
                          <span className="font-semibold text-slate-100">כל הסוגים (קבוע)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>רמת קושי:</span>
                          <span className="font-semibold text-slate-100">אדפטיבי (קבוע)</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-400">
                        * הגדרות אלו קבועות כדי לדמות את המבחן האמיתי
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Statistics */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-600/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 ml-2 text-green-400" />
                  הסטטיסטיקות שלך
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">מבחנים מלאים:</span>
                    <span className="font-semibold text-slate-100">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">ציון ממוצע:</span>
                    <span className="font-semibold text-slate-100">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">ציון מרבי:</span>
                    <span className="font-semibold text-slate-100">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">זמן ממוצע:</span>
                    <span className="font-semibold text-slate-100">-</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-600/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">טיפים למבחן</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• קרא כל שאלה בעיון</li>
                  <li>• נהל את הזמן בחוכמה (45 שניות לשאלה)</li>
                  <li>• אל תתעכב יותר מדי על שאלה אחת</li>
                  <li>• סמוך על התחושה הראשונה</li>
                  <li>• השתמש בטכניקת החיסול</li>
                  <li>• זכור: אין חזרה לאחור</li>
                </ul>
              </div>
            </motion.div>
          </div>        </div>
      </div>
      <Footer />
      
      {/* Full Exam Modal */}
      <FullExamModal 
        isOpen={isExamModalOpen} 
        onClose={() => setIsExamModalOpen(false)} 
      />
    </>
  );
};

export default FullSimulation;
