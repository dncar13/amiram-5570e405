import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  Clock,
  MessageSquare,
  History,
  RotateCcw,
  ArrowLeftRight,
  Calendar,
  Rewind
} from "lucide-react";

const PastPerfect: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Past Perfect
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            עבר מושלם
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Past Perfect מאפשר לתאר <strong>שני אירועים בעבר</strong>, ולציין איזה מהם קרה קודם. 
            זהו זמן חשוב להבנת רצף אירועים, לסיפורים, ולמענה נכון על שאלות מורכבות באנגלית. 
            זהו <strong>"עבר של העבר"</strong> - מה שקרה לפני משהו אחר שכבר קרה.
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookOpen className="h-6 w-6 mr-2" />
              הגדרה קצרה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <p className="text-lg font-medium text-gray-800 mb-3">
                <strong>Past Perfect</strong> מתאר פעולה שהסתיימה לפני פעולה אחרת בעבר.
              </p>
              <p className="text-gray-700 mb-3">
                The Past Perfect tense describes an action that happened before another action or time in the past.
              </p>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border-l-4 border-indigo-400 mt-4">
                <p className="text-indigo-800 flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  <strong>הרעיון המרכזי:</strong> מציין מה קרה קודם מבין שני אירועים בעבר
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Example */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <ArrowLeftRight className="h-6 w-6 mr-2" />
              דוגמה לרצף זמנים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-indigo-800 mb-2">When I arrived, the movie had already started</h4>
                <p className="text-indigo-600">כשהגעתי, הסרט כבר התחיל</p>
              </div>
              <div className="flex items-center justify-center space-x-4 mb-4" dir="ltr">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-800 font-bold">1st</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2 text-center">Movie started<br/><strong>Past Perfect</strong><br/>had started</p>
                </div>
                <ArrowRight className="h-8 w-8 text-gray-400" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-blue-800 font-bold">2nd</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2 text-center">I arrived<br/><strong>Past Simple</strong><br/>arrived</p>
                </div>
                <ArrowRight className="h-8 w-8 text-gray-400" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
                    <span className="text-green-800 font-bold">NOW</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2 text-center">Present<br/><strong>Current time</strong></p>
                </div>
              </div>
              <p className="text-center text-indigo-700 text-sm">
                💡 Past Perfect מציין מה קרה <strong>קודם</strong> מבין שני אירועי עבר
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Structure Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              מבנה תחבירי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2 text-purple-600" />
                  מבנה בסיסי
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                  <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                    Subject + had + Verb (V3 - past participle)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I <strong>had eaten</strong> before I left home - אכלתי לפני שיצאתי מהבית</li>
                    <li>• She <strong>had finished</strong> her homework when her friends arrived - היא סיימה את שיעורי הבית כשהחברים הגיעו</li>
                  </ul>
                </div>
              </div>

              {/* Key Point */}
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <Rewind className="h-5 w-5 mr-2" />
                  נקודה חשובה
                </h4>
                <p className="text-yellow-700">
                  לכל הגופים (I, you, he, she, it, we, they) משתמשים ב-<strong>had</strong> - אין הבדל בין גופים!
                </p>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + had + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• I had visited London</li>
                    <li>• They had finished</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + had not (hadn't) + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• I hadn't seen the movie</li>
                    <li>• She hadn't called</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Had + Subject + V3?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Had you been there?</li>
                    <li>• Had she finished?</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Uses Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <CheckCircle className="h-6 w-6 mr-2" />
              שימושים עיקריים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <History className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולה שהסתיימה לפני פעולה אחרת בעבר</h4>
                  <p className="text-gray-700">When we arrived, the movie <strong>had already started</strong></p>
                  <p className="text-gray-700">כשהגענו, הסרט כבר התחיל (לפני שהגענו)</p>
                  <p className="text-gray-700">She <strong>had left</strong> before I called her - היא עזבה לפני שהתקשרתי אליה</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Calendar className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הדגשת סדר האירועים</h4>
                  <p className="text-gray-700">By the time the teacher came, the students <strong>had finished</strong> the test</p>
                  <p className="text-gray-700">עד שהמורה הגיע, התלמידים כבר סיימו את המבחן</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">שלילה ושאלות</h4>
                  <p className="text-gray-700">I <strong>had not heard</strong> the news before you told me</p>
                  <p className="text-gray-700">לא שמעתי את החדשות לפני שסיפרת לי</p>
                  <p className="text-gray-700"><strong>Had you met</strong> him before the party? - פגשת אותו לפני המסיבה?</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              מילות זמן - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זמן נפוצות ל-Past Perfect</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">סדר זמנים:</p>
                    <p className="text-sm text-blue-600">before, after, by the time</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">השלמה:</p>
                    <p className="text-sm text-green-600">already, just</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">רצף:</p>
                    <p className="text-sm text-purple-600">when, until</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>By the time</strong> I got home, they had left</li>
                  <li>• <strong>After</strong> he had finished his work, he went to bed</li>
                  <li>• <strong>Before</strong> the meeting started, she had prepared everything</li>
                  <li>• <strong>When</strong> I called, they had already gone</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
              <p className="text-indigo-800 font-medium">
                💡 <strong>זכור:</strong> Past Perfect נדרש רק כשיש שתי פעולות בעבר וצריך להבהיר מה קרה קודם!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Past Perfect vs Past Simple */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <ArrowLeftRight className="h-6 w-6 mr-2" />
              Past Perfect vs Past Simple - ההבדל החשוב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Past Perfect</h4>
                <p className="text-purple-700 text-sm mb-2">עבר של העבר - מה קרה קודם</p>
                <ul className="text-purple-600 text-sm space-y-1">
                  <li>• When I arrived, he <strong>had finished</strong> lunch</li>
                  <li>• She <strong>had left</strong> before I called</li>
                  <li>• They <strong>had already gone</strong> to bed</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Past Simple</h4>
                <p className="text-blue-700 text-sm mb-2">עבר רגיל - מה קרה אחר כך</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• When I <strong>arrived</strong>, he was eating</li>
                  <li>• I <strong>called</strong> her at 8 PM</li>
                  <li>• They <strong>went</strong> to bed after dinner</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded">
              <p className="text-indigo-800 font-medium text-center">
                🔑 <strong>הכלל הזהב:</strong> פעולה אחת בעבר = Past Simple | שתי פעולות בעבר + צורך להדגיש מה קרה קודם = Past Perfect
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <Users className="h-6 w-6 mr-2" />
              דוגמאות מפורטות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• He had never visited Eilat before last year - הוא מעולם לא ביקר באילת לפני השנה שעברה</li>
                    <li>• The bus had already left when we got to the station - האוטובוס כבר יצא כשהגענו לתחנה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• By the time I finished the exam, most students had left the room</li>
                    <li>• After she had cleaned the house, she went shopping</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">When I arrived, they ___ dinner.</p>
                    <p className="text-sm text-gray-600">(finish / finished / had finished / have finished)</p>
                    <p className="text-green-700 font-medium">תשובה: had finished</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you ever ___ such a thing before?</p>
                    <p className="text-sm text-gray-600">(Had / saw / Have / did)</p>
                    <p className="text-green-700 font-medium">תשובה: Had you ever seen</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The train ___ before we got there.</p>
                    <p className="text-sm text-gray-600">(leaves / left / had left / was leaving)</p>
                    <p className="text-green-700 font-medium">תשובה: had left</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes Section */}
        <Card className="mb-8 shadow-sm border-l-4 border-red-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-red-600 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              טעויות נפוצות ואיך להימנע מהן
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50">
                <h4 className="font-semibold text-red-800 mb-3">ערבוב Past Simple ו-Past Perfect</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">When I arrived, he finished his lunch</p>
                        <p className="text-red-600 text-sm">צריך Past Perfect להראות מה קרה קודם</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">When I arrived, he had finished his lunch</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שימוש במבנה לא נכון</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She hadn't <strong>seen</strong> the movie (V3 אחרי had)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She hadn't <strong>saw</strong> the movie</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שכחת had</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>After I left, they <strong>had already gone</strong> home</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>After I left, they already gone home</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">שימוש Past Perfect בלי צורך</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Yesterday, I <strong>watched</strong> TV (פעולה אחת בעבר)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Yesterday, I <strong>had watched</strong> TV</span>
                  </div>
                </div>
                <p className="text-purple-600 text-sm mt-2">
                  💡 Past Perfect רק כשיש שתי פעולות בעבר ורוצים להדגיש מה קרה קודם!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Exercises */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              תרגול
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול השלמת משפטים</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She ___ (not/meet) him before the conference.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We ___ (finish) our homework before mom came home.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. ___ you ___ (be) in Paris before 2022?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The children ___ (already/go) to bed when I got home.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. By the time the teacher arrived, the students ___ (leave).</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. had not (hadn't) met</p>
                    <p>2. had finished</p>
                    <p>3. Had / been</p>
                    <p>4. had already gone</p>
                    <p>5. had left</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. When we arrived, the film started.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She hadn't saw this movie before.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. I didn't had breakfast before school.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. After he finished his work, he had gone home.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. When we arrived, the film <strong>had started</strong>.</p>
                    <p>2. She hadn't <strong>seen</strong> this movie before.</p>
                    <p>3. I <strong>hadn't had</strong> breakfast before school.</p>
                    <p>4. After he <strong>had finished</strong> his work, he went home.</p>
                  </div>
                </details>
              </div>

              <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-gray-700 mb-4 text-lg">
                  מוכנים לתרגול מתקדם יותר?
                </p>
                <Button 
                  size="lg" 
                  className="text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0056B3' }}
                  asChild
                >
                  <Link to="/simulations-entry">
                    התחילו תרגול במבחני אמיר"ם
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Tips */}
        <Card className="mb-8 shadow-sm" style={{ backgroundColor: '#4B2E80', color: 'white' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-white">
              <Lightbulb className="h-6 w-6 mr-2" />
              סיכום וטיפים להצלחה במבחן אמיר"ם
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">סיכום</h4>
                <p>Past Perfect חשוב להבהרת רצף אירועים בעבר – מסמן מי התרחש קודם. שים לב למבנה (had + V3), למילות זמן, ולכך שהשימוש בו נדרש רק כשיש שתי פעולות בעבר.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• חפש מילות מפתח: before, after, by the time, already, when</li>
                  <li>• אחרי had תמיד משתמשים ב-V3 (past participle) – גם עם פעלים לא רגילים!</li>
                  <li>• אם רק פעולה אחת בעבר – השתמש ב-Past Simple בלבד</li>
                  <li>• תרגל השלמת משפטים, תיקון טעויות ושאלות בסגנון אמיר"ם</li>
                  <li>• זכור: Past Perfect = "עבר של העבר" - מה שקרה קודם!</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">בהצלחה במבחן! 🎯</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-2 hover:bg-gray-50"
            style={{ borderColor: '#0056B3', color: '#0056B3' }}
            asChild
          >
            <Link to="/articles" className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2" />
              חזרה לכל הנושאים
            </Link>
          </Button>
          
          <Button 
            size="lg"
            className="w-full sm:w-auto text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF7F0E' }}
            asChild
          >
            <Link to="/simulations-entry" className="flex items-center">
              מעבר לתרגילים
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PastPerfect;