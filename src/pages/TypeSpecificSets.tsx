import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getQuestionsByDifficultyAndType } from "@/services/questionsService";

interface QuestionSet {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  startIndex: number;
  endIndex: number;
}

const TypeSpecificSets = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (!type || !difficulty) return;

    // Get questions for this type and difficulty
    const questions = getQuestionsByDifficultyAndType(difficulty, type);
    setTotalQuestions(questions.length);

    // Create sets of 10 questions each
    const questionsPerSet = 10;
    const numberOfSets = Math.ceil(questions.length / questionsPerSet);
    
    const sets: QuestionSet[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      const startIndex = i * questionsPerSet;
      const endIndex = Math.min(startIndex + questionsPerSet, questions.length);
      const actualCount = endIndex - startIndex;
      
      sets.push({
        id: i + 1,
        title: `סט ${i + 1}`,
        description: `שאלות ${startIndex + 1}-${endIndex} ברמת קושי ${getDifficultyInHebrew(difficulty)}`,
        questionsCount: actualCount,
        startIndex,
        endIndex: endIndex - 1
      });
    }
    
    setQuestionSets(sets);
  }, [type, difficulty]);

  const getDifficultyInHebrew = (diff: string) => {
    switch (diff) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return diff;
    }
  };

  const getTypeInHebrew = (t: string) => {
    switch (t) {
      case 'sentence-completion': return 'השלמת משפטים';
      case 'restatement': return 'ניסוח מחדש';
      case 'vocabulary': return 'אוצר מילים';
      case 'reading-comprehension': return 'הבנת הנקרא';
      default: return t;
    }
  };

  const handleSetClick = (set: QuestionSet) => {
    // Navigate to simulation with set parameters
    navigate(`/simulation/${type}/${difficulty}?set=${set.id}&start=${set.startIndex}`);
  };

  const handleBackClick = () => {
    navigate(`/simulation/type/${type}/${difficulty}`);
  };

  if (!type || !difficulty) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-electric-navy mb-4">שגיאה בפרמטרים</h1>
            <Button onClick={() => navigate('/simulations-entry')}>
              חזרה לסימולציות
            </Button>
          </div>
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
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="mb-4 text-electric-navy hover:text-electric-navy/80"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              חזרה
            </Button>
            
            <h1 className="text-2xl font-bold text-electric-navy mb-2">
              סטי תרגול - {getTypeInHebrew(type)}
            </h1>
            <p className="text-electric-slate mb-4">
              רמת קושי: {getDifficultyInHebrew(difficulty)} | סה"כ {totalQuestions} שאלות
            </p>
            <p className="text-sm text-electric-slate">
              כל סט מכיל 10 שאלות. בחר סט להתחלת התרגול.
            </p>
          </div>

          {questionSets.length === 0 ? (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold text-electric-navy mb-2">
                לא נמצאו שאלות
              </h2>
              <p className="text-electric-slate mb-4">
                אין שאלות זמינות עבור {getTypeInHebrew(type)} ברמת קושי {getDifficultyInHebrew(difficulty)}
              </p>
              <Button onClick={handleBackClick}>
                חזרה לבחירת אפשרויות
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionSets.map((set) => (
                <Card key={set.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-electric-navy">
                      {set.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-electric-slate mb-4">
                      {set.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/20 rounded-full px-2 py-1 text-xs font-medium">
                        <BookOpen className="h-3 w-3 ml-1" />
                        {set.questionsCount} שאלות
                      </Badge>
                      <Badge className="bg-electric-green/10 text-electric-green border-electric-green/20 rounded-full px-2 py-1 text-xs font-medium">
                        <Clock className="h-3 w-3 ml-1" />
                        ~{Math.ceil(set.questionsCount * 1.5)} דקות
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={() => handleSetClick(set)}
                      className="w-full"
                    >
                      התחל סט {set.id} <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TypeSpecificSets;