
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { useSavedQuestions } from '@/hooks/useSavedQuestions';
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

const SimulationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const { history, isLoading: historyLoading } = useActivityHistory();
  const { savedQuestions, removeQuestionById, isLoading: savedLoading } = useSavedQuestions();
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // הפניה לדף התחברות אם המשתמש לא מחובר
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

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

  // סינון היסטוריה
  const filteredHistory = history.filter(activity => 
    filterType === 'all' || activity.topic.includes(filterType)
  );

  // סינון שאלות שמורות
  const filteredSaved = savedQuestions.filter(q => 
    (filterType === 'all' || q.question.type === filterType) &&
    (searchTerm === '' || q.question.text.includes(searchTerm))
  );

  // חישוב סטטיסטיקות אמיתיות
  const simulationResults = history.filter(activity => 
    activity.questionId === 'final' || activity.questionId === 'partial'
  );

  const averageScore = simulationResults.length > 0 
    ? Math.round(simulationResults.reduce((sum, sim) => sum + (sim.score || 0), 0) / simulationResults.length)
    : 0;

  const totalQuestions = history.filter(activity => 
    activity.questionId !== 'final' && 
    activity.questionId !== 'partial' && 
    activity.questionId !== 'full-exam'
  ).length;

  const totalCorrect = history.filter(activity => 
    activity.status === 'correct' && 
    activity.questionId !== 'final' && 
    activity.questionId !== 'partial' && 
    activity.questionId !== 'full-exam'
  ).length;

  const handleRemoveSavedQuestion = (questionId: number) => {
    if (removeQuestionById(questionId)) {
      console.log(`Question ${questionId} removed successfully`);
    }
  };

  const handleViewQuestion = (questionId: number) => {
    navigate(`/saved-questions?questionId=${questionId}`);
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
              <div className="text-2xl font-bold text-gray-800">{simulationResults.length}</div>
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
                שאלות שמורות ({savedQuestions.length})
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
                    <option value="השלמת משפטים">השלמת משפטים</option>
                    <option value="ניסוח מחדש">ניסוח מחדש</option>
                    <option value="הבנת הנקרא">הבנת הנקרא</option>
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
                  {historyLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>טוען היסטוריה...</p>
                    </div>
                  ) : filteredHistory.length === 0 ? (
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
                    filteredHistory.map((activity, index) => (
                      <motion.div
                        key={`${activity.date}-${activity.questionId}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                              <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{activity.topic}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 ml-1" />
                                {activity.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activity.status === 'correct' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {activity.status === 'wrong' && <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {activity.score ? `${activity.score}%` : '-'}
                            </div>
                            <div className="text-xs text-gray-500">ציון</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-700">
                              {activity.questionId === 'final' || activity.questionId === 'partial' ? 
                                `${activity.correctAnswers}/${activity.totalAnswered}` : 
                                activity.status === 'correct' ? '1/1' : '0/1'
                              }
                            </div>
                            <div className="text-xs text-gray-500">נכונות</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-700">{activity.time}ד'</div>
                            <div className="text-xs text-gray-500">זמן</div>
                          </div>
                          <div className="text-center">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                              {activity.questionId === 'final' ? 'מבחן מלא' : 
                               activity.questionId === 'partial' ? 'מבחן חלקי' : 
                               `שאלה ${activity.questionId}`}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {savedLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>טוען שאלות שמורות...</p>
                    </div>
                  ) : filteredSaved.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {savedQuestions.length === 0 ? 'אין שאלות שמורות' : 'לא נמצאו תוצאות'}
                      </h3>
                      <p className="text-gray-500">
                        {savedQuestions.length === 0 ? 
                          'שמור שאלות במהלך תרגול כדי לחזור אליהן מאוחר יותר' :
                          'נסה לשנות את הפילטרים או תנאי החיפוש'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredSaved.map((savedQuestion, index) => (
                      <motion.div
                        key={savedQuestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="text-blue-600 ml-2">
                                {getTypeIcon(savedQuestion.question.type)}
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {getTypeLabel(savedQuestion.question.type)}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium mr-2 bg-blue-100 text-blue-600">
                                {getDifficultyLabel(savedQuestion.question.difficulty)}
                              </span>
                            </div>
                            <div 
                              className="text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewQuestion(savedQuestion.question.id)}
                              dangerouslySetInnerHTML={{ __html: savedQuestion.question.text }}
                            />
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 ml-1" />
                              נשמר ב: {new Date(savedQuestion.savedDate).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mr-4">
                            <button 
                              onClick={() => handleViewQuestion(savedQuestion.question.id)}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              title="צפה בשאלה"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleRemoveSavedQuestion(savedQuestion.question.id)}
                              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                              title="הסר מהשמורות"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-blue-600">
                              שאלה #{savedQuestion.question.id}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleViewQuestion(savedQuestion.question.id)}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            פתח שאלה
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimulationHistory;
