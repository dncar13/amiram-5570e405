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
  MessageSquare
} from "lucide-react";

const PastSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Past Simple
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            עבר פשוט
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Past Simple הוא זמן מרכזי ודומיננטי באנגלית, המשמש לתיאור פעולות ואירועים שהתרחשו והסתיימו בעבר. 
            שליטה בזמן זה נדרשת בכל שלב בלימודי אנגלית ובמיוחד במבחן אמיר"ם.
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
                <strong>Past Simple tense</strong> is used to describe actions or events that started and finished at a specific time in the past.
              </p>
              <p className="text-gray-700">
                זמן עבר פשוט מתאר פעולה שהתרחשה והסתיימה בעבר, בדרך כלל עם רמזים ברורים לזמן.
              </p>
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
              {/* Basic Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3">מבנה בסיסי - משפט חיובי</h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                  <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                    Subject + Verb (past form) + (Object / Adverb)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• She visited her grandmother yesterday - היא ביקרה את סבתא אתמול</li>
                    <li>• They walked to school last week - הם הלכו לבית הספר בשבוע שעבר</li>
                  </ul>
                </div>
              </div>

              {/* Regular vs Irregular Verbs */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3">פעלים רגילים ויוצאי דופן</h4>
                <div className="space-y-4">
                  <div className="border-r-4 border-blue-400 pr-4">
                    <h5 className="font-medium text-blue-800">פעלים רגילים (Regular Verbs)</h5>
                    <p className="text-gray-700">מוסיפים <strong>-ed</strong> לסוף הפועל:</p>
                    <ul className="text-sm text-gray-600 mt-1">
                      <li>• walk → walked</li>
                      <li>• play → played</li>
                    </ul>
                  </div>
                  <div className="border-r-4 border-purple-400 pr-4">
                    <h5 className="font-medium text-purple-800">פעלים יוצאי דופן (Irregular Verbs)</h5>
                    <p className="text-gray-700">משנים צורה, ויש ללמוד בעל פה:</p>
                    <ul className="text-sm text-gray-600 mt-1">
                      <li>• go → went</li>
                      <li>• have → had</li>
                      <li>• buy → bought</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      💡 שים לב: בשאלות ושלילה משתמשים ב-<strong>did</strong> וחוזרים לפועל הבסיס (בלי ed/שינוי)
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + Past Verb + Object</p>
                  <ul className="text-sm space-y-1">
                    <li>• I worked from home</li>
                    <li>• She studied English</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + didn't + Base Verb</p>
                  <ul className="text-sm space-y-1">
                    <li>• I didn't like the food</li>
                    <li>• He didn't watch TV</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Did + Subject + Base Verb?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Did you see the movie?</li>
                    <li>• Did she finish her work?</li>
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
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולות שהתרחשו בעבר (Completed past actions)</h4>
                  <p className="text-gray-700">I watched TV yesterday - צפיתי בטלוויזיה אתמול</p>
                  <p className="text-gray-700">We visited Paris in 2021 - ביקרנו בפריז ב-2021</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">רצפים של אירועים בעבר (Sequence of past events)</h4>
                  <p className="text-gray-700">He came home, took a shower, and went to sleep</p>
                  <p className="text-gray-700">הוא חזר הביתה, התקלח והלך לישון</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">עובדות/מצבים שהיו בעבר (Past states/facts)</h4>
                  <p className="text-gray-700">My parents lived in Tel Aviv when they were young</p>
                  <p className="text-gray-700">הורי גרו בתל אביב כשהיו צעירים</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">סיפורים ותיאורי חוויות (Stories and experiences)</h4>
                  <p className="text-gray-700">Last summer, I traveled to Italy. I met new friends and learned a lot</p>
                  <p className="text-gray-700">בקיץ שעבר נסעתי לאיטליה. פגשתי חברים חדשים ולמדתי הרבה</p>
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
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זמן נפוצות לעבר</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">זמן ספציפי:</p>
                    <p className="text-sm text-blue-600">yesterday, last (night/week/year/month), ago</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">תאריכים:</p>
                    <p className="text-sm text-green-600">in 1990, in March, when I was a child</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• I saw him <strong>yesterday</strong></li>
                  <li>• She finished the project <strong>last week</strong></li>
                  <li>• They left <strong>two hours ago</strong></li>
                  <li>• We met <strong>in 2020</strong></li>
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
                      <li>• Did you see the game?</li>
                      <li>• Did she call you?</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Wh- questions:</p>
                    <ul className="text-sm text-purple-600 mt-1">
                      <li>• When did they arrive?</li>
                      <li>• Where did you go?</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>תשובות קצרות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">חיובי:</p>
                    <p className="text-sm text-green-600">Yes, I did. / Yes, she did.</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <p className="font-medium text-orange-800">שלילי:</p>
                    <p className="text-sm text-orange-600">No, I didn't. / No, she didn't.</p>
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
                    <li>• I worked late last night - עבדתי מאוחר אתמול בלילה</li>
                    <li>• She watched a movie - היא צפתה בסרט</li>
                    <li>• They played football in the park - הם שיחקו כדורגל בפארק</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• After he finished his homework, he went to sleep</li>
                    <li>• We didn't enjoy the concert because it was too loud</li>
                    <li>• When I was a child, I lived in Eilat</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">When I was a child, I __ (live) in Beer Sheva.</p>
                    <p className="text-sm text-gray-600">(lives / living / lived / was living)</p>
                    <p className="text-green-700 font-medium">תשובה: lived</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">They __ (not/go) to school yesterday.</p>
                    <p className="text-sm text-gray-600">(don't go / didn't went / didn't go / haven't gone)</p>
                    <p className="text-green-700 font-medium">תשובה: didn't go</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">Did you __ (see) the film last week?</p>
                    <p className="text-sm text-gray-600">(sees / saw / seeing / see)</p>
                    <p className="text-green-700 font-medium">תשובה: see</p>
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
                <h4 className="font-semibold text-red-800 mb-3">בלבול בין Past Simple ל-Present Simple</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">Yesterday I go to the market</p>
                        <p className="text-red-600 text-sm">שימוש בהווה במקום עבר</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">Yesterday I went to the market</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שגיאות בפעלים יוצאי דופן</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She buyed a dress</p>
                        <p className="text-red-600 text-sm">הוספת ed לפועל יוצא דופן</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She bought a dress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש לא נכון ב-did</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Did you go home?</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Did you went home?</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She didn't call you</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She didn't called you</span>
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
                    <p>1. My brother ___ (visit) us last month.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We ___ (not/have) time yesterday.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. ___ you ___ (like) the cake?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. She ___ (read) a book two days ago.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. visited</p>
                    <p>2. did not (didn't) have</p>
                    <p>3. Did / like</p>
                    <p>4. read (פועל יוצא דופן - נשאר read)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She didn't went to work.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We buyed new shoes last week.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She didn't go to work.</p>
                    <p>2. We bought new shoes last week.</p>
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
                <p>Past Simple הוא זמן חיוני באנגלית ובמיוחד במבחן אמיר"ם. הכרה במבנה התחביר, הטיית פעלים, זיהוי מילות זמן – יעזרו לענות נכון על שאלות במבחן.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• זכור תמיד לבדוק אם יש מילות זמן של עבר – הן סימן ברור שצריך Past Simple</li>
                  <li>• תרגל במיוחד פעלים יוצאי דופן – הם המלכודת הכי נפוצה</li>
                  <li>• בשלילה או בשאלה – תמיד חזור לצורת הפועל הבסיסית (בלי ed/שינוי)</li>
                  <li>• קרא שאלות במבחן לאט, שים לב לסיגנון השאלה ולמילות זמן</li>
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

export default PastSimple;