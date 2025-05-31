
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allQuestions } from "@/data/questions"; // Import allQuestions from the index

interface QuestionSet {
  id: number;
  startQuestion: number;
  endQuestion: number;
  title: string;
  filePath: string;
  questionsCount: number; // Add count of actual questions
}

export default function QuestionsSets() {
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  
  useEffect(() => {
    // Create 20 groups of questions with links to the appropriate question files
    const sets: QuestionSet[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const startQuestion = (i - 1) * 50 + 1;
      const endQuestion = i * 50;
      const filePath = `questions${startQuestion}to${endQuestion}`;
      
      // Count actual questions in this range from allQuestions
      const startIndex = startQuestion - 1; // 0-based index
      const endIndex = endQuestion - 1;     // 0-based index
      const questionsInRange = allQuestions ? 
        allQuestions.filter(q => q.id >= startQuestion && q.id <= endQuestion).length : 0;
      
      sets.push({
        id: i,
        startQuestion,
        endQuestion,
        title: `שאלות ${startQuestion} עד ${endQuestion}`,
        filePath,
        questionsCount: questionsInRange
      });
    }
    
    setQuestionSets(sets);
  }, []);

  // Function to navigate to a specific question set preparation page
  const handleStartQuestionSet = (setId: number) => {
    navigate(`/questions-set/${setId}/intro`);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center text-electric-slate"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5 ml-1" />
            חזרה
          </Button>
          <h1 className="text-3xl font-bold text-electric-navy">מאגר השאלות</h1>
        </div>

        <div className="mb-6 text-center">
          <p className="text-electric-slate mb-2">בחר קבוצת שאלות מתוך 1000 השאלות במאגר</p>
          <p className="text-sm text-electric-slate">כל קבוצה מכילה עד 50 שאלות</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {questionSets.map((set) => (
            <Card 
              key={set.id}
              className="bg-white p-4 shadow-md border-t-4 border-t-electric-blue rounded-lg flex flex-col hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="p-3 bg-electric-blue/10 rounded-full">
                  <FileText className="h-6 w-6 text-electric-blue" />
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-2 text-electric-navy">
                {set.title}
              </h3>
              
              <p className="text-electric-slate text-sm mb-4 text-center">
                קבוצה {set.id} מתוך 20
                {set.questionsCount > 0 && (
                  <span className="block mt-1 font-medium text-electric-blue">
                    {set.questionsCount} שאלות זמינות
                  </span>
                )}
                {set.questionsCount === 0 && (
                  <span className="block mt-1 text-gray-400">
                    אין שאלות זמינות בקבוצה זו
                  </span>
                )}
              </p>
              
              <Button 
                className="mt-auto w-full py-2 text-base font-medium bg-electric-blue hover:bg-blue-600"
                onClick={() => handleStartQuestionSet(set.id)}
                disabled={set.questionsCount === 0}
              >
                התחל תרגול
              </Button>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
