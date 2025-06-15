
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/questionsData";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, Flag, Trophy, Star, Target, TrendingUp, Award, Zap } from "lucide-react";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { saveQuickPracticeProgress } from "@/hooks/simulation/progressUtils";
import { useParams, useSearchParams } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface SimulationResultsProps {
  score: number;
  questionsData: Question[];
  userAnswers: (number | null)[];
  questionFlags: boolean[];
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  onRestart: () => void;
  onBackToTopics: () => void;
  onNavigateToQuestion: (index: number) => void;
  isQuestionSet?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  color: string;
}

const SimulationResults = ({
  score,
  questionsData,
  userAnswers,
  questionFlags,
  answeredQuestionsCount,
  correctQuestionsCount,
  onRestart,
  onBackToTopics,
  onNavigateToQuestion,
  isQuestionSet = false
}: SimulationResultsProps) => {
  const { isQuestionSaved, saveQuestion, removeQuestionById } = useSavedQuestions();
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(() => new Set());
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const questionLimit = searchParams.get('limit');
  
  const isQuickPractice = Boolean(type && questionLimit && !searchParams.get('difficulty'));

  useEffect(() => {
    const parsedQuestions = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
    const savedIds = new Set(
      parsedQuestions.map((q: any) => String(q.id))
    ) as Set<string>;
    
    setSavedQuestionIds(savedIds);

    if (isQuickPractice && type) {
      saveQuickPracticeProgress(type, score, questionsData.length);
      console.log(`Quick practice progress saved for ${type}: ${score}% score`);
    }
  }, [isQuickPractice, type, score, questionsData.length]);

  const percentage = score;
  const wrongAnswersCount = answeredQuestionsCount - correctQuestionsCount;
  const skippedCount = questionsData.length - answeredQuestionsCount;
  const flaggedCount = questionFlags.filter(flag => flag).length;

  // Chart data for pie chart
  const pieChartData = [
    { name: 'Correct', value: correctQuestionsCount, color: '#10B981' },
    { name: 'Wrong', value: wrongAnswersCount, color: '#EF4444' },
    { name: 'Skipped', value: skippedCount, color: '#6B7280' }
  ];

  // Chart data for performance breakdown
  const performanceData = [
    { category: 'Accuracy', value: percentage, target: 80 },
    { category: 'Completion', value: Math.round((answeredQuestionsCount / questionsData.length) * 100), target: 90 },
    { category: 'Focus', value: Math.max(0, 100 - (flaggedCount * 10)), target: 85 }
  ];

  // Achievements system
  const achievements: Achievement[] = [
    {
      id: 'perfect_score',
      title: 'ציון מושלם!',
      description: 'ענית נכון על כל השאלות',
      icon: Trophy,
      earned: percentage === 100,
      color: 'text-yellow-400'
    },
    {
      id: 'high_achiever',
      title: 'הישג גבוה',
      description: 'קיבלת ציון של 80% או יותר',
      icon: Star,
      earned: percentage >= 80,
      color: 'text-blue-400'
    },
    {
      id: 'completionist',
      title: 'השלמת הכל',
      description: 'ענית על כל השאלות',
      icon: Target,
      earned: answeredQuestionsCount === questionsData.length,
      color: 'text-green-400'
    },
    {
      id: 'focused_learner',
      title: 'למידה ממוקדת',
      description: 'השלמת בלי לסמן שאלות',
      icon: Zap,
      earned: flaggedCount === 0,
      color: 'text-purple-400'
    },
    {
      id: 'improving',
      title: 'מתקדם',
      description: 'קיבלת ציון מעל 60%',
      icon: TrendingUp,
      earned: percentage >= 60,
      color: 'text-orange-400'
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  // Performance level
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: 'מעולה', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' };
    if (percentage >= 80) return { level: 'טוב מאוד', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' };
    if (percentage >= 70) return { level: 'טוב', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
    if (percentage >= 60) return { level: 'בסדר', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30' };
    return { level: 'צריך שיפור', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' };
  };

  const performanceLevel = getPerformanceLevel();

  // Recommendations based on performance
  const getRecommendations = () => {
    const recommendations = [];
    
    if (percentage < 60) {
      recommendations.push("התמקד בבדיקת ההסברים לתשובות השגויות");
      recommendations.push("כדאי להתרגל על שאלות קלות יותר תחילה");
    } else if (percentage < 80) {
      recommendations.push("התקדמות מעולה! נסה לזהות דפוסים בטעויות שלך");
      recommendations.push("התרגל על עוד שאלות ברמת קושי דומה");
    } else {
      recommendations.push("עבודה מצוינת! אתה מוכן לחומר מאתגר יותר");
      recommendations.push("שקול לנסות רמות קושי גבוהות יותר");
    }

    if (flaggedCount > 0) {
      recommendations.push(`עבור על ${flaggedCount} השאלות שסימנת`);
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6 animate-fade-in bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-6">
      <Card className="shadow-2xl border border-slate-600/50 bg-slate-800/90 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border ${performanceLevel.bg}`}>
              <Award className={`h-5 w-5 ${performanceLevel.color}`} />
              <span className={`font-semibold ${performanceLevel.color}`}>
                {performanceLevel.level}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              {isQuestionSet ? "קבוצת השאלות הושלמה!" : isQuickPractice ? "התרגול המהיר הושלם!" : "הסימולציה הושלמה!"}
            </h2>
            <p className="text-lg text-slate-300">
              ענית על {answeredQuestionsCount} מתוך {questionsData.length} שאלות
            </p>
          </div>

          {/* Main Score Display */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div style={{ width: 200, height: 200 }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    textColor: percentage >= 60 ? "#10B981" : "#EF4444",
                    trailColor: "#374151",
                    pathColor: percentage >= 60 ? "#10B981" : "#EF4444",
                    rotation: 0,
                    strokeLinecap: "round",
                    textSize: "20px",
                  })}
                />
              </div>
              {percentage === 100 && (
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl bg-green-500/20 border border-green-500/30">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{correctQuestionsCount}</div>
              <div className="text-sm text-green-300">נכונות</div>
            </div>

            <div className="text-center p-4 rounded-xl bg-red-500/20 border border-red-500/30">
              <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{wrongAnswersCount}</div>
              <div className="text-sm text-red-300">שגויות</div>
            </div>

            <div className="text-center p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Flag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{flaggedCount}</div>
              <div className="text-sm text-blue-300">מסומנות</div>
            </div>

            <div className="text-center p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{skippedCount}</div>
              <div className="text-sm text-purple-300">דולגות</div>
            </div>
          </div>

          {/* Achievements Section */}
          {earnedAchievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                הישגים שנפתחו!
              </h3>
              <div className="flex flex-wrap gap-3">
                {earnedAchievements.map((achievement) => (
                  <Badge 
                    key={achievement.id}
                    variant="secondary" 
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 animate-scale-in text-slate-100"
                  >
                    <achievement.icon className={`h-4 w-4 mr-2 ${achievement.color}`} />
                    <span className="font-medium">{achievement.title}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Analytics Toggle */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowDetailedStats(!showDetailedStats)}
              className="w-full bg-slate-700/50 border-slate-600 text-slate-100 hover:bg-slate-600/50"
            >
              {showDetailedStats ? 'הסתר' : 'הצג'} ניתוח מפורט
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Detailed Analytics */}
          {showDetailedStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
              {/* Results Breakdown Pie Chart */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-100">פירוט התוצאות</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      correct: { label: "נכונות", color: "#10B981" },
                      wrong: { label: "שגויות", color: "#EF4444" },
                      skipped: { label: "דולגות", color: "#6B7280" }
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-100">מדדי ביצועים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "הציון שלך", color: "#3B82F6" },
                      target: { label: "יעד", color: "#10B981" }
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <XAxis dataKey="category" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.3} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          <Card className="mb-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                <Star className="h-5 w-5" />
                המלצות אישיות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-300">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button 
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              {isQuickPractice ? "התחל תרגול מהיר חדש" : "התחל סימולציה חדשה"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onBackToTopics}
              className="py-3 text-lg rounded-xl border-2 border-slate-600 text-slate-100 hover:bg-slate-700/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {isQuestionSet ? "חזרה לקבוצות השאלות" : isQuickPractice ? "חזרה לאפשרויות התרגול" : "חזרה לנושאים"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
