import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  ChevronRight,
  CheckCircle2,
  Circle,
  Star,
  Clock,
  Filter,
  BookOpen,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface GrammarTopic {
  id: string;
  topic: string;
  hebrewTitle: string;
  example: string;
  path: string;
  level: "basic" | "intermediate" | "advanced";
  estimatedTime: number;
  isCompleted?: boolean;
  isRecommended?: boolean;
  order: number;
}

const grammarTopics: GrammarTopic[] = [
  { id: "present-simple", topic: "Present Simple", hebrewTitle: "הווה פשוט", example: "She walks to school", path: "/articles/present-simple", level: "basic", estimatedTime: 15, order: 1 },
  { id: "past-simple", topic: "Past Simple", hebrewTitle: "עבר פשוט", example: "He went home", path: "/articles/past-simple", level: "basic", estimatedTime: 15, order: 2 },
  { id: "future", topic: "Future (Will/Going to)", hebrewTitle: "זמן עתיד", example: "We will start soon", path: "/articles/future", level: "basic", estimatedTime: 15, order: 3 },
  { id: "present-progressive", topic: "Present Progressive", hebrewTitle: "הווה ממושך", example: "They are studying now", path: "/articles/present-progressive", level: "basic", estimatedTime: 15, order: 4 },
  { id: "articles", topic: "Articles (A/An/The)", hebrewTitle: "תווי היידוע", example: "The apple, a cat, an hour", path: "/articles/articles", level: "basic", estimatedTime: 15, order: 5 },
  { id: "question-forms", topic: "Question Forms", hebrewTitle: "משפטי שאלה", example: "Where do you live?", path: "/articles/question-forms", level: "basic", estimatedTime: 15, order: 6 },
  { id: "negatives", topic: "Negatives", hebrewTitle: "שלילה", example: "She does not know", path: "/articles/negatives", level: "basic", estimatedTime: 10, order: 7 },
  { id: "present-perfect", topic: "Present Perfect", hebrewTitle: "הווה מושלם", example: "I have finished my work", path: "/articles/present-perfect", level: "intermediate", estimatedTime: 20, order: 8, isRecommended: true },
  { id: "past-perfect", topic: "Past Perfect", hebrewTitle: "עבר מושלם", example: "She had left before I arrived", path: "/articles/past-perfect", level: "intermediate", estimatedTime: 20, order: 9 },
  { id: "passive-voice", topic: "Passive Voice", hebrewTitle: "סביל", example: "The book was written in 2020", path: "/articles/passive-voice", level: "intermediate", estimatedTime: 25, order: 10, isRecommended: true },
  { id: "relative-clauses", topic: "Relative Clauses", hebrewTitle: "משפטי זיקה", example: "The man who called is my friend", path: "/articles/relative-clauses", level: "intermediate", estimatedTime: 20, order: 11 },
  { id: "modal-verbs", topic: "Modal Verbs", hebrewTitle: "פעלים מודאליים", example: "She should study harder", path: "/articles/modal-verbs", level: "intermediate", estimatedTime: 20, order: 12 },
  { id: "comparatives-superlatives", topic: "Comparatives & Superlatives", hebrewTitle: "השוואות", example: "bigger / the biggest", path: "/articles/comparatives-superlatives", level: "intermediate", estimatedTime: 20, order: 13 },
  { id: "prepositions", topic: "Prepositions", hebrewTitle: "מילות יחס", example: "in, on, at, by", path: "/articles/prepositions", level: "intermediate", estimatedTime: 20, order: 14 },
  { id: "adjectives-adverbs", topic: "Adjectives & Adverbs", hebrewTitle: "תארים ותארי פועל", example: "He runs quickly", path: "/articles/adjectives-adverbs", level: "intermediate", estimatedTime: 15, order: 15 },
  { id: "countable-uncountable", topic: "Countable & Uncountable", hebrewTitle: "ספירים ולא ספירים", example: "many apples / much water", path: "/articles/countable-uncountable", level: "intermediate", estimatedTime: 15, order: 16 },
  { id: "subject-verb-agreement", topic: "Subject-Verb Agreement", hebrewTitle: "התאמת נושא-נשוא", example: "He likes / They like", path: "/articles/subject-verb-agreement", level: "intermediate", estimatedTime: 15, order: 17 },
  { id: "word-order", topic: "Word Order", hebrewTitle: "סדר מילים", example: "She always eats breakfast", path: "/articles/word-order", level: "intermediate", estimatedTime: 15, order: 18 },
  { id: "conditionals", topic: "Conditionals – If Sentences", hebrewTitle: "משפטי תנאי", example: "If I had known, I would have come", path: "/articles/conditionals", level: "advanced", estimatedTime: 25, order: 19, isRecommended: true },
  { id: "gerunds-infinitives", topic: "Gerunds & Infinitives", hebrewTitle: "שמות פועל", example: "I enjoy reading / I want to eat", path: "/articles/gerunds-infinitives", level: "advanced", estimatedTime: 25, order: 20 },
  { id: "reported-speech", topic: "Reported Speech", hebrewTitle: "דיבור עקיף", example: "He said that he was tired", path: "/articles/reported-speech", level: "advanced", estimatedTime: 25, order: 21 }
];

