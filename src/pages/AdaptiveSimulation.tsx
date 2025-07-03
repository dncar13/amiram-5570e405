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
  
  // Simulation configuration
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    (searchParams.get('difficulty') as DifficultyLevel) || 'medium'
  );
  const [sessionType, setSessionType] = useState<SessionType>(
    (searchParams.get('type') as SessionType) || 'quick'
  );
  const [questionLimit, setQuestionLimit] = useState<number>(
    parseInt(searchParams.get('limit') || '10') || 10
  );
  const [deliveryStrategy, setDeliveryStrategy] = useState<DeliveryStrategy>('unseen_priority');
  
  // Preferences state
  const [showExplanations, setShowExplanations] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [enableSound, setEnableSound] = useState(false);
  
  // Question type selection state - exposed in main form
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('mixed');
  
  // UI state
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  // Services - Memoized to prevent re-creation on every render
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
    toast({
      title: "מכין סימולציה",
      description: `טוען שאלות מסוג ${selectedGroupLabel}...`,
      duration: 2000,
    });
    
    // Start the simulation immediately with the selected question type
    setIsSimulationActive(true);
    
    // Save preferences
    if (currentUser?.id) {
      userPreferencesService.updatePreferences(currentUser.id, {
        preferredDifficulty: difficulty,
        questionsPerSession: questionLimit,
        deliveryStrategy,
        showExplanations,
        enableSound,
        preferredQuestionGroup: selectedQuestionType
      }).catch(console.error);
    }
  };


  const handleSimulationComplete = (result: SimulationSessionResult) => {
    setIsSimulationActive(false);
    
    // Show completion modal or navigate to results
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

  const getSessionTypeDisplay = (type: SessionType) => {
    const types = {
      'quick': 'תרגול מהיר',
      'practice': 'תרגול רגיל',
      'full': 'מבחן מלא',
      'review_mistakes': 'חזרה על טעויות',
      'custom': 'מותאם אישית'
    };
    return types[type] || type;
  };

  if (isSimulationActive) {
    return (
      <RTLWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <AdaptiveSimulation
              initialDifficulty={difficulty}
              sessionType={sessionType}
              questionLimit={questionLimit}
              questionGroup={toQuestionGroup(selectedQuestionType)}
              onComplete={handleSimulationComplete}
              onError={handleSimulationError}
            />
          </main>
        </div>
      </RTLWrapper>
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
                      התחלה מהירה
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

                      {/* Session Type */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">סוג תרגול</Label>
                        <Select value={sessionType} onValueChange={(value: SessionType) => setSessionType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick">תרגול מהיר</SelectItem>
                            <SelectItem value="practice">תרגול רגיל</SelectItem>
                            <SelectItem value="review_mistakes">חזרה על טעויות</SelectItem>
                            {isPremium && (
                              <>
                                <SelectItem value="full">מבחן מלא</SelectItem>
                                <SelectItem value="custom">מותאם אישית</SelectItem>
                              </>
                            )}
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
                    </div>

                    {/* Current Configuration Display */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className={getDifficultyColor(difficulty)}>
                        {difficulty === 'easy' ? 'קל' : difficulty === 'medium' ? 'בינוני' : 'קשה'}
                      </Badge>
                      <Badge variant="outline">
                        {getSessionTypeDisplay(sessionType)}
                      </Badge>
                      <Badge variant="outline">
                        {QUESTION_GROUPS.find(g => g.id === selectedQuestionType)?.label || 'מעורב'}
                      </Badge>
                      <Badge variant="outline">
                        {questionLimit} שאלות
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

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-slate-600" />
                      הגדרות מתקדמות
                      {isPremium && <Badge variant="secondary">Premium</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="strategy" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="strategy">אסטרטגיית בחירה</TabsTrigger>
                        <TabsTrigger value="preferences">העדפות</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="strategy" className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-3 block">אסטרטגיית בחירת שאלות</Label>
                          <Select 
                            value={deliveryStrategy} 
                            onValueChange={(value: DeliveryStrategy) => setDeliveryStrategy(value)}
                            disabled={!isPremium}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unseen_priority">עדיפות לשאלות חדשות</SelectItem>
                              <SelectItem value="random_weighted">בחירה מותאמת</SelectItem>
                              <SelectItem value="spaced_repetition">חזרה מרווחת</SelectItem>
                              <SelectItem value="mistake_review">חזרה על טעויות</SelectItem>
                            </SelectContent>
                          </Select>
                          {!isPremium && (
                            <p className="text-sm text-slate-500 mt-2">
                              אסטרטגיות מתקדמות זמינות למנויי Premium
                            </p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="preferences" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="explanations">הצג הסברים אחרי כל תשובה</Label>
                            <Switch 
                              id="explanations" 
                              checked={showExplanations} 
                              onCheckedChange={setShowExplanations}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="timer">הצג טיימר</Label>
                            <Switch 
                              id="timer" 
                              checked={showTimer} 
                              onCheckedChange={setShowTimer}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sound">אפקטי קול</Label>
                            <Switch 
                              id="sound" 
                              checked={enableSound} 
                              onCheckedChange={setEnableSound}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                          {Object.entries(userStats.byDifficulty || {}).map(([diff, data]: [string, any]) => (
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

                {/* Quick Actions */}
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
                        setSessionType('review_mistakes');
                        setQuestionLimit(15);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      חזרה על טעויות
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setDifficulty('hard');
                        setSessionType('practice');
                        setQuestionLimit(20);
                      }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      אתגר קשה
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/simulations')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      היסטוריית סימולציות
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Upsell */}
                {!isPremium && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-800">שדרג ל-Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-blue-700 space-y-1 mb-4">
                        <li>• אסטרטגיות בחירה מתקדמות</li>
                        <li>• אנליטיקות מפורטות</li>
                        <li>• מבחנים מלאים ללא הגבלה</li>
                        <li>• המלצות מותאמות אישית</li>
                      </ul>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/premium')}
                      >
                        שדרג עכשיו
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

    </RTLWrapper>
  );
};

export default AdaptiveSimulationPage;