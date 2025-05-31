
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import QuestionCard from "@/components/questions/QuestionCard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const SavedQuestionViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedQuestions, removeQuestionById, initializeSavedQuestions } = useSavedQuestions();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get questionId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialQuestionId = queryParams.get('questionId') ? 
    parseInt(queryParams.get('questionId') as string, 10) : 
    undefined;
  
  // Find the index of the requested questionId in the savedQuestions array
  const findQuestionIndexById = (id?: number) => {
    if (!id || savedQuestions.length === 0) return 0;
    const index = savedQuestions.findIndex(sq => sq.question.id === id);
    return index !== -1 ? index : 0;
  };
  
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Initialize saved questions and set loading state
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initializeSavedQuestions();
      
      // Delay setting loading to false to ensure data is ready
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    
    loadData();
  }, [initializeSavedQuestions]);
  
  // Set the current question index once data is loaded
  useEffect(() => {
    // Only update if not loading and we have questions
    if (!isLoading && savedQuestions.length > 0 && initialQuestionId) {
      const newIndex = findQuestionIndexById(initialQuestionId);
      setCurrentQuestionIndex(newIndex);
    }
    
    // If there are no saved questions after loading, redirect to saved tab
    if (!isLoading && savedQuestions.length === 0) {
      navigate('/account?tab=saved');
    }
  }, [savedQuestions, initialQuestionId, isLoading, navigate]);
  
  const currentSavedQuestion = savedQuestions[currentQuestionIndex];
  
  const onAnswerSelect = (index: number) => {
    setSelectedAnswerIndex(index);
  };
  
  const onSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
  };
  
  const onNextQuestion = () => {
    if (currentQuestionIndex < savedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
      
      // Update URL with new questionId
      const nextQuestionId = savedQuestions[currentQuestionIndex + 1].question.id;
      navigate(`/saved-questions?questionId=${nextQuestionId}`, { replace: true });
    } else {
      // If this is the last question, go back to the saved questions page
      navigate("/account?tab=saved");
    }
  };
  
  const onPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
      
      // Update URL with new questionId
      const prevQuestionId = savedQuestions[currentQuestionIndex - 1].question.id;
      navigate(`/saved-questions?questionId=${prevQuestionId}`, { replace: true });
    }
  };
  
  const onToggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  const onToggleQuestionFlag = () => {
    if (currentSavedQuestion) {
      try {
        if (removeQuestionById(currentSavedQuestion.question.id)) {
          toast.success("השאלה הוסרה מהשאלות השמורות");
          // If we removed the current question, go to the next question or back to the list
          if (savedQuestions.length <= 1) {
            navigate("/account?tab=saved");
          } else {
            onNextQuestion();
          }
        }
      } catch (error) {
        console.error("Error removing question:", error);
        toast.error("אירעה שגיאה בהסרת השאלה");
      }
    }
  };

  // Show loading state while checking for the question
  if (isLoading) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-3xl w-full p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-64 w-full" />
              <div className="flex justify-center">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </main>
        <Footer />
      </RTLWrapper>
    );
  }

  if (savedQuestions.length === 0) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-3xl w-full p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">אין שאלות שמורות</h2>
            <p className="mb-6 text-muted-foreground">
              לא נמצאו שאלות שמורות במערכת. שמור שאלות כדי לחזור אליהן מאוחר יותר.
            </p>
            <Button onClick={() => navigate('/account?tab=saved')} className="mx-auto">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לשאלות השמורות
            </Button>
          </Card>
        </main>
        <Footer />
      </RTLWrapper>
    );
  }
  
  if (!currentSavedQuestion) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-3xl w-full p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">השאלה לא נמצאה</h2>
            <p className="mb-6 text-muted-foreground">
              השאלה שחיפשת לא נמצאה או שהוסרה ממאגר השאלות השמורות שלך.
            </p>
            <Button onClick={() => navigate('/account?tab=saved')} className="mx-auto">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לשאלות השמורות
            </Button>
          </Card>
        </main>
        <Footer />
      </RTLWrapper>
    );
  }
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 bg-electric-gray/25">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-4 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/account?tab=saved')}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לשאלות השמורות
            </Button>
            
            <h1 className="text-2xl font-bold mb-2">שאלות שמורות</h1>
            <p className="text-muted-foreground">
              צפייה בשאלות ששמרת לשימוש מאוחר יותר
            </p>
            <div className="mt-2 text-sm">
              שאלה {currentQuestionIndex + 1} מתוך {savedQuestions.length}
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <QuestionCard
              currentQuestion={currentSavedQuestion.question}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={savedQuestions.length}
              selectedAnswerIndex={selectedAnswerIndex}
              isAnswerSubmitted={isAnswerSubmitted}
              showExplanation={showExplanation}
              isFlagged={true}
              onAnswerSelect={onAnswerSelect}
              onSubmitAnswer={onSubmitAnswer}
              onNextQuestion={onNextQuestion}
              onPreviousQuestion={onPreviousQuestion}
              onToggleExplanation={onToggleExplanation}
              onToggleQuestionFlag={onToggleQuestionFlag}
            />
          </div>
        </div>
      </main>
      <Footer />
    </RTLWrapper>
  );
};

export default SavedQuestionViewer;
