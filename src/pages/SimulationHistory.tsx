
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useSavedQuestions } from '@/hooks/useSavedQuestions';
import { 
  Clock, 
  Target, 
  BarChart3, 
  BookOpen, 
  Star, 
  Calendar,
  ArrowRight,
  Trophy,
  TrendingUp,
  Eye,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface SimulationResult {
  id: string;
  type: 'full' | 'practice' | 'reading-comprehension';
  title: string;
  date: string;
  duration: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'completed' | 'abandoned';
}

const SimulationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();  const { savedQuestions, removeQuestionById, isLoading: savedLoading } = useSavedQuestions();
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(true);

  // הפניה לדף התחברות אם המשתמש לא מחובר
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }  // חיבור לנתונים אמיתיים מ-localStorage
  React.useEffect(() => {
    const loadRealSimulationData = () => {
      try {
        setLoading(true);
        const realSimulations: SimulationResult[] = [];
        
        // 1. טוען נתוני Activity History - המקור העיקרי (ספציפי למשתמש)
        const userActivityKey = currentUser?.email ? `activity_history_${currentUser.email}` : 'activity_history';
        const activityHistoryStr = localStorage.getItem(userActivityKey);
        if (activityHistoryStr) {
          try {
            const activityHistory = JSON.parse(activityHistoryStr);
            console.log('Activity history loaded:', activityHistory);
            
            // מגדיר מילון לקיבוץ פעילויות לפי נושא ותאריך
            const groupedActivities = new Map<string, any[]>();
            
            activityHistory.forEach((activity: any) => {
              // רק פעילויות שהושלמו או שיש להן ציון
              if (activity.isCompleted || activity.score !== undefined || activity.totalAnswered > 0) {
                const date = new Date(activity.date).toDateString();
                const topic = activity.topic || 'כללי';
                const key = `${topic}_${date}`;
                
                if (!groupedActivities.has(key)) {
                  groupedActivities.set(key, []);
                }
                groupedActivities.get(key)!.push(activity);
              }
            });
            
            // המרה לפורמט SimulationResult
            groupedActivities.forEach((activities, key) => {
              // אם יש מספר פעילויות באותו יום ונושא, נקבץ אותן
              const firstActivity = activities[0];
              const totalQuestions = activities.reduce((sum, act) => sum + (act.totalAnswered || 0), 0);
              const totalCorrect = activities.reduce((sum, act) => sum + (act.correctAnswers || 0), 0);
              const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
              
              // זיהוי סוג הסימולציה
              const topic = firstActivity.topic || 'כללי';
              let simulationType: 'full' | 'practice' | 'reading-comprehension' = 'practice';
              let title = topic;
              
              if (topic.includes('מבחן מלא') || topic.includes('full') || totalQuestions >= 50) {
                simulationType = 'full';
                title = `מבחן מלא - ${totalQuestions} שאלות`;
              } else if (topic.includes('קריאה') || topic.includes('הבנת הנקרא') || topic.includes('reading')) {
                simulationType = 'reading-comprehension';
                title = `הבנת הנקרא - ${topic}`;
              } else {
                title = activities.length > 1 ? `${topic} - ${activities.length} תרגילים` : topic;
              }
              
              // חישוב זמן משוער (אם לא קיים)
              const duration = firstActivity.time && !isNaN(parseInt(firstActivity.time)) ? 
                `00:${firstActivity.time.toString().padStart(2, '0')}:00` : 
                totalQuestions > 30 ? '01:30:00' : '00:25:00';
              
              realSimulations.push({
                id: `activity_${key}_${activities.length}`,
                type: simulationType,
                title: title,
                date: firstActivity.date,
                duration: duration,
                totalQuestions: totalQuestions,
                correctAnswers: totalCorrect,
                score: avgScore,
                topics: [topic],
                difficulty: avgScore >= 80 ? 'easy' : avgScore >= 60 ? 'medium' : 'hard',
                status: 'completed'
              });
            });
          } catch (error) {
            console.error('Error parsing activity history:', error);
          }
        }
        
        // 2. בדיקת נתוני התקדמות סימולציות שנשמרו בלוקל סטורג'
        const progressKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('_progress_') || key.includes('simulation_progress')) && 
              !key.includes('activity_history') && !key.includes('conflict')) {
            progressKeys.push(key);
          }
        }
        
        progressKeys.forEach(key => {
          try {
            const progressData = JSON.parse(localStorage.getItem(key) || '{}');
            // רק אם יש התקדמות משמעותית
            if (progressData.answeredCount > 3 || progressData.correctCount > 0) {
              const simulationType = key.includes('qs_') ? 'practice' : 
                                   key.includes('topic_') ? 'practice' : 'practice';
              
              const score = progressData.score || 
                           (progressData.correctCount && progressData.totalQuestions ? 
                            Math.round((progressData.correctCount / progressData.totalQuestions) * 100) : 0);
              
              const date = progressData.lastSaved || progressData.timestamp || new Date().toISOString();
              const formattedDate = new Date(date).toLocaleDateString('he-IL', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              const title = key.includes('qs_') ? `קבוצת שאלות ${key.split('_')[2] || ''}` : 
                           key.includes('topic_') ? `נושא ${key.split('_')[2] || ''}` : 'סימולציה בהתקדמות';
              
              realSimulations.push({
                id: `progress_${key}`,
                type: simulationType,
                title: title,
                date: formattedDate,
                duration: progressData.remainingTime ? 
                         `00:${Math.floor((1800 - progressData.remainingTime) / 60)}:${((1800 - progressData.remainingTime) % 60).toString().padStart(2, '0')}` : 
                         '00:15:00',
                totalQuestions: progressData.totalQuestions || progressData.answeredCount || 50,
                correctAnswers: progressData.correctCount || progressData.correctQuestionsCount || 0,
                score: score,
                topics: [progressData.topicId ? `נושא ${progressData.topicId}` : 'כללי'],
                difficulty: score >= 80 ? 'easy' : score >= 60 ? 'medium' : 'hard',
                status: progressData.completed ? 'completed' : 'abandoned'
              });
            }
          } catch (error) {
            console.error(`Error parsing progress data for ${key}:`, error);
          }
        });
        
        // 3. בדיקת נתוני Quick Practice (מ-sessionStorage)
        const quickPracticeKeys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.includes('quick_practice_progress_')) {
            quickPracticeKeys.push(key);
          }
        }
        
        quickPracticeKeys.forEach(key => {
          try {
            const quickData = JSON.parse(sessionStorage.getItem(key) || '{}');
            if (quickData.completed || quickData.score) {
              const practiceType = key.replace('quick_practice_progress_', '');
              
              realSimulations.push({
                id: `quick_${key}`,
                type: 'practice',
                title: `תרגול מהיר - ${practiceType}`,
                date: new Date().toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                duration: '00:10:00',
                totalQuestions: quickData.totalQuestions || 25,
                correctAnswers: Math.round((quickData.score / 100) * (quickData.totalQuestions || 25)),
                score: quickData.score || 0,
                topics: [practiceType],
                difficulty: 'medium',
                status: quickData.completed ? 'completed' : 'abandoned'
              });
            }
          } catch (error) {
            console.error(`Error parsing quick practice data for ${key}:`, error);
          }
        });
        
        // מיון לפי תאריך (החדשים ראשון) והסרת כפילויות
        const uniqueSimulations = realSimulations.filter((sim, index, self) => 
          index === self.findIndex(s => s.title === sim.title && s.date === sim.date)
        );
        
        const sortedSimulations = uniqueSimulations.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setSimulations(sortedSimulations);
        
        console.log('Loaded real simulation data:', {
          total: sortedSimulations.length,
          byType: {
            full: sortedSimulations.filter(s => s.type === 'full').length,
            practice: sortedSimulations.filter(s => s.type === 'practice').length,
            reading: sortedSimulations.filter(s => s.type === 'reading-comprehension').length
          },
          simulations: sortedSimulations
        });
        
        // אם אין נתונים אמיתיים, נשתמש בנתונים לדוגמה
        if (sortedSimulations.length === 0) {
          console.log('No real simulation data found, using mock data');
          setSimulations(mockSimulations);
        }
      } catch (error) {
        console.error('Error loading simulation data:', error);
        setSimulations(mockSimulations);
      } finally {
        setLoading(false);
      }
    };
    
    loadRealSimulationData();
    
    // מאזין לעדכונים בhistory
    const handleActivityUpdate = () => {
      console.log('Activity updated, reloading simulation data...');
      loadRealSimulationData();
    };
    
    window.addEventListener('activity_history_updated', handleActivityUpdate);
    return () => {
      window.removeEventListener('activity_history_updated', handleActivityUpdate);
    };
  }, [currentUser]);

  // נתונים לדוגמה כרזרב (יוצגו רק אם אין נתונים אמיתיים)
  const mockSimulations: SimulationResult[] = [
    {
      id: '1',
      type: 'full',
      title: 'סימולציה מלאה - 80 שאלות',
      date: '2025-06-18T20:03:00Z',
      duration: '2:15:30',
      totalQuestions: 80,
      correctAnswers: 67,
      score: 84,
      topics: ['השלמת משפטים', 'הבנת הנקרא', 'ניסוח מחדש', 'אנלוגיות'],
      difficulty: 'hard',
      status: 'completed'
    },
    {
      id: '2',
      type: 'practice',
      title: 'תרגול השלמת משפטים',
      date: '2025-06-18T18:30:00Z',
      duration: '15:45',
      totalQuestions: 10,
      correctAnswers: 8,
      score: 80,
      topics: ['השלמת משפטים'],
      difficulty: 'medium',
      status: 'completed'
    },
    {
      id: '3',
      type: 'reading-comprehension',
      title: 'הבנת הנקרא - מדעים וטכנולוגיה',
      date: '2025-06-17T16:20:00Z',
      duration: '25:10',
      totalQuestions: 6,
      correctAnswers: 4,
      score: 67,
      topics: ['הבנת הנקרא'],
      difficulty: 'medium',
      status: 'completed'
    },
    {
      id: '4',
      type: 'practice',
      title: 'תרגול ניסוח מחדש',
      date: '2025-06-16T14:15:00Z',
      duration: '12:20',
      totalQuestions: 8,
      correctAnswers: 6,
      score: 75,
      topics: ['ניסוח מחדש'],
      difficulty: 'easy',
      status: 'completed'
    }  ];

  // פונקציות עזר
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAverageScore = () => {
    if (simulations.length === 0) return 0;
    const total = simulations.reduce((sum, sim) => sum + sim.score, 0);
    return Math.round(total / simulations.length);
  };

  const getTotalStudyTime = () => {
    // חישוב זמן לימוד כולל
    const totalMinutes = simulations.reduce((total, sim) => {
      const [hours, minutes, seconds] = sim.duration.split(':').map(Number);
      return total + (hours * 60) + minutes + (seconds / 60);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const getCompletedSimulations = () => {
    return simulations.filter(sim => sim.status === 'completed').length;
  };
  const getTotalQuestionsAnswered = () => {
    return simulations.filter(sim => sim.status === 'completed')
                     .reduce((total, sim) => total + sim.totalQuestions, 0);
  };

  const getSimulationIcon = (type: string) => {
    switch (type) {
      case 'full': return <Target className="h-5 w-5" />;
      case 'reading-comprehension': return <BookOpen className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getSimulationTypeText = (type: string) => {
    switch (type) {
      case 'full': return 'סימולציה מלאה';
      case 'reading-comprehension': return 'הבנת הנקרא';
      case 'practice': return 'תרגול';
      default: return 'כללי';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return difficulty;
    }
  };

  const handleRemoveSavedQuestion = (questionId: number) => {
    if (removeQuestionById(questionId)) {
      console.log(`Question ${questionId} removed successfully`);
    }
  };

  const handleViewQuestion = (questionId: number) => {
    navigate(`/saved-questions?questionId=${questionId}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">טוען היסטוריה...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">היסטוריה וביצועים</h1>
                  <p className="text-white text-opacity-90 text-lg">
                    עקוב אחר ההתקדמות שלך ונהל שאלות שמרת
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* סטטיסטיקות כלליות */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">ציון ממוצע</p>
                    <p className={`text-2xl font-bold ${getScoreColor(calculateAverageScore())}`}>
                      {calculateAverageScore()}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-4">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">סימולציות הושלמו</p>
                    <p className="text-2xl font-bold text-gray-900">{simulations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center ml-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">שאלות שמורות</p>
                    <p className="text-2xl font-bold text-gray-900">{savedQuestions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center ml-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">זמן לימוד כולל</p>
                    <p className="text-2xl font-bold text-gray-900">{getTotalStudyTime()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* טאבים */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg"
          >
            <Tabs defaultValue="simulations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-t-2xl">
                <TabsTrigger value="simulations" className="rounded-xl">
                  היסטוריית סימולציות ({simulations.length})
                </TabsTrigger>
                <TabsTrigger value="saved" className="rounded-xl">
                  שאלות שמורות ({savedQuestions.length})
                </TabsTrigger>
              </TabsList>

              {/* היסטוריית סימולציות */}
              <TabsContent value="simulations" className="p-6">
                {simulations.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      טרם בוצעו סימולציות
                    </h3>
                    <p className="text-gray-500 mb-6">
                      התחל את המסע שלך עם הסימולציה הראשונה
                    </p>
                    <Button
                      onClick={() => navigate('/simulations-entry')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      התחל סימולציה
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {simulations.map((simulation, index) => (
                      <motion.div
                        key={simulation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          {/* פרטי הסימולציה */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-blue-600">
                                {getSimulationIcon(simulation.type)}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {simulation.title}
                              </h3>
                              <Badge variant="secondary">
                                {getSimulationTypeText(simulation.type)}
                              </Badge>
                              <Badge variant="outline">
                                {getDifficultyLabel(simulation.difficulty)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(simulation.date)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {simulation.duration}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {simulation.correctAnswers}/{simulation.totalQuestions} נכונות
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge className={getScoreBadgeColor(simulation.score)}>
                                  {simulation.score}% ציון
                                </Badge>
                              </div>
                            </div>

                            {/* נושאים */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {simulation.topics.map((topic, topicIndex) => (
                                <Badge key={topicIndex} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* כפתורי פעולה */}
                          <div className="flex gap-2 mr-4">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 ml-1" />
                              צפה בתוצאות
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="w-4 h-4 ml-1" />
                              חזור על הסימולציה
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* שאלות שמורות */}
              <TabsContent value="saved" className="p-6">
                {savedLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>טוען שאלות שמורות...</p>
                  </div>
                ) : savedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      אין שאלות שמורות
                    </h3>
                    <p className="text-gray-500">
                      שמור שאלות מעניינות במהלך הסימולציות כדי לחזור אליהן מאוחר יותר
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedQuestions.map((savedQuestion, index) => (
                      <motion.div
                        key={savedQuestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                              <Badge variant="secondary">
                                {savedQuestion.question.type === 'sentence-completion' ? 'השלמת משפטים' : 
                                 savedQuestion.question.type === 'restatement' ? 'ניסוח מחדש' : 
                                 savedQuestion.question.type === 'reading-comprehension' ? 'הבנת הנקרא' : 
                                 savedQuestion.question.type}
                              </Badge>
                              <Badge variant="outline">
                                {savedQuestion.question.difficulty === 'easy' ? 'קל' : 
                                 savedQuestion.question.difficulty === 'medium' ? 'בינוני' : 
                                 savedQuestion.question.difficulty === 'hard' ? 'קשה' : 
                                 savedQuestion.question.difficulty}
                              </Badge>
                            </div>
                            
                            <div 
                              className="text-gray-900 mb-3 leading-relaxed cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewQuestion(savedQuestion.question.id)}
                              dangerouslySetInnerHTML={{ __html: savedQuestion.question.text }}
                            />
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                נשמר ב-{new Date(savedQuestion.savedDate).toLocaleDateString('he-IL')}
                              </div>
                              <span>שאלה #{savedQuestion.question.id}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mr-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewQuestion(savedQuestion.question.id)}
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              תרגל שוב
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveSavedQuestion(savedQuestion.question.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 ml-1" />
                              הסר
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimulationHistory;
