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

  // Mock data for demonstration
  const mockSimulations: SimulationResult[] = [
    {
      id: "sim-1",
      title: "תרגול אוצר מילים",
      type: "practice",
      date: "2024-01-20",
      duration: 35,
      score: 75,
      totalQuestions: 40,
      correctAnswers: 30,
      difficulty: "medium",
      topics: ["אוצר מילים"],
      status: "completed",
    },
    {
      id: "sim-2",
      title: "סימולציה מלאה - מועד ינואר",
      type: "exam",
      date: "2024-01-22",
      duration: 120,
      score: 62,
      totalQuestions: 100,
      correctAnswers: 62,
      difficulty: "hard",
      topics: ["הבנת הנקרא", "לוגיקה", "אנלוגיות"],
      status: "completed",
    },
    {
      id: "sim-3",
      title: "בוחן פתע - השלמת משפטים",
      type: "quiz",
      date: "2024-01-25",
      duration: 15,
      score: 80,
      totalQuestions: 20,
      correctAnswers: 16,
      difficulty: "easy",
      topics: ["השלמת משפטים"],
      status: "completed",
    },
    {
      id: "sim-4",
      title: "תרגול שאלות מילולי",
      type: "practice",
      date: "2024-01-28",
      duration: 40,
      score: 68,
      totalQuestions: 50,
      correctAnswers: 34,
      difficulty: "medium",
      topics: ["אנלוגיות", "הבנת הנקרא"],
      status: "completed",
    },
    {
      id: "sim-5",
      title: "סימולציה חלקית - כמותי",
      type: "exam",
      date: "2024-01-30",
      duration: 60,
      score: 55,
      totalQuestions: 40,
      correctAnswers: 22,
      difficulty: "hard",
      topics: ["כמותי"],
      status: "completed",
    },
    {
      id: "sim-6",
      title: "תרגול נוסף - הגיון",
      type: "practice",
      date: "2024-02-02",
      duration: 25,
      score: 90,
      totalQuestions: 30,
      correctAnswers: 27,
      difficulty: "easy",
      topics: ["הגיון"],
      status: "completed",
    },
    {
      id: "sim-7",
      title: "סימולציה מלאה - מועד פברואר",
      type: "exam",
      date: "2024-02-05",
      duration: 120,
      score: 70,
      totalQuestions: 100,
      correctAnswers: 70,
      difficulty: "hard",
      topics: ["הבנת הנקרא", "לוגיקה", "אנלוגיות", "כמותי"],
      status: "completed",
    },
    {
      id: "sim-8",
      title: "בוחן - חזרה על כמותי",
      type: "quiz",
      date: "2024-02-08",
      duration: 20,
      score: 75,
      totalQuestions: 20,
      correctAnswers: 15,
      difficulty: "medium",
      topics: ["כמותי"],
      status: "completed",
    },
    {
      id: "sim-9",
      title: "תרגול מקיף - מילולי",
      type: "practice",
      date: "2024-02-11",
      duration: 45,
      score: 82,
      totalQuestions: 50,
      correctAnswers: 41,
      difficulty: "medium",
      topics: ["אנלוגיות", "הבנת הנקרא", "השלמת משפטים"],
      status: "completed",
    },
    {
      id: "sim-10",
      title: "סימולציה חלקית - הגיון",
      type: "exam",
      date: "2024-02-14",
      duration: 55,
      score: 60,
      totalQuestions: 40,
      correctAnswers: 24,
      difficulty: "hard",
      topics: ["הגיון"],
      status: "completed",
    },
    {
      id: "sim-11",
      title: "תרגול שאלות מילולי",
      type: "practice",
      date: "2024-02-17",
      duration: 38,
      score: 70,
      totalQuestions: 45,
      correctAnswers: 32,
      difficulty: "medium",
      topics: ["אנלוגיות", "הבנת הנקרא"],
      status: "completed",
    },
    {
      id: "sim-12",
      title: "סימולציה מלאה - מועד מרץ",
      type: "exam",
      date: "2024-02-20",
      duration: 115,
      score: 65,
      totalQuestions: 100,
      correctAnswers: 65,
      difficulty: "hard",
      topics: ["הבנת הנקרא", "לוגיקה", "אנלוגיות", "כמותי"],
      status: "completed",
    },
    {
      id: "sim-13",
      title: "בוחן - חזרה על הגיון",
      type: "quiz",
      date: "2024-02-23",
      duration: 18,
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      difficulty: "medium",
      topics: ["הגיון"],
      status: "completed",
    },
    {
      id: "sim-14",
      title: "תרגול מקיף - כמותי",
      type: "practice",
      date: "2024-02-26",
      duration: 50,
      score: 78,
      totalQuestions: 50,
      correctAnswers: 39,
      difficulty: "medium",
      topics: ["כמותי"],
      status: "completed",
    },
    {
      id: "sim-15",
      title: "סימולציה חלקית - מילולי",
      type: "exam",
      date: "2024-02-29",
      duration: 58,
      score: 57,
      totalQuestions: 40,
      correctAnswers: 23,
      difficulty: "hard",
      topics: ["אנלוגיות", "הבנת הנקרא", "השלמת משפטים"],
      status: "completed",
    },
    {
      id: "sim-16",
      title: "תרגול שאלות הגיון",
      type: "practice",
      date: "2024-03-03",
      duration: 42,
      score: 72,
      totalQuestions: 45,
      correctAnswers: 33,
      difficulty: "medium",
      topics: ["הגיון"],
      status: "completed",
    },
    {
      id: "sim-17",
      title: "סימולציה מלאה - מועד אפריל",
      type: "exam",
      date: "2024-03-06",
      duration: 118,
      score: 68,
      totalQuestions: 100,
      correctAnswers: 68,
      difficulty: "hard",
      topics: ["הבנת הנקרא", "לוגיקה", "אנלוגיות", "כמותי"],
      status: "completed",
    },
    {
      id: "sim-18",
      title: "בוחן - חזרה על מילולי",
      type: "quiz",
      date: "2024-03-09",
      duration: 19,
      score: 80,
      totalQuestions: 20,
      correctAnswers: 16,
      difficulty: "medium",
      topics: ["אנלוגיות", "הבנת הנקרא", "השלמת משפטים"],
      status: "completed",
    },
    {
      id: "sim-19",
      title: "תרגול מקיף - הגיון",
      type: "practice",
      date: "2024-03-12",
      duration: 48,
      score: 80,
      totalQuestions: 50,
      correctAnswers: 40,
      difficulty: "medium",
      topics: ["הגיון"],
      status: "completed",
    },
    {
      id: "sim-20",
      title: "סימולציה חלקית - כמותי",
      type: "exam",
      date: "2024-03-15",
      duration: 57,
      score: 62,
      totalQuestions: 40,
      correctAnswers: 25,
      difficulty: "hard",
      topics: ["כמותי"],
      status: "completed",
    },
  ];

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
        // Fallback to mock data
        setSimulations(mockSimulations);
        setWeeklyStats(calculateWeeklyStats(mockSimulations));
        setTopicPerformance(calculateTopicPerformance(mockSimulations));
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
        
        if (convertedSessions.length > 0) {
          setSimulations(convertedSessions as SimulationResult[]);
          setWeeklyStats(calculateWeeklyStats(convertedSessions as SimulationResult[]));
          setTopicPerformance(calculateTopicPerformance(convertedSessions as SimulationResult[]));
        } else {
          // If no real sessions, show mock data
          setSimulations(mockSimulations);
          setWeeklyStats(calculateWeeklyStats(mockSimulations));
          setTopicPerformance(calculateTopicPerformance(mockSimulations));
        }
      }
      
    } catch (error) {
      console.error('❌ Error in loadRealSessions:', error);
      // Fallback to mock data
      setSimulations(mockSimulations);
      setWeeklyStats(calculateWeeklyStats(mockSimulations));
      setTopicPerformance(calculateTopicPerformance(mockSimulations));
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
                'סקירה של תוצאות הסימולציות הקודמות שלך (נתונים לדוגמה)'
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimulationHistory;
