
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Clock, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface QuestionSet {
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

const QuestionsSets = () => {
  const navigate = useNavigate();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadProgress = () => {
      const savedProgress: Record<string, number> = {};
      
      // Load progress from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('questionset_')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              if (typeof parsedValue === 'number') {
                savedProgress[key.replace('questionset_', '')] = parsedValue;
              }
            }
          } catch (error) {
            console.error(`Error parsing progress for ${key}:`, error);
          }
        }
      }
      
      setUserProgress(savedProgress);
    };

    const predefinedQuestionSets: QuestionSet[] = [
      // Sets 1-5
      {
        id: "1",
        title: "קבוצת שאלות 1",
        description: "שאלות 1-50 - הכנה בסיסית לבחינה",
        questionsCount: 50,
        difficulty: "easy",
        estimatedTime: 90,
        completionRate: userProgress["1"] || 0,
        tags: ["בסיסי", "התחלה", "יסודות"],
        icon: <BookOpen className="h-4 w-4" />,
        color: "bg-green-500",
      },
      {
        id: "2",
        title: "קבוצת שאלות 2",
        description: "שאלות 51-100 - המשך הכנה למבחן",
        questionsCount: 50,
        difficulty: "easy",
        estimatedTime: 90,
        completionRate: userProgress["2"] || 0,
        tags: ["בסיסי", "המשך", "תרגול"],
        icon: <BookOpen className="h-4 w-4" />,
        color: "bg-green-500",
      },
      {
        id: "3",
        title: "קבוצת שאלות 3",
        description: "שאלות 101-150 - חיזוק בסיס הידע",
        questionsCount: 50,
        difficulty: "medium",
        estimatedTime: 100,
        completionRate: userProgress["3"] || 0,
        tags: ["בינוני", "חיזוק", "פיתוח"],
        icon: <Target className="h-4 w-4" />,
        color: "bg-blue-500",
      },
      {
        id: "4",
        title: "קבוצת שאלות 4",
        description: "שאלות 151-200 - הרחבת הידע",
        questionsCount: 50,
        difficulty: "medium",
        estimatedTime: 100,
        completionRate: userProgress["4"] || 0,
        tags: ["בינוני", "הרחבה", "העמקה"],
        icon: <Target className="h-4 w-4" />,
        color: "bg-blue-500",
      },
      {
        id: "5",
        title: "קבוצת שאלות 5",
        description: "שאלות 201-250 - התקדמות לרמה גבוהה",
        questionsCount: 50,
        difficulty: "medium",
        estimatedTime: 110,
        completionRate: userProgress["5"] || 0,
        tags: ["בינוני", "התקדמות", "אתגר"],
        icon: <Target className="h-4 w-4" />,
        color: "bg-blue-500",
      },
      
      // Sets 6-10
      {
        id: "6",
        title: "קבוצת שאלות 6",
        description: "שאלות 251-300 - שאלות מורכבות יותר",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 120,
        completionRate: userProgress["6"] || 0,
        tags: ["מתקדם", "מורכב", "אתגר"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
      {
        id: "7",
        title: "קבוצת שאלות 7",
        description: "שאלות 301-350 - רמה מתקדמת",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 120,
        completionRate: userProgress["7"] || 0,
        tags: ["מתקדם", "מקצועי", "מיומנות"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
      {
        id: "8",
        title: "קבוצת שאלות 8",
        description: "שאלות 351-400 - שליטה מלאה",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 130,
        completionRate: userProgress["8"] || 0,
        tags: ["מתקדם", "שליטה", "מומחיות"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
      {
        id: "9",
        title: "קבוצת שאלות 9",
        description: "שאלות 401-450 - אתגרים מיוחדים",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 130,
        completionRate: userProgress["9"] || 0,
        tags: ["מתקדם", "אתגר", "מיוחד"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
      {
        id: "10",
        title: "קבוצת שאלות 10",
        description: "שאלות 451-500 - שיא הקושי",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 140,
        completionRate: userProgress["10"] || 0,
        tags: ["מתקדם", "שיא", "מאסטר"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
      
      // Sets 11-15
      {
        id: "11",
        title: "קבוצת שאלות 11",
        description: "שאלות 501-550 - רמת מומחיות",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 140,
        completionRate: userProgress["11"] || 0,
        tags: ["מומחיות", "גבוה", "פרו"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-purple-500",
      },
      {
        id: "12",
        title: "קבוצת שאלות 12",
        description: "שאלות 551-600 - שליטה מתקדמת",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 150,
        completionRate: userProgress["12"] || 0,
        tags: ["מומחיות", "שליטה", "מתקדם"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-purple-500",
      },
      {
        id: "13",
        title: "קבוצת שאלות 13",
        description: "שאלות 601-650 - רמה אקדמית",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 150,
        completionRate: userProgress["13"] || 0,
        tags: ["אקדמי", "מחקר", "עליון"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-purple-500",
      },
      {
        id: "14",
        title: "קבוצת שאלות 14",
        description: "שאלות 651-700 - ברמה הגבוהה ביותר",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 160,
        completionRate: userProgress["14"] || 0,
        tags: ["עליון", "מקסימום", "גבוה"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-purple-500",
      },
      {
        id: "15",
        title: "קבוצת שאלות 15",
        description: "שאלות 701-750 - רמת אמן",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 160,
        completionRate: userProgress["15"] || 0,
        tags: ["אמן", "מקצועי", "שיא"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-purple-500",
      },
      
      // Sets 16-20
      {
        id: "16",
        title: "קבוצת שאלות 16",
        description: "שאלות 751-800 - האתגר הגדול",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 170,
        completionRate: userProgress["16"] || 0,
        tags: ["אתגר", "גדול", "קיצוני"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-orange-500",
      },
      {
        id: "17",
        title: "קבוצת שאלות 17",
        description: "שאלות 801-850 - שאלות מיוחדות",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 170,
        completionRate: userProgress["17"] || 0,
        tags: ["מיוחד", "נדיר", "אקסקלוסיבי"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-orange-500",
      },
      {
        id: "18",
        title: "קבוצת שאלות 18",
        description: "שאלות 851-900 - ברמה הגבוהה ביותר",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 180,
        completionRate: userProgress["18"] || 0,
        tags: ["עליון", "מקסימום", "אולטרה"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-orange-500",
      },
      {
        id: "19",
        title: "קבוצת שאלות 19",
        description: "שאלות 901-950 - רמת גרנד מאסטר",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 180,
        completionRate: userProgress["19"] || 0,
        tags: ["מאסטר", "גרנד", "אליט"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-yellow-600",
      },
      {
        id: "20",
        title: "קבוצת שאלות 20",
        description: "שאלות 951-1000 - השלמת המסע",
        questionsCount: 50,
        difficulty: "hard",
        estimatedTime: 200,
        completionRate: userProgress["20"] || 0,
        tags: ["השלמה", "מסע", "סיום"],
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-yellow-600",
      }
    ];

    setQuestionSets(predefinedQuestionSets);
    loadProgress();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 bg-electric-gray/50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-electric-navy mb-2">
              קבוצות שאלות - 1000 שאלות בסך הכל
            </h1>
            <p className="text-electric-slate">
              20 קבוצות של 50 שאלות כל אחת - מבסיסי ועד מתקדם
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionSets.map((set) => (
              <Card key={set.id} className="bg-white shadow-sm">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    {set.icon}
                    <CardTitle className="text-lg font-semibold">
                      {set.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pl-4">
                  <CardDescription className="text-sm text-gray-500">
                    {set.description}
                  </CardDescription>
                  <div className="flex items-center mt-4">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 rounded-full px-2 py-1 text-xs font-medium mr-2">
                      <BookOpen className="h-3 w-3 ml-1" />
                      {set.questionsCount} שאלות
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-300 rounded-full px-2 py-1 text-xs font-medium mr-2">
                      <Clock className="h-3 w-3 ml-1" />
                      {set.estimatedTime} דקות
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="mb-1 text-sm font-semibold text-gray-700">
                      התקדמות:
                    </h4>
                    <Progress value={set.completionRate} />
                    <p className="text-xs text-gray-500 mt-1">
                      {set.completionRate}% השלמה
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/questions-set/${set.id}/intro`)}
                    className="w-full mt-4"
                  >
                    התחל תרגול <ArrowRight className="h-4 w-4 mr-2" />
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

export default QuestionsSets;
