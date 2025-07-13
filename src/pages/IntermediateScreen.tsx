import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Clock, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { getSimulationProgress, getQuestionsByTopic } from "@/services/questionsService";
import { topicsData } from "@/data/topicsData";
import { categoryData } from "@/data/categories/categoryData";
import { SimulationButtons } from "@/components/simulation/SimulationParts";

const IntermediateScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const { settings } = useSimulationSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<{
    currentQuestionIndex: number;
    totalQuestions: number;
  } | null>(null);
  const [topicQuestionsCount, setTopicQuestionsCount] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Find the topic if this is a topic-based simulation
  const topicId = id ? parseInt(id, 10) : undefined;
  const topic = topicId ? topicsData.find(t => t.id === topicId) : undefined;
  
  // Get the category if available
  const category = topic?.categoryId ? 
    categoryData.find(c => c.id === topic.categoryId) : undefined;
  
  useEffect(() => {
    // Scroll to top of the page
    window.scrollTo(0, 0);
    
    // Load simulation progress and topic questions
    const loadData = async () => {
      if (topicId) {
        // Load simulation progress (sync)
        const progress = getSimulationProgress(topicId);
        if (progress) {
          setSimulationProgress(progress);
        }
        
        // Load topic questions (async)
        setIsLoadingQuestions(true);
        try {
          const questions = await getQuestionsByTopic(topicId);
          setTopicQuestionsCount(questions.length);
        } catch (error) {
          console.error('Error loading topic questions:', error);
          setTopicQuestionsCount(0);
        } finally {
          setIsLoadingQuestions(false);
        }
      } else {
        setIsLoadingQuestions(false);
      }
    };
    
    loadData();
  }, [topicId]);
  
  // Display question count (limited by settings if necessary)
  const displayQuestionCount = topicQuestionsCount > 0 
    ? Math.min(topicQuestionsCount, settings?.questionsCount || 50)
    : settings?.questionsCount || 50;
  
  const handleStartSimulation = () => {
    if (topicId) {
      // Reset progress for this topic
      const progressKey = `topic_${topicId}_progress`;
      localStorage.removeItem(progressKey);
      
      // Navigate to simulation with reset parameter
      navigate(`/simulation/${id}?reset=1`);
    }
  };

  const handleContinueSimulation = () => {
    if (topicId) {
      // Navigate to simulation with continue parameter
      navigate(`/simulation/${id}?continue=true`);
    }
  };
  const handleBackClick = () => {
    navigate("/simulations-entry");
  };
  
  // Check if we have a saved progress to show the continue button
  const hasSavedProgress = simulationProgress !== null && 
    simulationProgress.currentQuestionIndex > 0 &&
    simulationProgress.currentQuestionIndex < simulationProgress.totalQuestions;

  if (!topic) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">          <h1 className="text-2xl font-bold mb-4">נושא לא נמצא</h1>
          <p className="mb-6">הנושא שחיפשת אינו קיים במערכת.</p>
          <Button onClick={() => navigate('/simulations-entry')}>חזרה לרשימת הנושאים</Button>
        </div>
        <Footer />
      </>
    );
  }

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
          <h1 className="text-3xl font-bold mb-3">{topic.title}</h1>
          {category && (
            <p className="text-electric-slate">
              קטגוריה: {category.title}
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
              {isLoadingQuestions ? "טוען..." : `${displayQuestionCount} שאלות`}
            </h3>
            <p className="text-sm text-electric-slate">
              נושא: {topic.title}
            </p>
          </Card>

          <Card className="p-5 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-electric-blue" />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              60 שניות לשאלה
            </h3>
            <p className="text-sm text-electric-slate">
              קצב עבודה מומלץ
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
          <SimulationButtons 
            onStartNew={handleStartSimulation}
            onContinue={handleContinueSimulation}
            hasSavedProgress={hasSavedProgress}
            currentQuestion={simulationProgress?.currentQuestionIndex}
            totalQuestions={simulationProgress?.totalQuestions}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IntermediateScreen;
