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
  RefreshCw,
  Eye,
  FileText,
  Shuffle,
  Settings,
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

const PassiveVoice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Passive Voice
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            סביל
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Passive Voice הוא מבנה תחבירי שבו הדגש הוא על <strong>הפעולה</strong> או <strong>התוצאה</strong> – לא על מי שעשה אותה. 
            שימוש בסביל נפוץ מאוד בכתיבה מדעית, עיתונאית ופורמלית, ומהווה נושא חשוב במבחן אמיר"ם. 
            זהו כלי שפה חיוני להבעה מקצועית ומדויקת.
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
                <strong>Passive Voice</strong> מתאר פעולה שנעשית על הנושא – לא על ידי הנושא.
              </p>
              <p className="text-gray-700 mb-3">
                The Passive Voice describes an action that is done to the subject, not by the subject.
              </p>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border-l-4 border-indigo-400 mt-4">
                <p className="text-indigo-800 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  <strong>הרעיון המרכזי:</strong> הדגשת הפעולה/התוצאה במקום המבצע
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active vs Passive Comparison */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <Shuffle className="h-6 w-6 mr-2" />
              Active vs Passive - ההשוואה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Active Voice (פעיל)
                </h4>
                <p className="text-blue-700 text-sm mb-2">המבצע עושה את הפעולה</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• <strong>Tom</strong> wrote the letter</li>
                  <li>• <strong>The chef</strong> prepares the food</li>
                  <li>• <strong>Students</strong> do homework</li>
                </ul>
                <p className="text-blue-700 text-xs mt-2 font-medium">
                  מבנה: Subject + Verb + Object
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Passive Voice (סביל)
                </h4>
                <p className="text-purple-700 text-sm mb-2">הפעולה נעשית על הנושא</p>
                <ul className="text-purple-600 text-sm space-y-1">
                  <li>• <strong>The letter</strong> was written by Tom</li>
                  <li>• <strong>The food</strong> is prepared daily</li>
                  <li>• <strong>Homework</strong> is done by students</li>
                </ul>
                <p className="text-purple-700 text-xs mt-2 font-medium">
                  מבנה: Subject + be + V3 + (by agent)
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
              <p className="text-indigo-800 font-medium text-center">
                🔑 <strong>הכלל הזהב:</strong> Active = מי עושה | Passive = מה נעשה (על מי/מה)
              </p>
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
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  מבנה בסיסי
                </h4>
                <div className="text-center p-3 bg-white rounded border-2" style={{ borderColor: '#4B2E80' }}>
                  <p className="font-mono text-lg" style={{ color: '#4B2E80' }}>
                    Subject + be (am/is/are/was/were/will be) + V3 + (by + agent)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• The letter <strong>is sent</strong> every day - המכתב נשלח כל יום</li>
                    <li>• The house <strong>was built</strong> in 1980 - הבית נבנה ב-1980</li>
                    <li>• The work <strong>will be finished</strong> tomorrow - העבודה תסתיים מחר</li>
                  </ul>
                </div>
              </div>

              {/* Tenses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#0056B3' }}>Present Simple</h5>
                  <p className="text-sm text-gray-600 mb-2">am/is/are + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• The book <strong>is read</strong> every week</li>
                    <li>• Letters <strong>are sent</strong> daily</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#4B2E80' }}>Past Simple</h5>
                  <p className="text-sm text-gray-600 mb-2">was/were + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• The house <strong>was built</strong> in 1980</li>
                    <li>• The keys <strong>were found</strong> yesterday</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#FF7F0E' }}>Present Perfect</h5>
                  <p className="text-sm text-gray-600 mb-2">has/have been + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• The work <strong>has been done</strong></li>
                    <li>• The keys <strong>have been lost</strong></li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border-2 border-green-500" style={{ backgroundColor: '#F7F9FC' }}>
                  <h5 className="font-semibold mb-2 text-green-600">Future Simple</h5>
                  <p className="text-sm text-gray-600 mb-2">will be + V3</p>
                  <ul className="text-sm space-y-1">
                    <li>• The work <strong>will be finished</strong></li>
                    <li>• The meeting <strong>will be held</strong></li>
                  </ul>
                </div>
              </div>

              {/* By usage */}
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  שימוש ב-by
                </h4>
                <div className="space-y-2 text-yellow-700">
                  <p>• משתמשים ב-by רק כשחשוב לציין מי עשה: <strong>The cake was baked by my mom</strong></p>
                  <p>• לרוב אפשר להשמיט: <strong>The project was completed</strong> (אין צורך לציין על ידי מי)</p>
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
                <Eye className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הדגשת הפעולה או התוצאה</h4>
                  <p className="text-gray-700">The window <strong>was broken</strong> last night</p>
                  <p className="text-gray-700">החלון נשבר אתמול בלילה (הפעולה חשובה, לא מי עשה)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <RefreshCw className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">הסתרת/התעלמות מהמבצע</h4>
                  <p className="text-gray-700">Mistakes <strong>were made</strong></p>
                  <p className="text-gray-700">נעשו טעויות (מי עשה? לא חשוב/ידוע)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <FileText className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">כתיבה פורמלית, מדעית, הוראות</h4>
                  <p className="text-gray-700">The results <strong>will be published</strong> next week</p>
                  <p className="text-gray-700">Passengers <strong>are requested</strong> to keep quiet</p>
                  <p className="text-gray-700">התוצאות יפורסמו השבוע הבא / הנוסעים מתבקשים לשמור על שקט</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Types Section */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              משפטים חיוביים, שליליים ושאלות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">משפט חיובי</h4>
                <p className="text-green-700 text-sm mb-2">Subject + be + V3</p>
                <ul className="text-green-600 text-sm space-y-1">
                  <li>• The house <strong>was built</strong> in 2005</li>
                  <li>• English <strong>is spoken</strong> worldwide</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">משפט שלילי</h4>
                <p className="text-red-700 text-sm mb-2">Subject + be + not + V3</p>
                <ul className="text-red-600 text-sm space-y-1">
                  <li>• The house <strong>was not built</strong> in 2005</li>
                  <li>• The work <strong>isn't finished</strong> yet</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">שאלות</h4>
                <p className="text-blue-700 text-sm mb-2">Be + Subject + V3?</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• <strong>Was</strong> the letter <strong>sent</strong>?</li>
                  <li>• <strong>When was</strong> the letter <strong>sent</strong>?</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded">
              <p className="text-indigo-800 font-medium text-center">
                💬 <strong>תשובה קצרה:</strong> Yes, it was. / No, it wasn't.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Signal Words Section */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Clock className="h-6 w-6 mr-2" />
              סימני זמן וביטויים נפוצים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>איך לזהות משפט סביל?</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">מבנה be + V3:</p>
                    <p className="text-sm text-blue-600">בכל משפט סביל תמיד תמצא צורת be + פועל V3</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="font-medium text-green-800">דוגמאות לזיהוי:</p>
                    <p className="text-sm text-green-600">The room <strong>is cleaned</strong> / The book <strong>was written</strong></p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>ביטויים נפוצים בסביל</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>be known as</strong> - להיות ידוע בתור</li>
                  <li>• <strong>be made of</strong> - להיות עשוי מ</li>
                  <li>• <strong>be born</strong> - להיוולד</li>
                  <li>• <strong>be called</strong> - להיקרא</li>
                  <li>• <strong>be given</strong> - להינתן</li>
                </ul>
              </div>
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
                    <li>• English <strong>is spoken</strong> all over the world - אנגלית מדוברת בכל העולם</li>
                    <li>• The homework <strong>was done</strong> yesterday - שיעורי הבית נעשו אתמול</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• The results <strong>have been published</strong> on the website</li>
                    <li>• The company's new product <strong>will be released</strong> soon</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The room ___ every day.</p>
                    <p className="text-sm text-gray-600">(cleans / is cleaned / was cleaned / cleaning)</p>
                    <p className="text-green-700 font-medium">תשובה: is cleaned</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The food ___ by my mother.</p>
                    <p className="text-sm text-gray-600">(was prepared / prepared / is prepare / will prepares)</p>
                    <p className="text-green-700 font-medium">תשובה: was prepared</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">The meeting ___ next week.</p>
                    <p className="text-sm text-gray-600">(is held / will be held / was held / being held)</p>
                    <p className="text-green-700 font-medium">תשובה: will be held</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שכחת פועל be</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The window cleaned yesterday</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The window <strong>was cleaned</strong> yesterday</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">שימוש לא נכון ב-V3</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The letter was <strong>send</strong> by Tom</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The letter was <strong>sent</strong> by Tom</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-3">בלבול בין Active ל-Passive</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The report wrote by the manager</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The report <strong>was written</strong> by the manager</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">טעויות בשימוש ב-by</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>The cake was made mom</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>The cake was made <strong>by</strong> mom</span>
                  </div>
                </div>
                <p className="text-purple-600 text-sm mt-2">
                  💡 אם המבצע לא חשוב/לא ידוע – אין צורך ב-by בכלל!
                </p>
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
                    <p>1. The documents ___ (print) yesterday.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. The house ___ (build) in 1995.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. The song ___ (write) by a famous artist.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The lessons ___ (record) every week.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. were printed</p>
                    <p>2. was built</p>
                    <p>3. was written</p>
                    <p>4. are recorded</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. The book was write by the student.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. The cakes are makes every morning.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. English spoken in many countries.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. The work will finished tomorrow.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. The book was <strong>written</strong> by the student.</p>
                    <p>2. The cakes are <strong>made</strong> every morning.</p>
                    <p>3. English <strong>is spoken</strong> in many countries.</p>
                    <p>4. The work will <strong>be finished</strong> tomorrow.</p>
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
                <p>Passive Voice הוא מבנה בסיסי ושימושי מאוד, במיוחד בזיהוי משפטים, השלמות והמרות במבחן אמיר"ם. שליטה במבנה, בזמנים ובשימושי by תוביל להצלחה.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• תמיד בדוק אם יש צורת be + V3 (הסימן של הסביל)</li>
                  <li>• ודא שהפועל מתאים לזמן של המשפט (am/is/are/was/were/have been/will be)</li>
                  <li>• שים לב אם מציינים את המבצע – ואם לא, פשוט משמיטים</li>
                  <li>• תרגל השלמות, המרות ותיקון טעויות – אלה חוזרים הרבה במבחן!</li>
                  <li>• זכור: הדגש על הפעולה/התוצאה, לא על המבצע</li>
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

export default PassiveVoice;