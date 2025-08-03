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
  RotateCcw
} from "lucide-react";

const PresentProgressive: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Present Progressive
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            הווה ממושך
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            הזמן Present Progressive (נקרא גם Present Continuous) משמש לתיאור פעולות שמתרחשות <strong>ברגע הדיבור</strong> או סביבו, 
            לתיאור מצבים זמניים, שינויים בתהליך והרגלים לא רגילים. זהו זמן חיוני למעבר ממתחילים למתקדמים באנגלית.
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
              <p className="text-lg font-medium text-gray-800 mb-2">
                <strong>Present Progressive</strong> מתאר פעולה שמתרחשת עכשיו, בזמן הדיבור, או בסביבה הקרובה.
              </p>
              <p className="text-gray-700 mb-3">
                This tense is essential for describing ongoing actions, temporary situations, and developing trends.
              </p>
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-400 mt-4">
                <p className="text-green-800">
                  <strong>נקודת מפתח:</strong> לא בהכרח בדיוק ברגע זה, אלא בתקופה זמנית נוכחית
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Structure Section */}
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
                  <Play className="h-5 w-5 mr-2 text-blue-600" />
                  מבנה בסיסי
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                  <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                    Subject + am/is/are + Verb-ing + (Object/Adverb)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I am eating breakfast - אני אוכל ארוחת בוקר</li>
                    <li>• She is talking on the phone - היא מדברת בטלפון</li>
                    <li>• They are studying for the test - הם לומדים למבחן</li>
                  </ul>
                </div>
              </div>

              {/* Verb Conjugation */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3">הטיות עיקריות (am/is/are)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <h5 className="font-semibold text-blue-800">I</h5>
                    <p className="text-blue-600">am + verb-ing</p>
                    <p className="text-sm text-blue-500">I am reading</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <h5 className="font-semibold text-purple-800">He/She/It</h5>
                    <p className="text-purple-600">is + verb-ing</p>
                    <p className="text-sm text-purple-500">She is working</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h5 className="font-semibold text-green-800">You/We/They</h5>
                    <p className="text-green-600">are + verb-ing</p>
                    <p className="text-sm text-green-500">They are playing</p>
                  </div>
                </div>
              </div>

              {/* Sentence Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Positive */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>משפט חיובי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + am/is/are + V-ing</p>
                  <ul className="text-sm space-y-1">
                    <li>• We are playing basketball</li>
                    <li>• She is reading a book</li>
                  </ul>
                </div>
                
                {/* Negative */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>משפט שלילי</h5>
                  <p className="text-sm text-gray-600 mb-2">Subject + am/is/are + not + V-ing</p>
                  <ul className="text-sm space-y-1">
                    <li>• I am not watching TV</li>
                    <li>• They aren't coming</li>
                  </ul>
                </div>
                
                {/* Questions */}
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>שאלות</h5>
                  <p className="text-sm text-gray-600 mb-2">Am/Is/Are + Subject + V-ing?</p>
                  <ul className="text-sm space-y-1">
                    <li>• Are you coming to class?</li>
                    <li>• Is he doing homework?</li>
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
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולות שמתרחשות ברגע זה (Actions happening now)</h4>
                  <p className="text-gray-700">I am writing an email now - אני כותב אימייל עכשיו</p>
                  <p className="text-gray-700">The dog is barking - הכלב נובח</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">מצבים זמניים (Temporary situations)</h4>
                  <p className="text-gray-700">She is living in London this year - היא גרה בלונדון השנה</p>
                  <p className="text-gray-700">We are studying hard for the final exams - אנחנו לומדים קשה לבחינות הגמר</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">פעולות בתהליך של שינוי (Changing situations)</h4>
                  <p className="text-gray-700">The weather is getting colder - מזג האוויר נעשה קר יותר</p>
                  <p className="text-gray-700">Technology is advancing rapidly - הטכנולוגיה מתקדמת במהירות</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הרגלים לא רגילים/מעצבנים (עם always)</h4>
                  <p className="text-gray-700">He is always losing his keys! - הוא תמיד מאבד את המפתחות!</p>
                  <p className="text-gray-700">You are always coming late! - אתה תמיד מגיע מאוחר!</p>
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
              סימני זמן - Signal Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זמן נפוצות להווה ממושך</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">רגע הדיבור:</p>
                    <p className="text-sm text-blue-600">now, right now, at the moment, currently</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">תקופה נוכחית:</p>
                    <p className="text-sm text-green-600">these days, today, this week/month/year</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">לתשומת לב:</p>
                    <p className="text-sm text-purple-600">Look! Listen!</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות לשימוש נכון</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• I am studying <strong>now</strong></li>
                  <li>• She is working <strong>at the moment</strong></li>
                  <li>• <strong>Look!</strong> The baby is crying</li>
                  <li>• We are learning a lot <strong>these days</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Types & Short Answers */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <MessageSquare className="h-6 w-6 mr-2" />
              שאלות ותשובות קצרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>סוגי שאלות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Yes/No questions:</p>
                    <ul className="text-sm text-blue-600 mt-1">
                      <li>• Are you coming to class?</li>
                      <li>• Is he doing his homework?</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="font-medium text-purple-800">Wh- questions:</p>
                    <ul className="text-sm text-purple-600 mt-1">
                      <li>• What are you doing?</li>
                      <li>• Why is it raining?</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>תשובות קצרות</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">חיובי:</p>
                    <p className="text-sm text-green-600">Yes, I am. / Yes, she is.</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <p className="font-medium text-orange-800">שלילי:</p>
                    <p className="text-sm text-orange-600">No, I'm not. / No, she isn't.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• I am sitting in class - אני יושב בכיתה</li>
                    <li>• He is running in the park - הוא רץ בפארק</li>
                    <li>• We are having lunch now - אנחנו אוכלים צהריים עכשיו</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מורכבים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The teacher is explaining a difficult topic right now</li>
                    <li>• Why are you always making noise during lessons?</li>
                    <li>• It is raining, so we are staying inside</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The students ___ (study) for their exams at the moment.</p>
                    <p className="text-sm text-gray-600">(studies / are studying / study / is studying)</p>
                    <p className="text-green-700 font-medium">תשובה: are studying</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She ___ (not/listen) to music now.</p>
                    <p className="text-sm text-gray-600">(is not listening / are not listening / does not listen / isn't listening)</p>
                    <p className="text-green-700 font-medium">תשובה: is not listening / isn't listening</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you ___ (wait) for someone?</p>
                    <p className="text-sm text-gray-600">(Are / waiting / Do / wait)</p>
                    <p className="text-green-700 font-medium">תשובה: Are you waiting</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש במבנה לא נכון (חסר am/is/are)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She talking on the phone</p>
                        <p className="text-red-600 text-sm">חסר פועל עזר</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She is talking on the phone</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">בלבול בין Present Simple ל-Present Progressive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <h5 className="font-semibold text-blue-800">Present Progressive</h5>
                    <p className="text-sm text-blue-600">עכשיו, ברגע זה</p>
                    <p className="text-blue-700 mt-1">I am eating now</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <h5 className="font-semibold text-purple-800">Present Simple</h5>
                    <p className="text-sm text-purple-600">הרגל, עובדה</p>
                    <p className="text-purple-700 mt-1">I eat breakfast daily</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">טעויות נוספות נפוצות</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>He is play football (חסר ing)</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>He is playing football</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>They is coming (אי התאמה)</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>They are coming</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-blue-800 font-medium">💡 טיפ: מילים שמסתיימות ב-e</p>
                  <p className="text-blue-600 text-sm">write → writing, drive → driving, dance → dancing</p>
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
                    <p>1. I ___ (write) a letter right now.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. They ___ (not/watch) TV at the moment.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. ___ she ___ (cook) dinner now?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The kids ___ (play) outside.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. am writing</p>
                    <p>2. are not (aren't) watching</p>
                    <p>3. Is / cooking</p>
                    <p>4. are playing</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. He going home now.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We is studying for the test.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. He <strong>is going</strong> home now.</p>
                    <p>2. We <strong>are studying</strong> for the test.</p>
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
                <p>Present Progressive הוא זמן קריטי לדיבור יומיומי ולהבנה טובה של טקסטים באנגלית. שליטה בזיהוי המילים המכוונות לעכשיו, מבנה התחביר, ושימוש נכון ב-am/is/are – מבטיחים הצלחה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• שים לב למילים כמו now, right now, at the moment – הן "צועקות" Present Progressive</li>
                  <li>• אל תשכח את הפועל העזר (am/is/are) – בלעדיו המשפט שגוי</li>
                  <li>• תרגל תרגילים קצרים: גם כתיבה, גם דיבור</li>
                  <li>• קרא שאלות באמיר"ם לאט, חפש רמזי זמן בפסקה</li>
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

export default PresentProgressive;