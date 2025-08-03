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
  HelpCircle,
  Hash,
  RotateCcw,
  Zap
} from "lucide-react";

const QuestionForms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Question Forms
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            משפטי שאלה
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            היכולת לשאול שאלות באנגלית חשובה לכל דובר שפה – בשיחה יומיומית, בכתיבה רשמית ובבחינות כמו אמיר"ם. 
            שאלות מופיעות בכל חלקי המבחן: הבנת הנקרא, השלמת משפטים, תיקון שגיאות ועוד.
          </p>
        </div>

        {/* Definition Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookOpen className="h-6 w-6 mr-2" />
              הגדרה ומבנה כללי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
              <p className="text-lg font-medium text-gray-800 mb-3">
                <strong>Question Forms</strong> הם המבנה התחבירי ליצירת שאלות באנגלית, עם סדר מילים מיוחד ופעלי עזר.
              </p>
              <p className="text-gray-700 mb-3">
                במבחן אמיר"ם כולל לא מעט שאלות שמבוססות על זיהוי, תיקון או השלמת משפטי שאלה.
              </p>
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400 mt-4">
                <p className="text-blue-800">
                  <strong>עיקרון בסיסי:</strong> באנגלית הסדר במשפט שאלה שונה ממשפט רגיל - הפועל העזר עובר לפני הנושא
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Types Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Hash className="h-6 w-6 mr-2" />
              סוגי שאלות באנגלית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Yes/No Questions */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Yes/No Questions (שאלות סגורות)
                </h4>
                <p className="text-blue-700 mb-3">שאלות שהתשובה להן היא Yes או No</p>
                <div className="bg-white p-3 rounded border-2 border-blue-200 mb-3">
                  <p className="font-mono text-blue-800">
                    <strong>מבנה:</strong> Auxiliary Verb + Subject + Main Verb...?
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-blue-800">דוגמאות:</p>
                  <ul className="space-y-1 text-blue-600">
                    <li>• <strong>Do</strong> you like pizza?</li>
                    <li>• <strong>Does</strong> he speak English?</li>
                    <li>• <strong>Are</strong> you coming tonight?</li>
                    <li>• <strong>Can</strong> she swim?</li>
                  </ul>
                </div>
              </div>

              {/* Wh- Questions */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Wh- Questions (שאלות פתוחות)
                </h4>
                <p className="text-purple-700 mb-3">שאלות שמתחילות במילת שאלה ומחייבות תשובה מידעית</p>
                <div className="bg-white p-3 rounded border-2 border-purple-200 mb-3">
                  <p className="font-mono text-purple-800">
                    <strong>מבנה:</strong> Wh-word + Auxiliary Verb + Subject + Main Verb...?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">מילות שאלה נפוצות:</p>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• <strong>Where</strong> - איפה</li>
                      <li>• <strong>What</strong> - מה</li>
                      <li>• <strong>When</strong> - מתי</li>
                      <li>• <strong>Who</strong> - מי</li>
                      <li>• <strong>Why</strong> - למה</li>
                      <li>• <strong>How</strong> - איך</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">דוגמאות:</p>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• <strong>Where</strong> do you live?</li>
                      <li>• <strong>What</strong> are you doing?</li>
                      <li>• <strong>When</strong> did they arrive?</li>
                      <li>• <strong>How</strong> does it work?</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Be Questions */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  שאלות עם פועל To Be (בלי פועל עזר נוסף)
                </h4>
                <p className="text-green-700 mb-3">כשהפועל הראשי הוא Be, הוא משמש גם כפועל עזר</p>
                <div className="bg-white p-3 rounded border-2 border-green-200 mb-3">
                  <p className="font-mono text-green-800">
                    <strong>מבנה:</strong> Be (am/is/are/was/were) + Subject + (...)?
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-800">דוגמאות:</p>
                  <ul className="space-y-1 text-green-600">
                    <li>• <strong>Are</strong> you ready?</li>
                    <li>• <strong>Was</strong> she at home yesterday?</li>
                    <li>• <strong>Is</strong> this your bag?</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <Target className="h-6 w-6 mr-2" />
              מבנה תחבירי ומעבר ממשפט לשאלה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Word Order */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3">סדר המילים במשפט שאלה</h4>
                <p className="text-gray-700 mb-3">באנגלית הסדר קבוע – Auxiliary/Be + Subject + Verb</p>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-semibold text-blue-800 mb-2">דוגמה 1: Present Simple</h5>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong>משפט רגיל:</strong> You live in Haifa.</p>
                      <p className="text-blue-700"><strong>שאלה:</strong> <span className="bg-blue-100 px-2 py-1 rounded">Do</span> you live in Haifa?</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-semibold text-purple-800 mb-2">דוגמה 2: פועל To Be</h5>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong>משפט רגיל:</strong> She is a teacher.</p>
                      <p className="text-purple-700"><strong>שאלה:</strong> <span className="bg-purple-100 px-2 py-1 rounded">Is</span> she a teacher?</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-semibold text-green-800 mb-2">דוגמה 3: Past Simple</h5>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong>משפט רגיל:</strong> They went to the store.</p>
                      <p className="text-green-700"><strong>שאלה:</strong> <span className="bg-green-100 px-2 py-1 rounded">Did</span> they go to the store?</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auxiliary Verbs */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-orange-600" />
                  פעלי עזר בשאלות
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <h5 className="font-semibold text-blue-800">Present Simple</h5>
                    <ul className="text-sm text-blue-600 mt-2">
                      <li>• I/You/We/They → <strong>Do</strong></li>
                      <li>• He/She/It → <strong>Does</strong></li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <h5 className="font-semibold text-purple-800">Past Simple</h5>
                    <ul className="text-sm text-purple-600 mt-2">
                      <li>• כל הגופים → <strong>Did</strong></li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <h5 className="font-semibold text-green-800">Present Progressive</h5>
                    <ul className="text-sm text-green-600 mt-2">
                      <li>• Am/Is/Are</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-yellow-800 font-medium">
                    💡 חשוב: אחרי Do/Does/Did הפועל הראשי תמיד בצורת בסיס (V1)!
                  </p>
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
              סימני זיהוי ודגשים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>איך לזהות סוגי שאלות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Yes/No Questions:</p>
                    <p className="text-sm text-blue-600">מתחילות ב-Do/Does/Did/Am/Is/Are/Can/Will</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Wh- Questions:</p>
                    <p className="text-sm text-purple-600">מתחילות במילת שאלה: where, when, who, what, why, how</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>כללים חשובים לזכור</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• בעבר: <strong>Did</strong> + Subject + V1</li>
                  <li>• בהווה (גוף 3 יחיד): <strong>Does</strong> + Subject + V1</li>
                  <li>• עם Be: רק הפוך סדר (Be + Subject)</li>
                  <li>• אחרי פועל עזר: תמיד פועל בסיס!</li>
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
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>Yes/No Questions</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Do</strong> you play the guitar? - אתה מנגן בגיטרה?</li>
                    <li>• <strong>Are</strong> they at home? - הם בבית?</li>
                    <li>• <strong>Can</strong> you help me? - אתה יכול לעזור לי?</li>
                    <li>• <strong>Did</strong> she call you? - היא התקשרה אליך?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>Wh- Questions</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Where</strong> does she work? - איפה היא עובדת?</li>
                    <li>• <strong>When</strong> did you arrive? - מתי הגעת?</li>
                    <li>• <strong>Why</strong> are you smiling? - למה אתה מחייך?</li>
                    <li>• <strong>How much</strong> does it cost? - כמה זה עולה?</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you ___ ice cream?</p>
                    <p className="text-sm text-gray-600">(Do / like) (Does / like) (Are / like) (Is / like)</p>
                    <p className="text-green-700 font-medium">תשובה: Do you like ice cream?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ he ___ in Tel Aviv?</p>
                    <p className="text-sm text-gray-600">(Does / live) (Do / live) (Is / live) (Are / live)</p>
                    <p className="text-green-700 font-medium">תשובה: Does he live in Tel Aviv?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">Where ___ you ___ last night?</p>
                    <p className="text-sm text-gray-600">(did / go) (do / go) (does / go) (are / go)</p>
                    <p className="text-green-700 font-medium">תשובה: did you go</p>
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
                <h4 className="font-semibold text-red-800 mb-3">סדר מילים לא נכון</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">Where you live?</p>
                        <p className="text-red-600 text-sm">חסר פועל עזר</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">Where <strong>do</strong> you live?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שכחת פועל עזר</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>What <strong>do</strong> you want?</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>What you want?</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש בזמן הלא נכון</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Did you <strong>go</strong> to the store? (פועל בסיס אחרי did)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Did you <strong>went</strong> to the store?</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">בלבול בין שאלה עם Be לשאלה עם פועל רגיל</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span><strong>Do</strong> you like music? (פועל רגיל)</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span><strong>Is</strong> you like music?</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span><strong>Are</strong> you tired? (תואר עם Be)</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span><strong>Do</strong> you tired?</span>
                    </div>
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
                <h4 className="font-semibold mb-3">תרגול השלמת משפטי שאלה</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. ___ she ___ to the party tonight? (come)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. What ___ you ___ right now? (do)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. Where ___ they ___ last summer? (travel)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. ___ you ___ (hungry)?</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. Is she coming (Present Progressive)</p>
                    <p>2. are you doing (Present Progressive)</p>
                    <p>3. did they travel (Past Simple)</p>
                    <p>4. Are you hungry (פועל Be עם תואר)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. What time you finish work?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. Where he lives?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. She is teacher?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. Did you went to school yesterday?</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. What time <strong>do you finish</strong> work?</p>
                    <p>2. Where <strong>does he live</strong>?</p>
                    <p>3. <strong>Is she a</strong> teacher?</p>
                    <p>4. Did you <strong>go</strong> to school yesterday?</p>
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
                <p>משפטי שאלה באנגלית דורשים תשומת לב לסדר המילים, לזיהוי פעלים עזר, ולהבחנה בין סוגי שאלות (Yes/No, Wh-, Be). זהו נושא שחוזר שוב ושוב במבחן אמיר"ם.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• תמיד תחפש את הפועל העזר בתחילת השאלה (Do/Does/Did/Am/Is/Are/Can/Will וכו')</li>
                  <li>• בשאלות Wh- תמיד פותחים במילת שאלה, ואחריה פועל עזר</li>
                  <li>• אחרי Do/Does/Did – הפועל תמיד בבסיס (ולא עם -ed או -s)</li>
                  <li>• תרגל השלמות ותיקונים של שאלות – אלה חוזרים במבחן אמיר"ם שוב ושוב</li>
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

export default QuestionForms;