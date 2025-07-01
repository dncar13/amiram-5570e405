import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Clock, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

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

    const predefinedPracticeSets: PracticeSet[] = [
      {
        id: "reading-comprehension",
        title: "הבנת הנקרא",
        description: "תרגול ממוקד בטקסטים ושאלות הבנת הנקרא",
        questionsCount: 50,
        difficulty: "medium",
        estimatedTime: 45,
        completionRate: userProgress["reading-comprehension"] || 0,
        tags: ["הבנת הנקרא", "טקסטים", "ניתוח"],
        icon: <BookOpen className="h-4 w-4" />,
        color: "bg-blue-500",
      },
      {
        id: "vocabulary",
        title: "אוצר מילים",
        description: "הרחבת אוצר המילים ושיפור הבנת הניבים והביטויים",
        questionsCount: 40,
        difficulty: "medium",
        estimatedTime: 30,
        completionRate: userProgress["vocabulary"] || 0,
        tags: ["מילים", "ביטויים", "ניבים"],
        icon: <Target className="h-4 w-4" />,
        color: "bg-green-500",
      },
      {
        id: "time-management",
        title: "ניהול זמן",
        description: "שיפור יכולת עמידה בזמנים במבחן",
        questionsCount: 30,
        difficulty: "hard",
        estimatedTime: 60,
        completionRate: userProgress["time-management"] || 0,
        tags: ["זמן", "אסטרטגיה", "יעילות"],
        icon: <Clock className="h-4 w-4" />,
        color: "bg-yellow-500",
      },
      {
        id: "speed-reading",
        title: "קריאה מהירה",
        description: "שיפור מהירות הקריאה והבנת הנקרא",
        questionsCount: 60,
        difficulty: "hard",
        estimatedTime: 45,
        completionRate: userProgress["speed-reading"] || 0,
        tags: ["קריאה", "מהירות", "ריכוז"],
        icon: <Zap className="h-4 w-4" />,
        color: "bg-red-500",
      },
    ];

    setPracticeSets(predefinedPracticeSets);
    loadProgress();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 bg-electric-gray/50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-electric-navy mb-2">
              ערכות תרגול מומלצות
            </h1>
            <p className="text-electric-slate">
              התחל לתרגל עם ערכות מובנות לשיפור מיומנויות ספציפיות
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceSets.map((set) => (
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
                    onClick={() => navigate(`/simulation/${set.id}`)}
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

export default PracticeSets;
