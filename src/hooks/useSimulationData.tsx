
import { useState, useEffect, useMemo } from "react";
import { getQuestionsForSet, resetConflictingProgress } from "@/services/cloudSync";
import { refreshQuestionsFromStorage, reloadQuestionsFromSource } from "@/services/questions/storage";
import { isComprehensiveExamTopic } from "@/data/utils/topicUtils";
import { topicsData } from "@/data/topicsData";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cleanupOldProgress, checkForResetRequest, removeResetParameterFromUrl } from "@/services/storageUtils";

export const useSimulationData = (
  topicId: string | undefined,
  setId: string | undefined,
  isQuestionSet: boolean
) => {
  const navigate = useNavigate();
  const [questionSetTitle, setQuestionSetTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [initComplete, setInitComplete] = useState(false);
  
  // Find the topic if we're doing a topic-based simulation
  const topic = topicId ? topicsData.find(t => t.id === Number(topicId)) : undefined;
  
  // Check if this is a comprehensive exam (all questions)
  const isComprehensiveExam = topicId ? isComprehensiveExamTopic(Number(topicId)) : false;
  
  // Parse the set ID if we have one
  const setIdNumber = setId ? parseInt(setId, 10) : undefined;
  
  useEffect(() => {
    const initializeSimulation = async () => {
      setIsLoading(true);
      
      try {
        // Reset conflicting global progress to avoid confusion between topics and question sets
        resetConflictingProgress();
        
        // Check if there's a reset parameter in the URL and process it only once
        const shouldReset = checkForResetRequest();
        
        if (shouldReset) {
          console.log("Reset parameter detected in URL - simulation will reset");
          // Don't show the toast here, it will be shown by the Simulation component
          
          // Remove the reset parameter from URL to prevent reload issues
          removeResetParameterFromUrl();
        }
        
        // Run cleanup on old progress data
        setTimeout(() => {
          try {
            cleanupOldProgress();
          } catch (err) {
            console.warn("Failed to clean up old progress:", err);
          }
        }, 1000);
        
        // Always reload questions from source files when simulation starts
        // This ensures any manually added questions are included
        const freshQuestions = reloadQuestionsFromSource();
        console.log(`Reloaded ${freshQuestions.length} questions from source files`);
        
        // If we have a question set ID, determine its title for display
        if (setId) {
          const setIdNum = parseInt(setId, 10);
          if (!isNaN(setIdNum) && setIdNum >= 1 && setIdNum <= 20) {
            const startQuestion = (setIdNum - 1) * 50 + 1;
            const endQuestion = setIdNum * 50;
            setQuestionSetTitle(`שאלות ${startQuestion} עד ${endQuestion}`);
          }
          
          // Mark this as a question set simulation in session storage
          sessionStorage.setItem('is_question_set', 'true');
          sessionStorage.setItem('question_set_id', setId);
        } else {
          // Mark this as a topic simulation
          sessionStorage.removeItem('is_question_set');
          sessionStorage.removeItem('question_set_id');
        }
        
        refreshQuestionsFromStorage();
        setInitComplete(true);
      } catch (err) {
        console.error("Error initializing simulation:", err);
        setError("שגיאה בטעינת הסימולציה");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSimulation();
  }, [topicId, setId]);
  
  // Get questions for this simulation
  const topicQuestions = useMemo(() => {
    if (!initComplete) return [];
    
    try {
      // If we're viewing a question set (not a topic)
      if (setId) {
        let setQuestions;
        // Use the function from cloudSync to get questions specifically by ID range
        const setIdNum = parseInt(setId, 10);
        if (!isNaN(setIdNum)) {
          setQuestions = getQuestionsForSet(setIdNum);
          setQuestionCount(setQuestions.length);
          
          console.log(`Found ${setQuestions.length} questions for set ${setId}`);
          
          if (setQuestions.length === 0) {
            setError(`No questions found for set ${setId}`);
            toast({
              title: "אין שאלות לקבוצה זו",
              description: "קבוצת שאלות זו אינה מכילה שאלות כרגע.",
              variant: "destructive",
            });
            return [];
          }
          
          return setQuestions;
        } else {
          setError("Invalid set ID");
          setQuestions = [];
          setQuestionCount(0);
          return [];
        }
      }
      
      // Regular topic behavior
      if (!topic) {
        setError("Topic not found");
        return [];
      }
      
      // For comprehensive exams, show all questions regardless of topic
      if (isComprehensiveExam) {
        const allQs = reloadQuestionsFromSource().slice(0); // Create a copy to avoid reference issues
        console.log(`Comprehensive exam: showing all ${allQs.length} questions`);
        setQuestionCount(allQs.length);
        return allQs;
      }
      
      // Normal filtering by topic ID - ensure we're working with a clean copy
      const filteredQuestions = reloadQuestionsFromSource()
        .filter(q => !topic || q.topicId === topic.id);
        
      console.log(`Topic ${topic.id}: found ${filteredQuestions.length} questions`);
      setQuestionCount(filteredQuestions.length);
      
      if (filteredQuestions.length === 0) {
        setError(`No questions found for topic ${topic.id}`);
        toast({
          title: "אין שאלות לנושא זה",
          description: "נושא זה אינו מכיל שאלות כרגע. אנא בחר נושא אחר.",
          variant: "destructive",
        });
      }
      
      return filteredQuestions;
    } catch (error) {
      console.error("Error loading questions:", error);
      setError("Error loading questions");
      return [];
    }
  }, [topic, setId, isComprehensiveExam, initComplete, navigate]);
  
  // Helper function for part navigation (question sets divided into parts)
  const getCurrentPart = () => {
    if (!isComprehensiveExam && !setId) return null;
    
    const currentQuestionNumber = 1; // Default to first question
    const currentPart = Math.ceil(currentQuestionNumber / 50);
    
    return {
      part: currentPart,
      firstQuestion: (currentPart - 1) * 50 + 1,
      lastQuestion: Math.min(currentPart * 50, questionCount)
    };
  };
  
  return {
    topic,
    topicQuestions,
    questionSetTitle,
    isLoading,
    isComprehensiveExam,
    setIdNumber,
    getCurrentPart,
    questionCount,
    error
  };
};