// Simulate completed topics (in real app, this would come from localStorage or API)
const completedTopics = ["present-simple", "past-simple", "articles"];
const topicsWithCompletion = grammarTopics.map(topic => ({
  ...topic,
  isCompleted: completedTopics.includes(topic.id)
}));

const levelInfo = {
  basic: { label: "בסיסי", color: "bg-green-100 text-green-700", bgColor: "bg-green-50" },
  intermediate: { label: "בינוני", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-50" },
  advanced: { label: "מתקדם", color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-50" }
};

const Articles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const filteredTopics = useMemo(() => {
    return topicsWithCompletion.filter(topic => {
      const matchesSearch = topic.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.hebrewTitle.includes(searchTerm) ||
                          topic.example.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "all" || topic.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, selectedLevel]);

  const stats = {
    totalTopics: grammarTopics.length,
    completedTopics: topicsWithCompletion.filter(t => t.isCompleted).length,
    totalHours: Math.round(grammarTopics.reduce((acc, topic) => acc + topic.estimatedTime, 0) / 60),
    progressPercentage: Math.round((topicsWithCompletion.filter(t => t.isCompleted).length / grammarTopics.length) * 100)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - Minimal and Clean */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            מרכז לימוד דקדוק לאמירם
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            בחר חוק ותתחיל ללמוד לפי הרמה שלך. כל הסבר קצר, פשוט, עם דוגמאות אמיתיות מהמבחן.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.completedTopics}/{stats.totalTopics}</div>
                <div className="text-sm text-gray-600">נושאים הושלמו</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.progressPercentage}%</div>
                <div className="text-sm text-gray-600">התקדמות כללית</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.totalHours}h</div>
                <div className="text-sm text-gray-600">זמן לימוד משוער</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">מומלץ ללמוד</div>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={stats.progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Path Diagram */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              מסלול למידה מומלץ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Learning Path Diagram - Coming Soon
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div className="text-sm text-blue-800">
              <strong>טיפ:</strong> התחל מהנושאים הבסיסיים ועבור בהדרגה למתקדמים. 
              נושאים מסומנים בכוכב (<Star className="h-4 w-4 inline text-yellow-500 fill-yellow-500" />) מומלצים במיוחד להתקדמות אופטימלית.
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="חפש נושא, דוגמה או מילת מפתח..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === "all" ? "default" : "outline"}
              onClick={() => setSelectedLevel("all")}
              className={selectedLevel === "all" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300"}
            >
              הכל ({grammarTopics.length})
            </Button>
            <Button
              variant={selectedLevel === "basic" ? "default" : "outline"}
              onClick={() => setSelectedLevel("basic")}
              className={selectedLevel === "basic" ? "bg-green-600 hover:bg-green-700" : "border-gray-300"}
            >
              בסיסי ({grammarTopics.filter(t => t.level === "basic").length})
            </Button>
            <Button
              variant={selectedLevel === "intermediate" ? "default" : "outline"}
              onClick={() => setSelectedLevel("intermediate")}
              className={selectedLevel === "intermediate" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"}
            >
              בינוני ({grammarTopics.filter(t => t.level === "intermediate").length})
            </Button>
            <Button
              variant={selectedLevel === "advanced" ? "default" : "outline"}
              onClick={() => setSelectedLevel("advanced")}
              className={selectedLevel === "advanced" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-300"}
            >
              מתקדם ({grammarTopics.filter(t => t.level === "advanced").length})
            </Button>
          </div>
        </div>

        {/* Grammar Topics Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">רמה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">נושא</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">דוגמה</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">זמן</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">פעולה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTopics.map((topic) => (
                  <tr 
                    key={topic.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      topic.isCompleted ? 'bg-green-50/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {topic.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : topic.isRecommended ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${levelInfo[topic.level].color} border-0`}>
                        {levelInfo[topic.level].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{topic.topic}</div>
                        <div className="text-sm text-gray-500">{topic.hebrewTitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 italic">"{topic.example}"</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {topic.estimatedTime}'
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link to={topic.path}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 text-gray-700"
                        >
                          {topic.isCompleted ? 'עבור שוב' : 'להסבר'}
                          <ChevronRight className="h-4 w-4 mr-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>הושלם</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>מומלץ ללמוד</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-300" />
              <span>טרם נלמד</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * זמני הלימוד משוערים וכוללים קריאת החומר ותרגול בסיסי
          </p>
        </div>

        {/* Statistics */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">סטטיסטיקה אישית</h3>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300">
                איפוס התקדמות
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.completedTopics}</div>
                <div className="text-sm text-gray-600">נושאים שנלמדו</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.completedTopics * 17)}m
                </div>
                <div className="text-sm text-gray-600">זמן למידה</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {21 - stats.completedTopics}
                </div>
                <div className="text-sm text-gray-600">נותרו ללמוד</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.progressPercentage}%
                </div>
                <div className="text-sm text-gray-600">התקדמות</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            סיימת ללמוד? עבור לתרגול בסימולציות המבחן
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/simulations-entry">
              עבור לסימולציות
              <ChevronRight className="h-5 w-5 mr-2" />
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;