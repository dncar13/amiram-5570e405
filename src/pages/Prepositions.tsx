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
  MapPin,
  Navigation,
  Link2,
  Hash,
  Calendar,
  Home,
  Compass,
  Activity
} from "lucide-react";

const Prepositions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Prepositions
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            מילות יחס
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            מילות יחס הן <strong>"המילים הקטנות"</strong> שבלעדיהן המשפט לא שלם. הן קובעות זמן, מקום, כיוון וסיבה - 
            והן אחד הנושאים הכי מבלבלים לומדי אנגלית, במיוחד כיוון שאין תמיד חוקי ברזל ויש הרבה צירופים קבועים!
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookOpen className="h-6 w-6 mr-2" />
              הגדרה ומבנה תחבירי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <h4 className="font-semibold text-gray-900 mb-3">מהי Preposition?</h4>
              <p className="text-lg font-medium text-gray-800 mb-4">
                מילת יחס היא מילה שמקשרת בין שם עצם או כינוי גוף לחלק אחר במשפט, ומציינת יחס של:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="font-semibold text-blue-800">מקום</p>
                  <p className="text-xs text-blue-600">in, on, at</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-green-600" />
                  <p className="font-semibold text-green-800">זמן</p>
                  <p className="text-xs text-green-600">at, on, in</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <Navigation className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <p className="font-semibold text-purple-800">כיוון</p>
                  <p className="text-xs text-purple-600">to, from, into</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <Activity className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                  <p className="font-semibold text-orange-800">סיבה</p>
                  <p className="text-xs text-orange-600">because of, due to</p>
                </div>
              </div>
              
              <div className="mt-4 text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                  The book is <strong>on</strong> the table | She lives <strong>in</strong> Tel Aviv
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Prepositions */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              מילות יחס לזמן - Time Prepositions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    IN
                  </h4>
                  <p className="text-blue-700 text-sm mb-2">שנה, חודש, עונה, חלק יום כללי</p>
                  <ul className="text-blue-600 text-xs space-y-1">
                    <li>• <strong>in</strong> 2024</li>
                    <li>• <strong>in</strong> June</li>
                    <li>• <strong>in</strong> summer</li>
                    <li>• <strong>in</strong> the morning</li>
                    <li>• <strong>in</strong> the evening</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    ON
                  </h4>
                  <p className="text-green-700 text-sm mb-2">יום, תאריך מדויק</p>
                  <ul className="text-green-600 text-xs space-y-1">
                    <li>• <strong>on</strong> Monday</li>
                    <li>• <strong>on</strong> July 4th</li>
                    <li>• <strong>on</strong> my birthday</li>
                    <li>• <strong>on</strong> Friday evening</li>
                    <li>• <strong>on</strong> the weekend</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    AT
                  </h4>
                  <p className="text-purple-700 text-sm mb-2">שעה מדויקת, רגע ספציפי</p>
                  <ul className="text-purple-600 text-xs space-y-1">
                    <li>• <strong>at</strong> 5 pm</li>
                    <li>• <strong>at</strong> midnight</li>
                    <li>• <strong>at</strong> noon</li>
                    <li>• <strong>at</strong> night</li>
                    <li>• <strong>at</strong> the same time</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <p className="font-semibold text-yellow-800 mb-1">💡 טיפ לזכירה:</p>
                <p className="text-yellow-700 text-sm">
                  <strong>IN</strong> = תקופות ארוכות | <strong>ON</strong> = ימים ותאריכים | <strong>AT</strong> = שעות ורגעים מדויקים
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Place Prepositions */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <MapPin className="h-6 w-6 mr-2" />
              מילות יחס למקום - Place Prepositions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    IN
                  </h4>
                  <p className="text-blue-700 text-sm mb-2">בתוך, ערים, מדינות, אזורים</p>
                  <ul className="text-blue-600 text-xs space-y-1">
                    <li>• <strong>in</strong> a room</li>
                    <li>• <strong>in</strong> Israel</li>
                    <li>• <strong>in</strong> Tel Aviv</li>
                    <li>• <strong>in</strong> the box</li>
                    <li>• <strong>in</strong> the garden</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    ON
                  </h4>
                  <p className="text-green-700 text-sm mb-2">על, משטחים, רחובות</p>
                  <ul className="text-green-600 text-xs space-y-1">
                    <li>• <strong>on</strong> the table</li>
                    <li>• <strong>on</strong> Main Street</li>
                    <li>• <strong>on</strong> the wall</li>
                    <li>• <strong>on</strong> the first floor</li>
                    <li>• <strong>on</strong> the bus</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    AT
                  </h4>
                  <p className="text-purple-700 text-sm mb-2">נקודה מדויקת, מקומות ספציפיים</p>
                  <ul className="text-purple-600 text-xs space-y-1">
                    <li>• <strong>at</strong> the station</li>
                    <li>• <strong>at</strong> home</li>
                    <li>• <strong>at</strong> school</li>
                    <li>• <strong>at</strong> the corner</li>
                    <li>• <strong>at</strong> the door</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movement Prepositions */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Navigation className="h-6 w-6 mr-2" />
              מילות יחס לתנועה וכיוון
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">תנועה לכיוון:</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-mono text-sm"><strong>to</strong> - She's going <strong>to</strong> school</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-mono text-sm"><strong>into</strong> - He walked <strong>into</strong> the room</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="font-mono text-sm"><strong>towards</strong> - Moving <strong>towards</strong> the city</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">תנועה מהמקור:</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-orange-50 rounded">
                    <p className="font-mono text-sm"><strong>from</strong> - He came <strong>from</strong> France</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <p className="font-mono text-sm"><strong>out of</strong> - She went <strong>out of</strong> the building</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="font-mono text-sm"><strong>away from</strong> - Stay <strong>away from</strong> danger</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Collocations */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <Link2 className="h-6 w-6 mr-2" />
              צירופים קבועים - Fixed Collocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-right font-semibold text-blue-800">פועל/תיאור</th>
                    <th className="border p-2 text-center font-semibold text-purple-800">מילת יחס</th>
                    <th className="border p-2 text-right font-semibold text-green-800">דוגמה</th>
                    <th className="border p-2 text-right font-semibold text-orange-800">תרגום</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">wait</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">for</td>
                    <td className="border p-2">Wait <strong>for</strong> me!</td>
                    <td className="border p-2 text-gray-600">חכה לי</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">listen</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">to</td>
                    <td className="border p-2">Listen <strong>to</strong> your teacher</td>
                    <td className="border p-2 text-gray-600">הקשב למורה</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">arrive</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">at/in</td>
                    <td className="border p-2">Arrive <strong>at</strong> school, <strong>in</strong> Paris</td>
                    <td className="border p-2 text-gray-600">הגיע לבית ספר/לפריז</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">interested</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">in</td>
                    <td className="border p-2">She's interested <strong>in</strong> art</td>
                    <td className="border p-2 text-gray-600">היא מתעניינת באמנות</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">afraid</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">of</td>
                    <td className="border p-2">He's afraid <strong>of</strong> dogs</td>
                    <td className="border p-2 text-gray-600">הוא מפחד מכלבים</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">good/bad</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">at</td>
                    <td className="border p-2">I'm good <strong>at</strong> English</td>
                    <td className="border p-2 text-gray-600">אני טוב באנגלית</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">married</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">to</td>
                    <td className="border p-2">She's married <strong>to</strong> John</td>
                    <td className="border p-2 text-gray-600">היא נשואה לג'ון</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">depend</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">on</td>
                    <td className="border p-2">It depends <strong>on</strong> the weather</td>
                    <td className="border p-2 text-gray-600">זה תלוי במזג האוויר</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">think</td>
                    <td className="border p-2 font-mono text-purple-700 text-center">about/of</td>
                    <td className="border p-2">Think <strong>about</strong> it / Think <strong>of</strong> me</td>
                    <td className="border p-2 text-gray-600">תחשוב על זה / תחשוב עליי</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <p className="font-semibold text-blue-800 mb-1">💡 טיפ חשוב:</p>
              <p className="text-blue-700 text-sm">
                אלה צירופים קבועים שצריך ללמוד בעל פה! אין לזה חוק - רק זכירה.
              </p>
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
                  <p className="font-medium">I am good ___ math.</p>
                  <p className="text-sm text-gray-600">(in / at / on)</p>
                  <p className="text-green-700 font-medium">תשובה: at</p>
                  <p className="text-sm text-gray-500">הסבר: צירוף קבוע - good at</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">She lives ___ Tel Aviv.</p>
                  <p className="text-sm text-gray-600">(in / at / on)</p>
                  <p className="text-green-700 font-medium">תשובה: in</p>
                  <p className="text-sm text-gray-500">הסבר: ערים - תמיד in</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">We'll meet ___ 6 o'clock.</p>
                  <p className="text-sm text-gray-600">(in / at / on)</p>
                  <p className="text-green-700 font-medium">תשובה: at</p>
                  <p className="text-sm text-gray-500">הסבר: שעה מדויקת - תמיד at</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He's afraid ___ dogs.</p>
                  <p className="text-sm text-gray-600">(of / from / with)</p>
                  <p className="text-green-700 font-medium">תשובה: of</p>
                  <p className="text-sm text-gray-500">הסבר: צירוף קבוע - afraid of</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">The concert is ___ Friday.</p>
                  <p className="text-sm text-gray-600">(at / in / on)</p>
                  <p className="text-green-700 font-medium">תשובה: on</p>
                  <p className="text-sm text-gray-500">הסבר: יום - תמיד on</p>
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
                <h4 className="font-semibold text-red-800 mb-3">בחירת מילת יחס שגויה</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">He arrived to the airport</p>
                        <p className="text-red-600 text-sm">arrive תמיד עם at (מקום) או in (עיר)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">He arrived <strong>at</strong> the airport</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">טעויות בזמן</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span><strong>in</strong> Monday</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>on</strong> Monday</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span><strong>at</strong> the evening</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>in</strong> the evening</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">טעויות בצירופים קבועים</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She is married <strong>with</strong> a doctor</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She is married <strong>to</strong> a doctor</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>I'm interested <strong>about</strong> art</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>I'm interested <strong>in</strong> art</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">שכחת מילת יחס</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Listen me!</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Listen <strong>to</strong> me!</span>
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
                    <p>1. Are you interested ___ sports?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. I arrived ___ the station early.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The test is ___ July.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. She depends ___ her friends.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. They went ___ the cinema.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>6. The meeting is ___ Monday ___ 3 pm.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. in (interested in - צירוף קבוע)</p>
                    <p>2. at (arrive at - מקום ספציפי)</p>
                    <p>3. in (חודש - תמיד in)</p>
                    <p>4. on (depend on - צירוף קבוע)</p>
                    <p>5. to (תנועה לכיוון)</p>
                    <p>6. on / at (יום=on, שעה=at)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She arrived to the party.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. I'm afraid from spiders.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. We met in Monday morning.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. He's good in playing guitar.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She arrived <strong>at</strong> the party</p>
                    <p>2. I'm afraid <strong>of</strong> spiders</p>
                    <p>3. We met <strong>on</strong> Monday morning</p>
                    <p>4. He's good <strong>at</strong> playing guitar</p>
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
                <p>Prepositions - נושא קטן עם המון כוח! בחר תמיד את מילת היחס הנכונה לפועל או לתיאור, שים לב לצירופים קבועים ולהבדלים בין זמן ומקום. רוב הטעויות נובעות מאי-לימוד צירופים קבועים.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• זכור: arrive <strong>at</strong> (מקום), arrive <strong>in</strong> (עיר/מדינה)</li>
                  <li>• אחרי פעלים כמו listen, depend, wait - תמיד יש מילת יחס!</li>
                  <li>• זמן: IN (תקופות ארוכות), ON (ימים), AT (שעות)</li>
                  <li>• מקום: IN (בתוך/ערים), ON (על/רחובות), AT (נקודה מדויקת)</li>
                  <li>• למד צירופים קבועים בעל פה - interested in, afraid of, good at</li>
                  <li>• תרגל השלמות ומשפטים נפוצים - במבחן זה מביא נקודות מהירות</li>
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

export default Prepositions;