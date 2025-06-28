
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, Target, BookOpen, Trophy, Users, Star } from "lucide-react";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SimulationsEntry = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const requireAuthForAction = (action: () => void) => {
    if (!currentUser) {
      toast({
        title: "נדרשת התחברות",
        description: "על מנת להתחיל סימולציה יש להתחבר תחילה",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    action();
  };

  const handleStartPractice = () => {
    requireAuthForAction(() => {
      setIsLoading(true);
      setTimeout(() => {
        navigate('/quiz/practice');
      }, 100);
    });
  };

  const handleStartFullSimulation = () => {
    requireAuthForAction(() => {
      setIsLoading(true);
      setTimeout(() => {
        navigate('/quiz/full');
      }, 100);
    });
  };

  const handleStartReading = () => {
    requireAuthForAction(() => {
      setIsLoading(true);
      setTimeout(() => {
        navigate('/quiz/reading');
      }, 100);
    });
  };

  return (
    <RTLWrapper className="min-h-screen flex flex-col simulations-entry-page">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              ברוכים הבאים לאקדמיית אמיר"ם
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              כאן תוכלו להתכונן למבחן אמיר"ם בצורה המקצועית והיעילה ביותר
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>+10,000 משתמשים</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>דירוג 4.8/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>98% הצלחה</span>
              </div>
            </div>
          </div>

          {/* Authentication Notice for Non-Logged Users */}
          {!authLoading && !currentUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">התחברות נדרשת</h3>
                  <p className="text-blue-700 text-sm">
                    כדי להתחיל סימולציה יש צורך להתחבר תחילה. 
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-800 underline mr-1"
                    >
                      התחבר כאן
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Simulation Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="simulation-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">תרגול</CardTitle>
                <CardDescription>
                  תרגול ממוקד עם הסברים מפורטים לכל שאלה
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>ללא מגבלת זמן</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>הסברים מיידיים</span>
                  </div>
                </div>
                <Button 
                  className="w-full btn-primary" 
                  onClick={handleStartPractice}
                  disabled={isLoading}
                  data-testid="practice-button"
                >
                  {isLoading ? <span className="loading-spinner"></span> : "התחל תרגול"}
                </Button>
              </CardContent>
            </Card>

            <Card className="simulation-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 featured-card">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  סימולציה מלאה
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">מומלץ</span>
                </CardTitle>
                <CardDescription>
                  מבחן מלא בתנאי מבחן אמיתיים
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>120 דקות</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>50 שאלות</span>
                  </div>
                </div>
                <Button 
                  className="w-full btn-primary-enhanced" 
                  onClick={handleStartFullSimulation}
                  disabled={isLoading}
                  data-testid="full-simulation-button"
                >
                  {isLoading ? <span className="loading-spinner"></span> : "התחל מבחן מלא"}
                </Button>
              </CardContent>
            </Card>

            <Card className="simulation-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">הבנת הנקרא</CardTitle>
                <CardDescription>
                  תרגול ממוקד בהבנת הנקרא - החלק הקשה ביותר
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>60 דקות</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>20 שאלות</span>
                  </div>
                </div>
                <Button 
                  className="w-full btn-secondary" 
                  onClick={handleStartReading}
                  disabled={isLoading}
                  data-testid="reading-button"
                >
                  {isLoading ? <span className="loading-spinner"></span> : "התחל הבנת הנקרא"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">למה לבחור באקדמיית אמיר"ם?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">שאלות מעודכנות</h3>
                  <p className="text-muted-foreground text-sm">
                    בנק שאלות מעודכן לפי המבחנים האחרונים של אמיר"ם
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">הסברים מפורטים</h3>
                  <p className="text-muted-foreground text-sm">
                    הסבר מפורט לכל שאלה כדי להבין את הטעויות ולשפר את הביצועים
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">מעקב התקדמות</h3>
                  <p className="text-muted-foreground text-sm">
                    מעקב אחר הביצועים שלכם וזיהוי נקודות לשיפור
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">גמישות בלמידה</h3>
                  <p className="text-muted-foreground text-sm">
                    אפשרות לתרגל בקצב שלכם או במבחן מלא בתנאי מבחן אמיתיים
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">מה אומרים עלינו?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card p-4 rounded-lg">
                <p className="text-muted-foreground italic mb-2">
                  "התכנים המעולים והסימולציות העזרו לי להעלות את הציון ב-20 נקודות!"
                </p>
                <p className="font-semibold">- רותם כ.</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <p className="text-muted-foreground italic mb-2">
                  "ההסברים המפורטים עזרו לי להבין איפה אני טועה ולשפר את עצמי"
                </p>
                <p className="font-semibold">- יוסי מ.</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <p className="text-muted-foreground italic mb-2">
                  "הכי טוב שיש! עברתי את אמיר"ם בזכות ההכנה כאן"
                </p>
                <p className="font-semibold">- מיכל ל.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </RTLWrapper>
  );
};

export default SimulationsEntry;
