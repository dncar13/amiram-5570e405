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
  GitBranch,
  Layers,
  Zap,
  Calendar,
  History,
  Eye,
  BarChart3
} from "lucide-react";

const Conditionals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Conditionals - If Sentences
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            משפטי תנאי באנגלית
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            משפטי תנאי מאפשרים לתאר <strong>תוצאה שקשורה לתנאי מסוים</strong> - מה יקרה, היה קורה, או קורה אם דבר מה יתרחש. 
            הבנה של 4 סוגי התנאי (Zero, First, Second, Third) ויכולת להבחין ביניהם קריטית להצלחה במבחן אמיר"ם.
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
              <p className="text-lg font-medium text-gray-800 mb-4">
                Conditional sentences מורכבים משני חלקים:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <GitBranch className="h-5 w-5 mr-2" />
                    החלק של התנאי (If-clause)
                  </h4>
                  <p className="text-blue-700 mb-2">מתאר את המצב/התנאי</p>
                  <p className="text-sm text-blue-600 italic">If you study hard...</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    החלק של התוצאה (Main clause)
                  </h4>
                  <p className="text-purple-700 mb-2">מתאר מה קורה/יקרה/היה קורה</p>
                  <p className="text-sm text-purple-600 italic">...you will pass the test</p>
                </div>
              </div>
              <div className="mt-4 text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                  If you study hard, you will pass the test
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types Overview Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Layers className="h-6 w-6 mr-2" />
              ארבעה סוגי תנאי עיקריים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Zero Conditional
                </h4>
                <p className="text-sm text-green-600 mb-1">תנאי קבוע/אמיתות כללית</p>
                <p className="font-mono text-xs text-green-700">If + Present, Present</p>
                <p className="text-xs text-green-600 italic">If you heat ice, it melts</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  First Conditional
                </h4>
                <p className="text-sm text-blue-600 mb-1">תנאי מציאותי/עתידי</p>
                <p className="font-mono text-xs text-blue-700">If + Present, will + Verb</p>
                <p className="text-xs text-blue-600 italic">If it rains, I will stay home</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Second Conditional
                </h4>
                <p className="text-sm text-purple-600 mb-1">תנאי דמיוני/לא מציאותי בהווה</p>
                <p className="font-mono text-xs text-purple-700">If + Past, would + Verb</p>
                <p className="text-xs text-purple-600 italic">If I won the lottery, I would travel</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Third Conditional
                </h4>
                <p className="text-sm text-orange-600 mb-1">תנאי דמיוני/לא מציאותי בעבר</p>
                <p className="font-mono text-xs text-orange-700">If + Past Perfect, would have + V3</p>
                <p className="text-xs text-orange-600 italic">If you had called, I would have helped</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Types Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <BarChart3 className="h-6 w-6 mr-2" />
              פירוט מלא לכל סוג תנאי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Zero Conditional */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Zero Conditional - תנאי קבוע/אמיתות כללית
                </h4>
                <div className="grid gap-3">
                  <div className="p-3 bg-white rounded">
                    <p className="font-mono font-semibold text-green-900 mb-2">If + Present Simple, Present Simple</p>
                    <p className="font-semibold text-green-900">שימושים:</p>
                    <p className="text-green-700">חוקי טבע, הרגלים, עובדות כלליות, הוראות</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold text-green-900">דוגמאות:</p>
                    <ul className="text-green-700 space-y-1">
                      <li>• If you heat ice, it melts - אם מחממים קרח, הוא נמס</li>
                      <li>• If water reaches 100°C, it boils - אם מים מגיעים ל-100°, הם רותחים</li>
                      <li>• If the light is red, stop - אם האור אדום, עצור</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* First Conditional */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  First Conditional - תנאי מציאותי/עתידי
                </h4>
                <div className="grid gap-3">
                  <div className="p-3 bg-white rounded">
                    <p className="font-mono font-semibold text-blue-900 mb-2">If + Present Simple, will + Verb</p>
                    <p className="font-semibold text-blue-900">שימושים:</p>
                    <p className="text-blue-700">תחזיות, אזהרות, הבטחות, איומים</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold text-blue-900">דוגמאות:</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• If it rains, we will cancel the picnic - אם יירד גשם, נבטל את הפיקניק</li>
                      <li>• If you don't hurry, you will miss the bus - אם לא תמהר, תפספס את האוטובוס</li>
                      <li>• If I see him, I'll tell him to call you - אם אני אראה אותו, אומר לו להתקשר אליך</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Second Conditional */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Second Conditional - תנאי דמיוני/לא מציאותי בהווה
                </h4>
                <div className="grid gap-3">
                  <div className="p-3 bg-white rounded">
                    <p className="font-mono font-semibold text-purple-900 mb-2">If + Past Simple, would + Verb</p>
                    <p className="font-semibold text-purple-900">שימושים:</p>
                    <p className="text-purple-700">חלומות, מצבים לא מציאותיים, עצות היפותטיות</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold text-purple-900">דוגמאות:</p>
                    <ul className="text-purple-700 space-y-1">
                      <li>• If I had a million dollars, I would buy a big house - אם היה לי מיליון דולר, הייתי קונה בית גדול</li>
                      <li>• If she were here, she would help us - אם היא הייתה פה, היא הייתה עוזרת לנו</li>
                      <li>• If I were you, I would study more - אם הייתי במקומך, הייתי לומד יותר</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded border-l-2 border-yellow-400">
                    <p className="text-sm text-yellow-800"><strong>שים לב:</strong> באנגלית תקנית אפשר להגיד "If I were..." (ולא was) - במיוחד בכתיבה פורמלית ובאמיר"ם!</p>
                  </div>
                </div>
              </div>

              {/* Third Conditional */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Third Conditional - תנאי דמיוני/לא מציאותי בעבר
                </h4>
                <div className="grid gap-3">
                  <div className="p-3 bg-white rounded">
                    <p className="font-mono font-semibold text-orange-900 mb-2">If + Past Perfect, would have + V3</p>
                    <p className="font-semibold text-orange-900">שימושים:</p>
                    <p className="text-orange-700">חיים בדיעבד, חרטה, מצבים שלא קרו בעבר</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold text-orange-900">דוגמאות:</p>
                    <ul className="text-orange-700 space-y-1">
                      <li>• If I had left home earlier, I would have caught the bus - אם הייתי יוצא מהבית מוקדם יותר, הייתי תופס את האוטובוס</li>
                      <li>• If they had studied harder, they would have passed the exam - אם הם היו לומדים יותר קשה, הם היו עוברים את המבחן</li>
                      <li>• If you had listened to me, you wouldn't have made that mistake - אם היית מקשיב לי, לא היית עושה את הטעות הזאת</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference Table */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              טבלת זיהוי מהיר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-right font-semibold">סוג תנאי</th>
                    <th className="border p-3 text-right font-semibold">מבנה</th>
                    <th className="border p-3 text-right font-semibold">שימוש</th>
                    <th className="border p-3 text-right font-semibold">דוגמה</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-medium text-green-700">Zero</td>
                    <td className="border p-3 font-mono text-sm">If + Present, Present</td>
                    <td className="border p-3 text-sm">חוקי טבע, אמיתות</td>
                    <td className="border p-3 text-sm">If you heat ice, it melts</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-medium text-blue-700">First</td>
                    <td className="border p-3 font-mono text-sm">If + Present, will + V</td>
                    <td className="border p-3 text-sm">עתיד אפשרי</td>
                    <td className="border p-3 text-sm">If it rains, I will stay home</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-medium text-purple-700">Second</td>
                    <td className="border p-3 font-mono text-sm">If + Past, would + V</td>
                    <td className="border p-3 text-sm">דמיוני בהווה</td>
                    <td className="border p-3 text-sm">If I were rich, I would travel</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-medium text-orange-700">Third</td>
                    <td className="border p-3 font-mono text-sm">If + Past Perfect, would have + V3</td>
                    <td className="border p-3 text-sm">דמיוני בעבר</td>
                    <td className="border p-3 text-sm">If I had known, I would have come</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="font-semibold text-blue-800 mb-2">טיפ למבחן:</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• אם יש <strong>will</strong> בצד התוצאה - כנראה First Conditional</li>
                <li>• אם יש <strong>would</strong> בצד התוצאה - כנראה Second Conditional</li>
                <li>• אם יש <strong>would have + V3</strong> - Third Conditional</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <Users className="h-6 w-6 mr-2" />
              דוגמאות ממבחני אמיר"ם
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
              <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות אופייניות לאמיר"ם</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">If you ___ (be) taller, you ___ (can) reach the shelf.</p>
                  <p className="text-sm text-gray-600">(be: was/were) (can: could/can)</p>
                  <p className="text-green-700 font-medium">תשובה: were / could</p>
                  <p className="text-sm text-gray-500">הסבר: Second Conditional - מצב דמיוני בהווה</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">If I ___ (know) about the party, I ___ (go).</p>
                  <p className="text-sm text-gray-600">(know: knew/had known) (go: would go/would have gone)</p>
                  <p className="text-green-700 font-medium">תשובה: had known / would have gone</p>
                  <p className="text-sm text-gray-500">הסבר: Third Conditional - מצב שלא קרה בעבר</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">If it ___ (rain) tomorrow, we ___ (stay) home.</p>
                  <p className="text-sm text-gray-600">(rain: rains/will rain) (stay: stay/will stay)</p>
                  <p className="text-green-700 font-medium">תשובה: rains / will stay</p>
                  <p className="text-sm text-gray-500">הסבר: First Conditional - תוצאה עתידית אפשרית</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">If you ___ (heat) ice, it ___.</p>
                  <p className="text-sm text-gray-600">(heat: heat/will heat) (melt: melts/will melt)</p>
                  <p className="text-green-700 font-medium">תשובה: heat / melts</p>
                  <p className="text-sm text-gray-500">הסבר: Zero Conditional - חוק טבע</p>
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
                <h4 className="font-semibold text-red-800 mb-3">ערבוב זמנים במבנה</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">If he will come, I will help him</p>
                        <p className="text-red-600 text-sm">אסור will ב-if clause של First Conditional</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">If he <strong>comes</strong>, I will help him</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שימוש שגוי ב-was/were (ב-If)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>If I <strong>was</strong> rich, I would travel</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>If I <strong>were</strong> rich, I would travel</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">ערבוב תנאים שונים</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>If he studies, he would pass</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>If he studies, he <strong>will</strong> pass <strong>או</strong> If he <strong>studied</strong>, he would pass</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">Third Conditional - טעויות נפוצות</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>If she <strong>would have studied</strong>, she would have passed</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>If she <strong>had studied</strong>, she would have passed</span>
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
                    <p>1. If she ___ (study), she will succeed.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. If I ___ (be) you, I would not do it.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. If we ___ (leave) earlier, we would have caught the train.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. If you ___ (heat) ice, it melts.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. If they ___ (have) enough money, they ___ (buy) a new car.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. studies (First Conditional)</p>
                    <p>2. were (Second Conditional)</p>
                    <p>3. had left (Third Conditional)</p>
                    <p>4. heat (Zero Conditional)</p>
                    <p>5. had / would buy (Second Conditional)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. If you will call me, I will answer.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. If they would listen, they would learn.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. If she had knew, she would have come.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. If I was rich, I would help everyone.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. If you <strong>call</strong> me, I will answer</p>
                    <p>2. If they <strong>listened</strong>, they would learn</p>
                    <p>3. If she had <strong>known</strong>, she would have come</p>
                    <p>4. If I <strong>were</strong> rich, I would help everyone</p>
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
                <p>משפטי תנאי הם נושא מרכזי באנגלית ובמבחן אמיר"ם. שליטה במבנה, זיהוי סוגי התנאי, והימנעות מטעויות של ערבוב זמנים - הם מפתח להצלחה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• בדוק תמיד את הזמן של כל חלק במשפט!</li>
                  <li>• First: Present → will | Second: Past → would | Third: Past Perfect → would have</li>
                  <li>• חפש רמזים ב-if, would, had, will - זה יכוון אותך ישר לתשובה</li>
                  <li>• זכור: אסור will ב-if clause של First Conditional</li>
                  <li>• ב-Second Conditional השתמש ב-were (לא was) עם I/he/she/it</li>
                  <li>• תרגל כמה שיותר השלמות, תיקונים ויצירת משפטים מכל סוג</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">בהצלחה! זה נושא שמביא נקודות קלות אם מתאמנים! 🎯</p>
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

export default Conditionals;