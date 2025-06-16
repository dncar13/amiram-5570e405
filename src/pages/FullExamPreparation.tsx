
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft, Clock, FileText, PlayCircle, Rocket, Settings, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FULL_EXAM_SETTINGS, FULL_EXAM_RULES } from "@/config/fullExamConfig";
import { hasProgressUnified } from "@/services/simulationStorage";
import { resetConflictingProgress } from "@/services/cloudSync";

const FullExamPreparation = () => {
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<{
    currentQuestionIndex: number;
    totalQuestions: number;
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for existing progress for full exam
    hasProgressUnified(0, false, 'full-exam').then(result => {
      if (result.success && result.data) {
        console.log('Found existing progress for full exam');
        setSimulationProgress({
          currentQuestionIndex: 1,
          totalQuestions: FULL_EXAM_SETTINGS.total
        });
      } else {
        console.log('No saved progress found for full exam');
        setSimulationProgress(null);
      }
    }).catch(err => {
      console.error("Error checking for progress:", err);
    });
  }, []);

  const handleStartFullExam = () => {
    setLoading(true);
    
    // Reset any conflicting progress
    resetConflictingProgress();
    
    // Set flags for full exam mode
    sessionStorage.setItem('full_exam_mode', 'true');
    sessionStorage.setItem('reset_simulation_progress', 'true');
    
    // Navigate to full simulation
    navigate('/simulation/full?reset=1');
  };

  const handleContinueFullExam = () => {
    setLoading(true);
    
    // Set flags for full exam mode
    sessionStorage.setItem('full_exam_mode', 'true');
    sessionStorage.setItem('continue_simulation', 'true');
    
    // Navigate to full simulation
    navigate('/simulation/full?continue=true');
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const hasSavedProgress = simulationProgress !== null && 
    simulationProgress.currentQuestionIndex > 0;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="flex items-center text-electric-slate"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5 ml-1" />
            חזרה
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">סימולציה מלאה - מצב מבחן</h1>
          <p className="text-electric-slate">
            מבחן מדומה מלא בתנאי מבחן אמיתיים
          </p>
          <div className="mt-4 inline-block">
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium">
              🚨 מצב מבחן - ללא הסברים ועם מגבלות זמן
            </span>
          </div>
        </div>

        {/* אזהרת מצב מבחן */}
        <Card className="p-6 mb-8 border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">שים לב - זהו מצב מבחן!</h3>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• ללא אפשרות לחזור לשאלות קודמות</li>
                <li>• ללא הסברים במהלך המבחן</li>
                <li>• זמן מוגבל: {FULL_EXAM_SETTINGS.timeInMinutes} דקות</li>
                <li>• אין אפשרות להשהיה או עצירה</li>
                <li>• התוצאות יוצגו רק בסוף</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {FULL_EXAM_SETTINGS.total} שאלות
            </h3>
            <p className="text-sm text-electric-slate">
              מבחן מלא כמו באמת
            </p>
          </Card>

          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {FULL_EXAM_SETTINGS.timeInMinutes} דקות
            </h3>
            <p className="text-sm text-electric-slate">
              זמן מוגבל ומדויק
            </p>
          </Card>

          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <Settings className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              חוקי מבחן
            </h3>
            <p className="text-sm text-electric-slate">
              תנאים כמו במבחן האמיתי
            </p>
          </Card>
        </div>

        {/* פילוח השאלות */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-lg text-electric-navy mb-4">פילוח השאלות</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{FULL_EXAM_SETTINGS.questionDistribution.sentenceCompletion}</div>
              <div className="text-sm text-blue-800">השלמת משפטים</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{FULL_EXAM_SETTINGS.questionDistribution.restatement}</div>
              <div className="text-sm text-green-800">ניסוח מחדש</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{FULL_EXAM_SETTINGS.questionDistribution.readingComprehension}</div>
              <div className="text-sm text-purple-800">הבנת הנקרא</div>
            </div>
          </div>
        </Card>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-10">
          <h3 className="font-semibold text-lg text-electric-navy mb-3">טיפים למבחן</h3>
          <ul className="list-disc pr-6 space-y-2 text-electric-slate">
            <li>וודא שיש לך זמן פנוי ללא הפרעות ל-{FULL_EXAM_SETTINGS.timeInMinutes} דקות רצופות</li>
            <li>היכן למקום שקט עם חיבור אינטרנט יציב</li>
            <li>התחל רק כשאתה מוכן ומרוכז לחלוטין</li>
            <li>זכור - אי אפשר לעצור באמצע או לחזור לשאלות קודמות</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          <Button
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-medium rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            onClick={handleStartFullExam}
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "טוען..." : (
                <>
                  <Rocket className="h-6 w-6" />
                  התחל מבחן מלא חדש
                </>
              )}
            </span>
          </Button>
          
          {hasSavedProgress && (
            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-6 text-lg font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
              onClick={handleContinueFullExam}
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "טוען..." : (
                  <>
                    <PlayCircle className="h-6 w-6" />
                    המשך מבחן מלא
                  </>
                )}
              </span>
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FullExamPreparation;
