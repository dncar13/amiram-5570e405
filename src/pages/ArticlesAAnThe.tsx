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
  Hash,
  Eye,
  Globe
} from "lucide-react";

const ArticlesAAnThe: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Articles (A/An/The)
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            תווי היידוע
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            המילים הקטנות a, an, the – נקראות באנגלית <strong>articles</strong> – והן חיוניות לאנגלית תקינה. 
            הן קובעות האם שם העצם מדבר על משהו כללי או מסוים. זהו נושא מרכזי במבחן אמיר"ם עם הרבה "מלכודות".
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
                <strong>Articles</strong> are small but essential words in English, helping us specify nouns clearly and correctly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">A / An</h4>
                  <p className="text-sm text-blue-600">Indefinite articles</p>
                  <p className="text-xs text-blue-500">משהו כללי/לא מוגדר</p>
                </div>
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800">The</h4>
                  <p className="text-sm text-purple-600">Definite article</p>
                  <p className="text-xs text-purple-500">משהו מסוים וידוע</p>
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800">Zero Article</h4>
                  <p className="text-sm text-green-600">No article needed</p>
                  <p className="text-xs text-green-500">אין צורך ב-article</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Rules Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              כללי השימוש הבסיסיים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* A vs An */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Hash className="h-5 w-5 mr-2 text-blue-600" />
                  A או An? - הכלל הזהב
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded border-2 border-blue-200">
                    <h5 className="font-semibold text-blue-800">A</h5>
                    <p className="text-blue-700 mb-2">לפני צליל עיצור (consonant sound)</p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• <strong>a</strong> book</li>
                      <li>• <strong>a</strong> car</li>
                      <li>• <strong>a</strong> university (יו-ני-ברסיטי)</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border-2 border-purple-200">
                    <h5 className="font-semibold text-purple-800">An</h5>
                    <p className="text-purple-700 mb-2">לפני צליל תנועה (vowel sound)</p>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• <strong>an</strong> apple</li>
                      <li>• <strong>an</strong> hour (אַוּר)</li>
                      <li>• <strong>an</strong> idea</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-yellow-800 font-medium">
                    💡 הסוד: מתייחסים לצליל, לא לאות הראשונה!
                  </p>
                </div>
              </div>

              {/* The Usage */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-600" />
                  מתי משתמשים ב-The
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-gray-900">דבר מסוים וידוע</h5>
                      <p className="text-gray-700"><strong>The</strong> teacher is absent today</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-gray-900">יחיד במינו</h5>
                      <p className="text-gray-700"><strong>The</strong> sun rises in the east</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-gray-900">משהו שכבר הוזכר</h5>
                      <p className="text-gray-700">I saw a dog. <strong>The</strong> dog was friendly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-gray-900">שמות מקומות מסוימים</h5>
                      <p className="text-gray-700"><strong>The</strong> USA, <strong>the</strong> Nile, <strong>the</strong> Alps</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zero Article */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Zero Article - מתי לא שמים בכלל
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-800 mb-2">דוגמאות נפוצות:</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>Books</strong> are important (רבים כללי)</li>
                      <li>• She speaks <strong>Spanish</strong> (שפות)</li>
                      <li>• I am a <strong>doctor</strong> (מקצוע)</li>
                      <li>• We had <strong>lunch</strong> (ארוחות)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-800 mb-2">שמות מדינות:</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>Egypt</strong>, <strong>Israel</strong>, <strong>Japan</strong></li>
                      <li>• אבל: <strong>the</strong> USA, <strong>the</strong> UK</li>
                    </ul>
                  </div>
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
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">שימוש ב-A/An</h4>
                <p className="text-blue-700 mb-2">כאשר מזכירים משהו בפעם הראשונה, או כשאין חשיבות איזה מהדבר:</p>
                <ul className="text-blue-600 space-y-1">
                  <li>• I need <strong>a</strong> pen - אני צריך עט (כל עט)</li>
                  <li>• She is <strong>an</strong> engineer - היא מהנדסת</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2">שימוש ב-The</h4>
                <p className="text-purple-700 mb-2">כאשר הדובר והמאזין יודעים למה הכוונה:</p>
                <ul className="text-purple-600 space-y-1">
                  <li>• <strong>The</strong> teacher is absent today - המורה (שלנו) לא נוכח</li>
                  <li>• <strong>The</strong> sun rises in the east - השמש (היחידה)</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">Zero Article</h4>
                <p className="text-green-700 mb-2">מתי לא משתמשים בכלל:</p>
                <ul className="text-green-600 space-y-1">
                  <li>• <strong>Egypt</strong> - שמות של מדינות (בלי the)</li>
                  <li>• We had <strong>dinner</strong> at seven - שמות ארוחות</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              סימנים ומילות רמז
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>רמזים לבחירת Article</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">A/An:</p>
                    <p className="text-sm text-blue-600">פעם ראשונה, משהו לא מוגדר</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">The:</p>
                    <p className="text-sm text-purple-600">חזרה על הזכרה, משהו ייחודי</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">Zero:</p>
                    <p className="text-sm text-green-600">רבים כללי, שמות מדינות, ארוחות</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>טיפים מהירים לזיהוי</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• צליל תנועה = <strong>an</strong></li>
                  <li>• צליל עיצור = <strong>a</strong></li>
                  <li>• יחיד במינו = <strong>the</strong></li>
                  <li>• כבר הוזכר = <strong>the</strong></li>
                  <li>• רבים כללי = <strong>ללא article</strong></li>
                </ul>
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
                    <li>• I want <strong>a</strong> sandwich - אני רוצה כריך</li>
                    <li>• She saw <strong>an</strong> elephant at the zoo - היא ראתה פיל בגן החיות</li>
                    <li>• <strong>The</strong> moon looks beautiful tonight - הירח נראה יפה הלילה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• There is <strong>a</strong> university in this city</li>
                    <li>• I have <strong>an</strong> idea for a new app</li>
                    <li>• <strong>The</strong> Nile is the longest river in Africa</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She is ___ excellent student.</p>
                    <p className="text-sm text-gray-600">(a / an / the / –)</p>
                    <p className="text-green-700 font-medium">תשובה: an (צליל תנועה)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">They visited ___ USA last year.</p>
                    <p className="text-sm text-gray-600">(a / an / the / –)</p>
                    <p className="text-green-700 font-medium">תשובה: the (שם מדינה מיוחד)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">He always eats ___ lunch at 1 PM.</p>
                    <p className="text-sm text-gray-600">(a / an / the / –)</p>
                    <p className="text-green-700 font-medium">תשובה: – (שם ארוחה)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ sun rises in the east.</p>
                    <p className="text-sm text-gray-600">(A / An / The / –)</p>
                    <p className="text-green-700 font-medium">תשובה: The (יחיד במינו)</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש שגוי בין a/an</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">a apple</p>
                        <p className="text-red-600 text-sm">צליל תנועה צריך an</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">an apple</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">an dog</p>
                        <p className="text-red-600 text-sm">צליל עיצור צריך a</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">a dog</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שימוש שגוי ב-the</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>I have <strong>a</strong> dog (לא מוגדר איזה כלב)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>I have <strong>the</strong> dog (מרמז על כלב מסוים)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>The</strong> sun is hot (יחיד במינו)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Sun is hot (חסר the)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שכחת Article כשנדרש או שימוש מיותר</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She is <strong>a</strong> teacher</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She is teacher</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He plays football</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He plays <strong>the</strong> football</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">דוגמאות מיוחדות שכדאי לזכור</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="font-medium text-blue-700">צליל מול אות:</p>
                    <ul className="text-sm text-blue-600">
                      <li>• <strong>a</strong> university (יו-ני)</li>
                      <li>• <strong>an</strong> hour (אַוּ-ער)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-blue-700">מדינות:</p>
                    <ul className="text-sm text-blue-600">
                      <li>• <strong>the</strong> USA, <strong>the</strong> UK</li>
                      <li>• Israel, Egypt (בלי the)</li>
                    </ul>
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
                    <p>1. I saw ___ interesting film last night. (a/an/the)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We visited ___ Eiffel Tower in Paris. (a/an/the)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. She wants to be ___ actress. (a/an/the)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. ___ dogs are barking outside. (A/An/The/–)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. I have ___ hour to finish this. (a/an/the)</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. an (צליל תנועה)</p>
                    <p>2. the (שם מקום מסוים)</p>
                    <p>3. an (צליל תנועה)</p>
                    <p>4. The (כלבים מסוימים)</p>
                    <p>5. an (hour נשמע אַוּר - צליל תנועה)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She is actress.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. I saw a hour ago.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The Mount Everest is the highest mountain.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She is <strong>an</strong> actress.</p>
                    <p>2. I saw <strong>an</strong> hour ago.</p>
                    <p>3. <strong>Mount Everest</strong> is the highest mountain. (בלי the)</p>
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
                <p>שימוש נכון ב-a/an/the הוא הבדל בין שפה "בסדר" לבין אנגלית מדויקת – וזה גם מקור לשאלות רבות באמיר"ם. זיהוי נכון של מתי להשתמש ומתי לא להשתמש ב-articles הוא מפתח להצלחה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• עצור ובדוק – האם מדובר בדבר מסוים (the), במשהו כללי (a/an), או שאין צורך בכלל?</li>
                  <li>• שים לב לצליל, לא לאות – זה כל הסיפור של a/an</li>
                  <li>• תזכור שיש ביטויים חריגים (by car, at school, in bed) – בהם אין article</li>
                  <li>• שאלות אמיר"ם אוהבות "מלכודות" של Articles – תרגל תיקון משפטים והשלמות</li>
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

export default ArticlesAAnThe;