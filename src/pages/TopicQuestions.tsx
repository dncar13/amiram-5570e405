import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Question } from "@/data/types/questionTypes";
import { topicsData } from "@/data/topicsData";
import { useAuth } from "@/context/AuthContext";
import { getAllQuestions } from "@/services/questionsService";

// Import refactored components
import LoadingSpinner from "@/components/questions/LoadingSpinner";
import SearchBar from "@/components/questions/SearchBar";
import FilterTabs from "@/components/questions/FilterTabs";
import NoQuestionsFound from "@/components/questions/NoQuestionsFound";
import TopicQuestionsList from "@/components/questions/TopicQuestionsList";

const TopicQuestions = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { currentUser, isPremium } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "mine" | "flagged">("all");
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserQuestions = async () => {
      setIsLoading(true);
      try {
        const allQuestions = getAllQuestions();
        
        // If categoryId is provided, filter questions by that category
        let filteredQuestions = allQuestions;
        
        if (categoryId) {
          const categoryIdNum = parseInt(categoryId);
          const topicsInCategory = topicsData.filter(topic => topic.categoryId === categoryIdNum);
          const topicIds = topicsInCategory.map(topic => topic.id);
          
          filteredQuestions = allQuestions.filter(q => 
            topicIds.includes(q.topicId)
          );
        }
        
        // Add some demo flags for UI demonstration
        const userQuestionsSimulated = filteredQuestions.map(q => ({
          ...q,
          flagged: Math.random() > 0.7,
          verified: Math.random() > 0.5
        }));
        
        setUserQuestions(userQuestionsSimulated);
      } catch (error) {
        console.error("Error loading user questions:", error);
        toast.error("שגיאה בטעינת השאלות");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserQuestions();
  }, [currentUser, categoryId]);
  
  const filteredQuestions = userQuestions.filter(question => {
    const searchMatch = searchTerm === "" || 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.options.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === "mine") return searchMatch;
    if (filter === "flagged") return searchMatch && question.flagged === true;
    return searchMatch;
  });
  
  const questionsByTopic = filteredQuestions.reduce((acc, question) => {
    const topic = topicsData.find(t => t.id === question.topicId);
    const topicName = topic ? topic.title : "נושא לא מוגדר";
    
    if (!acc[topicName]) {
      acc[topicName] = [];
    }
    
    acc[topicName].push(question);
    return acc;
  }, {} as Record<string, Question[]>);
  
  const sortedTopics = Object.keys(questionsByTopic).sort();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6 bg-electric-gray/50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-electric-navy mb-2">מאגר השאלות לפי נושאים</h1>
            <p className="text-electric-slate">
              צפייה וחיפוש בשאלות לפי נושאים מתוך מאגר השאלות
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <FilterTabs 
              questions={userQuestions}
              activeFilter={filter}
              onFilterChange={setFilter}
            >
              <div></div>
            </FilterTabs>
          </div>
          
          {filteredQuestions.length === 0 ? (
            <NoQuestionsFound searchTerm={searchTerm} />
          ) : (
            <div className="space-y-6">
              {sortedTopics.map((topicName) => (
                <TopicQuestionsList 
                  key={topicName}
                  topicName={topicName}
                  questions={questionsByTopic[topicName]}
                />
              ))}
              
              {filteredQuestions.length > 10 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="bg-white">
                    טען עוד שאלות
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TopicQuestions;
