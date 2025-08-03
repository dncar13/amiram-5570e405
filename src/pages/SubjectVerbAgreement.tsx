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
  UserCheck,
  Users2
} from "lucide-react";

const SubjectVerbAgreement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Subject-Verb Agreement
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            התאמת נושא-פועל
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            התאמת נושא-פועל היא עיקרון דקדוקי בסיסי באנגלית: <strong>הפועל צריך להתאים לנושא</strong> של המשפט 
            ביחיד/רבים ובגוף. טעות בהתאמה פוגעת בשפה ונפוצה במבחן אמיר"ם, במיוחד בשאלות השלמת משפטים ותיקון טעויות.
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
                הפועל במשפט <strong>מתאים</strong> במספר (יחיד/רבים) ובגוף (אני, אתה, היא, הם) לנושא.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    נושא יחיד
                  </h4>
                  <p className="text-sm text-blue-600">She <strong>works</strong> in Tel Aviv</p>
                  <p className="text-xs text-blue-500">פועל עם s בגוף שלישי</p>
                </div>
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 flex items-center">
                    <Users2 className="h-4 w-4 mr-2" />
                    נושא רבים
                  </h4>
                  <p className="text-sm text-purple-600">They <strong>work</strong> in Tel Aviv</p>
                  <p className="text-xs text-purple-500">פועל בסיסי ללא s</p>
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
              כללי מבנה תחבירי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Rules */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-600" />
                  כללים בסיסיים
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                    <p className="font-semibold text-blue-800 mb-1">נושא יחיד</p>
                    <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                      Subject (singular) + Verb + s
                    </p>
                    <p className="text-sm text-gray-600 mt-1">The cat runs fast</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                    <p className="font-semibold text-purple-800 mb-1">נושא רבים</p>
                    <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                      Subject (plural) + Verb (base)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">The cats run fast</p>
                  </div>
                </div>
              </div>

              {/* Pronoun Rules */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3">כללים לפי כינויי גוף</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">פועל בסיסי (ללא s)</h5>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• <strong>I/You/We/They</strong> work</li>
                      <li>• <strong>I/You/We/They</strong> do</li>
                      <li>• <strong>I/You/We/They</strong> have</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">פועל עם s</h5>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• <strong>He/She/It</strong> work<strong>s</strong></li>
                      <li>• <strong>He/She/It</strong> doe<strong>s</strong></li>
                      <li>• <strong>He/She/It</strong> ha<strong>s</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Special Cases */}
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-3">מקרים מיוחדים</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded">
                    <p className="font-medium text-yellow-900">שני נושאים עם AND:</p>
                    <p className="text-sm text-yellow-700">My friend and I <strong>are</strong> happy (רבים)</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <p className="font-medium text-yellow-900">מילים שנראות רבים אך יחיד:</p>
                    <p className="text-sm text-yellow-700">The news <strong>is</strong> interesting / Mathematics <strong>is</strong> difficult</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <CheckCircle className="h-6 w-6 mr-2" />
              שימושים עיקריים ומקרים מיוחדים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Singular Words that Look Plural */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  מילים שנחשבות ליחיד תמיד
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Everyone, Someone, Nobody, Anyone</h5>
                      <p className="text-blue-700">Everyone <strong>likes</strong> pizza - כולם אוהבים פיצה</p>
                      <p className="text-blue-700">Nobody <strong>knows</strong> the answer - אף אחד לא יודע את התשובה</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Each, Every</h5>
                      <p className="text-blue-700">Each student <strong>has</strong> a book - כל תלמיד יש לו ספר</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div>
                      <h5 className="font-semibold text-blue-900">מילים לא נספרות</h5>
                      <p className="text-blue-700">The information <strong>is</strong> useful - המידע שימושי</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Groups and OF expressions */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  ביטויים עם OF
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                    <div>
                      <h5 className="font-semibold text-purple-900">הנושא לפני OF קובע</h5>
                      <p className="text-purple-700">A <strong>group</strong> of students <strong>is</strong> coming</p>
                      <p className="text-purple-700">The <strong>members</strong> of the team <strong>are</strong> practicing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OR/NOR connections */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  נושאים מחוברים ב-OR/NOR
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-orange-900">הפועל מתאים לנושא הקרוב אליו:</p>
                  <ul className="space-y-1 text-orange-700">
                    <li>• Either my father or my brothers <strong>are</strong> coming</li>
                    <li>• Either my brothers or my father <strong>is</strong> coming</li>
                  </ul>
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
              סימני זיהוי וטיפים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>רמזים מהירים</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">פועל עם S?</p>
                    <p className="text-sm text-blue-600">כנראה נושא יחיד בגוף שלישי</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">שתי מילים עם AND?</p>
                    <p className="text-sm text-green-600">כנראה רבים</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Each, Every, Nobody?</p>
                    <p className="text-sm text-purple-600">תמיד יחיד</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>אסטרטגיות זיהוי</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• זהה את הנושא הראשי (לא מילים בסוגריים או ביטויי תוספת)</li>
                  <li>• בדוק אם זה יחיד או רבים</li>
                  <li>• שים לב למילות מפתח: everyone, each, every</li>
                  <li>• זכור: and = רבים, or = קרוב יותר</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Types Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <MessageSquare className="h-6 w-6 mr-2" />
              משפטים חיוביים, שליליים ושאלות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                <ul className="text-sm space-y-1">
                  <li>• The dog <strong>barks</strong> at night</li>
                  <li>• My parents <strong>travel</strong> every year</li>
                  <li>• She <strong>works</strong> hard</li>
                  <li>• They <strong>study</strong> English</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                <ul className="text-sm space-y-1">
                  <li>• She <strong>doesn't like</strong> fish</li>
                  <li>• The teachers <strong>don't live</strong> here</li>
                  <li>• He <strong>doesn't work</strong> on Friday</li>
                  <li>• We <strong>don't have</strong> time</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Does</strong> he speak English?</li>
                  <li>• <strong>Do</strong> they play football?</li>
                  <li>• <strong>Does</strong> she like music?</li>
                  <li>• <strong>Do</strong> you have a car?</li>
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
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The teacher ___ (teach/teaches) English every day.</p>
                    <p className="text-sm text-gray-600">(teach / teaches)</p>
                    <p className="text-green-700 font-medium">תשובה: teaches</p>
                    <p className="text-sm text-gray-500">הסבר: "teacher" = יחיד, גוף שלישי</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">A group of children ___ (is/are) playing outside.</p>
                    <p className="text-sm text-gray-600">(is / are)</p>
                    <p className="text-green-700 font-medium">תשובה: is</p>
                    <p className="text-sm text-gray-500">הסבר: הנושא הוא "group" (יחיד), לא "children"</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">Nobody ___ (knows/know) the answer.</p>
                    <p className="text-sm text-gray-600">(knows / know)</p>
                    <p className="text-green-700 font-medium">תשובה: knows</p>
                    <p className="text-sm text-gray-500">הסבר: "Nobody" תמיד יחיד</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The cat <strong>runs</strong> fast - החתול רץ מהר</li>
                    <li>• My friends <strong>play</strong> basketball - החברים שלי משחקים כדורסל</li>
                    <li>• Each student <strong>has</strong> a book - לכל תלמיד יש ספר</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Neither of the answers <strong>is</strong> correct</li>
                    <li>• The news <strong>is</strong> on TV</li>
                    <li>• Either Tom or his friends <strong>are</strong> coming</li>
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
                <h4 className="font-semibold text-red-800 mb-3">טעות ביחיד/רבים</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">The students studies for the test</p>
                        <p className="text-red-600 text-sm">"students" = רבים, אסור פועל עם s</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">The students <strong>study</strong> for the test</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">בלבול במילים "בעייתיות"</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Everyone <strong>like</strong> pizza</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Everyone <strong>likes</strong> pizza</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Nobody <strong>know</strong> the answer</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Nobody <strong>knows</strong> the answer</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">טעות בשני נושאים עם AND</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>My mother and my father <strong>is</strong> here</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>My mother and my father <strong>are</strong> here</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-3">מילים לא נספרות</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The information <strong>are</strong> useful</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The information <strong>is</strong> useful</span>
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
                    <p>1. My sister ___ (like/likes) chocolate.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. The news ___ (is/are) on TV.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. My friends ___ (enjoy/enjoys) music.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. Each student ___ (has/have) a locker.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. Either my parents or my sister ___ (is/are) coming.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. likes (יחיד, גוף שלישי)</p>
                    <p>2. is (news = יחיד)</p>
                    <p>3. enjoy (friends = רבים)</p>
                    <p>4. has (each = יחיד)</p>
                    <p>5. is (הקרוב יותר: sister = יחיד)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. The information are important.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. She walk to school every day.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. Everyone like ice cream.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The group of students are studying.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. The information <strong>is</strong> important (information = יחיד)</p>
                    <p>2. She <strong>walks</strong> to school every day (גוף שלישי יחיד)</p>
                    <p>3. Everyone <strong>likes</strong> ice cream (everyone = יחיד)</p>
                    <p>4. The group of students <strong>is</strong> studying (group = יחיד)</p>
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
                <p>התאמת נושא-פועל היא נושא קריטי באנגלית ובמבחן אמיר"ם. תמיד בדוק מי הנושא ומה המספר שלו, וזכור את המקרים המיוחדים כמו everyone, each, everybody שתמיד נחשבים יחיד.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• ספור את הנושא – יחיד או רבים? התאם את הפועל!</li>
                  <li>• מילים כמו everyone, nobody, each, every – תמיד פועל יחיד</li>
                  <li>• כאשר יש AND – ברוב המקרים זה רבים</li>
                  <li>• עם OR/NOR – הפועל מתאים לנושא הקרוב יותר</li>
                  <li>• תרגל השלמת משפטים, תיקון טעויות וזיהוי דקויות</li>
                  <li>• שים לב למילים לא נספרות: information, news, mathematics = יחיד</li>
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

export default SubjectVerbAgreement;