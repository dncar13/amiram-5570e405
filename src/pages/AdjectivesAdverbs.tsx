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
  FileText,
  Zap,
  ArrowRightLeft,
  Star,
  Hash,
  Eye,
  Activity,
  Settings
} from "lucide-react";

const AdjectivesAdverbs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Adjectives & Adverbs
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            תארים ותוארי פועל
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Adjectives (תארים) ו-Adverbs (תוארי פועל) הם כלי מפתח להבעה מדויקת ותיאור מצבים ופעולות. 
            לעיתים הבדל קטן בין תואר ותואר פועל משנה את משמעות המשפט - וזה חוזר הרבה במבחן אמיר"ם!
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookOpen className="h-6 w-6 mr-2" />
              הגדרות בסיסיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Adjective (תואר)
                  </h4>
                  <p className="text-blue-700 mb-3">מתאר <strong>שם עצם</strong> (noun)</p>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-white rounded">
                      <p className="font-mono">a <strong>big</strong> house</p>
                      <p className="font-mono">a <strong>beautiful</strong> song</p>
                      <p className="font-mono">She is <strong>happy</strong></p>
                    </div>
                    <p className="text-blue-600 italic text-xs">
                      מיקום: לפני שם העצם או אחרי be/seem/look
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Adverb (תואר פועל)
                  </h4>
                  <p className="text-purple-700 mb-3">מתאר <strong>פועל</strong>, תואר, או adverb אחר</p>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-white rounded">
                      <p className="font-mono">He runs <strong>quickly</strong></p>
                      <p className="font-mono">She sings <strong>beautifully</strong></p>
                      <p className="font-mono">It's <strong>really</strong> hard</p>
                    </div>
                    <p className="text-purple-600 italic text-xs">
                      מיקום: לרוב אחרי הפועל או בתחילת/סוף המשפט
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="font-mono text-lg text-blue-800">
                    The <strong>quick</strong> cat (תואר + שם עצם)
                  </p>
                  <p className="font-mono text-lg text-purple-800">
                    The cat runs <strong>quickly</strong> (פועל + תואר פועל)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Rules Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Settings className="h-6 w-6 mr-2" />
              שימושים עיקריים ודגשים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Adjectives Usage */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Adjectives - תיאור שם עצם
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">לפני שם העצם:</h5>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• a <strong>small</strong> cat</li>
                      <li>• an <strong>old</strong> building</li>
                      <li>• a <strong>beautiful</strong> flower</li>
                      <li>• an <strong>interesting</strong> book</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">אחרי פעלי קישור:</h5>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• She is <strong>happy</strong></li>
                      <li>• The car looks <strong>new</strong></li>
                      <li>• He seems <strong>tired</strong></li>
                      <li>• The food tastes <strong>good</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Adverbs Usage */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Adverbs - תיאור פעולה/תואר/Adverb אחר
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">מתאר פועל:</h5>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• She drives <strong>carefully</strong></li>
                      <li>• He speaks <strong>fluently</strong></li>
                      <li>• They work <strong>hard</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">מתאר תואר:</h5>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• <strong>Very</strong> smart</li>
                      <li>• <strong>Really</strong> beautiful</li>
                      <li>• <strong>Extremely</strong> difficult</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">מתאר adverb:</h5>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• <strong>Very</strong> quickly</li>
                      <li>• <strong>Quite</strong> slowly</li>
                      <li>• <strong>Really</strong> well</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Frequency Adverbs */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Adverbs of Frequency (מילות תדירות)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-white rounded text-center">
                    <p className="font-bold text-green-800">always</p>
                    <p className="text-green-600">תמיד</p>
                  </div>
                  <div className="p-2 bg-white rounded text-center">
                    <p className="font-bold text-green-800">usually</p>
                    <p className="text-green-600">בדרך כלל</p>
                  </div>
                  <div className="p-2 bg-white rounded text-center">
                    <p className="font-bold text-green-800">often</p>
                    <p className="text-green-600">לעיתים קרובות</p>
                  </div>
                  <div className="p-2 bg-white rounded text-center">
                    <p className="font-bold text-green-800">never</p>
                    <p className="text-green-600">אף פעם לא</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white rounded">
                  <p className="text-sm text-green-700">
                    <strong>מיקום:</strong> I <strong>always</strong> eat breakfast / She <strong>never</strong> arrives late
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tricky Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <Star className="h-6 w-6 mr-2" />
              מילים בעייתיות - משמעות שונה!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-center font-semibold text-blue-800">Adjective</th>
                    <th className="border p-3 text-center font-semibold text-purple-800">Adverb</th>
                    <th className="border p-3 text-center font-semibold text-orange-800">הערה חשובה</th>
                    <th className="border p-3 text-center font-semibold text-green-800">דוגמה</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">good</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">well</td>
                    <td className="border p-3 text-sm">good = תואר, well = תואר פועל</td>
                    <td className="border p-3 text-sm">He is good / He plays well</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">fast</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">fast</td>
                    <td className="border p-3 text-sm">אותו דבר! (לא fastly)</td>
                    <td className="border p-3 text-sm">A fast car / He runs fast</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">hard</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">hard</td>
                    <td className="border p-3 text-sm">אותו דבר! (hardly = כמעט לא)</td>
                    <td className="border p-3 text-sm">Hard work / Work hard</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">late</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">late</td>
                    <td className="border p-3 text-sm">late = מאוחר; lately = לאחרונה</td>
                    <td className="border p-3 text-sm">I'm late / He arrived late</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">easy</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">easily</td>
                    <td className="border p-3 text-sm">נוסף -ly רגיל</td>
                    <td className="border p-3 text-sm">Easy test / He won easily</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-blue-700 text-center">careful</td>
                    <td className="border p-3 font-mono text-purple-700 text-center">carefully</td>
                    <td className="border p-3 text-sm">נוסף -ly רגיל</td>
                    <td className="border p-3 text-sm">Careful driver / Drive carefully</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ זהירות מילים מטעות:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p className="text-yellow-700">• <strong>hardly</strong> = כמעט לא (לא "קשה"!)</p>
                <p className="text-yellow-700">• <strong>lately</strong> = לאחרונה (לא "מאוחר"!)</p>
                <p className="text-yellow-700">• <strong>nearly</strong> = כמעט</p>
                <p className="text-yellow-700">• <strong>really</strong> = באמת</p>
              </div>
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
                  <p className="font-medium">She sings ___.</p>
                  <p className="text-sm text-gray-600">(beautiful / beautifully)</p>
                  <p className="text-green-700 font-medium">תשובה: beautifully</p>
                  <p className="text-sm text-gray-500">הסבר: מתאר איך היא שרה (פועל) → adverb</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">The test was very ___.</p>
                  <p className="text-sm text-gray-600">(hard / hardly)</p>
                  <p className="text-green-700 font-medium">תשובה: hard</p>
                  <p className="text-sm text-gray-500">הסבר: מתאר את המבחן (שם עצם) → adjective</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He answered the question ___.</p>
                  <p className="text-sm text-gray-600">(correct / correctly)</p>
                  <p className="text-green-700 font-medium">תשובה: correctly</p>
                  <p className="text-sm text-gray-500">הסבר: מתאר איך הוא ענה (פועל) → adverb</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He is a ___ student.</p>
                  <p className="text-sm text-gray-600">(good / well)</p>
                  <p className="text-green-700 font-medium">תשובה: good</p>
                  <p className="text-sm text-gray-500">הסבר: מתאר תלמיד (שם עצם) → adjective</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He runs ___.</p>
                  <p className="text-sm text-gray-600">(fast / fastly)</p>
                  <p className="text-green-700 font-medium">תשובה: fast</p>
                  <p className="text-sm text-gray-500">הסבר: fast הוא גם adjective וגם adverb - אין fastly!</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש שגוי בצורת התואר/תואר פועל</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She sings beautiful</p>
                        <p className="text-red-600 text-sm">צריך adverb כי מתאר איך היא שרה</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She sings <strong>beautifully</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">ערבוב בין תארים לתוארי פועל</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She is <strong>quickly</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She is <strong>quick</strong></span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    אחרי "be" שמים תואר (adjective), לא תואר פועל (adverb)!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">טעויות עם good/well</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He did the test <strong>good</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He did the test <strong>well</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He is a <strong>good</strong> student</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">מילים חריגות - יצירת adverb שגויה</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He runs <strong>fastly</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He runs <strong>fast</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>I <strong>hardly</strong> work (אם מתכוונים "קשה")</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>I work <strong>hard</strong></span>
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
                    <p>1. She speaks English ___ (fluent / fluently).</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. They finished the project ___ (quick / quickly).</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The weather is very ___ (bad / badly) today.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. He answered ___ (polite / politely).</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. This is a ___ (real / really) difficult question.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>6. She drives very ___ (careful / carefully).</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. fluently (מתאר איך היא מדברת → adverb)</p>
                    <p>2. quickly (מתאר איך הם סיימו → adverb)</p>
                    <p>3. bad (מתאר את מזג האוויר → adjective)</p>
                    <p>4. politely (מתאר איך הוא ענה → adverb)</p>
                    <p>5. really (מתאר כמה קשה → adverb מתאר adjective)</p>
                    <p>6. carefully (מתאר איך היא נוהגת → adverb)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. He did the work perfect.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She is beautifully.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. They speak English very good.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The car is moving fastly.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. He did the work <strong>perfectly</strong></p>
                    <p>2. She is <strong>beautiful</strong></p>
                    <p>3. They speak English very <strong>well</strong></p>
                    <p>4. The car is moving <strong>fast</strong></p>
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
                <p>Adjectives & Adverbs - נושא מרכזי להצלחה באנגלית ובאמיר"ם. שליטה בזיהוי, שימוש נכון, והבדלה בין צורות דומות (good/well, fast/fast) מביאה נקודות קלות במבחן.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• תמיד בדוק למה אתה מתאר: פועל → adverb; שם עצם → adjective</li>
                  <li>• שים לב למילים חריגות: good/well, fast/fast, hard/hard</li>
                  <li>• לא תמיד מוסיפים -ly! (fast, hard, late)</li>
                  <li>• אחרי פועל עזר (be, seem, look) - תשתמש בתואר (adjective)!</li>
                  <li>• זכור: hardly = כמעט לא (לא "קשה"), lately = לאחרונה</li>
                  <li>• תרגל במיוחד השלמת משפטים ומציאת טעויות</li>
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

export default AdjectivesAdverbs;