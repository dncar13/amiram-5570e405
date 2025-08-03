import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  BookOpen, 
  Home, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Brain,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  FileText,
  MessageSquare
} from "lucide-react";

interface ArticleSection {
  title: string;
  content: string | JSX.Element;
  examples?: { text: string; translation?: string }[];
  tips?: string[];
}

interface Practice {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ArticleData {
  id: string;
  title: string;
  hebrewTitle: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  examFrequency: "high" | "medium" | "low";
  introduction: string;
  sections: ArticleSection[];
  commonMistakes: string[];
  examTips: string[];
  practice: Practice[];
  relatedTopics: { id: string; title: string }[];
}

const articleData: Record<string, ArticleData> = {
  "present-perfect": {
    id: "present-perfect",
    title: "Present Perfect",
    hebrewTitle: "הווה מושלם",
    description: "למד את זמן Present Perfect - החיבור בין העבר להווה",
    difficulty: 3,
    estimatedTime: 20,
    examFrequency: "high",
    introduction: "Present Perfect הוא אחד הזמנים החשובים והנפוצים במבחן אמירם. הוא מתאר פעולה שהתחילה בעבר ויש לה קשר או השפעה על ההווה.",
    sections: [
      {
        title: "מבנה הזמן",
        content: (
          <div>
            <p className="mb-4 text-lg">הנוסחה הבסיסית:</p>
            <div className="bg-blue-50 p-4 rounded-lg font-mono text-lg text-center mb-4">
              Subject + have/has + Past Participle (V3)
            </div>
            <ul className="space-y-2">
              <li><strong>I/You/We/They</strong> → have + V3</li>
              <li><strong>He/She/It</strong> → has + V3</li>
            </ul>
          </div>
        ),
        examples: [
          { text: "I have finished my homework", translation: "סיימתי את שיעורי הבית (והם מוכנים עכשיו)" },
          { text: "She has lived here for 5 years", translation: "היא גרה כאן כבר 5 שנים (ועדיין גרה)" },
          { text: "They have already eaten", translation: "הם כבר אכלו (ולכן לא רעבים)" }
        ]
      },
      {
        title: "מתי משתמשים ב-Present Perfect?",
        content: "יש 4 שימושים עיקריים לזמן זה:",
        examples: [
          { text: "פעולה שהסתיימה אבל התוצאה רלוונטית עכשיו", translation: "I have lost my keys (אין לי מפתחות עכשיו)" },
          { text: "חוויות חיים", translation: "Have you ever been to Paris? (האם היית אי פעם בפריז?)" },
          { text: "פעולה שהתחילה בעבר ונמשכת להווה", translation: "I have known him since 2010 (אני מכיר אותו מ-2010)" },
          { text: "פעולה שקרתה זה עתה", translation: "She has just arrived (היא הרגע הגיעה)" }
        ],
        tips: [
          "שימו לב למילות מפתח: already, just, yet, ever, never, since, for",
          "עם since - נקודת זמן מדויקת (since Monday)",
          "עם for - משך זמן (for two hours)"
        ]
      },
      {
        title: "שלילה ושאלה",
        content: (
          <div>
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">שלילה:</h4>
              <div className="bg-red-50 p-4 rounded-lg font-mono">
                Subject + have/has + not + Past Participle
              </div>
              <p className="mt-2">דוגמה: I have not (haven't) seen this movie</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">שאלה:</h4>
              <div className="bg-green-50 p-4 rounded-lg font-mono">
                Have/Has + Subject + Past Participle?
              </div>
              <p className="mt-2">דוגמה: Have you finished your work?</p>
            </div>
          </div>
        )
      }
    ],
    commonMistakes: [
      "בלבול עם Past Simple - אם יש זמן מדויק בעבר, תמיד Past Simple!",
      "שימוש ב-have במקום has עם גוף שלישי יחיד",
      "שכחת הפועל העיקרי בצורת V3",
      "שימוש לא נכון של since ו-for"
    ],
    examTips: [
      "חפשו מילות מפתח כמו: already, just, yet, ever, never",
      "אם רואים since או for - כנראה Present Perfect",
      "בדקו אם הפעולה רלוונטית להווה",
      "זכרו: עם yesterday, last week וכו' - תמיד Past Simple!"
    ],
    practice: [
      {
        question: "I _____ (never/visit) Japan before.",
        options: ["never visited", "have never visited", "never have visited", "had never visited"],
        correct: 1,
        explanation: "עם 'never' משתמשים ב-Present Perfect. הסדר הנכון: have + never + V3"
      },
      {
        question: "She _____ here since 2019.",
        options: ["lives", "lived", "has lived", "is living"],
        correct: 2,
        explanation: "since + נקודת זמן = Present Perfect. הפעולה התחילה ב-2019 ונמשכת עד היום"
      },
      {
        question: "_____ you _____ the new movie yet?",
        options: ["Did...see", "Have...seen", "Do...see", "Are...seeing"],
        correct: 1,
        explanation: "yet בסוף שאלה = Present Perfect. המבנה: Have + subject + V3"
      }
    ],
    relatedTopics: [
      { id: "past-simple", title: "Past Simple - ההבדלים החשובים" },
      { id: "present-perfect-continuous", title: "Present Perfect Continuous" },
      { id: "past-perfect", title: "Past Perfect" }
    ]
  },
  "passive-voice": {
    id: "passive-voice",
    title: "Passive Voice",
    hebrewTitle: "סביל",
    description: "למד איך לבנות ולזהות משפטים בסביל - נושא חשוב במבחן אמירם",
    difficulty: 3,
    estimatedTime: 25,
    examFrequency: "high",
    introduction: "סביל (Passive Voice) הוא אחד הנושאים החשובים ביותר במבחן אמירם. בסביל, הפעולה חשובה יותר מהעושה, או שהעושה לא ידוע/לא חשוב.",
    sections: [
      {
        title: "מבנה בסיסי של סביל",
        content: (
          <div>
            <p className="mb-4 text-lg">הנוסחה הבסיסית:</p>
            <div className="bg-purple-50 p-4 rounded-lg font-mono text-lg text-center mb-4">
              Subject + be + Past Participle (V3) + (by + agent)
            </div>
            <p className="mb-4">הפועל be משתנה לפי הזמן:</p>
            <ul className="space-y-2">
              <li><strong>Present Simple:</strong> am/is/are + V3</li>
              <li><strong>Past Simple:</strong> was/were + V3</li>
              <li><strong>Future:</strong> will be + V3</li>
              <li><strong>Present Perfect:</strong> have/has been + V3</li>
            </ul>
          </div>
        ),
        examples: [
          { text: "The book is written by a famous author", translation: "הספר נכתב על ידי סופר מפורסם" },
          { text: "The cake was eaten", translation: "העוגה נאכלה (לא חשוב מי אכל)" },
          { text: "The project will be completed tomorrow", translation: "הפרויקט יושלם מחר" }
        ]
      },
      {
        title: "מתי משתמשים בסביל?",
        content: "יש 4 מצבים עיקריים:",
        examples: [
          { text: "כשהפעולה חשובה מהעושה", translation: "The pyramids were built 4,500 years ago" },
          { text: "כשלא יודעים מי העושה", translation: "My bike was stolen (לא יודע מי גנב)" },
          { text: "כשברור מי העושה", translation: "The thief was arrested (ברור שהמשטרה עצרה)" },
          { text: "בכתיבה פורמלית/מדעית", translation: "The experiment was conducted carefully" }
        ],
        tips: [
          "רוב המשפטים בסביל לא כוללים 'by + agent'",
          "אם העושה לא חשוב או ברור מההקשר - אל תוסיפו אותו",
          "במבחן אמירם אוהבים לשאול על המרה מפעיל לסביל ולהפך"
        ]
      },
      {
        title: "סביל בזמנים שונים",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold">Present Simple Passive:</h4>
              <p>Coffee is grown in Brazil</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold">Past Simple Passive:</h4>
              <p>The letter was sent yesterday</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold">Present Perfect Passive:</h4>
              <p>The work has been finished</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold">Modal Passive:</h4>
              <p>The report must be submitted today</p>
            </div>
          </div>
        )
      }
    ],
    commonMistakes: [
      "שכחת הפועל be - תמיד חייב להיות!",
      "שימוש ב-V2 במקום V3",
      "הוספת by + agent כשזה לא נחוץ",
      "בלבול בין זמנים - הקפידו על התאמת be לזמן"
    ],
    examTips: [
      "חפשו את הפועל be + V3 - זה סימן לסביל",
      "בהמרה מפעיל לסביל: המושא הופך לנושא",
      "שימו לב לזמן המשפט המקורי - הוא נשאר אותו דבר בסביל",
      "במבחן: אם יש אפשרות עם be + V3, בדקו אותה ראשונה"
    ],
    practice: [
      {
        question: "The homework _____ by all students yesterday.",
        options: ["completed", "was completed", "has completed", "is completed"],
        correct: 1,
        explanation: "yesterday = Past Simple. בסביל: was/were + V3"
      },
      {
        question: "English _____ in many countries.",
        options: ["speaks", "is speaking", "is spoken", "has spoken"],
        correct: 2,
        explanation: "עובדה כללית = Present Simple Passive: is/are + V3"
      },
      {
        question: "The new hospital _____ next year.",
        options: ["will build", "will be built", "is built", "builds"],
        correct: 1,
        explanation: "next year = Future. בסביל: will be + V3"
      }
    ],
    relatedTopics: [
      { id: "active-vs-passive", title: "המרה בין פעיל לסביל" },
      { id: "passive-modals", title: "סביל עם פעלים מודאליים" },
      { id: "passive-questions", title: "שאלות בסביל" }
    ]
  },
  "conditionals": {
    id: "conditionals",
    title: "Conditionals – If Sentences",
    hebrewTitle: "משפטי תנאי",
    description: "למד את כל סוגי משפטי התנאי - מהבסיסיים ועד המתקדמים",
    difficulty: 4,
    estimatedTime: 25,
    examFrequency: "high",
    introduction: "משפטי תנאי (Conditionals) הם מהנושאים המורכבים והחשובים ביותר במבחן אמירם. יש 4 סוגים עיקריים + וריאציות מיוחדות.",
    sections: [
      {
        title: "Zero Conditional - תנאי אפס",
        content: (
          <div>
            <p className="mb-4">מתאר עובדות כלליות ואמיתות מדעיות:</p>
            <div className="bg-green-50 p-4 rounded-lg font-mono text-center mb-4">
              If + Present Simple, Present Simple
            </div>
          </div>
        ),
        examples: [
          { text: "If you heat water to 100°C, it boils", translation: "אם מחממים מים ל-100°C, הם רותחים" },
          { text: "If I don't sleep enough, I feel tired", translation: "אם אני לא ישן מספיק, אני מרגיש עייף" }
        ]
      },
      {
        title: "First Conditional - תנאי ראשון",
        content: (
          <div>
            <p className="mb-4">מתאר מצבים אפשריים בעתיד:</p>
            <div className="bg-blue-50 p-4 rounded-lg font-mono text-center mb-4">
              If + Present Simple, will + V1
            </div>
          </div>
        ),
        examples: [
          { text: "If it rains tomorrow, we will stay home", translation: "אם ירד גשם מחר, נישאר בבית" },
          { text: "If you study hard, you will pass the exam", translation: "אם תלמד קשה, תעבור את המבחן" }
        ],
        tips: [
          "אחרי if לעולם לא will! (לא: If it will rain)",
          "אפשר להשתמש גם ב-might, may, can במקום will"
        ]
      },
      {
        title: "Second Conditional - תנאי שני",
        content: (
          <div>
            <p className="mb-4">מתאר מצבים דמיוניים או לא סבירים בהווה/עתיד:</p>
            <div className="bg-purple-50 p-4 rounded-lg font-mono text-center mb-4">
              If + Past Simple, would + V1
            </div>
          </div>
        ),
        examples: [
          { text: "If I had a million dollars, I would travel the world", translation: "אם היה לי מיליון דולר, הייתי מטייל בעולם" },
          { text: "If I were you, I would accept the offer", translation: "אם הייתי אתה, הייתי מקבל את ההצעה" }
        ],
        tips: [
          "עם I/he/she/it אפשר להשתמש ב-were במקום was (יותר פורמלי)",
          "would יכול להתחלף ב-could, might"
        ]
      },
      {
        title: "Third Conditional - תנאי שלישי",
        content: (
          <div>
            <p className="mb-4">מתאר מצבים דמיוניים בעבר (מה היה קורה אם...):</p>
            <div className="bg-red-50 p-4 rounded-lg font-mono text-center mb-4">
              If + Past Perfect, would have + V3
            </div>
          </div>
        ),
        examples: [
          { text: "If I had studied harder, I would have passed", translation: "אם הייתי לומד יותר קשה, הייתי עובר" },
          { text: "If she had left earlier, she wouldn't have missed the train", translation: "אם היא הייתה יוצאת מוקדם יותר, היא לא הייתה מפספסת את הרכבת" }
        ]
      }
    ],
    commonMistakes: [
      "שימוש ב-will אחרי if בתנאי ראשון",
      "בלבול בין הזמנים בסוגי התנאי השונים",
      "שכחת had בתנאי שלישי",
      "שימוש ב-would בשני חלקי המשפט"
    ],
    examTips: [
      "זהו את סוג התנאי לפי הזמנים והמשמעות",
      "שימו לב למילים כמו: unless (=if not), provided that, as long as",
      "Mixed conditionals - ערבוב בין סוגי תנאי (מתקדם)",
      "Inversion - החלפת סדר במקום if (Had I known = If I had known)"
    ],
    practice: [
      {
        question: "If I _____ you, I would take the job.",
        options: ["am", "was", "were", "will be"],
        correct: 2,
        explanation: "Second Conditional - מצב דמיוני. were הוא הצורה הנכונה (גם עם I)"
      },
      {
        question: "If she _____ harder, she would have succeeded.",
        options: ["worked", "had worked", "works", "would work"],
        correct: 1,
        explanation: "Third Conditional - עבר דמיוני. צריך Past Perfect: had + V3"
      },
      {
        question: "If it _____ tomorrow, we'll cancel the picnic.",
        options: ["will rain", "rains", "rained", "rain"],
        correct: 1,
        explanation: "First Conditional - עתיד אפשרי. אחרי if משתמשים ב-Present Simple, לא ב-will"
      }
    ],
    relatedTopics: [
      { id: "mixed-conditionals", title: "Mixed Conditionals" },
      { id: "inversion", title: "Inversion במשפטי תנאי" },
      { id: "wish-if-only", title: "Wish ו-If only" }
    ]
  }
};

const ArticleTemplate: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [currentPractice, setCurrentPractice] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const article = articleId ? articleData[articleId] : null;

