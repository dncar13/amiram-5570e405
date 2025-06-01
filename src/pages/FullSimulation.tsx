import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  BookOpenCheck
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
    timeLimit: 45, // minutes
    questionCount: 30,
    includeTypes: ['sentence-completion', 'restatement', 'reading-comprehension'],
    difficulty: 'mixed'
  });
  const [showSettings, setShowSettings] = useState(false);

  const questionTypes = [
    { 
      type: 'sentence-completion', 
      title: 'השלמת משפטים', 
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-blue-600',
      count: 10
    },
    { 
      type: 'restatement', 
      title: 'ניסוח מחדש', 
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'text-green-600',
      count: 10
    },
    { 
      type: 'reading-comprehension', 
      title: 'הבנת הנקרא', 
      icon: <BookOpenCheck className="w-5 h-5" />,
      color: 'text-purple-600',
      count: 10
    }
  ];

  const handleStartSimulation = () => {
    // Navigate to actual simulation with settings
    navigate('/simulation/full/start', { state: { settings } });
  };

  const toggleQuestionType = (type: string) => {
    setSettings(prev => ({
      ...prev,
      includeTypes: prev.includeTypes.includes(type)
        ? prev.includeTypes.filter(t => t !== type)
        : [...prev.includeTypes, type]
    }));
  };

  return (
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
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">סימולציה מלאה</h1>
                <p className="text-white text-opacity-90 text-lg">
                  מבחן מלא כמו במבחן הפסיכומטרי האמיתי
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-opacity-90">
              <div className="flex items-center">
                <Target className="w-5 h-5 ml-2" />
                <span>{settings.questionCount} שאלות</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 ml-2" />
                <span>{settings.timeLimit} דקות</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 ml-2" />
                <span>כמו במבחן אמיתי</span>
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
            {/* Simulation Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">סקירת המבחן</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {questionTypes.map((type, index) => (
                  <motion.div
                    key={type.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={`${type.color} mb-2 flex justify-center`}>
                      {type.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{type.title}</h3>
                    <div className="text-2xl font-bold text-gray-700 mt-1">{type.count}</div>
                    <div className="text-xs text-gray-500">שאלות</div>
                  </motion.div>
                ))}
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-600 ml-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">הערות חשובות</h3>
                    <ul className="space-y-1 text-yellow-700 text-sm">
                      <li>• המבחן מתוזמן - לא ניתן לעצור את הזמן</li>
                      <li>• לא ניתן לחזור לשאלה קודמת לאחר מעבר לשאלה הבאה</li>
                      <li>• התוצאות יישמרו בהיסטוריה שלך</li>
                      <li>• מומלץ להיות במקום שקט וללא הפרעות</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartSimulation}
                disabled={settings.includeTypes.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <PlayCircle className="w-6 h-6 ml-2" />
                התחל מבחן מלא
              </button>
            </div>

            {/* Pre-Simulation Checklist */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">רשימת בדיקה לפני המבחן</h2>
              
              <div className="space-y-4">
                {[
                  'מקום שקט ללא הפרעות',
                  'מחשב או טלפון עם חיבור יציב לאינטרנט',
                  'מספיק זמן פנוי (כ-50 דקות)',
                  'מצב רוח טוב וריכוז מלא',
                  'כוס מים ומשהו קל לנשנוש'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center p-3 bg-green-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
                    <span className="text-gray-700">{item}</span>
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings className="w-5 h-5 ml-2 text-blue-600" />
                  הגדרות מבחן
                </h3>
                <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
              </button>

              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Time Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      זמן מבחן (דקות)
                    </label>
                    <select
                      value={settings.timeLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={30}>30 דקות</option>
                      <option value={45}>45 דקות (מומלץ)</option>
                      <option value={60}>60 דקות</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מספר שאלות
                    </label>
                    <select
                      value={settings.questionCount}
                      onChange={(e) => setSettings(prev => ({ ...prev, questionCount: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 שאלות</option>
                      <option value={30}>30 שאלות (מומלץ)</option>
                      <option value={45}>45 שאלות</option>
                    </select>
                  </div>

                  {/* Question Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      סוגי שאלות
                    </label>
                    <div className="space-y-2">
                      {questionTypes.map((type) => (
                        <label key={type.type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.includeTypes.includes(type.type)}
                            onChange={() => toggleQuestionType(type.type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="mr-3 text-sm text-gray-700">{type.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      רמת קושי
                    </label>
                    <select
                      value={settings.difficulty}
                      onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">קל</option>
                      <option value="medium">בינוני</option>
                      <option value="hard">קשה</option>
                      <option value="mixed">מעורב (מומלץ)</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 ml-2 text-green-600" />
                הסטטיסטיקות שלך
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">מבחנים מלאים:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ציון ממוצע:</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ציון מרבי:</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">זמן ממוצע:</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">טיפים למבחן</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• קרא כל שאלה בעיון</li>
                <li>• נהל את הזמן בחוכמה</li>
                <li>• אל תתעכב יותר מדי על שאלה אחת</li>
                <li>• סמוך על התחושה הראשונה</li>
                <li>• השתמש בטכניקת החיסול</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FullSimulation;
