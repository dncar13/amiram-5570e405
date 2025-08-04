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

const PresentSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-700 mb-3">
            Present Simple
          </h1>
          <h2 className="text-2xl font-semibold text-slate-600 mb-4">
            הווה פשוט
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Present Simple tense הוא זמן בסיסי וקריטי באנגלית. הוא משמש לתיאור פעולות שמתרחשות בקביעות, 
            עובדות כלליות והרגלים יומיומיים. זהו הזמן החשוב ביותר להצלחה במבחן אמיר"ם.
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <BookOpen className="h-6 w-6 mr-2 text-blue-400" />
              הגדרה קצרה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-slate-50/50">
              <p className="text-lg font-medium text-gray-700 mb-2">
                <strong>The Present Simple tense</strong> is used to describe actions that happen regularly, facts, and general truths.
              </p>
              <p className="text-gray-600">
                זמן הווה פשוט משמש לתיאור פעולות שקורות באופן קבוע, עובדות ואמיתות כלליות.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Structure Section */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <Target className="h-6 w-6 mr-2 text-emerald-400" />
              מבנה תחבירי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Structure */}
              <div className="p-4 rounded-lg bg-slate-50/50">
                <h4 className="font-semibold text-gray-700 mb-3">מבנה בסיסי - משפט חיובי</h4>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-mono text-lg text-slate-600">
                    Subject + Verb (V1) + (Object / Adverb)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• She works in Tel Aviv - היא עובדת בתל אביב</li>
                    <li>• They play football every Sunday - הם משחקים כדורגל כל ראשון</li>
                  </ul>
                </div>
              </div>

              {/* Special Conjugations */}
              <div className="p-4 rounded-lg bg-slate-50/50">
                <h4 className="font-semibold text-gray-700 mb-3">הטיות מיוחדות</h4>
                <div className="space-y-4">
                  <div className="border-r-4 border-blue-300/50 pr-4">
                    <h5 className="font-medium text-blue-600">גוף שלישי יחיד (he, she, it)</h5>
                    <p className="text-gray-600">מוסיפים <strong>-s</strong> לפועל:</p>
                    <ul className="text-sm text-gray-500 mt-1">
                      <li>• He walks to school</li>
                      <li>• She eats breakfast at 8</li>
                    </ul>
                  </div>
                  <div className="border-r-4 border-purple-300/50 pr-4">
                    <h5 className="font-medium text-purple-600">שאלה או שלילה</h5>
                    <p className="text-gray-600">משתמשים ב-<strong>do/does</strong>:</p>
                    <ul className="text-sm text-gray-500 mt-1">
                      <li>• Do you like music?</li>
                      <li>• He doesn't play tennis</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/50">
                    <p className="text-amber-700 font-medium">
                      💡 שים לב: אחרי <strong>does</strong> ו-<strong>doesn't</strong> חוזרים לצורת הבסיס של הפועל (בלי S)
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border border-blue-200/50 bg-blue-50/30">
                  <h5 className="font-semibold mb-2 text-blue-600">משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + Verb + Object</p>
                  <ul className="text-sm space-y-1">
                    <li>• I work from home</li>
                    <li>• She studies English</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border border-purple-200/50 bg-purple-50/30">
                  <h5 className="font-semibold mb-2 text-purple-600">משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + don't/doesn't + Verb</p>
                  <ul className="text-sm space-y-1">
                    <li>• I don't like fish</li>
                    <li>• He doesn't watch TV</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border border-emerald-200/50 bg-emerald-50/30">
                  <h5 className="font-semibold mb-2 text-emerald-600">שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Do/Does + Subject + Verb?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Do you speak English?</li>
                    <li>• Does he live here?</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Uses Section */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
              שימושים עיקריים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-gray-700">עובדות קבועות (Permanent facts / General truths)</h4>
                  <p className="text-gray-600">Water boils at 100°C - מים רותחים ב-100 מעלות</p>
                  <p className="text-gray-600">The Earth revolves around the sun - כדור הארץ מקיף את השמש</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-gray-700">הרגלים (Habits)</h4>
                  <p className="text-gray-600">I drink coffee every morning - אני שותה קפה כל בוקר</p>
                  <p className="text-gray-600">She always takes the bus to work - היא תמיד נוסעת לעבודה באוטובוס</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-gray-700">לוח זמנים/אירועים קבועים (Schedules / Timetables)</h4>
                  <p className="text-gray-600">The train leaves at 6 o'clock - הרכבת יוצאת ב-6</p>
                  <p className="text-gray-600">My English lesson starts at 9 - השיעור באנגלית מתחיל ב-9</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-gray-700">משפטי תיאור ותחושות (Descriptions and States)</h4>
                  <p className="text-gray-600">I love chocolate - אני אוהב שוקולד</p>
                  <p className="text-gray-600">They know the answer - הם יודעים את התשובה</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Words Section */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <Clock className="h-6 w-6 mr-2 text-indigo-400" />
              סימני זמן - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-slate-600">מילות זמן נפוצות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
                    <p className="font-medium text-blue-700">תדירות:</p>
                    <p className="text-sm text-blue-600">always, usually, often, sometimes, rarely, never</p>
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-lg border border-green-200/30">
                    <p className="font-medium text-green-700">זמן:</p>
                    <p className="text-sm text-green-600">every day/week/month, on Sundays, at night, in the morning</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-600">דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• He <strong>always</strong> finishes his homework on time</li>
                  <li>• We <strong>never</strong> go to the gym on Mondays</li>
                  <li>• I <strong>usually</strong> eat breakfast at 7</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Types & Short Answers */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <MessageSquare className="h-6 w-6 mr-2 text-purple-400" />
              שאלות ותשובות קצרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-slate-600">סוגי שאלות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
                    <p className="font-medium text-blue-700">Yes/No questions:</p>
                    <ul className="text-sm text-blue-600 mt-1">
                      <li>• Do you speak English?</li>
                      <li>• Does he live here?</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200/30">
                    <p className="font-medium text-purple-700">Wh- questions:</p>
                    <ul className="text-sm text-purple-600 mt-1">
                      <li>• Where do you live?</li>
                      <li>• What does she want?</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-600">תשובות קצרות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50/50 rounded-lg border border-green-200/30">
                    <p className="font-medium text-green-700">עם I/You/We/They:</p>
                    <p className="text-sm text-green-600">Yes, I do. / No, I don't.</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/30">
                    <p className="font-medium text-amber-700">עם He/She/It:</p>
                    <p className="text-sm text-amber-600">Yes, she does. / No, she doesn't.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <Users className="h-6 w-6 mr-2 text-teal-400" />
              דוגמאות מפורטות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-slate-600">משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• I read books - אני קורא ספרים</li>
                    <li>• He speaks English - הוא מדבר אנגלית</li>
                    <li>• They live in Haifa - הם גרים בחיפה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-slate-600">משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• The museum opens at 10 o'clock every day</li>
                    <li>• My friend rarely eats meat, but he always enjoys fish</li>
                    <li>• The company sends newsletters to all its customers on Mondays</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-50/50">
                <h4 className="font-semibold mb-3 text-slate-600">דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="font-medium">The train __ at 8:00 every morning.</p>
                    <p className="text-sm text-gray-600">(leaves / leave / is leaving / left)</p>
                    <p className="text-green-600 font-medium">תשובה: leaves</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="font-medium">Tom and Jerry __ tennis every weekend.</p>
                    <p className="text-sm text-gray-600">(plays / play / is playing / played)</p>
                    <p className="text-green-600 font-medium">תשובה: play</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes Section */}
        <Card className="mb-8 shadow-sm border border-red-200/50 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-red-500 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              טעויות נפוצות ואיך להימנע מהן
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50/50 border border-red-200/30">
                <h4 className="font-semibold text-red-700 mb-3">טעויות הטיית פועל (Verb Agreement Mistakes)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-700">She walk to school</p>
                        <p className="text-red-500 text-sm">שכחת S בגוף שלישי יחיד</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-700">She walks to school</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-700">He doesn't likes pizza</p>
                        <p className="text-red-500 text-sm">הוספת S אחרי פועל עזר (does)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-700">He doesn't like pizza</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/30">
                <h4 className="font-semibold text-amber-700 mb-3">בלבול בין Present Simple ל-Present Progressive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-blue-200/50">
                    <h5 className="font-semibold text-blue-700">Present Simple</h5>
                    <p className="text-sm text-blue-600">להרגלים ועובדות</p>
                    <p className="text-blue-600 mt-1">I work every day (כל יום)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-purple-200/50">
                    <h5 className="font-semibold text-purple-700">Present Progressive</h5>
                    <p className="text-sm text-purple-600">פעולה שמתרחשת כרגע</p>
                    <p className="text-purple-600 mt-1">I am working now (עכשיו)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-200/30">
                <h4 className="font-semibold text-orange-700 mb-3">טעויות במילות זמן (Signal Words)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He always drinks coffee in the morning</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>He drinks always coffee in the morning</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Exercises */}
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <Target className="h-6 w-6 mr-2 text-indigo-400" />
              תרגול
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200/30">
                <h4 className="font-semibold mb-3 text-slate-700">תרגול השלמת משפטים</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200/30">
                    <p className="text-slate-600">1. My sister ___ (watch) TV every evening.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200/30">
                    <p className="text-slate-600">2. They ___ (not/eat) breakfast at home.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200/30">
                    <p className="text-slate-600">3. ___ you ___ (like) chocolate?</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200/30">
                    <p className="text-slate-600">4. It ___ (rain) a lot in winter.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-500 hover:text-blue-600">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50/50 rounded-lg border border-green-200/30">
                    <p className="text-green-700">1. watches</p>
                    <p className="text-green-700">2. do not (don't) eat</p>
                    <p className="text-green-700">3. Do / like</p>
                    <p className="text-green-700">4. rains</p>
                  </div>
                </details>
              </div>

              <div className="text-center py-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-200/20">
                <p className="text-slate-600 mb-4 text-lg">
                  מוכנים לתרגול מתקדם יותר?
                </p>
                <Button 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
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
        <Card className="mb-8 shadow-sm border border-slate-200 rounded-lg bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-slate-700">
              <Lightbulb className="h-6 w-6 mr-2 text-amber-400" />
              סיכום וטיפים להצלחה במבחן אמיר"ם
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/80 border border-purple-200/30">
                <h4 className="font-semibold mb-2 text-purple-700">סיכום</h4>
                <p className="text-slate-600">Present Simple הוא זמן בסיסי, אך קריטי להבנה באנגלית ולמענה נכון במבחן אמיר"ם. שליטה במבנה, שימוש נכון במילות זמן והימנעות מטעויות נפוצות – יבטיחו הצלחה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/80 border border-indigo-200/30">
                <h4 className="font-semibold mb-2 text-indigo-700">טיפים חשובים</h4>
                <ul className="space-y-2 text-slate-600">
                  <li>• זהה את מילות הזמן המופיעות בשאלה – הן בדרך כלל "רומזות" על הזמן הנכון</li>
                  <li>• תמיד בדוק את נושא המשפט: האם צריך להוסיף S או לא?</li>
                  <li>• זכור שבשאלות ושלילה תמיד חוזרים לפועל בסיסי (בלי S)</li>
                  <li>• תרגל השלמות, תיקונים ושאלות לדוגמה – ממש כמו במבחן עצמו</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-700">בהצלחה במבחן! 🎯</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            asChild
          >
            <Link to="/articles" className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2" />
              חזרה לכל הנושאים
            </Link>
          </Button>
          
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-orange-400 hover:bg-orange-500 text-white transition-colors"
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

export default PresentSimple;