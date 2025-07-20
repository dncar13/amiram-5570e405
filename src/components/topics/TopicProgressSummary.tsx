
import { Link } from "react-router-dom";
import { FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/types/questionTypes";
import { useEffect, useState } from "react";
import { refreshQuestionsFromStorage } from "@/services/questions";

const TopicProgressSummary = () => {
  const [questionCount, setQuestionCount] = useState(0);
  
  useEffect(() => {
    // Get all questions to count the comprehensive ones
    const loadQuestions = async () => {
      const allQuestions = await refreshQuestionsFromStorage();
      setQuestionCount(allQuestions.length);
    };
    loadQuestions();
  }, []);

  return (
    <Card className="h-full border-t-4 border-t-electric-orange transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge className="bg-electric-orange text-white border-0">
              מקיף
            </Badge>
            <Badge variant="outline" className="bg-electric-gray/50 text-electric-slate border-0">
              בסיסי
            </Badge>
          </div>
          <div className="flex-grow text-right">
            <CardTitle className="text-xl flex items-center gap-2 justify-end">
              <span>כל השאלות - מבחן מקיף</span>
              <span className="p-1.5 rounded-full bg-electric-orange/10 text-electric-orange">
                <BookOpen className="h-5 w-5" />
              </span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 text-right">
        <div className="flex flex-col h-full">
          <p className="text-electric-slate mb-4">
            מאגר מקיף של כל השאלות מכל הנושאים
          </p>
          
          <div className="flex flex-row-reverse items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex flex-row-reverse items-center gap-1">
              <FileText className="h-4 w-4 text-electric-blue/70" />
              <span>{questionCount} מתוך 1000 שאלות</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to="/simulation/0" className="w-full">
          <Button 
            className="w-full font-medium transition-all hover:shadow-md bg-electric-orange hover:bg-orange-600"
          >
            התחל סימולציה
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TopicProgressSummary;
