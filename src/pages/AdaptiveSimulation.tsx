
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
import { UserPreferencesService } from '@/services/adaptiveQuestions/userPreferencesService';
import { AnalyticsService } from '@/services/adaptiveQuestions/analyticsService';
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

// Question type options
const QUESTION_GROUPS = [
  { 
    id: 'sentence-completion', 
    label: 'השלמת משפט', 
    description: 'מלא את החלק החסר במשפט',
    icon: Edit
  },
  { 
    id: 'restatement', 
    label: 'ניסוח מחדש', 
    description: 'בחר את הביטוי הנכון לאותה מחשבה',
    icon: Repeat
  },
  { 
    id: 'reading-comprehension', 
    label: 'הבנת הנקרא', 
    description: 'ענה על שאלות בעקבות קריאת קטע',
    icon: BookOpen
  },
  { 
    id: 'mixed', 
    label: 'מעורב', 
    description: 'שילוב של כל סוגי השאלות',
    icon: Shuffle
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
  
  // Core settings that determine practice vs exam mode
  const [showExplanations, setShowExplanations] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  
  // Question type selection state
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('mixed');
  
  // UI state
  const [isSimulationActive, setIsSimulationActive] = useState(false);
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
        setShowExplanations(preferences.showExplanations);
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

  // Determine session type based on settings
  const getSessionType = (): SessionType => {
    if (showExplanations && !showTimer) return 'practice';
    if (!showExplanations && showTimer) return 'full';
    return 'quick'; // Default fallback
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
    const modeLabel = showExplanations ? 'תרגול' : 'מבחן';
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
        showExplanations,
        preferredQuestionGroup: selectedQuestionType
      }).catch(console.error);
    }
  };

  const handleSimulationComplete = (result: SimulationSessionResult) => {
    setIsSimulationActive(false);
    
    toast({
      title: "סימולציה הושלמה בהצלחה!",
      description: `ציון: ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}%)`,
      duration: 5000,
    });

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

  const getDifficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isSimulationActive) {
    return (
      <AdaptiveSimulation
        initialDifficulty={difficulty}
        sessionType={getSessionType()}
        questionLimit={questionLimit}
        questionGroup={toQuestionGroup(selectedQuestionType)}
        onComplete={handleSimulationComplete}
        onError={handleSimulationError}
      />
    );
  }

  return (
    <RTLWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="h-10 w-10 text-blue-600" />
                <h1 className="text-4xl font-bold text-slate-800">סימולציה מותאמת אישית</h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                מערכת חכמה הבוחרת שאלות בהתאם לרמתך ולהיסטוריית הלמידה שלך
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Quick Start Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      הגדרות סימולציה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {QUESTION_GROUPS.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.label}
                              </SelectItem>
                            ))}
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

                      {/* Mode indicator based on settings */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">מצב</Label>
                        <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md">
                          <span className={`text-sm font-medium ${
                            showExplanations && !showTimer ? 'text-green-600' : 
                            !showExplanations && showTimer ? 'text-blue-600' : 
                            'text-gray-600'
                          }`}>
                            {showExplanations && !showTimer ? '📚 תרגול' : 
                             !showExplanations && showTimer ? '⏱️ מבחן' : 
                             '🎯 מעורב'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Practice/Exam Mode Settings */}
                    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="explanations" className="text-sm font-medium">הצג הסברים אחרי כל תשובה</Label>
                        <Switch 
                          id="explanations" 
                          checked={showExplanations} 
                          onCheckedChange={setShowExplanations}
                          className="data-[state=checked]:bg-blue-600"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timer" className="text-sm font-medium">הצג טיימר</Label>
                        <Switch 
                          id="timer" 
                          checked={showTimer} 
                          onCheckedChange={setShowTimer}
                          className="data-[state=checked]:bg-blue-600"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Current Configuration Display */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className={getDifficultyColor(difficulty)}>
                        {difficulty === 'easy' ? 'קל' : difficulty === 'medium' ? 'בינוני' : 'קשה'}
                      </Badge>
                      <Badge variant="outline">
                        {QUESTION_GROUPS.find(g => g.id === selectedQuestionType)?.label || 'מעורב'}
                      </Badge>
                      <Badge variant="outline">
                        {questionLimit} שאלות
                      </Badge>
                      <Badge className={showExplanations ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {showExplanations ? 'מצב תרגול' : 'מצב מבחן'}
                      </Badge>
                    </div>

                    <Button 
                      onClick={startSimulation}
                      size="lg"
                      className="w-full"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      התחל סימולציה
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

                {/* Quick Actions - Simplified */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      פעולות מהירות
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setShowExplanations(true);
                        setShowTimer(false);
                        setSelectedQuestionType('mixed');
                        setQuestionLimit(10);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      תרגול מהיר (10 שאלות)
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setShowExplanations(false);
                        setShowTimer(true);
                        setSelectedQuestionType('mixed');
                        setQuestionLimit(20);
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      מבחן מדומה (20 שאלות)
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={loadUserData}
                      disabled={isLoadingStats}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
                      רענן סטטיסטיקות
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
