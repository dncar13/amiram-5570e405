
import { BookOpen, FileText, Play, List, ArrowLeft, Trophy, Clock, CheckCircle, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Category } from "@/data/types/topicTypes";
import { useNavigate } from "react-router-dom";
import { getSimulationProgress } from "@/services/questions/progress";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTopicById } from "@/data/utils/topicUtils";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { reloadQuestionsFromSource } from "@/services/questions/storage";

interface StudyModesProps {
  categories: Category[];
  isPremium: boolean;
}

export default function StudyModes({ categories, isPremium }: StudyModesProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [simulationProgress, setSimulationProgress] = useState<{
    currentQuestionIndex: number;
    totalQuestions: number;
    topicId: number;
    timestamp: string;
  } | null>(null);
  const [lastSimulationTopic, setLastSimulationTopic] = useState<string | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Force reload questions from source to ensure all manually added questions are included
    const refreshedQuestions = reloadQuestionsFromSource();
    console.log(`Loaded ${refreshedQuestions.length} fresh questions on StudyModes component`);
    
    const progress = getSimulationProgress();
    if (progress) {
      setSimulationProgress(progress);
      
      // Get topic name based on the topic ID from the simulation progress
      if (progress.topicId) {
        const topic = getTopicById(progress.topicId);
        if (topic) {
          setLastSimulationTopic(topic.title);
        } else {
          // Set a default name if topic not found
          setLastSimulationTopic("סימולציה קודמת");
        }
      }
    }
  }, []);

  const handleStartFullSimulation = () => {
    setIsLoading(true);
    
    try {
      // Reset any simulation progress storage flag to ensure we start fresh
      sessionStorage.setItem('reset_simulation_progress', 'true');
      
      // Force reload questions from source to ensure all questions are included
      reloadQuestionsFromSource();
        // Using topic ID 1 which contains the first set of questions
      navigate("/questions-set/1/intro");
    } catch (error) {
      console.error("Error starting simulation:", error);
      // toast({
      //   title: "שגיאה בהפעלת הסימולציה",
      //   description: "אירעה שגיאה בעת ניסיון להתחיל סימולציה חדשה",
      //   variant: "destructive"
      // });
      setIsLoading(false);
    }
  };

  const handleContinueSimulation = () => {
    setIsLoading(true);
    
    try {
      if (currentUser) {
        // Force reload questions from source to ensure all questions are included
        const questions = reloadQuestionsFromSource();
        console.log(`Continue simulation with ${questions.length} questions loaded`);
        
        // Explicitly set a flag in session storage that we want to continue
        sessionStorage.setItem('continue_simulation', 'true');
        
        // If we have a specific topic ID, use it for navigation
        if (simulationProgress && simulationProgress.topicId) {
          // Check if there are questions in this topic
          const topicQuestions = questions.filter(q => q.topicId === simulationProgress.topicId);
          
          if (topicQuestions.length > 0) {
            console.log(`Found ${topicQuestions.length} questions for topic ${simulationProgress.topicId}, continuing simulation`);
            navigate(`/simulation/${simulationProgress.topicId}?continue=true`);          } else {
            console.error(`No questions found for topic ${simulationProgress.topicId}`);
            // toast({
            //   title: "אין שאלות בנושא זה",
            //   description: "לא ניתן להמשיך את הסימולציה כיוון שאין שאלות בנושא זה",
            //   variant: "destructive"
            // });
            setIsLoading(false);
          }
        } else {
          // Fallback to general simulation
          console.log("No specific topic ID found, continuing with general simulation");
          navigate('/simulation/1?continue=true');
        }
      } else {
        // Open login dialog if user is not authenticated
        setLoginDialogOpen(true);
        setIsLoading(false);
      }    } catch (error) {
      console.error("Error continuing simulation:", error);
      // toast({
      //   title: "שגיאה בהמשך הסימולציה",
      //   description: "אירעה שגיאה בעת ניסיון להמשיך את הסימולציה",
      //   variant: "destructive"
      // });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            בחר את דרך הלימוד המושלמת עבורך
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            מסלולי למידה מותאמים אישית
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            בין אם אתה מעדיף ללמוד לפי נושאים, לעבור על כל השאלות או להתחיל סימולציה מלאה - 
            יש לנו את המסלול המושלם בשבילך
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* כרטיס ראשון - לפי נושא */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent" />
            <div className="relative p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-emerald-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <BookOpen className="h-12 w-12 text-emerald-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
                למידה לפי נושאים
              </h3>
              
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                בחר מתוך 6 נושאים מקצועיים והתמקד בתרגול ממוקד לקראת הבחינה
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full ml-2" />
                  <span>למידה ממוקדת לפי נושא</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full ml-2" />
                  <span>מעקב אחר התקדמות אישית</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full ml-2" />
                  <span>הסברים מפורטים לכל שאלה</span>
                </div>
              </div>
                <Button 
                variant="default"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-base font-semibold group-hover:scale-105 transition-all duration-200"
                onClick={() => navigate("/simulations-entry/list")}
              >
                התחל תרגול
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </Card>
          
          {/* כרטיס שני - כל השאלות */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent" />
            <div className="relative p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-amber-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <List className="h-12 w-12 text-amber-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
                מאגר שאלות מלא
              </h3>
              
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                2000 שאלות מחולקות ל-40 קבוצות של 50 שאלות כל אחת
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-amber-500 rounded-full ml-2" />
                  <span>גישה לכל השאלות במאגר</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-amber-500 rounded-full ml-2" />
                  <span>תרגול לפי סדר רציף</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-amber-500 rounded-full ml-2" />
                  <span>קבוצות מאורגנות לנוחיותך</span>
                </div>
              </div>
              
              <Button 
                variant="default"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 text-base font-semibold group-hover:scale-105 transition-all duration-200"
                onClick={() => navigate("/questions-sets")}
              >
                פתח מאגר שאלות
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </Card>
          
          {/* כרטיס שלישי - סימולציה דינמית */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0">
            <div className={cn(
              "absolute inset-0",
              simulationProgress ? "bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent" : "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent"
            )} />
            <div className="relative p-8">
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "p-4 rounded-2xl group-hover:scale-110 transition-transform",
                  simulationProgress ? "bg-purple-100" : "bg-blue-100"
                )}>
                  {simulationProgress ? (
                    <Play className="h-12 w-12 text-purple-600" />
                  ) : (
                    <GraduationCap className="h-12 w-12 text-blue-600" />
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">
                {simulationProgress ? 'המשך סימולציה' : 'סימולציה מלאה'}
              </h3>
              
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                {simulationProgress 
                  ? `המשך מהמקום שהפסקת - ${lastSimulationTopic || 'סימולציה'}`
                  : 'התרגל על 50 שאלות אקראיות מתוך מאגר השאלות'
                }
              </p>
              
              {simulationProgress ? (
                <div className="space-y-3 mb-8">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-purple-800">התקדמות נוכחית</span>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.round((simulationProgress.currentQuestionIndex / simulationProgress.totalQuestions) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(simulationProgress.currentQuestionIndex / simulationProgress.totalQuestions) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-purple-600">
                      <span>שאלה {simulationProgress.currentQuestionIndex + 1} מתוך {simulationProgress.totalQuestions}</span>
                      <span>{lastSimulationTopic || 'סימולציה כללית'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-2 w-2 bg-blue-500 rounded-full ml-2" />
                    <span>50 שאלות אקראיות</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-2 w-2 bg-blue-500 rounded-full ml-2" />
                    <span>בדיקת ידע כללי</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="h-2 w-2 bg-blue-500 rounded-full ml-2" />
                    <span>תוצאות מיידיות</span>
                  </div>
                </div>
              )}
              
              <Button 
                variant="default"
                className={cn(
                  "w-full py-4 text-base font-semibold group-hover:scale-105 transition-all duration-200",
                  simulationProgress 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                )}
                disabled={isLoading}
                onClick={simulationProgress ? handleContinueSimulation : handleStartFullSimulation}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {simulationProgress ? 'טוען סימולציה...' : 'מכין סימולציה...'}
                  </span>
                ) : (
                  <>
                    {simulationProgress ? 'המשך סימולציה' : 'התחל סימולציה'}
                    {simulationProgress ? <Play className="h-4 w-4 mr-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
                  </>
                )}
              </Button>
              
              {!currentUser && (
                <p className="text-xs text-center mt-4 text-gray-500">
                  {simulationProgress ? 'התחבר כדי לשמור את ההתקדמות' : 'התחבר כדי לשמור את התוצאות'}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>נדרשת התחברות</DialogTitle>
            <DialogDescription>
              כדי לשמור את ההתקדמות שלך בסימולציה יש להתחבר למערכת
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={() => navigate("/login")}>
              התחבר
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
