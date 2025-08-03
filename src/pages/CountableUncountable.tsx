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
  TrendingUp,
  Award,
  BarChart3
} from "lucide-react";

const ComparativesSuperlatives: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Comparatives & Superlatives
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            השוואות - תואר השוואה ותואר העליון
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            השוואות באנגלית הן כלי בסיסי להשוואה בין אנשים, חפצים ותכונות. <strong>Comparatives</strong> משווים בין שניים, 
            ו-<strong>Superlatives</strong> מציינים את העליון או הכי. הבנה נכונה של הכללים והיוצאי הדופן חיונית להצלחה במבחן אמיר"ם.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Comparative (השוואה)
                  </h4>
                  <p className="text-blue-700 mb-2">משווה בין שניים</p>
                  <div className="space-y-1 text-sm">
                    <p>• tall → <strong>taller</strong></p>
                    <p>• interesting → <strong>more interesting</strong></p>
                    <p className="text-blue-600 italic">John is taller than Mike</p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Superlative (תואר עליון)
                  </h4>
                  <p className="text-purple-700 mb-2">מציין את העליון/הכי</p>
                  <div className="space-y-1 text-sm">
                    <p>• tall → <strong>the tallest</strong></p>
                    <p>• interesting → <strong>the most interesting</strong></p>
                    <p className="text-purple-600 italic">She is the tallest in class</p>
                  </div>
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
              {/* Comparative Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  מבנה Comparative
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                    <p className="font-semibold text-blue-800 mb-1">תארים קצרים (1-2 הברות)</p>
                    <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                      Adjective + er + than
                    </p>
                    <p className="text-sm text-gray-600 mt-1">tall → taller than</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                    <p className="font-semibold text-purple-800 mb-1">תארים ארוכים (3+ הברות)</p>
                    <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                      more + Adjective + than
                    </p>
                    <p className="text-sm text-gray-600 mt-1">more interesting than</p>
                  </div>
                </div>
              </div>

              {/* Superlative Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  מבנה Superlative
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                    <p className="font-semibold text-blue-800 mb-1">תארים קצרים</p>
                    <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                      the + Adjective + est
                    </p>
                    <p className="text-sm text-gray-600 mt-1">the tallest</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                    <p className="font-semibold text-purple-800 mb-1">תארים ארוכים</p>
                    <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                      the most + Adjective
                    </p>
                    <p className="text-sm text-gray-600 mt-1">the most interesting</p>
                  </div>
                </div>
              </div>

              {/* Examples by type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <ul className="text-sm space-y-1">
                    <li>• This is <strong>bigger than</strong> that</li>
                    <li>• She is <strong>the smartest</strong> student</li>
                    <li>• It's <strong>more expensive than</strong> before</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <ul className="text-sm space-y-1">
                    <li>• It's <strong>not bigger than</strong> mine</li>
                    <li>• He's <strong>not the oldest</strong> here</li>
                    <li>• This is <strong>not more difficult</strong></li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Is it <strong>bigger than</strong> yours?</li>
                    <li>• Who is <strong>the tallest</strong>?</li>
                    <li>• Which is <strong>more important</strong>?</li>
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
              {/* Comparative Uses */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  שימושי Comparative
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">השוואה בין שניים</h5>
                      <p className="text-blue-700">My car is faster than yours - המכונית שלי מהירה יותר משלך</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">השוואת מצבים</h5>
                      <p className="text-blue-700">This exam is easier than the last one - המבחן הזה קל יותר מהקודם</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">השוואת כמויות</h5>
                      <p className="text-blue-700">She has more books than me - יש לה יותר ספרים ממני</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Superlative Uses */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  שימושי Superlative
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">ציון עליונות מוחלטת</h5>
                      <p className="text-purple-700">She is the smartest student in the class</p>
                      <p className="text-purple-700">היא התלמידה הכי חכמה בכיתה</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">בתוך קבוצה</h5>
                      <p className="text-purple-700">This is the most expensive hotel in town - זה המלון הכי יקר בעיר</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">עם "one of"</h5>
                      <p className="text-purple-700">He is one of the best players - הוא אחד השחקנים הטובים ביותר</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Irregular Forms Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <BarChart3 className="h-6 w-6 mr-2" />
              צורות חריגות - יוצאי דופן חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <h4 className="font-semibold mb-4 text-gray-900">יוצאי דופן שחייבים לדעת למבחן אמיר"ם</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-right font-semibold">תואר רגיל</th>
                      <th className="border p-3 text-right font-semibold">Comparative</th>
                      <th className="border p-3 text-right font-semibold">Superlative</th>
                      <th className="border p-3 text-right font-semibold">דוגמה</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">good</td>
                      <td className="border p-3 text-blue-600">better</td>
                      <td className="border p-3 text-purple-600">the best</td>
                      <td className="border p-3 text-sm">This is better than that</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">bad</td>
                      <td className="border p-3 text-blue-600">worse</td>
                      <td className="border p-3 text-purple-600">the worst</td>
                      <td className="border p-3 text-sm">Today is worse than yesterday</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">far</td>
                      <td className="border p-3 text-blue-600">farther/further</td>
                      <td className="border p-3 text-purple-600">the farthest/furthest</td>
                      <td className="border p-3 text-sm">It's farther than I thought</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">little</td>
                      <td className="border p-3 text-blue-600">less</td>
                      <td className="border p-3 text-purple-600">the least</td>
                      <td className="border p-3 text-sm">I have less time</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">many/much</td>
                      <td className="border p-3 text-blue-600">more</td>
                      <td className="border p-3 text-purple-600">the most</td>
                      <td className="border p-3 text-sm">She has more books</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              סימני זיהוי - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>רמזים ל-Comparative</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">than</p>
                    <p className="text-sm text-blue-600">המילה הכי חשובה - תמיד מציינת השוואה</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">as...as</p>
                    <p className="text-sm text-green-600">She is as tall as her sister</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>רמזים ל-Superlative</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">the most / the -est</p>
                    <p className="text-sm text-purple-600">הסימן הברור ביותר לתואר עליון</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <p className="font-medium text-orange-800">one of the...</p>
                    <p className="text-sm text-orange-600">One of the best students</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <p className="font-medium text-red-800">in/of + קבוצה</p>
                    <p className="text-sm text-red-600">the tallest in the class</p>
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
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">This book is ___ (interesting) than the one I read yesterday.</p>
                    <p className="text-sm text-gray-600">(interesting / more interesting / most interesting / the most interesting)</p>
                    <p className="text-green-700 font-medium">תשובה: more interesting</p>
                    <p className="text-sm text-gray-500">הסבר: יש "than" + תואר ארוך (3 הברות)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She is ___ (good) student in our class.</p>
                    <p className="text-sm text-gray-600">(good / better / best / the best)</p>
                    <p className="text-green-700 font-medium">תשובה: the best</p>
                    <p className="text-sm text-gray-500">הסבר: יוצא דופן + "in our class" = superlative</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">My house is ___ (big) than yours, but not ___ (big) in the neighborhood.</p>
                    <p className="text-green-700 font-medium">תשובה: bigger / the biggest</p>
                    <p className="text-sm text-gray-500">הסבר: than = comparative, in the neighborhood = superlative</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• This test is easier than the previous one</li>
                    <li>• המבחן הזה קל יותר מהקודם</li>
                    <li>• He is the oldest student in the class</li>
                    <li>• הוא התלמיד הכי מבוגר בכיתה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• This is one of the most important decisions</li>
                    <li>• זו אחת ההחלטות החשובות ביותר</li>
                    <li>• Your idea is better than mine</li>
                    <li>• הרעיון שלך טוב יותר משלי</li>
                  </ul>
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
                <h4 className="font-semibold text-red-800 mb-3">בלבול בין more/most ל -er/-est</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">This is more easy than I thought</p>
                        <p className="text-red-600 text-sm">easy הוא תואר קצר - צריך easier</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">This is easier than I thought</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שכחת "the" בתואר עליון</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She is oldest in the family</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She is <strong>the</strong> oldest in the family</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש כפול בצורה</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>This is more prettier than that</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>This is prettier than that</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">יוצאי דופן - זכרו אותם!</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>This is more good than that</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>This is <strong>better</strong> than that</span>
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
                    <p>1. This movie is ___ (interesting) than the book.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She is ___ (good) student in our school.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. Today's weather is ___ (bad) than yesterday's.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. This is one of ___ (expensive) restaurants in the city.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. more interesting (תואר ארוך + than)</p>
                    <p>2. the best (יוצא דופן + superlative)</p>
                    <p>3. worse (יוצא דופן של bad)</p>
                    <p>4. the most expensive (one of + superlative)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. This is more fast than the old car.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She is most beautiful girl in the class.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. Your answer is more better than mine.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. This is <strong>faster</strong> than the old car. (fast = תואר קצר)</p>
                    <p>2. She is <strong>the</strong> most beautiful girl in the class. (חסר the)</p>
                    <p>3. Your answer is <strong>better</strong> than mine. (יוצא דופן + לא שימוש כפול)</p>
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
                <p>השוואות באנגלית דורשות הבנה של כללים ברורים: תארים קצרים מקבלים -er/-est, ארוכים מקבלים more/most. יוצאי הדופן (good/better/best) חייבים להישמר בזיכרון, והרמזים במשפט (than, the, one of) מסייעים לזהות את הצורה הנכונה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• זהה את המילה "than" - היא תמיד מציינת comparative</li>
                  <li>• "the" לפני תואר = superlative (ברוב המקרים)</li>
                  <li>• ספור הברות: 1-2 הברות = -er/-est, 3+ הברות = more/most</li>
                  <li>• יוצאי דופן: good/better/best, bad/worse/worst - למד בעל פה!</li>
                  <li>• "one of the..." תמיד דורש superlative</li>
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

export default ComparativesSuperlatives;