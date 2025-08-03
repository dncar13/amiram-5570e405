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
  Play,
  Infinity as InfinityIcon,
  ArrowRightLeft,
  List,
  Hash,
  Layers,
  FileText,
  Brain
} from "lucide-react";

const GerundsInfinitives: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Gerunds & Infinitives
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            שמות פועל - Gerund (-ing) ו-Infinitive (to + verb)
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Gerunds (צורת ing של הפועל) ו-Infinitives (to + פועל) הם אחד הנושאים הכי מבלבלים לומדי אנגלית. 
            הבנה נכונה של מתי להשתמש ב-<strong>ing</strong> ומתי ב-<strong>to + verb</strong> חיונית להצלחה במבחן אמיר"ם.
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
                    <Play className="h-5 w-5 mr-2" />
                    Gerund (-ing)
                  </h4>
                  <p className="text-blue-700 mb-2">פועל בצורת ing המשמש כשם עצם</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono"><strong>Swimming</strong> is fun</p>
                    <p className="font-mono">I enjoy <strong>reading</strong></p>
                    <p className="text-blue-600 italic">שימוש כנושא או מושא</p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <InfinityIcon className="h-5 w-5 mr-2" />
                    Infinitive (to + verb)
                  </h4>
                  <p className="text-purple-700 mb-2">to + צורת הבסיס של הפועל</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono">I want <strong>to learn</strong> English</p>
                    <p className="font-mono">It's easy <strong>to understand</strong></p>
                    <p className="text-purple-600 italic">אחרי פעלים ותארים מסוימים</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="font-mono text-lg text-blue-800">
                    <strong>Swimming</strong> helps you relax
                  </p>
                  <p className="font-mono text-lg text-purple-800">
                    I want <strong>to swim</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Use Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <ArrowRightLeft className="h-6 w-6 mr-2" />
              מתי משתמשים בכל אחד?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Gerund Verbs */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  פעלים שמצריכים Gerund (-ing)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">פעלים נפוצים:</h5>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• <strong>enjoy</strong> - I enjoy reading</li>
                      <li>• <strong>finish</strong> - He finished studying</li>
                      <li>• <strong>avoid</strong> - She avoids eating late</li>
                      <li>• <strong>suggest</strong> - They suggested going</li>
                      <li>• <strong>keep</strong> - Keep practicing!</li>
                      <li>• <strong>mind</strong> - Do you mind waiting?</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">עוד פעלים:</h5>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• <strong>practice</strong> - Practice speaking</li>
                      <li>• <strong>consider</strong> - Consider moving</li>
                      <li>• <strong>admit</strong> - He admitted lying</li>
                      <li>• <strong>deny</strong> - She denied stealing</li>
                      <li>• <strong>imagine</strong> - Imagine living there</li>
                      <li>• <strong>miss</strong> - I miss seeing you</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Infinitive Verbs */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <InfinityIcon className="h-5 w-5 mr-2" />
                  פעלים שמצריכים Infinitive (to + verb)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">פעלים נפוצים:</h5>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• <strong>want</strong> - I want to go</li>
                      <li>• <strong>need</strong> - She needs to study</li>
                      <li>• <strong>decide</strong> - They decided to move</li>
                      <li>• <strong>hope</strong> - We hope to see you</li>
                      <li>• <strong>plan</strong> - I plan to travel</li>
                      <li>• <strong>promise</strong> - He promised to help</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">עוד פעלים:</h5>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• <strong>learn</strong> - Learn to drive</li>
                      <li>• <strong>expect</strong> - I expect to win</li>
                      <li>• <strong>agree</strong> - They agreed to come</li>
                      <li>• <strong>refuse</strong> - She refused to answer</li>
                      <li>• <strong>offer</strong> - He offered to help</li>
                      <li>• <strong>choose</strong> - Choose to be happy</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Both Forms */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  פעלים שיכולים לבוא עם שניהם (משמעות משתנה!)
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded">
                    <h5 className="font-semibold text-orange-900">Remember:</h5>
                    <p className="text-orange-700 text-sm">• <strong>Remember to call</strong> me (תזכור לעשות משהו בעתיד)</p>
                    <p className="text-orange-700 text-sm">• <strong>Remember calling</strong> her? (אתה זוכר שעשית משהו בעבר?)</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <h5 className="font-semibold text-orange-900">Stop:</h5>
                    <p className="text-orange-700 text-sm">• <strong>Stop to rest</strong> (עצור כדי לנוח)</p>
                    <p className="text-orange-700 text-sm">• <strong>Stop smoking</strong> (הפסק לעשן)</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <h5 className="font-semibold text-orange-900">Try:</h5>
                    <p className="text-orange-700 text-sm">• <strong>Try to understand</strong> (נסה להבין - עשה מאמץ)</p>
                    <p className="text-orange-700 text-sm">• <strong>Try eating</strong> less (נסה לאכול פחות - נסה כניסוי)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Cases Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <CheckCircle className="h-6 w-6 mr-2" />
              מקרים מיוחדים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* After Prepositions */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Hash className="h-5 w-5 mr-2" />
                  אחרי מילות יחס - תמיד Gerund!
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">דוגמאות נפוצות:</h5>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• interested <strong>in learning</strong></li>
                      <li>• good <strong>at swimming</strong></li>
                      <li>• tired <strong>of waiting</strong></li>
                      <li>• excited <strong>about traveling</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">עוד דוגמאות:</h5>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• talked <strong>about moving</strong></li>
                      <li>• think <strong>about changing</strong></li>
                      <li>• dream <strong>of becoming</strong></li>
                      <li>• succeed <strong>in passing</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* After Adjectives */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  אחרי תארים - לרוב Infinitive
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-blue-900">מבנה: It's + Adjective + to + verb</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 text-blue-700 text-sm">
                      <p>• It's <strong>easy to learn</strong></p>
                      <p>• It's <strong>important to study</strong></p>
                      <p>• It's <strong>difficult to understand</strong></p>
                    </div>
                    <div className="space-y-1 text-blue-700 text-sm">
                      <p>• She was <strong>happy to help</strong></p>
                      <p>• I'm <strong>ready to go</strong></p>
                      <p>• They're <strong>excited to start</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* As Subject/Object */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Gerund כנושא או מושא
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">כנושא:</h5>
                    <ul className="text-purple-700 space-y-1 text-sm">
                      <li>• <strong>Cooking</strong> takes time</li>
                      <li>• <strong>Swimming</strong> is healthy</li>
                      <li>• <strong>Learning</strong> English is fun</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">כמושא:</h5>
                    <ul className="text-purple-700 space-y-1 text-sm">
                      <li>• I enjoy <strong>cooking</strong></li>
                      <li>• She loves <strong>swimming</strong></li>
                      <li>• We practice <strong>speaking</strong></li>
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
              <List className="h-6 w-6 mr-2" />
              טבלת פעלים נפוצים - זכירה חיונית למבחן!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-center font-semibold text-blue-800">רק עם Gerund (-ing)</th>
                    <th className="border p-3 text-center font-semibold text-purple-800">רק עם Infinitive (to + verb)</th>
                    <th className="border p-3 text-center font-semibold text-orange-800">שניהם (משמעות משתנה)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 text-blue-700">
                      <ul className="space-y-1">
                        <li>• <strong>enjoy</strong> - I enjoy reading</li>
                        <li>• <strong>finish</strong> - He finished eating</li>
                        <li>• <strong>avoid</strong> - Avoid smoking</li>
                        <li>• <strong>suggest</strong> - I suggest going</li>
                        <li>• <strong>keep</strong> - Keep trying</li>
                        <li>• <strong>practice</strong> - Practice speaking</li>
                        <li>• <strong>mind</strong> - Do you mind waiting?</li>
                        <li>• <strong>consider</strong> - Consider buying</li>
                        <li>• <strong>admit</strong> - He admitted lying</li>
                      </ul>
                    </td>
                    <td className="border p-3 text-purple-700">
                      <ul className="space-y-1">
                        <li>• <strong>want</strong> - I want to go</li>
                        <li>• <strong>decide</strong> - She decided to study</li>
                        <li>• <strong>hope</strong> - We hope to win</li>
                        <li>• <strong>need</strong> - You need to rest</li>
                        <li>• <strong>plan</strong> - They plan to travel</li>
                        <li>• <strong>agree</strong> - I agree to help</li>
                        <li>• <strong>promise</strong> - He promised to call</li>
                        <li>• <strong>refuse</strong> - She refused to go</li>
                        <li>• <strong>learn</strong> - Learn to drive</li>
                      </ul>
                    </td>
                    <td className="border p-3 text-orange-700">
                      <ul className="space-y-1">
                        <li>• <strong>remember</strong> 
                          <br />- to call (עתיד)
                          <br />- calling (עבר)
                        </li>
                        <li>• <strong>forget</strong>
                          <br />- to do (עתיד) 
                          <br />- doing (עבר)
                        </li>
                        <li>• <strong>stop</strong>
                          <br />- to rest (כדי)
                          <br />- smoking (הפסק)
                        </li>
                        <li>• <strong>try</strong>
                          <br />- to understand (מאמץ)
                          <br />- eating less (ניסוי)
                        </li>
                        <li>• <strong>like/love/hate/prefer</strong>
                          <br />- (דומה לרוב)
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                  <p className="font-medium">I finished ___ my homework.</p>
                  <p className="text-sm text-gray-600">(to do / doing / do)</p>
                  <p className="text-green-700 font-medium">תשובה: doing</p>
                  <p className="text-sm text-gray-500">הסבר: finish תמיד לוקח gerund</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">They promised ___ us.</p>
                  <p className="text-sm text-gray-600">(to help / helping / help)</p>
                  <p className="text-green-700 font-medium">תשובה: to help</p>
                  <p className="text-sm text-gray-500">הסבר: promise תמיד לוקח infinitive</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">She's interested in ___ Spanish.</p>
                  <p className="text-sm text-gray-600">(to learn / learning / learn)</p>
                  <p className="text-green-700 font-medium">תשובה: learning</p>
                  <p className="text-sm text-gray-500">הסבר: אחרי מילת יחס (in) תמיד gerund</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He enjoys ___ in the sea.</p>
                  <p className="text-sm text-gray-600">(to swim / swimming / swim)</p>
                  <p className="text-green-700 font-medium">תשובה: swimming</p>
                  <p className="text-sm text-gray-500">הסבר: enjoy תמיד לוקח gerund</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">It's important ___ healthy food.</p>
                  <p className="text-sm text-gray-600">(to eat / eating / eat)</p>
                  <p className="text-green-700 font-medium">תשובה: to eat</p>
                  <p className="text-sm text-gray-500">הסבר: It's + adjective + infinitive</p>
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
                <h4 className="font-semibold text-red-800 mb-3">ערבוב Gerund ו-Infinitive</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">I enjoy to read books</p>
                        <p className="text-red-600 text-sm">enjoy תמיד לוקח gerund</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">I enjoy <strong>reading</strong> books</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">טעויות עם want, need, decide</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>I want <strong>going</strong> home</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>I want <strong>to go</strong> home</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She decided <strong>studying</strong> French</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She decided <strong>to study</strong> French</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש שגוי אחרי מילות יחס</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She is good at <strong>to draw</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She is good at <strong>drawing</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>We talked about <strong>to visit</strong> the museum</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>We talked about <strong>visiting</strong> the museum</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">בלבול עם suggest</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He suggested <strong>to go</strong> to the cinema</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He suggested <strong>going</strong> to the cinema</span>
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
                    <p>1. I like ___ (to read / reading) before bed.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She hopes ___ (to get / getting) the job.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. They are good at ___ (play / playing) basketball.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. He agreed ___ (to help / helping) us.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. We finished ___ (to clean / cleaning) the house.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>6. It's important ___ (to study / studying) hard.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. reading (like יכול לקחת שניהם, אבל reading נפוץ יותר)</p>
                    <p>2. to get (hope תמיד לוקח infinitive)</p>
                    <p>3. playing (אחרי מילת יחס תמיד gerund)</p>
                    <p>4. to help (agree תמיד לוקח infinitive)</p>
                    <p>5. cleaning (finish תמיד לוקח gerund)</p>
                    <p>6. to study (It's + adjective + infinitive)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. He decided going abroad.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We talked about to visit the museum.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. I enjoy to play football.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. She's interested in to learn Chinese.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. He decided <strong>to go</strong> abroad</p>
                    <p>2. We talked about <strong>visiting</strong> the museum</p>
                    <p>3. I enjoy <strong>playing</strong> football</p>
                    <p>4. She's interested in <strong>learning</strong> Chinese</p>
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
                <p>Gerunds & Infinitives מופיעים הרבה באמיר"ם - בזיהוי, השלמה, ותיקון. יש לשים לב אילו פעלים דורשים ing, אילו to, ולא להתבלבל אחרי מילות יחס שתמיד לוקחות gerund.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• <strong>זכור את רשימת הפעלים הנפוצים!</strong></li>
                  <li>• enjoy, suggest, finish - תמיד ing</li>
                  <li>• want, decide, hope - תמיד to</li>
                  <li>• אחרי מילת יחס (in, at, about) - תמיד ing</li>
                  <li>• פעלים כמו remember, stop, try - בדוק את ההקשר!</li>
                  <li>• It's + adjective + infinitive</li>
                  <li>• תרגל במיוחד השלמות משפטים - זה נושא שחוזר הרבה</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">בהצלחה! חזרה על פעלים עיקריים חוסכת טעויות במבחן! 🎯</p>
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

export default GerundsInfinitives;