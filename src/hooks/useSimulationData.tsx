
import { useState, useEffect, useMemo } from "react";
import { Question } from "@/data/types/questionTypes";
import { Topic } from "@/data/types/topicTypes";
import { topicsData } from "@/data/topicsData";
import { useToast } from "@/hooks/use-toast";
import { 
  getMediumQuestions, 
  getEasyQuestions, 
  getHardQuestions, 
  getMixedDifficultyQuestions,
  getRestatementQuestions 
} from "@/services/questionsService";
import { MobileConfig } from "@/types/mobileConfig";

interface SimulationDataResult {
  topicQuestions: Question[];
  topic: Topic | null;
  questionSetTitle: string;
  isLoading: boolean;
  error: string | null;
  isComprehensiveExam: boolean;
  setIdNumber: number | null;
}

export const useSimulationData = (
  topicId: string | undefined,
  setId: string | undefined,
  isQuestionSet: boolean = false,
  storyQuestions: Question[] = []
): SimulationDataResult => {
  const [topicQuestions, setTopicQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questionSetTitle, setQuestionSetTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComprehensiveExam, setIsComprehensiveExam] = useState(false);
  const [setIdNumber, setSetIdNumber] = useState<number | null>(null);
  const { toast } = useToast();

  // Mobile configuration
  const mobileConfig: MobileConfig = useMemo(() => ({
    enableDebugLogging: false,
    retryDelay: 1000,
    maxRetries: 3,
    timeoutDuration: 10000,
    enableOfflineMode: true,
    cacheExpiryTime: 24 * 60 * 60 * 1000, // 24 hours
    maxCacheSize: 100,
    enableProgressSync: true,
    autoSaveInterval: 5000,
    enableCrashReporting: false,
    debugMode: false
  }), []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        if (isQuestionSet && setId) {
          // Parse setId to number
          const setNumber = parseInt(setId, 10);
          setSetIdNumber(setNumber);

          // Load questions for the set
          let questionsForSet: Question[] = [];

          if (setNumber >= 1 && setNumber <= 20) {
            // For sets 1-20, load mixed difficulty questions
            questionsForSet = getMixedDifficultyQuestions('medium').slice(0, 50);
          } else if (setNumber === 801) {
            // Special set 801-850 for restatement questions
            questionsForSet = getRestatementQuestions().slice(0, 50);
          } else {
            questionsForSet = [];
          }

          if (isMounted) {
            setTopicQuestions(questionsForSet);
            setQuestionSetTitle(`קבוצת שאלות מספר ${setNumber}`);
            setTopic(null);
            setIsComprehensiveExam(false);
            setIsLoading(false);
          }
        } else if (topicId) {
          // Load topic questions
          const topicNum = parseInt(topicId, 10);
          const foundTopic = topicsData.find(t => t.id === topicNum) || null;

          if (foundTopic) {
            setTopic(foundTopic);

            // Load questions by difficulty or all
            let questionsForTopic: Question[] = [];

            if (foundTopic.difficulty === 'easy') {
              questionsForTopic = getEasyQuestions().slice(0, 25);
            } else if (foundTopic.difficulty === 'medium') {
              questionsForTopic = getMediumQuestions().slice(0, 25);
            } else if (foundTopic.difficulty === 'hard') {
              questionsForTopic = getHardQuestions().slice(0, 25);
            } else {
              questionsForTopic = getMixedDifficultyQuestions('medium').slice(0, 25);
            }

            if (isMounted) {
              setTopicQuestions(questionsForTopic);
              setQuestionSetTitle(foundTopic.title);
              setIsComprehensiveExam(false);
              setIsLoading(false);
            }
          } else {
            if (isMounted) {
              setError("נושא לא נמצא");
              setIsLoading(false);
            }
          }
        } else if (storyQuestions.length > 0) {
          // Story-based questions
          if (isMounted) {
            setTopicQuestions(storyQuestions);
            setQuestionSetTitle("סימולציית סיפור");
            setTopic(null);
            setIsComprehensiveExam(false);
            setIsLoading(false);
          }
        } else {
          // Default fallback: empty questions
          if (isMounted) {
            setTopicQuestions([]);
            setQuestionSetTitle("");
            setTopic(null);
            setIsComprehensiveExam(false);
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("שגיאה בטעינת הנתונים");
          setIsLoading(false);
          toast({
            title: "שגיאה",
            description: "אירעה שגיאה בטעינת שאלות הסימולציה",
            variant: "destructive",
          });
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [topicId, setId, isQuestionSet, storyQuestions, toast]);

  return {
    topicQuestions,
    topic,
    questionSetTitle,
    isLoading,
    error,
    isComprehensiveExam,
    setIdNumber,
  };
};
