
/**
 * Adaptive Simulation Page
 * 
 * Main page for the adaptive question delivery system.
 * Provides personalized question selection and intelligent progress tracking.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RTLWrapper } from '@/components/ui/rtl-wrapper';
import Header from '@/components/Header';
import { AdaptiveSimulation } from '@/components/simulation/AdaptiveSimulation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  DifficultyLevel, 
  SessionType, 
  SimulationSessionResult,
  DeliveryStrategy 
} from '@/services/adaptiveQuestions/types';
import { Question } from '@/data/types/questionTypes';
import { UserPreferencesService } from '@/services/adaptiveQuestions/userPreferencesService';
import { AnalyticsService } from '@/services/adaptiveQuestions/analyticsService';
import { QuestionDeliveryService } from '@/services/adaptiveQuestions/questionDeliveryService';
import SimulationResults from '@/components/simulation/SimulationResults';
import { 
  Brain, 
  Settings, 
  TrendingUp, 
  Target, 
  Clock, 
  BarChart3,
  User,
  Zap,
  BookOpen,
  Trophy,
  ArrowRight,
  RefreshCw,
  Edit,
  Repeat,
  Shuffle,
  FileText
} from 'lucide-react';

// Question type options with counts (actual database values)
const QUESTION_GROUPS = [
  { 
    id: 'sentence-completion', 
    label: 'השלמת משפט', 
    description: 'מלא את החלק החסר במשפט',
    icon: Edit,
    count: 300
  },
  { 
    id: 'restatement', 
    label: 'ניסוח מחדש', 
    description: 'בחר את הביטוי הנכון לאותה מחשבה',
    icon: Repeat,
    count: 300
  },
  { 
    id: 'reading-comprehension', 
    label: 'הבנת הנקרא', 
    description: 'ענה על שאלות בעקבות קריאת קטע',
    icon: BookOpen,
    count: 5
  },
  { 
    id: 'mixed', 
    label: 'מעורב', 
    description: 'שילוב של כל סוגי השאלות',
    icon: Shuffle,
    count: 635
  }
];

const AdaptiveSimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, isPremium } = useAuth();
  
  // Simulation configuration - simplified without sessionType
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    (searchParams.get('difficulty') as DifficultyLevel) || 'medium'
  );
  const [questionLimit, setQuestionLimit] = useState<number>(
    parseInt(searchParams.get('limit') || '10') || 10
  );
  const [deliveryStrategy, setDeliveryStrategy] = useState<DeliveryStrategy>('unseen_priority');
  
  // Simplified mode selection - either practice or exam
  const [simulationMode, setSimulationMode] = useState<'practice' | 'exam'>('practice');
  
  // Question type selection state
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('mixed');
  
  // UI state
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // Extended simulation results type
  interface ExtendedSimulationResults {
    score: number;
    totalQuestions: number;
    timeSpent: number;
    correctAnswers: number;
    incorrectAnswers: number;
    questions: Question[];
    questionsData: Question[];
    userAnswers: Record<number, number>;
    difficulty: DifficultyLevel;
    type: string;
    completionTime: string;
    answeredQuestionsCount: number;
    correctQuestionsCount: number;
  }

  const [simulationResults, setSimulationResults] = useState<ExtendedSimulationResults | null>(null);
  const [questionTypeCounts, setQuestionTypeCounts] = useState<Record<string, number> | null>(null);
  const [userStats, setUserStats] = useState<{
    overall: {
      accuracy: number;
      totalQuestions: number;
      currentStreak: number;
      averageTime: number;
    };
    byDifficulty?: {
      [key: string]: {
        accuracy: number;
      };
    };
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Services
  const userPreferencesService = useMemo(() => new UserPreferencesService(), []);
  const analyticsService = useMemo(() => new AnalyticsService(), []);
  const questionDeliveryService = useMemo(() => new QuestionDeliveryService(), []);

  const loadUserData = useCallback(async () => {
    if (!currentUser?.id) return;

    setIsLoadingStats(true);
    try {
      // Load user preferences
      const preferences = await userPreferencesService.getUserPreferences(currentUser.id);
      if (preferences) {
        setDifficulty(preferences.preferredDifficulty);
        setQuestionLimit(preferences.questionsPerSession);
        setDeliveryStrategy(preferences.deliveryStrategy);
        // Map old preferences to new simplified mode
        setSimulationMode(preferences.showExplanations ? 'practice' : 'exam');
        if (preferences.preferredQuestionGroup) {
          setSelectedQuestionType(preferences.preferredQuestionGroup);
        }
      }

      // Load user analytics
      const analytics = await analyticsService.getUserAnalytics(currentUser.id);
      setUserStats(analytics);

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [currentUser?.id, userPreferencesService, analyticsService]);

  // Load user preferences and stats
  useEffect(() => {
    if (currentUser?.id) {
      loadUserData();
    }
  }, [currentUser?.id, loadUserData]);

  // Load question type counts on mount
  useEffect(() => {
    const loadQuestionCounts = async () => {
      try {
        const counts = await questionDeliveryService.getQuestionTypeCounts();
        setQuestionTypeCounts(counts);
      } catch (error) {
        console.error('Failed to load question type counts:', error);
      }
    };
    loadQuestionCounts();
  }, [questionDeliveryService]);

  // Show warning for reading-comprehension type
  useEffect(() => {
    if (selectedQuestionType === 'reading-comprehension') {
      toast({
        title: "הערה חשובה",
        description: "כרגע יש מספר מוגבל של שאלות הבנת הנקרא (5 שאלות). מומלץ לבחור במצב מעורב לחוויה טובה יותר",
        variant: "destructive",
        duration: 6000
      });
    }
  }, [selectedQuestionType]);

  // Determine session type based on simulation mode
  const getSessionType = (): SessionType => {
    return simulationMode === 'practice' ? 'practice' : 'full';
  };

  // Helper function to convert question type to question group array
  const toQuestionGroup = (id: string): string[] =>
    id === 'mixed'
      ? ['sentence-completion', 'restatement', 'reading-comprehension']
      : [id];

  const startSimulation = () => {
    if (!currentUser) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר כדי להתחיל סימולציה",
        variant: "destructive"
      });
      return;
    }

    // Show loading toast
    const selectedGroupLabel = QUESTION_GROUPS.find(g => g.id === selectedQuestionType)?.label || 'מעורב';
    const modeLabel = simulationMode === 'practice' ? 'תרגול' : 'מבחן';
    toast({
      title: "מכין סימולציה",
      description: `טוען שאלות מסוג ${selectedGroupLabel} במצב ${modeLabel}...`,
      duration: 2000,
    });
    
    // Start the simulation
    setIsSimulationActive(true);
    
    // Save preferences
    if (currentUser?.id) {
      userPreferencesService.updatePreferences(currentUser.id, {
        preferredDifficulty: difficulty,
        questionsPerSession: questionLimit,
        deliveryStrategy,
        showExplanations: simulationMode === 'practice',
        preferredQuestionGroup: selectedQuestionType
      }).catch(console.error);
    }
  };

  const handleSimulationComplete = (result: SimulationSessionResult & { 
    questions?: Question[], 
    userAnswers?: Record<number, number>,
    timeSpent?: number 
  }) => {
    setIsSimulationActive(false);
    
    // Store comprehensive results data
    setSimulationResults({
      score: result.score,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent || 0,
      correctAnswers: result.score,
      incorrectAnswers: result.totalQuestions - result.score,
      questions: result.questions || [],
      questionsData: result.questions || [],
      userAnswers: result.userAnswers || {},
      difficulty: difficulty,
      type: selectedQuestionType,
      completionTime: new Date().toLocaleTimeString('he-IL'),
      answeredQuestionsCount: result.totalQuestions,
      correctQuestionsCount: result.score
    });
    
    // Show results page instead of toast
    setShowResults(true);

    // Refresh user stats
    loadUserData();
  };

  const handleSimulationError = (error: Error) => {
    setIsSimulationActive(false);
    toast({
      title: "שגיאה בסימולציה",
      description: error.message || "אירעה שגיאה לא צפויה. אנא נסה שוב.",
      variant: "destructive",
      duration: 5000,
    });
  };

  // Results page navigation functions
  const handleRestart = () => {
    setShowResults(false);
    setSimulationResults(null);
    // Keep current settings and restart
  };

  const handleReview = () => {
    // TODO: Implement review mode
    setShowResults(false);
    setIsSimulationActive(true);
  };

  const handleBackToHome = () => {
    setShowResults(false);
    setSimulationResults(null);
    return '/'; // Navigate to home
  };

  const getDifficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showResults && simulationResults) {
    return (
      <SimulationResults
        {...simulationResults}
        onRestart={handleRestart}
        onReview={handleReview}
        onBackToTopics={handleBackToHome}
      />
    );
  }

  if (isSimulationActive) {
    return (
      <AdaptiveSimulation
        initialDifficulty={difficulty}
        sessionType={getSessionType()}
        questionLimit={questionLimit}
        questionGroup={toQuestionGroup(selectedQuestionType)}
        onComplete={handleSimulationComplete}
        onError={handleSimulationError}
        enableTimer={simulationMode === 'exam'}
        timePerQuestion={90} // 90 seconds per question
      />
    );
  }

  return (
    <RTLWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">סימולציה מותאמת אישית</h1>
              </div>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                מערכת חכמה הבוחרת שאלות בהתאם לרמתך ולהיסטוריית הלמידה שלך
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Main Configuration Panel */}
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                
                {/* Quick Start Card */}
                <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Zap className="h-5 w-5 text-blue-600" />
                      הגדרות סימולציה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      
                      {/* Difficulty Selection */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">רמת קושי</Label>
                        <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">קל</SelectItem>
                            <SelectItem value="medium">בינוני</SelectItem>
                            <SelectItem value="hard">קשה</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Question Type Selection */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">סוג שאלות</Label>
                        <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
                          <SelectTrigger data-testid="question-type-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent data-testid="question-type-options">
                            {QUESTION_GROUPS.map((group) => {
                              const count = questionTypeCounts?.[group.id] || group.count;
                              return (
                                <SelectItem 
                                  key={group.id} 
                                  value={group.id}
                                  disabled={count < 3}
                                  data-testid={`question-type-${group.id}`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span>{group.label}</span>
                                    <span className={`text-xs ${count < 5 ? 'text-red-500' : count < 10 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                      ({count} שאלות)
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Question Limit */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">מספר שאלות</Label>
                        <Input 
                          type="number" 
                          value={questionLimit.toString()} 
                          onChange={(e) => setQuestionLimit(parseInt(e.target.value) || 10)}
                          min="5"
                          max={isPremium ? "50" : "20"}
                        />
                      </div>
                    </div>

                    {/* Simulation Mode Selection - Horizontal Layout */}
                    <div className="mb-6">
                      <Label className="text-lg font-bold mb-4 block text-slate-700">בחר סוג סימולציה</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Practice Mode */}
                        <div 
                          className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            simulationMode === 'practice' 
                              ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-800 shadow-lg shadow-green-500/20' 
                              : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-green-300 hover:shadow-md'
                          }`}
                          onClick={() => setSimulationMode('practice')}
                          data-testid="practice-mode-card"
                        >
                          <div className="text-center space-y-3">
                            <div className={`text-4xl mb-3 transition-transform duration-300 ${
                              simulationMode === 'practice' ? 'scale-110' : 'group-hover:scale-105'
                            }`}>📚</div>
                            <div className="font-bold text-xl">מצב תרגול</div>
                            <div className="space-y-2">
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'practice' ? 'text-green-700' : 'text-slate-600'
                              }`}>
                                <span className="text-green-500">✓</span>
                                תשובות מיידיות
                              </div>
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'practice' ? 'text-green-700' : 'text-slate-600'
                              }`}>
                                <span className="text-green-500">✓</span>
                                הסברים מפורטים
                              </div>
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'practice' ? 'text-green-700' : 'text-slate-600'
                              }`}>
                                <span className="text-slate-400">○</span>
                                בלי לחץ זמן
                              </div>
                            </div>
                          </div>
                          {simulationMode === 'practice' && (
                            <div className="absolute top-2 right-2 text-green-500">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Exam Mode */}
                        <div 
                          className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            simulationMode === 'exam' 
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 shadow-lg shadow-blue-500/20' 
                              : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => setSimulationMode('exam')}
                          data-testid="exam-mode-card"
                        >
                          <div className="text-center space-y-3">
                            <div className={`text-4xl mb-3 transition-transform duration-300 ${
                              simulationMode === 'exam' ? 'scale-110' : 'group-hover:scale-105'
                            }`}>⏱️</div>
                            <div className="font-bold text-xl">מצב מבחן</div>
                            <div className="space-y-2">
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'exam' ? 'text-blue-700' : 'text-slate-600'
                              }`}>
                                <span className="text-blue-500">⏱</span>
                                טיימר פועל
                              </div>
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'exam' ? 'text-blue-700' : 'text-slate-600'
                              }`}>
                                <span className="text-blue-500">🎯</span>
                                תשובות בסוף בלבד
                              </div>
                              <div className={`flex items-center justify-center gap-2 text-sm ${
                                simulationMode === 'exam' ? 'text-blue-700' : 'text-slate-600'
                              }`}>
                                <span className="text-slate-400">○</span>
                                ללא הסברים
                              </div>
                            </div>
                          </div>
                          {simulationMode === 'exam' && (
                            <div className="absolute top-2 right-2 text-blue-500">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Current Configuration Display - Modern and Beautiful */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        ההגדרות שלך
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Badge className={`px-4 py-2 text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                          רמת קושי: {difficulty === 'easy' ? 'קל' : difficulty === 'medium' ? 'בינוני' : 'קשה'}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white border-slate-300">
                          {QUESTION_GROUPS.find(g => g.id === selectedQuestionType)?.label || 'מעורב'}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white border-slate-300">
                          {questionLimit} שאלות
                        </Badge>
                        <Badge className={`px-4 py-2 text-sm font-medium ${
                          simulationMode === 'practice' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {simulationMode === 'practice' ? '📚 מצב תרגול' : '⏱️ מצב מבחן'}
                        </Badge>
                      </div>
                    </div>

                    {/* Start Simulation Button - Gorgeous and Prominent */}
                    <Button 
                      onClick={startSimulation}
                      size="lg"
                      className={`w-full h-16 text-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                        simulationMode === 'practice'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/30'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      <ArrowRight className="h-6 w-6 mr-3" />
                      {simulationMode === 'practice' ? 'התחל תרגול' : 'התחל מבחן'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Stats and Progress */}
              <div className="space-y-6">
                
                {/* User Progress Summary */}
                {userStats && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        הסטטיסטיקות שלך
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {/* Overall Accuracy */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>דיוק כללי</span>
                          <span className="font-medium">{Math.round(userStats.overall.accuracy)}%</span>
                        </div>
                        <Progress value={userStats.overall.accuracy} className="h-2" />
                      </div>

                      {/* Questions Answered */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">שאלות נענו</span>
                        </div>
                        <span className="font-medium">{userStats.overall.totalQuestions}</span>
                      </div>

                      {/* Current Streak */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">רצף נוכחי</span>
                        </div>
                        <span className="font-medium">{userStats.overall.currentStreak}</span>
                      </div>

                      {/* Average Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">זמן ממוצע</span>
                        </div>
                        <span className="font-medium">{Math.round(userStats.overall.averageTime)}s</span>
                      </div>

                      <Separator />

                      {/* Difficulty Breakdown */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">ביצועים לפי רמת קושי</h4>
                        <div className="space-y-2">
                          {Object.entries(userStats.byDifficulty || {}).map(([diff, data]: [string, { accuracy: number }]) => (
                            <div key={diff} className="flex items-center justify-between text-sm">
                              <Badge className={getDifficultyColor(diff as DifficultyLevel)} variant="outline">
                                {diff === 'easy' ? 'קל' : diff === 'medium' ? 'בינוני' : 'קשה'}
                              </Badge>
                              <span>{Math.round(data.accuracy)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions - Beautiful and Modern */}
                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                    <CardTitle className="flex items-center gap-3 text-indigo-700">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Zap className="h-5 w-5 text-indigo-600" />
                      </div>
                      פעולות מהירות
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 sm:h-14 group hover:bg-green-50 hover:border-green-300 transition-all duration-300 text-sm sm:text-base"
                      onClick={() => {
                        setSimulationMode('practice');
                        setSelectedQuestionType('mixed');
                        setQuestionLimit(10);
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-700">תרגול מהיר</div>
                          <div className="text-xs sm:text-sm text-slate-500">10 שאלות מעורבות</div>
                        </div>
                      </div>
                      <span className="text-xl sm:text-2xl">📚</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 sm:h-14 group hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 text-sm sm:text-base"
                      onClick={() => {
                        setSimulationMode('exam');
                        setSelectedQuestionType('mixed');
                        setQuestionLimit(20);
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-700">מבחן מדומה</div>
                          <div className="text-xs sm:text-sm text-slate-500">20 שאלות עם טיימר</div>
                        </div>
                      </div>
                      <span className="text-xl sm:text-2xl">⏱️</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 sm:h-14 group hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 text-sm sm:text-base"
                      onClick={() => {
                        setSimulationMode('practice');
                        setSelectedQuestionType('reading-comprehension');
                        setQuestionLimit(5);
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-700">הבנת הנקרא</div>
                          <div className="text-xs sm:text-sm text-slate-500">התמחות בטקסטים</div>
                        </div>
                      </div>
                      <span className="text-xl sm:text-2xl">📖</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RTLWrapper>
  );
};

export default AdaptiveSimulationPage;
