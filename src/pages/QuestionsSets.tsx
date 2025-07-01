import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Clock, Target, Star, TrendingUp, BarChart } from "lucide-react";
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
  totalSets?: number;
}

const QuestionsSets = () => {
  const navigate = useNavigate();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const predefinedQuestionSets: QuestionSet[] = [
    {
      id: "qs_1",
      title: "סט שאלות 1",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_2",
      title: "סט שאלות 2",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_3",
      title: "סט שאלות 3",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_4",
      title: "סט שאלות 4",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_5",
      title: "סט שאלות 5",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_6",
      title: "סט שאלות 6",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_7",
      title: "סט שאלות 7",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_8",
      title: "סט שאלות 8",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_9",
      title: "סט שאלות 9",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_10",
      title: "סט שאלות 10",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_11",
      title: "סט שאלות 11",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_12",
      title: "סט שאלות 12",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_13",
      title: "סט שאלות 13",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_14",
      title: "סט שאלות 14",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_15",
      title: "סט שאלות 15",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_16",
      title: "סט שאלות 16",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_17",
      title: "סט שאלות 17",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_18",
      title: "סט שאלות 18",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_19",
      title: "סט שאלות 19",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
    {
      id: "qs_20",
      title: "סט שאלות 20",
      description: "קבוצת שאלות בנושאים שונים",
      questionsCount: 50,
      difficulty: "medium",
      estimatedTime: 45,
      completionRate: 75,
      tags: ["general", "practice"],
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-blue-500",
      totalSets: 20,
    },
  ];

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

    const setPredefinedQuestionSets = () => {
      setQuestionSets(predefinedQuestionSets);
    };
    
    loadProgress();
    setPredefinedQuestionSets();
  }, [predefinedQuestionSets]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6 bg-electric-gray/50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-electric-navy mb-2">קבוצות שאלות</h1>
            <p className="text-electric-slate">
              בחרו קבוצת שאלות לתרגול
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionSets.map((set) => (
              <Card key={set.id} className="bg-white shadow-sm rounded-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {set.title}
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs text-gray-500">
                    {set.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 py-4">
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 ml-1" />
                      <span>{set.questionsCount} שאלות</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 ml-1" />
                      <span>{set.estimatedTime} דקות</span>
                    </div>
                    {set.totalSets && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 ml-1" />
                        <span>{set.totalSets} סטים</span>
                      </div>
                    )}
                  </div>
                  <Progress value={set.completionRate} className="h-2 rounded-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>התקדמות</span>
                    <span>{set.completionRate}%</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 justify-start"
                    onClick={() => navigate(`/simulation/qs/${set.id.replace('qs_', '')}`)}
                  >
                    התחל תרגול
                    <ArrowRight className="h-4 w-4 mr-2" />
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
