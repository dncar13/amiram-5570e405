
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  PenTool,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart
} from 'recharts';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { ProgressService, UserProgressStats } from '@/services/progressService';
import { supabase } from '@/integrations/supabase/client';

const ProgressStats: React.FC = () => {
  const navigate = useNavigate();
  const { history, isLoading } = useActivityHistory();
  const [realStats, setRealStats] = useState<UserProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [weakestTopic, setWeakestTopic] = useState<{ type: string; displayName: string; accuracy: number } | null>(null);
  const [weeklyQuestionsCount, setWeeklyQuestionsCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [dailyActivity, setDailyActivity] = useState<Record<string, { correct: number; total: number; accuracy: number }>>({});

  // Get topic-specific icon
  const getTopicIcon = (topicType: string) => {
    const topicIcons = {
      'sentence-completion': <PenTool className="w-6 h-6 text-white" />,
      'reading-comprehension': <BookOpen className="w-6 h-6 text-white" />,
      'restatement': <RefreshCw className="w-6 h-6 text-white" />
    };
    return topicIcons[topicType as keyof typeof topicIcons] || <Target className="w-6 h-6 text-white" />;
  };

  // Get the correct navigation route for each topic
  const getTopicRoute = (topicType: string) => {
    const topicRoutes = {
      'sentence-completion': '/simulation/type/sentence-completion',
      'reading-comprehension': '/reading-comprehension',
      'restatement': '/simulation/type/restatement'
    };
    return topicRoutes[topicType as keyof typeof topicRoutes] || `/simulation/type/${topicType}`;
  };

  // Calculate study streak from daily activity data
  const calculateStudyStreak = useCallback((dailyStats: Record<string, { correct: number; total: number; accuracy: number }>) => {
    const sortedDays = Object.keys(dailyStats).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const dayDate = new Date(sortedDays[i]);
      dayDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (dayDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, []);

  const loadRealStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      console.log('📊 Loading complete real stats from Supabase...');
      
      // Load basic stats
      const stats = await ProgressService.getUserProgressStats(user.id);
      console.log('✅ Basic stats loaded:', stats);
      console.log('📊 [ProgressStats] User ID:', user.id);
      console.log('📊 [ProgressStats] Stats details:', JSON.stringify(stats, null, 2));
      setRealStats(stats);
      
      // Load chart data
      const weeklyData = await ProgressService.getWeeklyProgressData(user.id);
      console.log('✅ Chart data loaded:', { weeklyData });
      setWeeklyProgress(weeklyData);
      
      // Load daily activity data for goals and achievements
      const dailyStats = await ProgressService.getUserDailyActivity(user.id, 30);
      console.log('✅ Daily activity loaded:', dailyStats);
      setDailyActivity(dailyStats);
      
      // Calculate weekly questions count (past 7 days)
      const weeklyCount = Object.values(dailyStats)
        .slice(0, 7)
        .reduce((total, day) => total + day.total, 0);
      setWeeklyQuestionsCount(weeklyCount);
      
      // Calculate study streak
      const streak = calculateStudyStreak(dailyStats);
      setStudyStreak(streak);
      
      // Create topic performance data from stats - filter out vocabulary and low-data types
      if (stats && stats.questions_by_type) {
        const topicData = Object.entries(stats.questions_by_type)
          .filter(([type, data]: [string, { correct: number; total: number; accuracy: number }]) => {
            // Filter out vocabulary and types with too few questions
            return type !== 'vocabulary' && data.total >= 2;
          })
          .map(([type, data]: [string, { correct: number; total: number; accuracy: number }]) => ({
            topic: type === 'sentence-completion' ? 'השלמת משפטים' : 
                   type === 'reading-comprehension' ? 'הבנת הנקרא' :
                   type === 'restatement' ? 'ניסוח מחדש' : type,
            score: Math.round(data.accuracy),
            questions: data.total
          }));
        setTopicPerformance(topicData);
        
        // Find the weakest topic for recommendation
        if (topicData.length > 0) {
          // Sort topics by score (ascending) and then by question count (descending) for tie-breaking
          const sortedTopics = topicData.sort((a, b) => {
            if (a.score === b.score) {
              return b.questions - a.questions; // If same score, prefer topic with more questions
            }
            return a.score - b.score; // Lower score first
          });
          
          const weakest = sortedTopics[0];
          
          const typeMapping: Record<string, string> = {
            'השלמת משפטים': 'sentence-completion',
            'הבנת הנקרא': 'reading-comprehension',
            'ניסוח מחדש': 'restatement'
          };
          
          setWeakestTopic({
            type: typeMapping[weakest.topic] || weakest.topic,
            displayName: weakest.topic,
            accuracy: weakest.score
          });
        }
      }
      
      // Create difficulty breakdown data from stats - filter out vocabulary
      if (stats && stats.questions_by_difficulty) {
        const colors = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };
        const difficultyData = Object.entries(stats.questions_by_difficulty)
          .filter(([difficulty, data]: [string, { correct: number; total: number; accuracy: number }]) => data.total >= 2)
          .map(([difficulty, data]: [string, { correct: number; total: number; accuracy: number }]) => ({
            name: difficulty === 'easy' ? 'קל' : difficulty === 'medium' ? 'בינוני' : 'קשה',
            value: data.total,
            color: colors[difficulty as keyof typeof colors] || '#6B7280'
          }));
        setDifficultyBreakdown(difficultyData);
      }
      
    } catch (error) {
      console.error('❌ Error loading real stats:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateStudyStreak]);

  useEffect(() => {
    loadRealStats();
  }, [loadRealStats]);

  // Real chart data states
  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ week: string; correct: number; wrong: number; total: number }>>([]);
  const [topicPerformance, setTopicPerformance] = useState<Array<{ topic: string; score: number; questions: number }>>([]);
  const [difficultyBreakdown, setDifficultyBreakdown] = useState<Array<{ name: string; value: number; color: string }>>([]);

  const chartConfig = {
    correct: {
      label: "תשובות נכונות",
      color: "#10B981",
    },
    wrong: {
      label: "תשובות שגויות", 
      color: "#EF4444",
    },
    score: {
      label: "ציון",
      color: "#3B82F6",
    },
  };

  // Use real statistics when available, fallback to local history
  const totalQuestions = realStats ? realStats.total_questions_answered : history.length;
  const correctAnswers = realStats ? realStats.total_correct_answers : history.filter(h => h.status === 'correct').length;
  const averageScore = realStats ? Math.round(realStats.accuracy_percentage) : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);
  const totalTime = realStats ? Math.round(realStats.total_time_spent / 60) : history.reduce((sum, h) => sum + (parseInt(h.time) || 0), 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/account')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              חזור לחשבון
            </button>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">סטטיסטיקות התקדמות</h1>
                  <p className="text-white text-opacity-90 text-lg">
                    מעקב מפורט אחר הביצועים והשיפור שלך
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{averageScore}%</div>
                <div className="text-blue-600">ציון ממוצע</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-700">{correctAnswers}</div>
                <div className="text-green-600">תשובות נכונות</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-700">{totalQuestions}</div>
                <div className="text-purple-600">שאלות נענו</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-700">{totalTime}</div>
                <div className="text-orange-600">{realStats ? 'דקות למידה' : 'דקות למידה (נתונים מקומיים)'}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Topic to Improve Recommendation */}
          {weakestTopic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-500 rounded-full p-3">
                        {getTopicIcon(weakestTopic.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-800 mb-1">
                          הנושא הבא לשיפור
                        </h3>
                        <p className="text-amber-700 mb-2">
                          {weakestTopic.displayName} - {weakestTopic.accuracy}% דיוק
                        </p>
                        <p className="text-amber-600 text-sm">
                          התמקדות בנושא זה תשפר את הביצועים הכלליים שלך
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(getTopicRoute(weakestTopic.type))}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>התרגל בנושא זה</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    התקדמות שבועית
                  </CardTitle>
                  <CardDescription>
                    מעקב אחר הביצועים לאורך זמן
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-600">טוען נתונים מהמסד נתונים...</p>
                      </div>
                    </div>
                  ) : weeklyProgress.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <AreaChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="correct" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="wrong" 
                          stackId="1"
                          stroke="#EF4444" 
                          fill="#EF4444"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">אין נתונים זמינים</p>
                        <p className="text-sm text-gray-500">ענה על שאלות כדי לראות התקדמות</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Topic Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    ביצועים לפי נושא
                  </CardTitle>
                  <CardDescription>
                    ציונים ממוצעים בכל נושא
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-600">טוען נתונים מהמסד נתונים...</p>
                      </div>
                    </div>
                  ) : topicPerformance.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart data={topicPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="topic" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">אין נתוני נושאים זמינים</p>
                        <p className="text-sm text-gray-500">ענה על שאלות בנושאים שונים</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  התפלגות רמות קושי
                </CardTitle>
                <CardDescription>
                  פילוח השאלות לפי רמת קושי
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-600">טוען נתונים מהמסד נתונים...</p>
                    </div>
                  </div>
                ) : difficultyBreakdown.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={difficultyBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {difficultyBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">אין נתוני קושי זמינים</p>
                      <p className="text-sm text-gray-500">ענה על שאלות ברמות קושי שונות</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  מטרות והישגים
                </CardTitle>
                <CardDescription>
                  התקדמות לקראת יעדים
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-600">טוען נתוני מטרות...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>יעד שבועי: 100 שאלות</span>
                        <span className="font-medium">{weeklyQuestionsCount}/100</span>
                      </div>
                      <Progress value={Math.min((weeklyQuestionsCount / 100) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>יעד דיוק: 85%</span>
                        <span className="font-medium">{averageScore}/85%</span>
                      </div>
                      <Progress value={Math.min((averageScore / 85) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>ימי לימוד רצופים</span>
                        <span className="font-medium">{studyStreak} ימים</span>
                      </div>
                      <Progress value={Math.min((studyStreak / 15) * 100, 100)} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProgressStats;
