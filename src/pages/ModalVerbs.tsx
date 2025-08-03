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
  Zap,
  Shield,
  Compass,
  Heart,
  HelpCircle,
  Star,
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

const ModalVerbs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3" style={{ color: '#0056B3' }}>
            Modal Verbs
          </h1>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4" style={{ color: '#4B2E80' }}>
            פעלים מודאליים
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Modal Verbs (פעלים מודאליים) משמשים <strong>להביע יכולת, בקשה, חובה, אפשרות, רשות, עצה ועוד</strong>. 
            הם מהווים חלק מרכזי באנגלית היומיומית, בשפה האקדמית ובמבחני הבנה. 
            שליטה בהם חיונית להבעה מדויקת ולהצלחה במבחן אמיר"ם.
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
                <strong>Modal Verbs</strong> הם פעלים עזר (auxiliary verbs) שמופיעים לפני פועל עיקרי ונותנים לו משמעות נוספת.
              </p>
              <p className="text-gray-700 mb-3">
                Modal Verbs are auxiliary verbs that appear before a main verb and give it additional meaning.
              </p>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border-l-4 border-indigo-400 mt-4">
                <p className="text-indigo-800 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  <strong>הרעיון המרכזי:</strong> הוספת גוון משמעותי לפועל (יכולת, חובה, אפשרות וכו')
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Section */}
        <Card className="mb-8 shadow-sm border-l-4 border-indigo-400">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-indigo-600 flex items-center">
              <Target className="h-6 w-6 mr-2" />
              מבנה תחבירי בסיסי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Structure */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                <h4 className="font-semibold text-indigo-800 mb-3">כללי מבנה</h4>
                <div className="text-center p-3 bg-white rounded border-2 border-indigo-300">
                  <p className="font-mono text-lg text-indigo-800">
                    Subject + Modal Verb + Verb (base form)
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">דוגמאות:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• I <strong>can eat</strong> - אני יכול לאכול</li>
                    <li>• He <strong>should go</strong> - הוא צריך ללכת</li>
                    <li>• She <strong>must study</strong> - היא חייבת ללמוד</li>
                  </ul>
                </div>
              </div>

              {/* Key Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                  <h5 className="font-semibold text-yellow-800 mb-2">כלל 1</h5>
                  <p className="text-yellow-700 text-sm">תמיד פועל בסיסי (V1) אחרי מודאלי - בלי to, s, ing</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
                  <h5 className="font-semibold text-green-800 mb-2">כלל 2</h5>
                  <p className="text-green-700 text-sm">אין הטיה למודאליים - אותו צורה לכל הגופים</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                  <h5 className="font-semibold text-blue-800 mb-2">כלל 3</h5>
                  <p className="text-blue-700 text-sm">שלילה: not אחרי המודאלי | שאלה: מודאלי בתחילת המשפט</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal Verbs Types */}
        <Card className="mb-8 shadow-sm border-l-4" style={{ borderLeftColor: '#FF7F0E' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#FF7F0E' }}>
              <Star className="h-6 w-6 mr-2" />
              פעלים מודאליים עיקריים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#0056B3', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 flex items-center" style={{ color: '#0056B3' }}>
                  <Zap className="h-5 w-5 mr-2" />
                  CAN / COULD - יכולת
                </h5>
                <p className="text-sm text-gray-600 mb-2">יכולת פיזית או מנטלית</p>
                <ul className="text-sm space-y-1">
                  <li>• I <strong>can</strong> speak English - אני יכול לדבר אנגלית</li>
                  <li>• She <strong>could</strong> swim when she was 5 - היא ידעה לשחות כשהיתה בת 5</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4B2E80', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 flex items-center" style={{ color: '#4B2E80' }}>
                  <HelpCircle className="h-5 w-5 mr-2" />
                  MAY / MIGHT - אפשרות/רשות
                </h5>
                <p className="text-sm text-gray-600 mb-2">אפשרות או בקשת רשות</p>
                <ul className="text-sm space-y-1">
                  <li>• It <strong>may</strong> rain tomorrow - יכול להיות שיירד גשם מחר</li>
                  <li>• You <strong>might</strong> win the prize - אתה עשוי לזכות בפרס</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#FF7F0E', backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 flex items-center" style={{ color: '#FF7F0E' }}>
                  <Shield className="h-5 w-5 mr-2" />
                  MUST - חובה
                </h5>
                <p className="text-sm text-gray-600 mb-2">חובה חזקה או הכרח</p>
                <ul className="text-sm space-y-1">
                  <li>• Students <strong>must</strong> wear uniforms - תלמידים חייבים ללבוש מדים</li>
                  <li>• You <strong>must</strong> stop - אתה חייב לעצור</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-green-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-green-600 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  SHOULD / OUGHT TO - עצה
                </h5>
                <p className="text-sm text-gray-600 mb-2">עצה או המלצה</p>
                <ul className="text-sm space-y-1">
                  <li>• You <strong>should</strong> study harder - אתה צריך ללמוד יותר</li>
                  <li>• You <strong>ought to</strong> rest - אתה צריך לנוח</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border-2 border-purple-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-purple-600 flex items-center">
                  <Compass className="h-5 w-5 mr-2" />
                  WILL / WOULD - עתיד/נימוס
                </h5>
                <p className="text-sm text-gray-600 mb-2">עתיד או בקשה מנומסת</p>
                <ul className="text-sm space-y-1">
                  <li>• He <strong>will</strong> come soon - הוא יבוא בקרוב</li>
                  <li>• <strong>Would</strong> you like some tea? - האם תרצה תה?</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border-2 border-teal-500" style={{ backgroundColor: '#F7F9FC' }}>
                <h5 className="font-semibold mb-2 text-teal-600 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  COULD / WOULD - בקשה מנומסת
                </h5>
                <p className="text-sm text-gray-600 mb-2">בקשות מנומסות ומתוחכמות</p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Could</strong> you help me? - האם תוכל לעזור לי?</li>
                  <li>• <strong>Would</strong> you open the door? - האם תפתח את הדלת?</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uses Section */}
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
                <Zap className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">יכולת (Ability)</h4>
                  <p className="text-gray-700">She <strong>can</strong> play the piano - היא יודעת לנגן בפסנתר</p>
                  <p className="text-gray-700">I <strong>could</strong> run fast when I was a child - יכולתי לרוץ מהר כשהייתי ילד</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <HelpCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">אפשרות (Possibility)</h4>
                  <p className="text-gray-700">It <strong>may</strong> rain tomorrow - יכול להיות שיירד גשם מחר</p>
                  <p className="text-gray-700">You <strong>might</strong> win the prize - אתה עשוי לזכות בפרס</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Shield className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">חובה (Obligation)</h4>
                  <p className="text-gray-700">Students <strong>must</strong> wear uniforms - תלמידים חייבים ללבוש מדים</p>
                  <p className="text-gray-700">You <strong>have to</strong> listen carefully - אתה חייב להקשיב בעינה</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <Heart className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">עצה (Advice)</h4>
                  <p className="text-gray-700">You <strong>should</strong> eat healthy food - אתה צריך לאכול אוכל בריא</p>
                  <p className="text-gray-700">You <strong>ought to</strong> rest - אתה צריך לנוח</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#FF7F0E' }} />
                <div>
                  <h4 className="font-semibold text-gray-900">בקשה/נימוס (Request/Politeness)</h4>
                  <p className="text-gray-700"><strong>Could</strong> you help me? - האם תוכל לעזור לי?</p>
                  <p className="text-gray-700"><strong>Would</strong> you like some coffee? - האם תרצה קפה?</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Types */}
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
                <p className="text-green-700 text-sm mb-2">Subject + Modal + V1</p>
                <ul className="text-green-600 text-sm space-y-1">
                  <li>• He <strong>can swim</strong></li>
                  <li>• You <strong>should study</strong></li>
                  <li>• She <strong>must go</strong></li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">משפט שלילי</h4>
                <p className="text-red-700 text-sm mb-2">Subject + Modal + not + V1</p>
                <ul className="text-red-600 text-sm space-y-1">
                  <li>• He <strong>cannot (can't) swim</strong></li>
                  <li>• You <strong>should not (shouldn't) smoke</strong></li>
                  <li>• She <strong>must not (mustn't) leave</strong></li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">שאלות</h4>
                <p className="text-blue-700 text-sm mb-2">Modal + Subject + V1?</p>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li>• <strong>Can</strong> he swim?</li>
                  <li>• <strong>Should</strong> I call?</li>
                  <li>• <strong>Must</strong> she go?</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded">
              <p className="text-indigo-800 font-medium text-center">
                💬 <strong>תשובות קצרות:</strong> Yes, he can. / No, he can't. | Yes, you should. / No, you shouldn't.
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
                    <li>• You <strong>can</strong> sit here - אתה יכול לשבת כאן</li>
                    <li>• I <strong>must</strong> go now - אני חייב ללכת עכשיו</li>
                    <li>• She <strong>should</strong> call her mother - היא צריכה להתקשר לאמא שלה</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>משפטים מתקדמים</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• He <strong>could</strong> speak French when he was young</li>
                    <li>• You <strong>might</strong> find the answer in the book</li>
                    <li>• We <strong>should have</strong> left earlier (עצה בעבר)</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F4FD' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#0056B3' }}>דוגמאות מתוך מבחני אמיר"ם</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">You ___ eat more vegetables.</p>
                    <p className="text-sm text-gray-600">(can / must / should / will)</p>
                    <p className="text-green-700 font-medium">תשובה: should</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">___ you help me with this?</p>
                    <p className="text-sm text-gray-600">(Can / Will / Must / Should)</p>
                    <p className="text-green-700 font-medium">תשובה: Can</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">She ___ not swim.</p>
                    <p className="text-sm text-gray-600">(can / does / should / is)</p>
                    <p className="text-green-700 font-medium">תשובה: can</p>
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
                <h4 className="font-semibold text-red-800 mb-3">שימוש לא נכון במבנה</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">✗</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-800">She can <strong>to go</strong> home</p>
                        <p className="text-red-600 text-sm">אחרי מודאלי לא מוסיפים to!</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse mt-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">She can <strong>go</strong> home</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-3">הוספת s, ing או ed למודאליים</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He <strong>cans</strong> swim</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He <strong>can</strong> swim</span>
                  </div>
                  <p className="text-orange-600 text-sm mt-2">
                    💡 מודאליים לא משתנים - אותה צורה לכל הגופים!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-3">שימוש בשני מודאליים יחד</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>He <strong>will can</strong> help us</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>He <strong>will be able to</strong> help us</span>
                  </div>
                  <p className="text-purple-600 text-sm mt-2">
                    💡 לא יכול להיות שני מודאליים יחד - השתמש ב-be able to במקום can
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
                    <p>1. He ___ (must) do his homework.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. You ___ (can) see the sea from here.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. I ___ (may) come to the party.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. ___ you (would) like some tea?</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. She ___ (should) eat more vegetables.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">פתרונות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. must</p>
                    <p>2. can</p>
                    <p>3. may</p>
                    <p>4. Would</p>
                    <p>5. should</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול תיקון טעויות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. She cans dance very well.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. You should to eat breakfast.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. He don't can swim.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. They musted leave early yesterday.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>5. I will can help you tomorrow.</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תיקונים</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. She <strong>can</strong> dance very well.</p>
                    <p>2. You should eat breakfast.</p>
                    <p>3. He <strong>cannot (can't)</strong> swim.</p>
                    <p>4. They <strong>had to</strong> leave early yesterday.</p>
                    <p>5. I <strong>will be able to</strong> help you tomorrow.</p>
                  </div>
                </details>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F9FC' }}>
                <h4 className="font-semibold mb-3">תרגול זיהוי משמעות</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <p>1. "You should study more" - זהו ביטוי של:</p>
                    <p className="text-sm text-gray-600">(יכולת / חובה / עצה / אפשרות)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>2. "Students must wear uniforms" - זהו ביטוי של:</p>
                    <p className="text-sm text-gray-600">(יכולת / חובה / עצה / אפשרות)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>3. "It might rain tomorrow" - זהו ביטוי של:</p>
                    <p className="text-sm text-gray-600">(יכולת / חובה / עצה / אפשרות)</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p>4. "She can speak five languages" - זהו ביטוי של:</p>
                    <p className="text-sm text-gray-600">(יכולת / חובה / עצה / אפשרות)</p>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">תשובות</summary>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <p>1. עצה</p>
                    <p>2. חובה</p>
                    <p>3. אפשרות</p>
                    <p>4. יכולת</p>
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
                <p>Modal Verbs מופיעים הרבה באנגלית ובמבחני אמיר"ם. זיהוי השימושים, שמירה על מבנה נכון (פועל בסיסי), ושליטה בשלילה ובשאלה יבטיחו תשובות נכונות.</p>
              </div>
              <div className="p-4 rounded-lg bg-white bg-opacity-10">
                <h4 className="font-semibold mb-2">טיפים חשובים לאמיר"ם</h4>
                <ul className="space-y-2">
                  <li>• תמיד השתמש בפועל בסיסי אחרי מודאלי – בלי to, בלי s, בלי ing</li>
                  <li>• שלילה: not אחרי הפועל המודאלי (cannot, should not)</li>
                  <li>• תרגל במיוחד הבנה והשלמות – אלה חוזרים הרבה במבחן!</li>
                  <li>• דע לזהות: עצה (should), חובה (must), יכולת (can/could), אפשרות (may/might)</li>
                  <li>• זכור: מודאליים לא משתנים - אותה צורה לכל הגופים</li>
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

export default ModalVerbs;