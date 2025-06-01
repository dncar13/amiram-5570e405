import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, ChevronLeft, BookOpen, Edit3, RotateCcw, Brain, 
  GraduationCap, ListChecks, Clock, Star, ArrowLeft 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allQuestions } from "@/data/questions";

interface QuestionSet {
  id: number;
  title: string;
  description: string;
  filePath: string;
  questionsCount: number;
  icon: React.ReactNode;
  filter: (q: any) => boolean;
  color: string;
}

export default function QuestionsSets() {
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  
  // הגדרת קבוצות השאלות לפי סוג
  const predefinedQuestionSets: Omit<QuestionSet, 'questionsCount'>[] = [
    {
      id: 1,
      title: "שאלות הבנת הנקרא",
      description: "שאלות על טקסטים וקטעי קריאה",
      filePath: "reading-comprehension",
      icon: <BookOpen className="h-6 w-6" />,
      filter: (q) => q.questionType === 'reading-comprehension',
      color: "border-t-blue-500"
    },
    {
      id: 2,
      title: "השלמת משפטים",
      description: "בחירת המילה המתאימה להשלמת המשפט",
      filePath: "sentence-completion", 
      icon: <Edit3 className="h-6 w-6" />,
      filter: (q) => q.questionType === 'sentence-completion',
      color: "border-t-green-500"
    },
    {
      id: 3,
      title: "שאלות ניסוח מחדש",
      description: "מציאת הביטוי השווה במשמעותו",
      filePath: "restatement",
      icon: <RotateCcw className="h-6 w-6" />,
      filter: (q) => q.questionType === 'restatement',
      color: "border-t-purple-500"
    },
    {
      id: 4,
      title: "כל השאלות (1-50)",
      description: "תרגול מעורב מכל הסוגים",
      filePath: "questions1to50",
      icon: <FileText className="h-6 w-6" />,
      filter: (q) => q.id >= 1 && q.id <= 50,
      color: "border-t-electric-blue"
    },
    {
      id: 5,
      title: "קטע מורכב - Gig Economy",
      description: "שאלות הבנת הנקרא מתקדמות",
      filePath: "questions51to100",
      icon: <BookOpen className="h-6 w-6" />,
      filter: (q) => q.id >= 51 && q.id <= 100 && q.passageTitle === "The Rise of the Gig Economy",
      color: "border-t-orange-500"
    }
  ];

  useEffect(() => {
    // חישוב כמות השאלות לכל קבוצה
    const sets: QuestionSet[] = predefinedQuestionSets.map((set) => {
      const questionsInRange = allQuestions ? 
        allQuestions.filter(set.filter).length : 0;
      
      return {
        ...set,
        questionsCount: questionsInRange
      };
    });
    
    setQuestionSets(sets);
  }, []);

  // פונקציה לניווט לעמוד הכנה של קבוצת שאלות מסוימת
  const handleStartQuestionSet = (setId: number) => {
    navigate(`/questions-set/${setId}/intro`);
  };

  // פונקציה לקבלת צבע הרקע של האייקון
  const getIconBgColor = (color: string) => {
    switch(color) {
      case "border-t-blue-500": return "bg-blue-100";
      case "border-t-green-500": return "bg-green-100";
      case "border-t-purple-500": return "bg-purple-100";
      case "border-t-electric-blue": return "bg-electric-blue/10";
      case "border-t-orange-500": return "bg-orange-100";
      default: return "bg-gray-100";
    }
  };

  // פונקציה לקבלת צבע הטקסט של האייקון
  const getIconTextColor = (color: string) => {
    switch(color) {
      case "border-t-blue-500": return "text-blue-600";
      case "border-t-green-500": return "text-green-600";
      case "border-t-purple-500": return "text-purple-600";
      case "border-t-electric-blue": return "text-electric-blue";
      case "border-t-orange-500": return "text-orange-600";
      default: return "text-gray-600";
    }
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
          <p className="text-electric-slate mb-2">בחר סוג שאלות לתרגול</p>
          <p className="text-sm text-electric-slate">
            כרגע זמינות {allQuestions?.length || 0} שאלות במאגר
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {questionSets.map((set) => (
            <Card 
              key={set.id}
              className={`bg-white p-6 shadow-md ${set.color} border-t-4 rounded-lg flex flex-col hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-center mb-4">
                <span className={`p-3 ${getIconBgColor(set.color)} rounded-full`}>
                  <div className={getIconTextColor(set.color)}>
                    {set.icon}
                  </div>
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-2 text-electric-navy">
                {set.title}
              </h3>
              
              <p className="text-electric-slate text-sm mb-4 text-center min-h-[3rem] flex items-center justify-center">
                {set.description}
              </p>
              
              <div className="text-center mb-4">
                {set.questionsCount > 0 ? (
                  <span className="inline-block px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-sm font-medium">
                    {set.questionsCount} שאלות זמינות
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm">
                    אין שאלות זמינות
                  </span>
                )}
              </div>
              
              <Button 
                className="mt-auto w-full py-2 text-base font-medium bg-electric-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => handleStartQuestionSet(set.id)}
                disabled={set.questionsCount === 0}
              >
                התחל תרגול
              </Button>
            </Card>
          ))}
        </div>

        {/* הוספת הודעה עבור המשתמש על התוכניות העתידיות */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-700 text-sm">
            🚀 בקרוב יתווספו עוד סוגי שאלות וקטעי קריאה נוספים למאגר
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}