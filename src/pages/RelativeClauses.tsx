import React from "react";
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
  FileText,
  Filter,
  Info,
  Zap,
  BookMarked
} from "lucide-react";

// Simple Card components
const Card = ({ children, className = "", style = {} }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`} style={style}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", style = {} }) => (
  <h3 className={`text-lg font-semibold ${className}`} style={style}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", size = "default", className = "", style = {}, asChild = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-200 bg-white hover:bg-gray-50"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    lg: "h-11 px-8 rounded-md"
  };
  
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.default;
  
  if (asChild) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`,
      style: style,
      ...props
    });
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

const RelativeClauses: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Relative Clauses
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            משפטי זיקה
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Relative Clauses (משפטי זיקה) מאפשרים <strong>להוסיף מידע על שם עצם</strong> בצורה יעילה וממוקדת, 
            בלי ליצור משפטים מיותרים. זהו כלי קריטי בשפה תקנית, בקריאה אקדמית ובמבחני הבנה. 
            הם מאפשרים לכתוב משפטים עשירים יותר ולחבר רעיונות בצורה חלקה ואלגנטית.
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
                <strong>Relative Clause</strong> הוא משפט משנה שמספק מידע נוסף על שם עצם, באמצעות מילת זיקה.
              </p>
              <p className="text-gray-700 mb-3">
                A Relative Clause is a subordinate clause that provides additional information about a noun using a relative pronoun.
              </p>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border-l-4 border-indigo-400 mt-4">
                <p className="text-indigo-800 flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  <strong>הרעיון המרכזי:</strong> חיבור מידע נוסף לשם עצם בצורה תחבירית נכונה
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure and Example */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <Link2 className="h-6 w-6 mr-2" />
              מבנה ודוגמאות בסיסיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Structure */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                <h4 className="font-semibold text-indigo-800 mb-3">כללי מבנה</h4>
                <div className="text-center p-3 bg-white rounded border-2 border-indigo-300">
                  <p className="font-mono text-lg text-indigo-800">
                    שם עצם + Relative Pronoun + משפט זיקה
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• The book <strong>that I read</strong> was interesting - הספר <strong>שקראתי</strong> היה מעניין</li>
                    <li>• The student <strong>who got 100</strong> is very happy - התלמיד <strong>שקיבל 100</strong> מאוד שמח</li>
                  </ul>
                </div>
              </div>

              {/* Connection Example */}
              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  חיבור שני משפטים למשפט אחד
                </h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded">
                    <p className="text-red-600 font-medium">לפני (שני משפטים נפרדים):</p>
                    <p className="text-gray-700">I have a friend. He speaks French.</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-green-600 font-medium">אחרי (משפט אחד עם זיקה):</p>
                    <p className="text-gray-700">I have a friend <strong>who speaks French</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relative Pronouns Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Target className="h-6 w-6 mr-2" />
              מילות זיקה עיקריות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>WHO - אנשים</h5>
                <p className="text-sm text-gray-600 mb-2">מתייחס לאנשים בלבד</p>
                <ul className="text-sm space-y-1">
                  <li>• The woman <strong>who</strong> lives next door is a doctor</li>
                  <li>• האישה <strong>ש</strong>גרה בבית השכן היא רופאה</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>WHICH - דברים/חיות</h5>
                <p className="text-sm text-gray-600 mb-2">מתייחס לדברים וחיות</p>
                <ul className="text-sm space-y-1">
                  <li>• The car <strong>which</strong> was stolen is new</li>
                  <li>• המכונית <strong>ש</strong>נגנבה היא חדשה</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>THAT - אנשים ודברים</h5>
                <p className="text-sm text-gray-600 mb-2">יכול להחליף את who/which</p>
                <ul className="text-sm space-y-1">
                  <li>• The book <strong>that</strong> I bought was expensive</li>
                  <li>• הספר <strong>ש</strong>קניתי היה יקר</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-green-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-green-600">WHOSE - בעלות</h5>
                <p className="text-sm text-gray-600 mb-2">מציין בעלות או שייכות</p>
                <ul className="text-sm space-y-1">
                  <li>• The boy <strong>whose</strong> bike was lost is crying</li>
                  <li>• הילד <strong>ש</strong>האופניים <strong>שלו</strong> אבדו בוכה</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border-2 border-purple-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-purple-600">WHERE - מקום</h5>
                <p className="text-sm text-gray-600 mb-2">מתייחס למקום</p>
                <ul className="text-sm space-y-1">
                  <li>• The café <strong>where</strong> we met is closed</li>
                  <li>• הקפה <strong>ש</strong>בו נפגשנו סגור</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border-2 border-teal-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-teal-600">WHEN - זמן</h5>
                <p className="text-sm text-gray-600 mb-2">מתייחס לזמן</p>
                <ul className="text-sm space-y-1">
                  <li>• I remember the day <strong>when</strong> we met</li>
                  <li>• אני זוכר את היום <strong>ש</strong>בו נפגשנו</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Relative Clauses */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#4B2E80' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#4B2E80' }}>
              <Filter className="h-6 w-6 mr-2" />
              שני סוגי משפטי זיקה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Defining (מגדיר)
                </h4>
                <p className="text-blue-700 text-sm mb-2">מידע חיוני - בלי פסיקים</p>
                <div className="bg-white p-3 rounded">
                  <p className="text-blue-600 text-sm">
                    The girl <strong>who is wearing a red dress</strong> is my sister
                  </p>
                  <p className="text-blue-500 text-xs mt-1">
                    הבנות הרבה - איזו מהן? זו שלובשת שמלה אדומה
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Non-defining (לא מגדיר)
                </h4>
                <p className="text-purple-700 text-sm mb-2">מידע נוסף - עם פסיקים</p>
                <div className="bg-white p-3 rounded">
                  <p className="text-purple-600 text-sm">
                    My brother<strong>, who lives in Haifa,</strong> is a teacher
                  </p>
                  <p className="text-purple-500 text-xs mt-1">
                    יש לי אח אחד - בדרך אגב, הוא גר בחיפה
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <p className="text-yellow-800 font-medium">
                ⚠️ <strong>חשוב לאמיר"ם:</strong> במבחן מתרכזים בעיקר במשפטי זיקה מגדירים (Defining) - בלי פסיקים!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uses Section */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              שימושים עיקריים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Info className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הוספת מידע חיוני</h4>
                  <p className="text-gray-700">The man <strong>who fixed my car</strong> is a professional</p>
                  <p className="text-gray-700">האיש <strong>שתיקן את המכונית שלי</strong> הוא מקצועי</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Link2 className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">חיבור שני משפטים</h4>
                  <p className="text-gray-700">She bought the dress <strong>that was on sale</strong></p>
                  <p className="text-gray-700">היא קנתה את השמלה <strong>שהיתה במבצע</strong></p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Zap className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">חיסכון במילים ותחביר</h4>
                  <p className="text-gray-700">I have a friend <strong>who speaks French</strong></p>
                  <p className="text-gray-700">יש לי חבר <strong>שמדבר צרפתית</strong></p>
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
              סימני זיהוי ודגשים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>מילות זיקה לזיהוי</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">מילות זיקה:</p>
                    <p className="text-sm text-blue-600">who, which, that, whose, where, when</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">זיהוי במשפט:</p>
                    <p className="text-sm text-green-600">חפש שם עצם + מילת זיקה + משפט נוסף</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דגשים חשובים</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>אין פסיק</strong> לפני משפט זיקה מגדיר (Defining)</li>
                  <li>• ניתן להשמיט <strong>"that"</strong> כשהוא מושא</li>
                  <li>• <strong>לא</strong> להשתמש בשתי מילות זיקה יחד</li>
                  <li>• תמיד לבחור מילת זיקה מתאימה לשם העצם</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
              <p className="text-indigo-800 font-medium">
                💡 <strong>טיפ מהיר:</strong> אדם = who/that | דבר = which/that | בעלות = whose | מקום = where | זמן = when
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#0056B3' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#0056B3' }}>
              <BookMarked className="h-6 w-6 mr-2" />
              דוגמאות מפורטות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים בסיסיים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The teacher <strong>who teaches English</strong> is very nice</li>
                    <li>• המורה <strong>שמלמדת אנגלית</strong> מאוד נחמדה</li>
                    <li>• The bag <strong>that I bought</strong> was expensive</li>
                    <li>• התיק <strong>שקניתי</strong> היה יקר</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The car <strong>which was stolen</strong> has been found</li>
                    <li>• המכונית <strong>שנגנבה</strong> נמצאה</li>
                    <li>• The student <strong>whose homework was lost</strong> got extra time</li>
                    <li>• התלמיד <strong>ששיעורי הבית שלו אבדו</strong> קיבל זמן נוסף</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The man ___ fixed my car is my neighbor.</p>
                    <p className="text-sm text-gray-600">(who / which / where / when)</p>
                    <p className="text-green-700 font-medium">תשובה: who</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The building ___ we work is new.</p>
                    <p className="text-sm text-gray-600">(where / that / whose / which)</p>
                    <p className="text-green-700 font-medium">תשובה: where</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The girl ___ dog ran away is crying.</p>
                    <p className="text-sm text-gray-600">(whose / who's / who / which)</p>
                    <p className="text-green-700 font-medium">תשובה: whose</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש לא נכון במילת הזיקה</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">The book <strong>who</strong> is on the table is mine</p>
                        <p className="text-red-600 text-sm">ספר הוא דבר, לא אדם!</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">The book <strong>which/that</strong> is on the table is mine</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">פסיקים לא נכונים</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The man, who works here, is my uncle</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The man <strong>who works here</strong> is my uncle</span>
                  </div>
                  <p className="text-orange-600 text-sm mt-2">
                    💡 ב-Defining Relative Clauses אין פסיקים!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">שימוש כפול במילת זיקה</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The girl who that called is my friend</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The girl <strong>who</strong> called is my friend</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">בחירה לא נכונה של מילת זיקה</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The boy <strong>which</strong> won the race is my brother</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The boy <strong>who/that</strong> won the race is my brother</span>
                  </div>
                  <p className="text-purple-600 text-sm mt-2">
                    💡 ילד הוא אדם, לא דבר - לכן who או that!
                  </p>
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
                    <p>1. The book ___ you gave me is interesting.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. The student ___ won the prize is absent.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The restaurant ___ we ate dinner was full.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The woman ___ son is in my class is a doctor.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. I remember the day ___ we first met.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. that/which</p>
                    <p>2. who</p>
                    <p>3. where</p>
                    <p>4. whose</p>
                    <p>5. when</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. The movie who I watched was boring.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. The girl which lives next door is friendly.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The house where we bought is beautiful.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The teacher, who teaches math, is strict.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. The movie <strong>which/that</strong> I watched was boring.</p>
                    <p>2. The girl <strong>who/that</strong> lives next door is friendly.</p>
                    <p>3. The house <strong>which/that</strong> we bought is beautiful.</p>
                    <p>4. The teacher <strong>who teaches math</strong> is strict. (אין פסיקים!)</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול חיבור משפטים</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. I met a girl. She speaks five languages.</p>
                    <p className="text-sm text-gray-600">→ I met a girl ___________</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. We visited a museum. It was built in 1920.</p>
                    <p className="text-sm text-gray-600">→ We visited a museum ___________</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. I know a place. We can have lunch there.</p>
                    <p className="text-sm text-gray-600">→ I know a place ___________</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. I met a girl <strong>who speaks five languages</strong>.</p>
                    <p>2. We visited a museum <strong>which/that was built in 1920</strong>.</p>
                    <p>3. I know a place <strong>where we can have lunch</strong>.</p>
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
                >
                  <a href="/simulations-entry" className="flex items-center">
                    התחילו תרגול במבחני אמיר"ם
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  </a>
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
                <p>Relative Clauses מאפשרים לכתוב משפטים עשירים וברורים. שליטה במילות הזיקה, זיהוי סוג המשפט (Defining/Non-defining), ושימוש נכון בזיקה יובילו להצלחה באנגלית ובאמיר"ם.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• שים לב מה שם העצם – אדם? חפץ? מקום? בחר מילת זיקה מתאימה</li>
                  <li>• ב-Defining אין פסיקים! (המקרה הנפוץ באמיר"ם)</li>
                  <li>• תרגל במיוחד השלמות ותיקון טעויות עם who, which, that, whose, where, when</li>
                  <li>• לפעמים מותר להשמיט "that", אך אל תשמיט במבחן אם לא בטוח</li>
                  <li>• זכור: אדם=who/that | דבר=which/that | בעלות=whose | מקום=where | זמן=when</li>
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
          >
            <a href="/articles" className="flex items-center">
              <ArrowRight className="h-5 w-5 ml-2" />
              חזרה לכל הנושאים
            </a>
          </Button>
          
          <Button 
            size="lg"
            className="w-full sm:w-auto text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF7F0E' }}
          >
            <a href="/simulations-entry" className="flex items-center">
              מעבר לתרגילים
              <ArrowLeft className="h-5 w-5 mr-2" />
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RelativeClauses;