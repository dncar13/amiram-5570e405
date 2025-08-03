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
  Quote,
  ArrowRightLeft,
  RefreshCw,
  Calendar,
  HelpCircle,
  MessageCircle,
  UserCheck
} from "lucide-react";

const ReportedSpeech: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Reported Speech
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            דיבור עקיף
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Reported Speech הוא הדרך לספר מה שמישהו אחר אמר - <strong>לא במילים המדויקות שלו</strong>, אלא כציטוט עקיף, 
            לרוב בזמן אחר. זה נושא שמדגיש את ההבדל בין משפט ישיר לבין עקיף וחוזר הרבה במבחן אמיר"ם.
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
              <h4 className="font-semibold text-gray-900 mb-4">משפט ישיר לעומת משפט עקיף</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Quote className="h-5 w-5 mr-2" />
                    Direct Speech (דיבור ישיר)
                  </h4>
                  <p className="text-blue-700 mb-2">המילים המדויקות שנאמרו</p>
                  <div className="p-2 bg-white rounded border">
                    <p className="font-mono text-sm text-blue-900">
                      Tom said: <strong>"I am hungry."</strong>
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Reported Speech (דיבור עקיף)
                  </h4>
                  <p className="text-purple-700 mb-2">ציטוט עקיף של מה שנאמר</p>
                  <div className="p-2 bg-white rounded border">
                    <p className="font-mono text-sm text-purple-900">
                      Tom said <strong>(that) he was hungry.</strong>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-blue-600">"I am busy"</span>
                  <ArrowRightLeft className="h-6 w-6 text-gray-400" />
                  <span className="text-purple-600">He said he was busy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes Overview */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <RefreshCw className="h-6 w-6 mr-2" />
              כללי ההמרה - מה משתנה?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  זמנים (Tense Shift)
                </h4>
                <p className="text-blue-700 text-sm">יורדים בזמן אחד אחורה</p>
                <div className="text-xs text-blue-600 mt-1">
                  <p>am/is → was</p>
                  <p>will → would</p>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  גוף/מושא
                </h4>
                <p className="text-purple-700 text-sm">משתנה לפי הדובר</p>
                <div className="text-xs text-purple-600 mt-1">
                  <p>I → he/she</p>
                  <p>you → I/he/she</p>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  מילות זמן
                </h4>
                <p className="text-orange-700 text-sm">מתאמות לזמן החדש</p>
                <div className="text-xs text-orange-600 mt-1">
                  <p>today → that day</p>
                  <p>now → then</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tense Shift Table */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <Clock className="h-6 w-6 mr-2" />
              טבלת שינוי זמנים - Tense Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-center font-semibold text-blue-800">Direct Speech</th>
                    <th className="border p-3 text-center font-semibold text-purple-800">Reported Speech</th>
                    <th className="border p-3 text-center font-semibold text-green-800">דוגמה</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">am/is/are</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">was/were</td>
                    <td className="border p-3 text-sm">"I am tired" → He said he was tired</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">do/does</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">did</td>
                    <td className="border p-3 text-sm">"I don't like it" → She said she didn't like it</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">have/has</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">had</td>
                    <td className="border p-3 text-sm">"I have a car" → He said he had a car</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">will</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">would</td>
                    <td className="border p-3 text-sm">"I will call" → She said she would call</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">can</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">could</td>
                    <td className="border p-3 text-sm">"I can swim" → He said he could swim</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">must</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">had to</td>
                    <td className="border p-3 text-sm">"You must go" → He said I had to go</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">was/were</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">had been</td>
                    <td className="border p-3 text-sm">"I was busy" → She said she had been busy</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm text-blue-700">V2 (past simple)</td>
                    <td className="border p-3 font-mono text-sm text-purple-700">had V3 (past perfect)</td>
                    <td className="border p-3 text-sm">"I saw him" → He said he had seen him</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Time and Place Words */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Calendar className="h-6 w-6 mr-2" />
              מילות זמן ומקום - שינוי טיפוסי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border p-2 text-blue-800 font-semibold">Direct</th>
                      <th className="border p-2 text-purple-800 font-semibold">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">today</td>
                      <td className="border p-2 font-mono text-purple-700">that day</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">now</td>
                      <td className="border p-2 font-mono text-purple-700">then</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">yesterday</td>
                      <td className="border p-2 font-mono text-purple-700">the day before</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">tomorrow</td>
                      <td className="border p-2 font-mono text-purple-700">the next day</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">here</td>
                      <td className="border p-2 font-mono text-purple-700">there</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-blue-700">this</td>
                      <td className="border p-2 font-mono text-purple-700">that</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">דוגמאות מעשיות:</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-blue-800">"I'm busy today"</p>
                    <p className="text-purple-800">→ He said he was busy that day</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-blue-800">"I'll call you tomorrow"</p>
                    <p className="text-purple-800">→ She said she would call me the next day</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <p className="text-blue-800">"I saw him yesterday"</p>
                    <p className="text-purple-800">→ He said he had seen him the day before</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Reported Speech */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <MessageSquare className="h-6 w-6 mr-2" />
              סוגי דיבור עקיף
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Statements */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  דיבור עקיף עם משפט רגיל (Statements)
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-blue-900">מבנה: Subject + said (that) + reported clause</p>
                  <div className="space-y-1 text-blue-700 text-sm">
                    <p>• "I'm tired." → She said (that) she <strong>was</strong> tired</p>
                    <p>• "We have finished." → They said (that) they <strong>had finished</strong></p>
                    <p>• "He will come." → She said (that) he <strong>would</strong> come</p>
                  </div>
                </div>
              </div>

              {/* Commands */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  פקודות והוראות (Commands)
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-purple-900">מבנה: told + someone + (not) + to + infinitive</p>
                  <div className="space-y-1 text-purple-700 text-sm">
                    <p>• "You must study." → The teacher <strong>told</strong> us (that) we <strong>had to</strong> study</p>
                    <p>• "Don't go." → She <strong>told</strong> him <strong>not to go</strong></p>
                    <p>• "Close the door." → He <strong>told</strong> me <strong>to close</strong> the door</p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  שאלות עקיפות (Reported Questions)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-orange-900 mb-2">Wh- questions:</h5>
                    <div className="space-y-1 text-orange-700 text-sm">
                      <p>• "Where do you live?" → She asked <strong>where</strong> I <strong>lived</strong></p>
                      <p>• "What did you buy?" → He asked <strong>what</strong> I <strong>had bought</strong></p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-900 mb-2">Yes/No questions:</h5>
                    <div className="space-y-1 text-orange-700 text-sm">
                      <p>• "Are you coming?" → He asked <strong>if</strong> I <strong>was</strong> coming</p>
                      <p>• "Did you see her?" → He asked <strong>if</strong> I <strong>had seen</strong> her</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-100 rounded border-l-2 border-yellow-400">
                  <p className="text-sm text-yellow-800"><strong>חשוב:</strong> בשאלות עקיפות לא משתמשים בסדר של שאלה - אין הופכים את הפועל, אין do/does/did</p>
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
              דוגמאות ממבחני אמיר"ם
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
              <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות אופייניות לאמיר"ם</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">She said she ___ (will/would) come later.</p>
                  <p className="text-sm text-gray-600">(will / would)</p>
                  <p className="text-green-700 font-medium">תשובה: would</p>
                  <p className="text-sm text-gray-500">הסבר: will משתנה ל-would בדיבור עקיף</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">He asked where I ___ (live/lived).</p>
                  <p className="text-sm text-gray-600">(live / lived)</p>
                  <p className="text-green-700 font-medium">תשובה: lived</p>
                  <p className="text-sm text-gray-500">הסבר: present משתנה ל-past בשאלה עקיפה</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">They said they ___ (finished/had finished) the work.</p>
                  <p className="text-sm text-gray-600">(finished / had finished)</p>
                  <p className="text-green-700 font-medium">תשובה: had finished</p>
                  <p className="text-sm text-gray-500">הסבר: past simple משתנה ל-past perfect</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">"I can swim." → He said he ___ swim.</p>
                  <p className="text-sm text-gray-600">(can / could)</p>
                  <p className="text-green-700 font-medium">תשובה: could</p>
                  <p className="text-sm text-gray-500">הסבר: can משתנה ל-could</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">"Do you like coffee?" → She asked if I ___ coffee.</p>
                  <p className="text-sm text-gray-600">(like / liked)</p>
                  <p className="text-green-700 font-medium">תשובה: liked</p>
                  <p className="text-sm text-gray-500">הסבר: Yes/No question עם if + past tense</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שכחת שינוי זמן</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She said she is tired</p>
                        <p className="text-red-600 text-sm">צריך לשנות זמן: is → was</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She said she <strong>was</strong> tired</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">ערבוב סדר המילים בשאלה</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He asked where <strong>does she live</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He asked where <strong>she lived</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She asked <strong>did I see</strong> the movie</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She asked <strong>if I had seen</strong> the movie</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש ישיר במקום עקיף</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He said: "I like pizza" (לא Reported Speech)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He said (that) he <strong>liked</strong> pizza</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">בלבול בין said ו-told</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He <strong>said me</strong> the truth</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He <strong>told me</strong> the truth</span>
                  </div>
                  <div className="text-sm text-blue-700 mt-2">
                    <p><strong>said</strong> - לא מקבל מושא ישיר | <strong>told</strong> - מקבל מושא ישיר</p>
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
                    <p>1. "I can swim." → He said he ___ swim.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. "We saw her yesterday." → They said they ___ seen her the day before.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. "Do you like coffee?" → She asked if I ___ coffee.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. "I will call you tomorrow." → He said he ___ call me the next day.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. "Where do you work?" → She asked where I ___.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. could (can → could)</p>
                    <p>2. had (past simple → past perfect)</p>
                    <p>3. liked (present → past)</p>
                    <p>4. would (will → would)</p>
                    <p>5. worked (present → past)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She said she is going to the party.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. He asked where did they go.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. They told they were tired.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. She asked do I have a car.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She said she <strong>was</strong> going to the party</p>
                    <p>2. He asked where they <strong>had gone</strong></p>
                    <p>3. They <strong>said</strong> they were tired</p>
                    <p>4. She asked <strong>if I had</strong> a car</p>
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
                <p>ב-Reported Speech צריך לשים לב לשינוי זמן, גוף, ומילות זמן. טעויות נפוצות - לא לשנות זמן, ערבוב סדר בשאלות, או שמירה על צורת הדיבור הישיר.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• חפש את פועל הדיווח (said, told, asked)</li>
                  <li>• שים לב למעבר של הזמנים (am → was, will → would, וכו')</li>
                  <li>• בשאלה עקיפה - אין להפוך את הסדר (כמו בשאלה ישירה)</li>
                  <li>• זכור: said (לא מקבל מושא ישיר) / told (מקבל מושא ישיר)</li>
                  <li>• מילות זמן משתנות: today → that day, now → then</li>
                  <li>• תרגל המרה ממשפט ישיר לעקיף ולהיפך</li>
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

export default ReportedSpeech;