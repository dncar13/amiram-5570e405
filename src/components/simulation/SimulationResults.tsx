
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
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  // תיקון הספירה - נוודא שהמספרים נכונים
  const totalQuestions = questionsData.length;
  const actualAnsweredCount = Math.min(answeredQuestionsCount, totalQuestions);
  const actualCorrectCount = Math.min(correctQuestionsCount, actualAnsweredCount);
  const wrongAnswersCount = actualAnsweredCount - actualCorrectCount;
  const skippedCount = totalQuestions - actualAnsweredCount;
  const flaggedCount = questionFlags.filter(flag => flag).length;

  // Chart data for pie chart
  const pieChartData = [
    { name: 'Correct', value: actualCorrectCount, color: '#10B981' },
    { name: 'Wrong', value: wrongAnswersCount, color: '#EF4444' },
    { name: 'Skipped', value: skippedCount, color: '#6B7280' }
  ];

  // Chart data for performance breakdown
  const performanceData = [
    { category: 'Accuracy', value: score, target: 80 },
    { category: 'Completion', value: Math.round((actualAnsweredCount / totalQuestions) * 100), target: 90 },
    { category: 'Focus', value: Math.max(0, 100 - (flaggedCount * 10)), target: 85 }
  ];

  // Achievements system
  const achievements: Achievement[] = [
    {
      id: 'perfect_score',
      title: 'Perfect Score!',
      description: 'Answered all questions correctly',
      icon: Trophy,
      earned: score === 100,
      color: 'text-yellow-500'
    },
    {
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Scored 80% or higher',
      icon: Star,
      earned: score >= 80,
      color: 'text-blue-500'
    },
    {
      id: 'completionist',
      title: 'Completionist',
      description: 'Answered all questions',
      icon: Target,
      earned: actualAnsweredCount === totalQuestions,
      color: 'text-green-500'
    },
    {
      id: 'focused_learner',
      title: 'Focused Learner',
      description: 'Completed without flagging questions',
      icon: Zap,
      earned: flaggedCount === 0,
      color: 'text-purple-500'
    },
    {
      id: 'improving',
      title: 'Getting Better',
      description: 'Scored better than 60%',
      icon: TrendingUp,
      earned: score >= 60,
      color: 'text-orange-500'
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  // Performance level
  const getPerformanceLevel = () => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { level: 'Great', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 60) return { level: 'Fair', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performanceLevel = getPerformanceLevel();

  // Recommendations based on performance
  const getRecommendations = () => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push("Focus on reviewing the explanations for incorrect answers");
      recommendations.push("Consider practicing easier questions first");
    } else if (score < 80) {
      recommendations.push("Great progress! Try to identify patterns in your mistakes");
      recommendations.push("Practice more questions of similar difficulty");
    } else {
      recommendations.push("Excellent work! You're ready for more challenging material");
      recommendations.push("Consider attempting harder difficulty levels");
    }

    if (flaggedCount > 0) {
      recommendations.push(`Review the ${flaggedCount} flagged questions you marked`);
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  // תיקון הפונקציה לחזרה
  const handleBackToTopics = () => {
    if (isQuickPractice) {
      // אם זה תרגול מהיר, חזור לעמוד האפשרויות
      navigate(`/practice-options/${type}/medium`);
    } else if (isQuestionSet) {
      // אם זה סט שאלות, חזור לרשימת הסטים
      navigate("/questions-sets");
    } else {
      // אחרת, חזור לעמוד הסימולציות
      onBackToTopics();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${performanceLevel.bg} border border-opacity-20`}>
                <Award className={`h-5 w-5 ${performanceLevel.color}`} />
                <span className={`font-semibold ${performanceLevel.color}`}>
                  {performanceLevel.level}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">
                {isQuestionSet ? "Question Set Completed!" : isQuickPractice ? "Quick Practice Completed!" : "Simulation Completed!"}
              </h2>
              <p className="text-lg text-gray-300">
                You answered {actualAnsweredCount} out of {totalQuestions} questions
              </p>
            </div>

            {/* Main Score Display */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={score}
                    text={`${score}%`}
                    styles={buildStyles({
                      textColor: score >= 60 ? "#10B981" : "#EF4444",
                      trailColor: "#374151",
                      pathColor: score >= 60 ? "#10B981" : "#EF4444",
                      rotation: 0,
                      strokeLinecap: "round",
                      textSize: "20px",
                    })}
                  />
                </div>
                {score === 100 && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{actualCorrectCount}</div>
                <div className="text-sm text-green-300">Correct</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">{wrongAnswersCount}</div>
                <div className="text-sm text-red-300">Wrong</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <Flag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{flaggedCount}</div>
                <div className="text-sm text-blue-300">Flagged</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{skippedCount}</div>
                <div className="text-sm text-purple-300">Skipped</div>
              </div>
            </div>

            {/* Achievements Section */}
            {earnedAchievements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Achievements Unlocked!
                </h3>
                <div className="flex flex-wrap gap-3">
                  {earnedAchievements.map((achievement) => (
                    <Badge 
                      key={achievement.id}
                      variant="secondary" 
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 text-yellow-300 animate-scale-in backdrop-blur-sm"
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
                className="w-full bg-slate-700/50 border-slate-600 text-gray-200 hover:bg-slate-600/50"
              >
                {showDetailedStats ? 'Hide' : 'Show'} Detailed Analytics
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Detailed Analytics */}
            {showDetailedStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
                {/* Results Breakdown Pie Chart */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Results Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        correct: { label: "Correct", color: "#10B981" },
                        wrong: { label: "Wrong", color: "#EF4444" },
                        skipped: { label: "Skipped", color: "#6B7280" }
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
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Your Score", color: "#3B82F6" },
                        target: { label: "Target", color: "#10B981" }
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
            <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-200">
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {isQuickPractice ? "Start New Quick Practice" : "Start New Simulation"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleBackToTopics}
                className="py-3 text-lg rounded-xl border-2 border-slate-600 bg-slate-700/50 text-gray-200 hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {isQuestionSet ? "Back to Question Sets" : isQuickPractice ? "Back to Practice Options" : "Back to Topics"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimulationResults;
