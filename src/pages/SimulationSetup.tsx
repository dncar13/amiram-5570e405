
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, ChevronLeft, Rocket, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { resetSimulation } from "@/services/questionsService";
import { topicsData } from "@/data/topicsData";
import { categoryData } from "@/data/categories/categoryData";
import { Topic, Category } from "@/data/types/topicTypes";
import { getQuestionsByTopic } from "@/services/questionsService";
import { SimulationTips } from "@/components/simulation/SimulationTips";
import { resetConflictingProgress } from "@/services/cloudSync";
import { hasProgressUnified } from "@/services/simulationStorage";

const SimulationSetup = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSimulationSettings();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<{
    currentQuestionIndex: number;
    totalQuestions: number;
  } | null>(null); 
  const [availableQuestionsCount, setAvailableQuestionsCount] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // שינוי כותרת הדף לפי הנושא
    if (topic) {
      document.title = `סימולציה - ${topic.title}`;
    } else {
      document.title = "סימולציה - הגדרות";
    }
    
    // Check for existing progress for this topic using unified storage
    if (topicId) {
      // Use the unified progress check
      const numericTopicId = Number(topicId);
      
      hasProgressUnified(numericTopicId, false).then(result => {
        if (result.success && result.data) {
          console.log(`Found existing progress for topic ${numericTopicId} using unified storage`);
          
          // Create minimal progress object for the "Continue" button
          // We don't need all the details, just enough to show the button
          setSimulationProgress({
            currentQuestionIndex: 1, // At least 1 to show continue button
            totalQuestions: availableQuestionsCount || 50
          });
        } else {
          console.log(`No saved progress found for topic ${numericTopicId} using unified storage`);
          setSimulationProgress(null);
        }
      }).catch(err => {
        console.error("Error checking for progress:", err);
      });
    }
  }, [topicId, availableQuestionsCount, topic]);

  useEffect(() => {
    if (!topicId) {
      return;
    }

    const loadTopicData = async () => {
      const topicIdNumber = parseInt(topicId, 10);
      const foundTopic = topicsData.find((t) => t.id === topicIdNumber);
      if (!foundTopic) {
        return;
      }
      
      setTopic(foundTopic);

      const foundCategory = categoryData.find((c) => c.id === foundTopic.categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      }
      
      // Get questions count for this topic
      try {
        const topicQuestions = await getQuestionsByTopic(topicIdNumber);
        setAvailableQuestionsCount(topicQuestions.length);
      } catch (error) {
        console.error('Error loading topic questions:', error);
        setAvailableQuestionsCount(0);
      }

      // Auto-set training mode for topic-specific simulations
      updateSettings({
        examMode: false,
        timerEnabled: false,
        showAnswersImmediately: true,
        timerMinutes: undefined
      });
    };

    loadTopicData();
  }, [topicId, updateSettings]);

  // Calculate timer based on questions count - wrapped with useMemo to avoid recalculation
  const calculateTimer = useMemo(() => {
    const questionsCount = Math.min(settings.questionsCount || 50, availableQuestionsCount);
    // 3 hours for 50 questions = 180 minutes
    // So each question gets 3.6 minutes
    return Math.round(questionsCount * 3.6);
  }, [availableQuestionsCount, settings.questionsCount]);

  const handleStartSimulation = () => {
    setLoading(true);
    
    try {
      // Reset any global progress to prevent conflicts with topic-based simulations
      resetConflictingProgress();
      
      // Store reset flag in session storage to signal fresh start
      window.sessionStorage.setItem('reset_simulation_progress', 'true');
      
      // Navigate to simulation with training mode parameter
      navigate(`/simulation/${topicId}?practice=1&reset=1`);
    } catch (error) {
      console.error("Error starting simulation:", error);
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setLoading(true);
    // Store continue flag in session storage for persistence through navigation
    sessionStorage.setItem('continue_simulation', 'true');
    navigate(`/simulation/${topicId}?practice=1&continue=true`);
  };

  const handleBackClick = () => {
    navigate("/topics");
  };

  // Check if we have a saved progress to show the continue button
  const hasSavedProgress = simulationProgress !== null && 
    simulationProgress.currentQuestionIndex > 0;

  return (
    <>
      <Header />
      <main className="py-8 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {!topic ? (
            <div className="p-8 text-center">טוען נתונים...</div>
          ) : (
            <Card className="p-8 bg-white shadow-md">
              {/* כפתור חזרה */}
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
              
              {/* כותרת ראשית */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-electric-navy mb-3">הגדרות סימולציה</h1>
                <p className="text-gray-600">
                  {topic.title} • {category?.title}
                </p>
                
                {availableQuestionsCount > 0 && (
                  <p className="text-electric-slate mt-2">
                    <span className="font-semibold text-electric-blue">{availableQuestionsCount}</span> שאלות זמינות
                  </p>
                )}

                <div className="mt-4 inline-block">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                    🎯 מצב תרגול - הסברים מיידיים אחרי כל שאלה
                  </span>
                </div>
              </div>

              {/* טיפים לפני התחלת הסימולציה */}
              <SimulationTips />

              {/* אזור זמן וכמות שאלות מעוצב */}
              <div className="flex justify-between items-center bg-gray-100 px-6 py-4 rounded-xl mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">זמן: </span>
                  <span className="text-green-600">ללא הגבלה</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">מספר שאלות: </span>
                  <span className="font-bold">
                    {availableQuestionsCount > 0 
                      ? Math.min(settings.questionsCount || 50, availableQuestionsCount)
                      : settings.questionsCount || 50}
                  </span>
                  {availableQuestionsCount > 0 && availableQuestionsCount < (settings.questionsCount || 50) && (
                    <span className="text-amber-600 text-sm">(מתוך {availableQuestionsCount} זמינות)</span>
                  )}
                </div>
              </div>

              {/* כפתורי פעולה מעוצבים */}
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-5 text-xl font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                  onClick={handleStartSimulation}
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-3">
                    {loading ? (
                      "טוען..."
                    ) : (
                      <>
                        <Rocket className="h-6 w-6" />
                        התחל תרגול חדש
                      </>
                    )}
                  </span>
                </Button>

                {/* כפתור המשך מוצג רק אם יש התקדמות אמיתית */}
                {hasSavedProgress && (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-bold rounded-xl shadow-md transition-all hover:shadow-lg"
                    onClick={handleContinue}
                    disabled={loading}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        "טוען..."
                      ) : (
                        <>
                          <PlayCircle className="h-6 w-6" />
                          המשך תרגול {simulationProgress?.currentQuestionIndex > 1 && `(שאלה ${simulationProgress?.currentQuestionIndex + 1} מתוך ${simulationProgress?.totalQuestions})`}
                        </>
                      )}
                    </span>
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SimulationSetup;