  // Simulate reading progress
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentPractice] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const getScore = () => {
    if (!article) return 0;
    return userAnswers.reduce((score, answer, index) => {
      return answer === article.practice[index].correct ? score + 1 : score;
    }, 0);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-800 mb-4">הנושא לא נמצא</h1>
              <p className="text-slate-600 mb-6">
                הנושא המבוקש עדיין לא זמין במערכת.
              </p>
              <Button asChild>
                <Link to="/articles">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  חזרה לכל הנושאים
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white shadow-sm">
        <Progress value={progress} className="h-1" />
      </div>
      
      <main className="container mx-auto px-4 py-8 mt-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="flex items-center hover:text-[#0056B3] transition-colors">
              <Home className="h-4 w-4 mr-1" />
              בית
            </Link>
            <ChevronRight className="h-4 w-4 transform rotate-180" />
            <Link to="/articles" className="hover:text-[#0056B3] transition-colors">
              נושאי דקדוק
            </Link>
            <ChevronRight className="h-4 w-4 transform rotate-180" />
            <span className="text-slate-800 font-medium">{article.hebrewTitle}</span>
          </div>
        </nav>

        {/* Article Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-[#0056B3] p-6 rounded-3xl shadow-2xl">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
            {article.title}
          </h1>
          <h2 className="text-2xl text-slate-600 mb-4">{article.hebrewTitle}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
            {article.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="px-4 py-2 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {article.estimatedTime} דקות
            </Badge>
            <Badge className={`px-4 py-2 text-sm ${
              article.examFrequency === 'high' ? 'bg-red-100 text-red-800' : 
              article.examFrequency === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              תדירות במבחן: {
                article.examFrequency === 'high' ? 'גבוהה' :
                article.examFrequency === 'medium' ? 'בינונית' : 'נמוכה'
              }
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              רמת קושי: {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 inline ${i < article.difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </Badge>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#0056B3] to-[#4B2E80] text-white">
            <CardTitle className="text-2xl flex items-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              הקדמה
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              {article.introduction}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Sections */}
        {article.sections.map((section, index) => (
          <Card key={index} className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#0056B3] flex items-center">
                <Target className="h-6 w-6 mr-2" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {typeof section.content === 'string' ? (
                  <p className="text-lg text-slate-700 mb-4">{section.content}</p>
                ) : section.content}
                
                {section.examples && section.examples.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {section.examples.map((example, i) => (
                      <div key={i} className="bg-[#F7F9FC] p-4 rounded-lg border-r-4 border-[#0056B3]">
                        <p className="text-lg font-medium text-slate-800">
                          {example.text}
                        </p>
                        {example.translation && (
                          <p className="text-slate-600 mt-1">
                            {example.translation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {section.tips && section.tips.length > 0 && (
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 טיפים:</h4>
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="text-yellow-700">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Common Mistakes */}
        <Card className="mb-8 shadow-xl border-0 bg-red-50">
          <CardHeader>
            <CardTitle className="text-2xl text-red-800 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2" />
              טעויות נפוצות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {article.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">✗</span>
                  <span className="text-slate-700">{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Exam Tips */}
        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-[#FF7F0E] to-[#FF9F4E] text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Award className="h-6 w-6 mr-2" />
              טיפים למבחן אמירם
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {article.examTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Practice Section */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#4B2E80] to-[#6B46B0] text-white">
            <CardTitle className="text-2xl flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              תרגול
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!showResults ? (
              <div>
                <div className="mb-4 text-center">
                  <span className="text-lg text-slate-600">
                    שאלה {currentPractice + 1} מתוך {article.practice.length}
                  </span>
                </div>
                
                <div className="bg-[#F7F9FC] p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-medium text-slate-800 mb-4">
                    {article.practice[currentPractice].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {article.practice[currentPractice].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 text-right rounded-lg border-2 transition-all ${
                          userAnswers[currentPractice] === index
                            ? 'border-[#0056B3] bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {userAnswers[currentPractice] !== null && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    userAnswers[currentPractice] === article.practice[currentPractice].correct
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="font-medium mb-2">
                      {userAnswers[currentPractice] === article.practice[currentPractice].correct
                        ? '✅ תשובה נכונה!'
                        : '❌ תשובה שגויה'}
                    </p>
                    <p>{article.practice[currentPractice].explanation}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentPractice(currentPractice - 1)}
                    disabled={currentPractice === 0}
                    variant="outline"
                  >
                    שאלה קודמת
                  </Button>
                  
                  {currentPractice < article.practice.length - 1 ? (
                    <Button
                      onClick={() => setCurrentPractice(currentPractice + 1)}
                      disabled={userAnswers[currentPractice] === null}
                      className="bg-[#0056B3] hover:bg-[#0045A0]"
                    >
                      שאלה הבאה
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowResults(true)}
                      disabled={userAnswers.filter(a => a !== null).length < article.practice.length}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      סיים תרגול
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  סיימת! הציון שלך: {getScore()}/{article.practice.length}
                </h3>
                <div className="mb-6">
                  <Progress value={(getScore() / article.practice.length) * 100} className="h-4" />
                </div>
                <p className="text-lg text-slate-600 mb-6">
                  {getScore() === article.practice.length 
                    ? "מצוין! שלטת בחומר בצורה מושלמת! 🎉"
                    : getScore() >= article.practice.length * 0.7
                    ? "עבודה טובה! עוד קצת תרגול ותהיה מושלם 💪"
                    : "כדאי לחזור על החומר ולתרגל עוד 📚"}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      setCurrentPractice(0);
                      setUserAnswers([]);
                      setShowResults(false);
                    }}
                    variant="outline"
                  >
                    תרגל שוב
                  </Button>
                  <Button asChild className="bg-[#0056B3] hover:bg-[#0045A0]">
                    <Link to="/articles">
                      חזרה לכל הנושאים
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Topics */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-[#0056B3] flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              נושאים קשורים
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {article.relatedTopics.map((topic, index) => (
                <Link
                  key={index}
                  to={`/articles/${topic.id}`}
                  className="p-4 bg-[#F7F9FC] rounded-lg hover:bg-[#0056B3] hover:text-white transition-all group"
                >
                  <span className="font-medium flex items-center">
                    {topic.title}
                    <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#0056B3] to-[#4B2E80] text-white shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">מוכן להמשיך?</h2>
              <p className="text-blue-100 mb-6 text-lg">
                עבור לסימולציות המבחן כדי לתרגל את מה שלמדת
              </p>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white text-[#0056B3] hover:bg-blue-50 font-semibold px-8 py-3"
              >
                <Link to="/simulations-entry">
                  התחל סימולציה
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleTemplate;