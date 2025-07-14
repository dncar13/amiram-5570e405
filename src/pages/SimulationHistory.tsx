import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Target, BookOpen, TrendingUp, Award, ChevronRight, BarChart3, Timer, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SimulationResult {
  id: string;
  title: string;
  type: "practice" | "exam" | "quiz";
  date: string;
  duration: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  status: "completed" | "incomplete" | "in-progress";
}

interface WeeklyStats {
  week: string;
  totalTime: number;
  questionsAnswered: number;
  averageScore: number;
  simulationsCompleted: number;
}

interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  timeSpent: number;
}

const SimulationHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week");
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  const [realSessions, setRealSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // REMOVED: All mock simulation data
  // Now using only real data from Supabase simulation_sessions table

  const calculateWeeklyStats = (simulationData: SimulationResult[]): WeeklyStats[] => {
    const weeklyData: Record<string, WeeklyStats> = {};
    
    simulationData.forEach((sim: SimulationResult) => {
      const week = getWeekKey(sim.date);
      if (!weeklyData[week]) {
        weeklyData[week] = {
          week,
          totalTime: 0,
          questionsAnswered: 0,
          averageScore: 0,
          simulationsCompleted: 0
        };
      }
      
      weeklyData[week].totalTime += sim.duration;
      weeklyData[week].questionsAnswered += sim.totalQuestions;
      weeklyData[week].simulationsCompleted += 1;
    });

    return Object.values(weeklyData);
  };

  const calculateTopicPerformance = (simulationData: SimulationResult[]): TopicPerformance[] => {
    const topicData: Record<string, TopicPerformance> = {};
    
    simulationData.forEach((sim: SimulationResult) => {
      sim.topics.forEach((topic: string) => {
        if (!topicData[topic]) {
          topicData[topic] = {
            topic,
            totalQuestions: 0,
            correctAnswers: 0,
            averageScore: 0,
            timeSpent: 0
          };
        }
        
        topicData[topic].totalQuestions += sim.totalQuestions;
        topicData[topic].correctAnswers += sim.correctAnswers;
        topicData[topic].timeSpent += sim.duration;
      });
    });

    return Object.values(topicData);
  };

  const getWeekKey = (dateString: string): string => {
    const date = new Date(dateString);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    return startOfWeek.toISOString().split('T')[0];
  };

  // Load real simulation sessions from database
  useEffect(() => {
    loadRealSessions();
  }, [currentUser]);

  const loadRealSessions = async () => {
    try {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      console.log('📊 Loading real simulation sessions for user:', currentUser.id);
      
      // Query simulation_sessions table
      const { data: sessions, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error loading sessions:', error);
        // Show empty state, no fallback to mock data
        setSimulations([]);
        setWeeklyStats([]);
        setTopicPerformance([]);
      } else {
        console.log('✅ Real sessions loaded:', sessions);
        setRealSessions(sessions || []);
        
        // Convert real sessions to simulation format
        const convertedSessions = sessions?.map(session => ({
          id: session.id,
          title: `${session.session_type} - ${new Date(session.created_at).toLocaleDateString('he-IL')}`,
          type: session.session_type,
          date: new Date(session.created_at).toISOString().split('T')[0],
          duration: Math.round(session.time_spent / 60), // Convert seconds to minutes
          score: session.total_questions > 0 ? Math.round((session.correct_answers / session.total_questions) * 100) : 0,
          totalQuestions: session.total_questions,
          correctAnswers: session.correct_answers,
          difficulty: "medium" as const, // Default difficulty
          topics: session.topic_id ? [`נושא ${session.topic_id}`] : ['כללי'],
          status: session.completed_at ? "completed" : "incomplete" as const,
        })) || [];
        
        // Always use real data, even if empty
        setSimulations(convertedSessions as SimulationResult[]);
        setWeeklyStats(calculateWeeklyStats(convertedSessions as SimulationResult[]));
        setTopicPerformance(calculateTopicPerformance(convertedSessions as SimulationResult[]));
      }
      
    } catch (error) {
      console.error('❌ Error in loadRealSessions:', error);
      // Show empty state on error
      setSimulations([]);
      setWeeklyStats([]);
      setTopicPerformance([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6 bg-electric-gray/50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-electric-navy mb-2">היסטוריית סימולציות</h1>
            <p className="text-electric-slate">
              {realSessions.length > 0 ? 
                `סקירה של ${realSessions.length} סימולציות שלך מהמסד נתונים` : 
                'אין סימולציות זמינות - השלם סימולציות כדי לראות היסטוריה'
              }
            </p>
          </div>
          
          <Tabs defaultValue="week" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">שבוע</TabsTrigger>
              <TabsTrigger value="month">חודש</TabsTrigger>
              <TabsTrigger value="all">הכל</TabsTrigger>
            </TabsList>
            
            <TabsContent value="week">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>סטטיסטיקות שבועיות</CardTitle>
                  <CardDescription>סיכום נתונים לשבוע האחרון</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {weeklyStats.map((weekData) => (
                    <div key={weekData.week} className="border rounded-md p-4">
                      <h3 className="font-semibold">שבוע: {weekData.week}</h3>
                      <p>זמן כולל: {weekData.totalTime} דקות</p>
                      <p>שאלות שנענו: {weekData.questionsAnswered}</p>
                      <p>סימולציות שהושלמו: {weekData.simulationsCompleted}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="month">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>סטטיסטיקות חודשיות</CardTitle>
                  <CardDescription>סיכום נתונים לחודש האחרון</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>גרף ונתונים חודשיים יוצגו כאן</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="all">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>ביצועים לפי נושא</CardTitle>
                  <CardDescription>פירוט ביצועים בכל נושא</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {topicPerformance.map((topicData) => (
                    <div key={topicData.topic} className="border rounded-md p-4">
                      <h3 className="font-semibold">נושא: {topicData.topic}</h3>
                      <p>שאלות: {topicData.totalQuestions}</p>
                      <p>תשובות נכונות: {topicData.correctAnswers}</p>
                      <p>זמן: {topicData.timeSpent} דקות</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600">טוען היסטוריית סימולציות מהמסד נתונים...</p>
              </div>
            </div>
          ) : simulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((simulation) => (
                <Card key={simulation.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{simulation.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{simulation.date}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{simulation.duration} דקות</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>{simulation.score}%</span>
                    </div>
                    <Progress value={simulation.score} />
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{simulation.totalQuestions} שאלות</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{simulation.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{simulation.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {simulation.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : simulation.status === "incomplete" ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span>{simulation.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>{simulation.topics.join(", ")}</span>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      לצפייה בתוצאות <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">אין היסטוריית סימולציות</h3>
                <p className="text-gray-600 mb-4">השלם סימולציות כדי לראות את ההיסטוריה שלך כאן</p>
                <Button onClick={() => navigate('/simulations-entry')}>
                  התחל סימולציה חדשה
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimulationHistory;
