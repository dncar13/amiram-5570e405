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
  Link2,
  Star,
  Infinity as InfinityIcon,
  Zap
} from "lucide-react";

const PresentPerfect: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Present Perfect
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            הווה מושלם
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            הזמן Present Perfect משמש לחיבור בין עבר להווה – פעולה שהתרחשה בעבר ומשפיעה על ההווה, או ניסיון/חוויה שנצברה לאורך זמן. 
            זהו זמן מאוד שימושי אך גם מבלבל לתלמידים ישראלים כי <strong>אין לו מקבילה ישירה בעברית</strong>.
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
                <strong>Present Perfect</strong> מתאר פעולה שהתרחשה בעבר אך לא צוין מתי, או שהתוצאה שלה מורגשת עכשיו, או שמדובר בחוויה/התנסות.
              </p>
              <p className="text-gray-700 mb-3">
                The Present Perfect tense connects the past with the present – describing actions or experiences that have relevance to now.
              </p>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded border-l-4 border-indigo-400 mt-4">
                <p className="text-indigo-800 flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  <strong>הרעיון המרכזי:</strong> מחבר בין עבר להווה - משהו שקרה אז ורלוונטי עכשיו
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Section */}
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
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  מבנה בסיסי
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                  <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                    Subject + have/has + Verb (V3 - past participle)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I <strong>have eaten</strong> breakfast - אכלתי ארוחת בוקר</li>
                    <li>• She <strong>has finished</strong> her homework - היא סיימה את שיעורי הבית</li>
                  </ul>
                </div>
              </div>

              {/* Have/Has Usage */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3">שימוש ב-Have/Has</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded border-2 border-blue-200">
                    <h5 className="font-semibold text-blue-800">Have</h5>
                    <p className="text-blue-700 mb-2">I, You, We, They</p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• I <strong>have</strong> been to Paris</li>
                      <li>• They <strong>have</strong> lived here for years</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border-2 border-purple-200">
                    <h5 className="font-semibold text-purple-800">Has</h5>
                    <p className="text-purple-700 mb-2">He, She, It</p>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• She <strong>has</strong> never tried sushi</li>
                      <li>• He <strong>has</strong> just arrived</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + have/has + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• I have visited London</li>
                    <li>• She has finished</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + have/has + not + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• I haven't seen him</li>
                    <li>• She hasn't called</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Have/Has + Subject + V3?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Have you been there?</li>
                    <li>• Has she finished?</li>
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
                <Star className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולה בעבר שקשורה להווה (Past action with present result)</h4>
                  <p className="text-gray-700">I <strong>have lost</strong> my keys - איבדתי את המפתחות (ואין לי אותם עכשיו)</p>
                  <p className="text-gray-700">She <strong>has broken</strong> her leg - היא שברה את הרגל (והיא עדיין שבורה)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Star className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">ניסיון חיים (Life experience)</h4>
                  <p className="text-gray-700"><strong>Have you ever traveled</strong> abroad? - נסעת פעם לחו"ל?</p>
                  <p className="text-gray-700">I <strong>have never tried</strong> sushi - מעולם לא טעמתי סושי</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <InfinityIcon className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולה שחוזרת ונמשכת עד עכשיו (Ongoing from past to present)</h4>
                  <p className="text-gray-700">We <strong>have lived</strong> here for five years - אנחנו גרים כאן חמש שנים</p>
                  <p className="text-gray-700">They <strong>have studied</strong> English since 2020 - הם לומדים אנגלית מאז 2020</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולה שקרתה בעבר מבלי לציין מתי (Unspecified past time)</h4>
                  <p className="text-gray-700">Someone <strong>has eaten</strong> my cake! - מישהו אכל את העוגה שלי!</p>
                  <p className="text-gray-700">They <strong>have already left</strong> - הם כבר עזבו</p>
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
              מילות זמן - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זמן אופייניות ל-Present Perfect</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">ניסיון/חוויה:</p>
                    <p className="text-sm text-blue-600">ever, never</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">זמן/סדר:</p>
                    <p className="text-sm text-green-600">already, yet, just, recently, lately</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">משך זמן:</p>
                    <p className="text-sm text-purple-600">for (למשך), since (מאז), so far, until now</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Have you <strong>ever</strong> seen this movie?</li>
                  <li>• I have <strong>already</strong> finished my homework</li>
                  <li>• We haven't met <strong>yet</strong></li>
                  <li>• She has worked here <strong>since</strong> 2018</li>
                  <li>• They have lived in Haifa <strong>for</strong> two years</li>
                  <li>• He has <strong>just</strong> arrived</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-yellow-800 font-medium">
                💡 <strong>זכור:</strong> Present Perfect לא משתמש עם מילות זמן מדויקות (yesterday, last week, in 2019) - שם צריך Past Simple!
              </p>
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
                    <li>• I have visited Jerusalem many times - ביקרתי בירושלים הרבה פעמים</li>
                    <li>• She has never been to London - היא מעולם לא הייתה בלונדון</li>
                    <li>• They have just arrived - הם זה עתה הגיעו</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• How long have you lived in Tel Aviv? - כמה זמן אתה גר בתל אביב?</li>
                    <li>• We have not seen Tom since last week - לא ראינו את טום מהשבוע שעבר</li>
                    <li>• Have you already done your homework? - כבר עשית את שיעורי הבית?</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She ___ snow.</p>
                    <p className="text-sm text-gray-600">(never saw / has never seen / never seen / never sees)</p>
                    <p className="text-green-700 font-medium">תשובה: has never seen</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you ___ your lunch yet?</p>
                    <p className="text-sm text-gray-600">(Have / finished / Has / finish)</p>
                    <p className="text-green-700 font-medium">תשובה: Have you finished</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">They ___ here for five years.</p>
                    <p className="text-sm text-gray-600">(lived / have lived / lives / living)</p>
                    <p className="text-green-700 font-medium">תשובה: have lived</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Present Perfect vs Past Simple */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <Link2 className="h-6 w-6 mr-2" />
              Present Perfect vs Past Simple - ההבדל החשוב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Present Perfect</h4>
                <p className="text-blue-700 text-sm mb-2">קשר להווה, זמן לא מצוין</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• I <strong>have lost</strong> my keys (אין לי אותם עכשיו)</li>
                  <li>• She <strong>has been</strong> to Paris (חוויה בחיים)</li>
                  <li>• We <strong>have lived</strong> here for 5 years (עדיין גרים)</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Past Simple</h4>
                <p className="text-purple-700 text-sm mb-2">זמן מצוין, פעולה שהסתיימה</p>
                <ul className="text-purple-600 text-sm space-y-1">
                  <li>• I <strong>lost</strong> my keys yesterday (אתמול)</li>
                  <li>• She <strong>went</strong> to Paris last year (שנה שעברה)</li>
                  <li>• We <strong>lived</strong> there from 2015-2020 (תקופה מוגדרת)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
              <p className="text-indigo-800 font-medium text-center">
                🔑 <strong>הכלל הזהב:</strong> זמן מצוין = Past Simple | זמן לא מצוין + רלוונטיות להווה = Present Perfect
              </p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש במבנה Past Simple במקום Present Perfect</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">I saw this movie already</p>
                        <p className="text-red-600 text-sm">עם "already" צריך Present Perfect</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">I have already seen this movie</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שכחת הפועל העזר have/has</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She <strong>has finished</strong> her work</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She finished her work (אם התכוונו ל-Present Perfect)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש בזמן לא נכון עם signal words</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Have you ever visited</strong> Paris?</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span><strong>Did you ever visit</strong> Paris?</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">בחירת הפועל הלא נכון (V3, past participle)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He has <strong>eaten</strong> breakfast (eat-ate-eaten)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He has <strong>ate</strong> breakfast</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>I have <strong>seen</strong> that movie (see-saw-seen)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>I have <strong>saw</strong> that movie</span>
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
                    <p>1. I ___ (not/try) sushi yet.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She ___ (just/finish) the test.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. ___ you ever ___ (be) to Paris?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. We ___ (live) in this city since 2020.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. He ___ (never/see) snow before.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. have not (haven't) tried</p>
                    <p>2. has just finished</p>
                    <p>3. Have / been</p>
                    <p>4. have lived</p>
                    <p>5. has never seen</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. I have saw that movie.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She haven't visited Rome.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. Did you finished your homework yet?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. He have been to London.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. I have <strong>seen</strong> that movie.</p>
                    <p>2. She <strong>hasn't</strong> visited Rome.</p>
                    <p>3. <strong>Have</strong> you finished your homework yet?</p>
                    <p>4. He <strong>has</strong> been to London.</p>
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
                <p>Present Perfect הוא זמן שמחבר בין העבר להווה. הוא מופיע כשלא מצוין מתי משהו קרה, או כשיש תוצאה/חוויה שמורגשת עכשיו. הוא מאוד חשוב להצלחה באמיר"ם ולשפה עשירה ומתקדמת.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• חפש מילות זמן שמרמזות על Present Perfect: ever, never, just, already, yet, since, for</li>
                  <li>• זכור: תמיד משתמשים ב-have/has + פועל בצורת V3 (past participle)</li>
                  <li>• בזמן שאלה – הפועל העזר קופץ לפני הנושא (Have you…? Has she…?)</li>
                  <li>• אל תשתמש במבנה הזה עם מילות זמן מדויקות (yesterday, last year - שם Past Simple)</li>
                  <li>• תרגל הרבה – ההבחנה בין Present Perfect ל-Past Simple עושה את כל ההבדל!</li>
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

export default PresentPerfect;