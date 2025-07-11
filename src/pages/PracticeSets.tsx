
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Clock, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PracticeSet {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  completionRate: number;
  tags: string[];
  icon: React.ReactNode;
  color: string;
}

const PracticeSets = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  // Type translations
  const typeTranslations: Record<string, string> = {
    'sentence-completion': 'השלמת משפטים',
    'restatement': 'ניסוח מחדש'
  };

  // Difficulty translations
  const difficultyTranslations: Record<string, string> = {
    'easy': 'קל',
    'medium': 'בינוני',
    'hard': 'קשה'
  };

  useEffect(() => {
    const loadProgress = () => {
      const savedProgress: Record<string, unknown> = {};
      
      // Load progress from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('practice_set_')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              if (typeof parsedValue === 'number') {
                savedProgress[key.replace('practice_set_', '')] = parsedValue;
              }
            }
          } catch (error) {
            console.error(`Error parsing progress for ${key}:`, error);
          }
        }
      }
      
      setUserProgress(savedProgress as Record<string, number>);
    };

    // Load progress only on mount
    loadProgress();
  }, []);

  useEffect(() => {
    // Generate practice sets based on type and difficulty
    const generatePracticeSets = () => {
      const sets: PracticeSet[] = [];
      
      // Create 5 sets for each type/difficulty combination
      for (let i = 1; i <= 5; i++) {
        const setId = `${type}-${difficulty}-set-${i}`;
        sets.push({
          id: setId,
          title: `סט ${i} - ${typeTranslations[type || '']} - ${difficultyTranslations[difficulty || '']}`,
          description: `סט תרגול מספר ${i} עם שאלות ברמת קושי ${difficultyTranslations[difficulty || '']}`,
          questionsCount: 20,
          difficulty: difficulty as "easy" | "medium" | "hard",
          estimatedTime: 25,
          completionRate: userProgress[setId] || 0,
          tags: [typeTranslations[type || ''], difficultyTranslations[difficulty || '']],
          icon: type === 'sentence-completion' ? <BookOpen className="h-4 w-4" /> : <Target className="h-4 w-4" />,
          color: type === 'sentence-completion' ? "bg-blue-500" : "bg-green-500",
        });
      }
      
      return sets;
    };

    if (type && difficulty) {
      setPracticeSets(generatePracticeSets());
    }
  }, [type, difficulty, userProgress]);

  const handleStartSet = (setId: string) => {
    // Navigate to simulation with specific set
    navigate(`/simulation/type/${type}/${difficulty}?set=${setId.split('-').pop()}`);
  };

  const handleBack = () => {
    navigate(`/simulation/type/${type}/${difficulty}`);
  };

  if (!type || !difficulty) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6 bg-electric-gray/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-electric-navy mb-4">שגיאה</h1>
            <p className="text-electric-slate mb-4">לא נמצא סוג שאלה או רמת קושי</p>
            <Button onClick={() => navigate('/simulations-entry')}>
              חזור לעמוד הכניסה
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
              onClick={handleBack}
              variant="ghost"
              className="mb-4 text-electric-navy hover:text-electric-navy/80"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              חזור
            </Button>
            
            <h1 className="text-2xl font-bold text-electric-navy mb-2">
              סטי תרגול - {typeTranslations[type]} - {difficultyTranslations[difficulty]}
            </h1>
            <p className="text-electric-slate">
              בחר סט תרגול לתחילת התרגול המסודר
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceSets.map((set) => (
              <Card key={set.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    {set.icon}
                    <CardTitle className="text-lg font-semibold">
                      {set.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm text-gray-500">
                    {set.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 rounded-full px-2 py-1 text-xs font-medium">
                      <BookOpen className="h-3 w-3 ml-1" />
                      {set.questionsCount} שאלות
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-300 rounded-full px-2 py-1 text-xs font-medium">
                      <Clock className="h-3 w-3 ml-1" />
                      {set.estimatedTime} דקות
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700">
                        התקדמות:
                      </h4>
                      <span className="text-xs text-gray-500">
                        {set.completionRate}%
                      </span>
                    </div>
                    <Progress value={set.completionRate} className="h-2" />
                  </div>
                  
                  <Button
                    onClick={() => handleStartSet(set.id)}
                    className="w-full"
                    variant={set.completionRate > 0 ? "outline" : "default"}
                  >
                    {set.completionRate > 0 ? (
                      <>
                        <CheckCircle className="h-4 w-4 ml-2" />
                        המשך תרגול
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 ml-2" />
                        התחל סט
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PracticeSets;
