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
  X,
  Minus,
  RotateCcw,
  Zap,
  Ban
} from "lucide-react";

const Negatives: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Negatives
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            שלילה
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            בניית משפטי שלילה באנגלית שונה מאוד מעברית ודורשת שימוש נכון בפעלים עזר ובצורת הפועל הבסיסית. 
            <strong> Negatives are essential for clear communication</strong> - להביע מה לא קורה, לא נכון, או לא מותר.
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookOpen className="h-6 w-6 mr-2" />
              הגדרה ועקרונות בסיסיים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <p className="text-lg font-medium text-gray-800 mb-3">
                <strong>שלילה באנגלית</strong> נבנית על ידי הוספת <strong>not</strong> לפועל העזר, לא לפועל הראשי.
              </p>
              <p className="text-gray-700 mb-3">
                במבחן אמיר"ם שאלות רבות דורשות לזהות מבנה שלילי נכון, להבחין בין סוגי פעלים, ולתקן משפטים שכתובים באופן לא תקני.
              </p>
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-400 mt-4">
                <p className="text-red-800">
                  <strong>כלל זהב:</strong> אחרי פועל עזר בשלילה (do/does/did/will/can) הפועל הראשי תמיד בצורת בסיס!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Negation Rules by Tense */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              כללי שלילה לפי זמנים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Present Simple */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Minus className="h-5 w-5 mr-2" />
                  Present Simple - הווה פשוט
                </h4>
                <div className="bg-white p-3 rounded border-2 border-blue-200 mb-3">
                  <p className="font-mono text-blue-800">
                    <strong>מבנה:</strong> Subject + do/does + not + Verb (base form)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">דוגמאות מלאות:</p>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• I <strong>do not</strong> like coffee</li>
                      <li>• She <strong>does not</strong> know the answer</li>
                      <li>• They <strong>do not</strong> play football</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">דוגמאות עם קיצורים:</p>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• I <strong>don't</strong> like coffee</li>
                      <li>• She <strong>doesn't</strong> know the answer</li>
                      <li>• They <strong>don't</strong> play football</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Past Simple */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Past Simple - עבר פשוט
                </h4>
                <div className="bg-white p-3 rounded border-2 border-purple-200 mb-3">
                  <p className="font-mono text-purple-800">
                    <strong>מבנה:</strong> Subject + did not (didn't) + Verb (base form)
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-purple-800">דוגמאות:</p>
                  <ul className="space-y-1 text-purple-600">
                    <li>• He <strong>did not</strong> see the movie</li>
                    <li>• We <strong>didn't</strong> go to school yesterday</li>
                    <li>• She <strong>didn't</strong> call me last night</li>
                  </ul>
                </div>
              </div>

              {/* Present Progressive */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Present Progressive - הווה ממושך
                </h4>
                <div className="bg-white p-3 rounded border-2 border-green-200 mb-3">
                  <p className="font-mono text-green-800">
                    <strong>מבנה:</strong> Subject + am/is/are + not + Verb-ing
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-800">דוגמאות:</p>
                  <ul className="space-y-1 text-green-600">
                    <li>• I <strong>am not</strong> studying now</li>
                    <li>• She <strong>isn't</strong> watching TV</li>
                    <li>• They <strong>aren't</strong> coming tonight</li>
                  </ul>
                </div>
              </div>

              {/* Future */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Future - עתיד
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border-2 border-orange-200">
                    <p className="font-mono text-orange-800 font-semibold mb-2">Will:</p>
                    <p className="text-sm text-orange-700 mb-2">Subject + will not (won't) + Verb</p>
                    <ul className="text-sm text-orange-600">
                      <li>• They <strong>won't</strong> come</li>
                      <li>• I <strong>will not</strong> forget</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border-2 border-orange-200">
                    <p className="font-mono text-orange-800 font-semibold mb-2">Going to:</p>
                    <p className="text-sm text-orange-700 mb-2">Subject + am/is/are + not + going to + Verb</p>
                    <ul className="text-sm text-orange-600">
                      <li>• He <strong>isn't going to</strong> join us</li>
                      <li>• We <strong>aren't going to</strong> travel</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Verbs */}
              <div className="p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-400">
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                  <Ban className="h-5 w-5 mr-2" />
                  Modal Verbs - פעלים מיוחדים
                </h4>
                <div className="bg-white p-3 rounded border-2 border-indigo-200 mb-3">
                  <p className="font-mono text-indigo-800">
                    <strong>מבנה:</strong> Subject + Modal + not + Verb (base form)
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-indigo-800">דוגמאות:</p>
                  <ul className="space-y-1 text-indigo-600">
                    <li>• She <strong>cannot</strong> (can't) swim</li>
                    <li>• You <strong>should not</strong> (shouldn't) eat that</li>
                    <li>• We <strong>must not</strong> (mustn't) be late</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Rules Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <CheckCircle className="h-6 w-6 mr-2" />
              דגשים וכללים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הפועל הראשי תמיד בצורת בסיס</h4>
                  <p className="text-gray-700">אחרי do/does/did/will/can/must הפועל <strong>ללא s, ללא ed, ללא ing</strong></p>
                  <p className="text-gray-700">She does <strong>not like</strong> pizza (לא "doesn't likes")</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">חשיבות המילה not</h4>
                  <p className="text-gray-700">במשפט שלילה אין לשכוח את ה-not!</p>
                  <p className="text-gray-700">אפשר להשתמש בקיצור או בצורה מלאה</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">קיצורים נפוצים (Contractions)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div className="text-sm">
                      <p><strong>do not</strong> → don't</p>
                      <p><strong>does not</strong> → doesn't</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>did not</strong> → didn't</p>
                      <p><strong>will not</strong> → won't</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>is not</strong> → isn't</p>
                      <p><strong>are not</strong> → aren't</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>cannot</strong> → can't</p>
                      <p><strong>should not</strong> → shouldn't</p>
                    </div>
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
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטי שלילה בכל הזמנים</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h5 className="font-semibold text-blue-800">Present Simple:</h5>
                      <ul className="space-y-1 text-blue-600 text-sm">
                        <li>• She <strong>doesn't</strong> like tea</li>
                        <li>• We <strong>don't</strong> live in Tel Aviv</li>
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h5 className="font-semibold text-purple-800">Past Simple:</h5>
                      <ul className="space-y-1 text-purple-600 text-sm">
                        <li>• He <strong>didn't</strong> call me yesterday</li>
                        <li>• They <strong>did not</strong> finish the task</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h5 className="font-semibold text-green-800">Present Progressive:</h5>
                      <ul className="space-y-1 text-green-600 text-sm">
                        <li>• I <strong>am not</strong> listening</li>
                        <li>• The kids <strong>aren't</strong> playing outside</li>
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h5 className="font-semibold text-orange-800">Future & Modals:</h5>
                      <ul className="space-y-1 text-orange-600 text-sm">
                        <li>• I <strong>won't</strong> forget!</li>
                        <li>• You <strong>can't</strong> park here</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She ___ to school yesterday.</p>
                    <p className="text-sm text-gray-600">(doesn't go / didn't go / don't go / isn't going)</p>
                    <p className="text-green-700 font-medium">תשובה: didn't go</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">They ___ the movie.</p>
                    <p className="text-sm text-gray-600">(don't like / doesn't like / didn't like / aren't like)</p>
                    <p className="text-green-700 font-medium">תשובה: don't like (הווה) או didn't like (עבר)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">I ___ my homework now.</p>
                    <p className="text-sm text-gray-600">(am not doing / don't do / isn't doing / didn't do)</p>
                    <p className="text-green-700 font-medium">תשובה: am not doing</p>
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
              טעויות נפוצות ומלכודות במבחן
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50">
                <h4 className="font-semibold text-red-800 mb-3">הוספת s מיותרת בפועל</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">He doesn't likes apples</p>
                        <p className="text-red-600 text-sm">הוספת s מיותרת אחרי doesn't</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">He doesn't like apples</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שימוש בזמן לא נכון</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>We didn't <strong>go</strong> to the party (פועל בסיס אחרי didn't)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>We didn't <strong>went</strong> to the party</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שכחת פועל עזר או not</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>She <strong>does not</strong> understand</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>She not understand</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">בחירה לא נכונה של פועל עזר</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Does</strong> she know the answer? (פועל רגיל)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span><strong>Is</strong> she know the answer?</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He <strong>doesn't</strong> like pizza (גוף שלישי יחיד)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He <strong>don't</strong> like pizza</span>
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
                <h4 className="font-semibold mb-3">תרגול השלמת משפטי שלילה</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She ___ (not/know) the answer.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We ___ (not/eat) meat.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. He ___ (not/go) to work yesterday.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. I ___ (not/watch) TV right now.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. They ___ (not/come) to the party next week.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. does not (doesn't) know</p>
                    <p>2. do not (don't) eat</p>
                    <p>3. did not (didn't) go</p>
                    <p>4. am not watching</p>
                    <p>5. will not (won't) come / are not (aren't) going to come</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. They don't plays football.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. He didn't went home.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. She isn't understand English.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. We not going to the cinema.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. They don't <strong>play</strong> football.</p>
                    <p>2. He didn't <strong>go</strong> home.</p>
                    <p>3. She <strong>doesn't understand</strong> English.</p>
                    <p>4. We <strong>are not going</strong> to the cinema.</p>
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
                <p>שלילה באנגלית בנויה על פעלי עזר + not + פועל בסיס. זהו נושא עם הרבה כללים וחריגים, שמופיע בכל חלקי המבחן. שליטה בכללי השלילה חיונית לכתיבה ודיבור נכונים.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• תזהה בזמן הקריאה: יש פועל עזר? תחפש not או את הקיצור שלו!</li>
                  <li>• תמיד תשתמש בצורת הבסיס אחרי פועל עזר בשלילה</li>
                  <li>• תרגל במיוחד משפטים עם do/does/did – הם המקור הכי שכיח לטעויות</li>
                  <li>• אל תשכח את הקיצורים! (doesn't, didn't, isn't, aren't, won't, can't)</li>
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

export default Negatives;