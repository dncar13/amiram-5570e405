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
  ArrowRightLeft,
  List,
  ArrowUpDown,
  FileText,
  HelpCircle
} from "lucide-react";

const WordOrder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Word Order
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            סדר מילים באנגלית
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            סדר המילים באנגלית קובע את <strong>המשמעות</strong> של המשפט. טעות בסדר המילים יכולה לשנות משמעות ולפגוע בציון במבחן אמיר"ם. 
            בעברית יש חופש תחבירי, אבל באנגלית יש כלל ברזל: <strong>Subject → Verb → Object</strong>.
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
              <p className="text-lg font-medium text-gray-800 mb-4">
                באנגלית, לרוב המשפטים יש <strong>סדר קבוע</strong>: Subject (נושא) → Verb (פועל) → Object (מושא)
              </p>
              <div className="text-center p-4 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                  <div className="p-3 bg-blue-100 rounded text-blue-800 font-semibold">
                    Subject
                  </div>
                  <ArrowRightLeft className="h-6 w-6 text-gray-400" />
                  <div className="p-3 bg-purple-100 rounded text-purple-800 font-semibold">
                    Verb
                  </div>
                  <ArrowRightLeft className="h-6 w-6 text-gray-400" />
                  <div className="p-3 bg-orange-100 rounded text-orange-800 font-semibold">
                    Object
                  </div>
                </div>
                <p className="mt-3 font-mono text-lg" style={{ color: '#0056B3' }}>
                  She reads books
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="font-semibold text-green-800">✓ נכון</p>
                  <p className="text-green-600">I eat apples</p>
                </div>
                <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                  <p className="font-semibold text-red-800">✗ לא נכון</p>
                  <p className="text-red-600">Apples eat I</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Structure Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              מבנה תחבירי ומיקום מילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic SVO Structure */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <List className="h-5 w-5 mr-2 text-blue-600" />
                  מבנה בסיסי: Subject + Verb + Object
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#0056B3' }}>
                  <p className="font-mono text-lg" style={{ color: '#0056B3' }}>
                    The cat (S) chased (V) the mouse (O)
                  </p>
                </div>
              </div>

              {/* Adverbs Position */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <ArrowUpDown className="h-5 w-5 mr-2" />
                  מיקום תוארי פועל (Adverbs)
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded">
                    <h5 className="font-semibold text-blue-900">לרוב אחרי הפועל:</h5>
                    <p className="text-blue-700">He <strong>usually eats</strong> breakfast at 8</p>
                    <p className="text-blue-700">She <strong>quickly ran</strong> home</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <h5 className="font-semibold text-blue-900">מילות תדירות (always, never, usually):</h5>
                    <p className="text-blue-700">I <strong>always</strong> study at night</p>
                    <p className="text-blue-700">They <strong>never</strong> arrive late</p>
                  </div>
                </div>
              </div>

              {/* Adjectives Position */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  מיקום תארים (Adjectives)
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-purple-900">תמיד לפני שם העצם:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-2 bg-white rounded">
                      <p className="text-purple-700">A <strong>big</strong> house</p>
                    </div>
                    <div className="p-2 bg-white rounded">
                      <p className="text-purple-700">An <strong>interesting</strong> book</p>
                    </div>
                    <div className="p-2 bg-white rounded">
                      <p className="text-purple-700">A <strong>beautiful</strong> girl</p>
                    </div>
                    <div className="p-2 bg-white rounded">
                      <p className="text-purple-700">A <strong>red</strong> car</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions and Negatives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>שלילה</h5>
                  <p className="font-mono text-sm mb-1">Subject + do/does + not + Verb</p>
                  <p className="text-sm">She <strong>does not</strong> like coffee</p>
                </div>
                
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>שאלות</h5>
                  <p className="font-mono text-sm mb-1">Do/Does + Subject + Verb?</p>
                  <p className="text-sm"><strong>Do</strong> you play football?</p>
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
              שימושים עיקריים ודגשים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* SVO Order */}
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <ArrowRightLeft className="h-5 w-5 mr-2" />
                  שמירה על סדר Subject-Verb-Object
                </h4>
                <div className="space-y-2">
                  <p className="text-blue-700">• The cat (S) chased (V) the mouse (O)</p>
                  <p className="text-blue-700">• Students (S) study (V) English (O)</p>
                  <p className="text-blue-700">• My mother (S) cooks (V) dinner (O)</p>
                </div>
              </div>

              {/* Frequency Words */}
              <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  מילות תדירות (usually, always, never)
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-purple-900">בין הנושא לפועל עיקרי:</p>
                  <div className="space-y-1 text-purple-700">
                    <p>• I <strong>always</strong> study at night</p>
                    <p>• She <strong>usually</strong> arrives on time</p>
                    <p>• They <strong>never</strong> eat meat</p>
                    <p>• We <strong>sometimes</strong> go to the cinema</p>
                  </div>
                </div>
              </div>

              {/* WH Questions */}
              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  סדר בשאלות עם מילת שאלה
                </h4>
                <div className="p-3 bg-white rounded border">
                  <p className="font-mono font-semibold text-center text-orange-900">
                    Wh-Question + Auxiliary + Subject + Verb
                  </p>
                </div>
                <div className="mt-3 space-y-1 text-orange-700">
                  <p>• <strong>Where</strong> do you live?</p>
                  <p>• <strong>What</strong> does he want?</p>
                  <p>• <strong>Why</strong> are you late?</p>
                  <p>• <strong>When</strong> did they arrive?</p>
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
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ always she eats breakfast at home.</p>
                    <p className="text-sm text-gray-600">(She always / Always she / She eats always)</p>
                    <p className="text-green-700 font-medium">תשובה: She always</p>
                    <p className="text-sm text-gray-500">הסבר: מילת תדירות בין נושא לפועל</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The book ___ is interesting.</p>
                    <p className="text-sm text-gray-600">(red / big / on the table / that you gave me)</p>
                    <p className="text-green-700 font-medium">תשובה: that you gave me</p>
                    <p className="text-sm text-gray-500">הסבר: תואר אחרי שם העצם - רק במשפט יחס</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you play football?</p>
                    <p className="text-sm text-gray-600">(Do / Does / Are / Is)</p>
                    <p className="text-green-700 font-medium">תשובה: Do</p>
                    <p className="text-sm text-gray-500">הסבר: you = פועל עזר do</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• She <strong>drinks coffee</strong> every morning</li>
                    <li>• They <strong>play football</strong> after school</li>
                    <li>• I <strong>read books</strong> at night</li>
                    <li>• We <strong>study English</strong> together</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The teacher <strong>always gives</strong> us homework</li>
                    <li>• I <strong>rarely watch</strong> TV in the afternoon</li>
                    <li>• She <strong>never eats</strong> fast food</li>
                    <li>• We <strong>sometimes visit</strong> our grandparents</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>שאלות</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Where</strong> do you live?</li>
                    <li>• <strong>What time</strong> does the lesson start?</li>
                    <li>• <strong>Why</strong> are you late?</li>
                    <li>• <strong>How often</strong> do you exercise?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>שלילה</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• He <strong>does not</strong> eat fish</li>
                    <li>• We <strong>did not</strong> go to the party</li>
                    <li>• She <strong>doesn't</strong> like chocolate</li>
                    <li>• They <strong>don't</strong> have a car</li>
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
                <h4 className="font-semibold text-red-800 mb-3">ערבוב סדר המילים</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">Eats always he breakfast</p>
                        <p className="text-red-600 text-sm">סדר שגוי - תואר פועל במקום הלא נכון</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">He always eats breakfast</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">תואר אחרי שם עצם (לא נכון!)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>A car <strong>red</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>A <strong>red</strong> car</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>A house <strong>beautiful</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>A <strong>beautiful</strong> house</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שלילה/שאלה במבנה לא נכון</h4>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>He not likes pizza</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>He <strong>does not</strong> like pizza</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Where you are going?</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Where <strong>are you</strong> going?</span>
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
                <h4 className="font-semibold mb-3">תרגול השלמת משפטים</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She ___ (always / eats / breakfast) at 7 o'clock.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. ___ (Where / do / you / live)?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. My friend ___ (not / like) pizza.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. I have a ___ (car / red / beautiful).</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. ___ (Why / is / he / late)?</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She <strong>always eats breakfast</strong> at 7 o'clock</p>
                    <p>2. <strong>Where do you live?</strong></p>
                    <p>3. My friend <strong>does not (doesn't) like</strong> pizza</p>
                    <p>4. I have a <strong>beautiful red car</strong></p>
                    <p>5. <strong>Why is he late?</strong></p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. Always she comes on time.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. A house beautiful.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. What you want?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. Usually I eat lunch at home.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. <strong>She always</strong> comes on time</p>
                    <p>2. A <strong>beautiful house</strong></p>
                    <p>3. What <strong>do you</strong> want?</p>
                    <p>4. I <strong>usually</strong> eat lunch at home</p>
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
                <p>סדר המילים באנגלית הוא חוק ברור: <strong>Subject → Verb → Object</strong>. שינוי סדר המילים פוגע במשמעות, בהבנה, ובציון - במיוחד במבחן אמיר"ם. תארים תמיד לפני שם העצם, ומילות תדירות בין הנושא לפועל.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים</h4>
                <ul className="space-y-2">
                  <li>• וודא תמיד שנושא פותח את המשפט, אחריו פועל, אחריו מושא</li>
                  <li>• תארים תמיד לפני שם העצם - A red car (לא A car red)</li>
                  <li>• מילות תדירות (always, never, usually) בין נושא לפועל</li>
                  <li>• בשאלות: מילת שאלה + פועל עזר + נושא + פועל</li>
                  <li>• בשלילה: Subject + do/does + not + verb</li>
                  <li>• תרגל זיהוי שגיאות - סדר מילים חוזר הרבה באמיר"ם!</li>
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

export default WordOrder;