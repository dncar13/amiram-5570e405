import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  History, 
  Bookmark, 
  ArrowRight,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  Filter,
  Search,
  BarChart3,
  Eye,
  Trash2,
  Download,
  Star,
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  BookOpenCheck
} from 'lucide-react';

interface SimulationHistory {
  id: string;
  date: string;
  type: string;
  questionCount: number;
  correctAnswers: number;
  timeSpent: number;
  difficulty: string;
  score: number;
}

interface SavedQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  dateSaved: string;
  isAnswered: boolean;
  isCorrect?: boolean;
}

const SimulationHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API/context
  const simulationHistory: SimulationHistory[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'מבחן מלא',
      questionCount: 30,
      correctAnswers: 24,
      timeSpent: 42,
      difficulty: 'mixed',
      score: 80
    },
    {
      id: '2',
      date: '2024-01-14',
      type: 'השלמת משפטים',
      questionCount: 15,
      correctAnswers: 12,
      timeSpent: 18,
      difficulty: 'medium',
      score: 80
    },
    {
      id: '3',
      date: '2024-01-13',
      type: 'הבנת הנקרא',
      questionCount: 10,
      correctAnswers: 7,
      timeSpent: 25,
      difficulty: 'hard',
      score: 70
    }
  ];

  const savedQuestions: SavedQuestion[] = [
    {
      id: '1',
      question: 'המילה החסרה במשפט: "הוא _____ בעבודתו כבר שנים רבות"',
      type: 'sentence-completion',
      difficulty: 'medium',
      dateSaved: '2024-01-15',
      isAnswered: true,
      isCorrect: true
    },
    {
      id: '2',
      question: 'איזה מהביטויים הבאים מבטא בצורה הטובה ביותר את המשפט המקורי?',
      type: 'restatement',
      difficulty: 'hard',
      dateSaved: '2024-01-14',
      isAnswered: false
    },
    {
      id: '3',
      question: 'על פי הקטע, מה היה הגורם העיקרי לשינוי?',
      type: 'reading-comprehension',
      difficulty: 'easy',
      dateSaved: '2024-01-13',
      isAnswered: true,
      isCorrect: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentence-completion':
        return <BookOpen className="w-4 h-4" />;
      case 'restatement':
        return <RotateCcw className="w-4 h-4" />;
      case 'reading-comprehension':
        return <BookOpenCheck className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sentence-completion':
        return 'השלמת משפטים';
      case 'restatement':
        return 'ניסוח מחדש';
      case 'reading-comprehension':
        return 'הבנת הנקרא';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'קל';
      case 'medium':
        return 'בינוני';
      case 'hard':
        return 'קשה';
      case 'mixed':
        return 'מעורב';
      default:
        return difficulty;
    }
  };

  const filteredHistory = simulationHistory.filter(sim => 
    filterType === 'all' || sim.type.includes(filterType)
  );

  const filteredSaved = savedQuestions.filter(q => 
    (filterType === 'all' || q.type === filterType) &&
    (searchTerm === '' || q.question.includes(searchTerm))
  );

  const averageScore = simulationHistory.length > 0 
    ? Math.round(simulationHistory.reduce((sum, sim) => sum + sim.score, 0) / simulationHistory.length)
    : 0;

  const totalQuestions = simulationHistory.reduce((sum, sim) => sum + sim.questionCount, 0);
  const totalCorrect = simulationHistory.reduce((sum, sim) => sum + sim.correctAnswers, 0);
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
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                <History className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">היסטוריה ושאלות שמורות</h1>
                <p className="text-white text-opacity-90 text-lg">
                  עקוב אחר ההתקדמות שלך ונהל שאלות שמרת
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{averageScore}%</div>
            <div className="text-gray-600">ציון ממוצע</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{totalQuestions}</div>
            <div className="text-gray-600">שאלות נענו</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{simulationHistory.length}</div>
            <div className="text-gray-600">מבחנים הושלמו</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{savedQuestions.length}</div>
            <div className="text-gray-600">שאלות שמורות</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg mb-8"
        >
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <History className="w-5 h-5 inline ml-2" />
              היסטוריית מבחנים
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'saved' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Bookmark className="w-5 h-5 inline ml-2" />
              שאלות שמורות
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-500 ml-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">כל הסוגים</option>
                  <option value="sentence-completion">השלמת משפטים</option>
                  <option value="restatement">ניסוח מחדש</option>
                  <option value="reading-comprehension">הבנת הנקרא</option>
                </select>
              </div>
              
              {activeTab === 'saved' && (
                <div className="flex items-center flex-1">
                  <Search className="w-5 h-5 text-gray-500 ml-2" />
                  <input
                    type="text"
                    placeholder="חפש שאלות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'history' ? (
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      אין היסטוריית מבחנים
                    </h3>
                    <p className="text-gray-500 mb-6">
                      התחל לפתור מבחנים כדי לראות את ההיסטוריה שלך כאן
                    </p>
                    <button
                      onClick={() => navigate('/simulations-entry')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      התחל מבחן חדש
                    </button>
                  </div>
                ) : (
                  filteredHistory.map((simulation, index) => (
                    <motion.div
                      key={simulation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                            {getTypeIcon(simulation.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{simulation.type}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 ml-1" />
                              {new Date(simulation.date).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{simulation.score}%</div>
                          <div className="text-xs text-gray-500">ציון</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">
                            {simulation.correctAnswers}/{simulation.questionCount}
                          </div>
                          <div className="text-xs text-gray-500">נכונות</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">{simulation.timeSpent}ד'</div>
                          <div className="text-xs text-gray-500">זמן</div>
                        </div>
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(simulation.difficulty)}`}>
                            {getDifficultyLabel(simulation.difficulty)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSaved.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      אין שאלות שמורות
                    </h3>
                    <p className="text-gray-500">
                      שמור שאלות במהלך תרגול כדי לחזור אליהן מאוחר יותר
                    </p>
                  </div>
                ) : (
                  filteredSaved.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="text-blue-600 ml-2">
                              {getTypeIcon(question.type)}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {getTypeLabel(question.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyLabel(question.difficulty)}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-2">{question.question}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 ml-1" />
                            נשמר ב: {new Date(question.dateSaved).toLocaleDateString('he-IL')}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mr-4">
                          {question.isAnswered && (
                            <div className={`p-1 rounded-full ${question.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                              {question.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          )}
                          <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm ${question.isAnswered ? 'text-green-600' : 'text-gray-500'}`}>
                            {question.isAnswered ? 'נענתה' : 'לא נענתה'}
                          </span>
                        </div>
                        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                          פתח שאלה
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>      </div>
    </div>
    <Footer />
    </>
  );
};

export default SimulationHistory;
