
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft, Clock, FileText, PlayCircle, Rocket, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { SimulationSettings } from "@/components/topics/SimulationSettings";
import { getQuestionSetCount, resetConflictingProgress } from "@/services/cloudSync";
import { hasProgressUnified } from "@/services/simulationStorage";

const QuestionsSetPreparation = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const { settings } = useSimulationSettings();
  const { currentUser, isPremium } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<{
    currentQuestionIndex: number;
    totalQuestions: number;
  } | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Parse setId as a number to avoid type comparison issues
  const setIdNumber = setId ? parseInt(setId, 10) : 0;
  
  const startQuestion = (setIdNumber - 1) * 50 + 1;
  const endQuestion = setIdNumber * 50;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Reset any global progress to prevent conflicts with topic-based simulations
    // FIX #8: Only reset conflicting progress when starting a new simulation, not on page load
    
    // Get accurate question count for this set
    const count = getQuestionSetCount(setIdNumber);
    setQuestionCount(count);
    console.log(`Question set ${setId} contains ${count} questions`);
    
    // Check for existing progress using unified storage
    if (setIdNumber) {
      // FIX #2: Make sure we're passing a number, not a string with prefix
      hasProgressUnified(setIdNumber, true).then(result => {
        if (result.success && result.data) {
          console.log(`Found existing progress for question set ${setId} using unified storage`);
          
          // Create minimal progress object for the "Continue" button
          // We don't need all the details, just enough to show the button
          setSimulationProgress({
            currentQuestionIndex: 1, // At least 1 to show continue button
            totalQuestions: count || 50
          });
        } else {
          console.log(`No saved progress found for question set ${setId} using unified storage`);
          setSimulationProgress(null);
        }
      }).catch(err => {
        console.error("Error checking for progress:", err);
      });
    }
  }, [setId, setIdNumber]);

  const handleStartSimulation = () => {
    setLoading(true);
    
    // FIX #8: Only reset conflicting progress when starting a new simulation
    resetConflictingProgress();
    
    // Set a flag in sessionStorage to indicate we're starting a question set simulation
    sessionStorage.setItem('is_question_set', 'true');
    sessionStorage.setItem('question_set_id', String(setIdNumber));
    
    // Set reset flag in session storage
    // FIX #3: Ensure we're consistently setting this flag
    sessionStorage.setItem('reset_simulation_progress', 'true');
    
    // Navigate to simulation with reset parameter
    navigate(`/questions-set/${setId}?reset=1`);
  };

  const handleContinueSimulation = () => {
    setLoading(true);
    
    // Set flags for question set simulation
    sessionStorage.setItem('is_question_set', 'true');
    sessionStorage.setItem('question_set_id', String(setIdNumber));
    
    // Set continue flag in session storage
    sessionStorage.setItem('continue_simulation', 'true');
    
    // Navigate to simulation with continue parameter
    navigate(`/questions-set/${setId}?continue=true`);
  };

  const handleBackClick = () => {
    navigate("/questions-sets");
  };

  // Display the actual available question count or the max available in settings
  const displayQuestionCount = questionCount > 0 
    ? Math.min(questionCount, settings?.questionsCount || 50)
    : settings?.questionsCount || 50;

  // Check if we have a saved progress to show the continue button
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
          <h1 className="text-3xl font-bold mb-3">הכנה לתרגול שאלות {startQuestion} עד {endQuestion}</h1>
          <p className="text-electric-slate">
            אנא בחר את הגדרות התרגול המועדפות עליך לפני תחילת התרגול
          </p>
          {questionCount > 0 && (
            <p className="text-electric-slate mt-2">
              <span className="font-semibold text-electric-blue">{questionCount}</span> שאלות זמינות מתוך {endQuestion - startQuestion + 1} אפשריות
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              שאלות {startQuestion} עד {endQuestion}
            </h3>
            <p className="text-sm text-electric-slate">
              חטיבה {setId} מתוך 20 חטיבות
            </p>
          </Card>

          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <Check className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {displayQuestionCount} שאלות
            </h3>
            <p className="text-sm text-electric-slate">
              מספר השאלות בסימולציה {questionCount > 0 && questionCount < (settings?.questionsCount || 50) && 
                <span className="text-amber-600">(מתוך {questionCount} זמינות)</span>
              }
            </p>
          </Card>

          <Card className="p-5 text-center cursor-pointer hover:bg-gray-50" onClick={() => setShowSettings(true)}>
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <Settings className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              הגדרות סימולציה
            </h3>
            <p className="text-sm text-electric-slate">
              התאם את הסימולציה לצרכים שלך
            </p>
          </Card>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-10">
          <h3 className="font-semibold text-lg text-electric-navy mb-3">טיפים ללימוד יעיל</h3>
          <ul className="list-disc pr-6 space-y-2 text-electric-slate">
            <li>התמקד בנושאים שבהם אתה מתקשה יותר</li>
            <li>חזור על שאלות שטעית בהן כדי לחזק את הידע שלך</li>
            <li>נסה להסביר את התשובות במילים שלך כדי לוודא הבנה מלאה</li>
            <li>עשה הפסקות קצרות בין סבבי למידה כדי לשפר את הריכוז</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-medium rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            onClick={handleStartSimulation}
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "טוען..." : (
                <>
                  <Rocket className="h-6 w-6" />
                  התחל סימולציה חדשה
                </>
              )}
            </span>
          </Button>
          
          {hasSavedProgress && (
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
              onClick={handleContinueSimulation}
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "טוען..." : (
                  <>
                    <PlayCircle className="h-6 w-6" />
                    המשך סימולציה {simulationProgress?.currentQuestionIndex > 1 && `(שאלה ${simulationProgress?.currentQuestionIndex + 1} מתוך ${simulationProgress?.totalQuestions})`}
                  </>
                )}
              </span>
            </Button>
          )}
        </div>

        {/* Settings Dialog */}
        <SimulationSettings 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
          questionsCount={settings?.questionsCount}
        />
      </div>
      <Footer />
    </>
  );
};

export default QuestionsSetPreparation;
