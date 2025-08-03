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
  Zap,
  Calendar
} from "lucide-react";

const Future: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Future (Will/Going to)
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            זמן עתיד
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            הבעת עתיד היא אחד הזמנים החשובים באנגלית. היא מאפשרת לנו לתאר כוונות, תחזיות, תכניות, והבטחות. 
            בעתיד יש שתי דרכים עיקריות: <strong>Will</strong> ו-<strong>Going to</strong> - וחשוב לדעת מתי להשתמש בכל אחת מהן.
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
              <p className="text-lg font-medium text-gray-800 mb-2">
                <strong>Future tenses</strong> describe actions that will happen after the present moment.
              </p>
              <p className="text-gray-700 mb-3">
                זמני עתיד מתארים פעולות שיקרו אחרי הרגע הנוכחי.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Will</h4>
                  <p className="text-sm text-blue-600">פעולה עתידית כללית/החלטה רגעית/תחזית</p>
                </div>
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800">Going to</h4>
                  <p className="text-sm text-purple-600">כוונה ברורה או תכנון מוקדם</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Structure Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              מבנה תחבירי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Will Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  מבנה Will
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                  <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                    Subject + Will + Verb (base form)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I will go to the party - אני אלך למסיבה</li>
                    <li>• She will call you tomorrow - היא תתקשר אליך מחר</li>
                  </ul>
                </div>
              </div>

              {/* Going to Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  מבנה Going to
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                  <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                    Am/Is/Are + going to + Verb (base form)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I am going to visit my grandparents - אני הולך לבקר את הסבים</li>
                    <li>• They are going to study medicine - הם הולכים ללמוד רפואה</li>
                  </ul>
                </div>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Will/Going to + Base Verb</p>
                  <ul className="text-sm space-y-1">
                    <li>• I will help you</li>
                    <li>• She is going to cook</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Won't / Am/Is/Are + not + going to</p>
                  <ul className="text-sm space-y-1">
                    <li>• I won't come</li>
                    <li>• He isn't going to join</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Will you...? / Are you going to...?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Will you help me?</li>
                    <li>• Are you going to eat?</li>
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
          <CardContent>
            <div className="space-y-6">
              {/* Will Uses */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  שימושי Will
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">תחזיות (Predictions)</h5>
                      <p className="text-blue-700">It will rain tomorrow - יירד גשם מחר</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">החלטות רגעיות (Spontaneous Decisions)</h5>
                      <p className="text-blue-700">I'm tired. I will go to bed - אני עייף. אני אלך לישון</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">הבטחות (Promises)</h5>
                      <p className="text-blue-700">I will help you with your homework - אני אעזור לך עם השיעורי בית</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">הצעות/בקשות (Offers/Requests)</h5>
                      <p className="text-blue-700">Will you open the window? - תפתח את החלון?</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Going to Uses */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  שימושי Going to
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">תכניות שנעשו מראש (Plans)</h5>
                      <p className="text-purple-700">We are going to travel to France next summer</p>
                      <p className="text-purple-700">אנחנו הולכים לנסוע לצרפת בקיץ הבא</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">כוונות (Intentions)</h5>
                      <p className="text-purple-700">She is going to learn Spanish - היא הולכת ללמוד ספרדית</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">חיזוי על סמך מצב נוכחי (Prediction based on evidence)</h5>
                      <p className="text-purple-700">Look at the sky! It's going to rain</p>
                      <p className="text-purple-700">תסתכל על השמיים! יירד גשם</p>
                    </div>
                  </div>
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
              סימני זמן - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זמן נפוצות לעתיד</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">זמן קרוב:</p>
                    <p className="text-sm text-blue-600">tomorrow, tonight, soon, later</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">זמן רחוק:</p>
                    <p className="text-sm text-green-600">next (week/month/year), in an hour, in 2025</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• I will see you <strong>tomorrow</strong></li>
                  <li>• They are going to start a new project <strong>next month</strong></li>
                  <li>• We will finish the work <strong>in two days</strong></li>
                  <li>• She is going to call you <strong>soon</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Types & Short Answers */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <MessageSquare className="h-6 w-6 mr-2" />
              שאלות ותשובות קצרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>סוגי שאלות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Yes/No questions:</p>
                    <ul className="text-sm text-blue-600 mt-1">
                      <li>• Will you help me?</li>
                      <li>• Are they going to join us?</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Wh- questions:</p>
                    <ul className="text-sm text-purple-600 mt-1">
                      <li>• When will you arrive?</li>
                      <li>• What are you going to do after work?</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>תשובות קצרות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">עם Will:</p>
                    <p className="text-sm text-green-600">Yes, I will. / No, I won't.</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <p className="font-medium text-orange-800">עם Going to:</p>
                    <p className="text-sm text-orange-600">Yes, she is. / No, she isn't.</p>
                  </div>
                </div>
              </div>
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
                    <li>• We will travel to Eilat next week - ניסע לאילת בשבוע הבא</li>
                    <li>• I am going to call you soon - אני הולך להתקשר אליך בקרוב</li>
                    <li>• They won't agree to this idea - הם לא יסכימו לרעיון הזה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• When I finish my homework, I will watch TV</li>
                    <li>• Are you going to attend the meeting tomorrow?</li>
                    <li>• If it rains, we won't go to the beach</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She ___ (help) you if you ask her.</p>
                    <p className="text-sm text-gray-600">(help / helps / will help / helped)</p>
                    <p className="text-green-700 font-medium">תשובה: will help</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">They ___ (not/visit) their aunt next week.</p>
                    <p className="text-sm text-gray-600">(don't visit / won't visit / aren't going to visit / didn't visit)</p>
                    <p className="text-green-700 font-medium">תשובות נכונות: won't visit / aren't going to visit</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you ___ (join) us for dinner tonight?</p>
                    <p className="text-sm text-gray-600">(Will / join / Are / going to join)</p>
                    <p className="text-green-700 font-medium">תשובות נכונות: Will you join / Are you going to join</p>
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
                <h4 className="font-semibold text-red-800 mb-3">בלבול בין Will ל-Going to</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">I will eat pizza with my family tonight</p>
                        <p className="text-red-600 text-sm">אם זה תוכנן מראש, צריך going to</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">I am going to eat pizza with my family tonight</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שכחת מבנה של Am/Is/Are ב-Going to</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She going to visit her grandma</p>
                        <p className="text-red-600 text-sm">חסר פועל עזר</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She is going to visit her grandma</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש לא נכון בפועל אחרי will/going to</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He will go home (פועל בסיס)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He will goes home (לא מוסיפים S)</span>
                  </div>
                </div>
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
                    <p>1. I ___ (call) you later.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We ___ (not/go) to the cinema tonight.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. ___ she ___ (study) for the test?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. It looks dark. It ___ (rain).</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. will call</p>
                    <p>2. are not (aren't) going</p>
                    <p>3. Will / study <strong>או</strong> Is / going to study</p>
                    <p>4. is going to rain (ראיה מהמצב הנוכחי)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. He will goes to work tomorrow.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. They not going to visit us.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. He will go to work tomorrow.</p>
                    <p>2. They are not going to visit us.</p>
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
                <p>בעתיד באנגלית, חשוב להבחין בין will ל-going to לפי כוונת הדובר, ולהשתמש נכון במבנה התחבירי. הקפד לזהות מילות זמן של עתיד, להבין את ההבדלים, ולזכור את כללי השימוש!</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• חפש רמזים לשימוש ב-will (החלטה פתאומית, הבטחה, תחזית) וב-going to (כוונה, תכנון, ראיה לעתיד)</li>
                  <li>• תרגל במיוחד שאלות השלמת משפטים – כך תזהה בקלות מה דורש will ומה דורש going to</li>
                  <li>• זכור: אחרי will/going to תמיד פועל בסיס (V1)!</li>
                  <li>• שים לב לזמן בשאלה – הרבה טעויות נובעות ממילה קטנה כמו "tomorrow", "next week"</li>
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

export default Future;