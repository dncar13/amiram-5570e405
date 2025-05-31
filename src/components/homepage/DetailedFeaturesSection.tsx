import { Users, Trophy, Monitor, CheckCircle2, Star, Zap, BookOpen } from "lucide-react";

const FeatureCard = ({ icon, title, items, highlight = false }) => {
  return (
    <div className={`bg-white rounded-lg p-6 border transition-all duration-300 hover:shadow-lg 
      ${highlight ? 'border-blue-200 shadow-md' : 'border-gray-100'}`}>
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DetailedFeaturesSection = () => {
  const features = [
    {
      icon: <Users className="h-7 w-7 text-blue-600" />,
      title: "ליווי אישי צמוד",
      items: [
        "תמיכה מקצועית לאורך כל הדרך",
        "מענה מהיר לשאלות ופניות",
        "קבוצות לימוד וירטואליות בזום",
        "הנחיות אישיות ללמידה יעילה"
      ],
      highlight: false
    },
    {
      icon: <Monitor className="h-7 w-7 text-blue-600" />,
      title: "חומר לימוד מקצועי",
      items: [
        "כל החומר מעודכן לתכנית העדכנית",
        "מאות שאלות תרגול לכל נושא",
        "סרטוני הסבר מפורטים",
        "סיכומים וחומרי עזר להורדה"
      ],
      highlight: true
    },
    {
      icon: <Trophy className="h-7 w-7 text-blue-600" />,
      title: "סימולציות בחינה מתקדמות",
      items: [
        "דף בחינה וירטואלי מדויק",
        "מדידת זמן ומעקב אחר ביצועים",
        "ניתוח תוצאות מפורט",
        "המלצות לשיפור ביצועים"
      ],
      highlight: false
    }
  ];

  // תכונות נוספות שניתן להוסיף (אופציונלי)
  const additionalFeatures = [
    {
      icon: <BookOpen className="h-7 w-7 text-blue-600" />,
      title: "ספריית תכנים עשירה",
      items: [
        "ספרייה דיגיטלית מקיפה",
        "חומרי עזר בכל נושאי הלימוד",
        "עדכונים שוטפים לפי תקנים חדשים",
        "תכנים מותאמים לכל רמות הרישיון"
      ]
    },
    {
      icon: <Zap className="h-7 w-7 text-blue-600" />,
      title: "למידה אינטראקטיבית",
      items: [
        "מערכת למידה מותאמת אישית",
        "משימות יומיות לקידום הלמידה",
        "משחקי למידה ואתגרים מעשיים",
        "מעקב התקדמות אישי"
      ]
    },
    {
      icon: <Star className="h-7 w-7 text-blue-600" />,
      title: "הכנה ממוקדת לבחינה",
      items: [
        "תרגול שאלות מבחינות קודמות",
        "טיפים להתמודדות עם חרדת בחינות",
        "אסטרטגיות לפתרון שאלות מורכבות",
        "סימולציות זמן אמת של הבחינה"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* כותרת עם אפקט הדגשה */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 inline-block relative">
            מה שהופך אותנו למובילים בתחום לימודי החשמל
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100"></div>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            אנחנו מציעים את כל הכלים שאתם צריכים להצלחה במבחנים ובלימודים בתחום החשמל
          </p>
        </div>
        
        {/* תכונות עיקריות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              items={feature.items}
              highlight={feature.highlight}
            />
          ))}
        </div>
        
        {/* סטטיסטיקות */}
        <div className="bg-blue-50 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">המספרים מדברים בעד עצמם</h3>
            <p className="text-gray-600">הישגים שמוכיחים את המחויבות שלנו להצלחת הסטודנטים</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-blue-600 block mb-1">+5,000</span>
              <span className="text-sm text-gray-600">סטודנטים</span>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-blue-600 block mb-1">97%</span>
              <span className="text-sm text-gray-600">אחוזי הצלחה</span>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-blue-600 block mb-1">+1,200</span>
              <span className="text-sm text-gray-600">שאלות תרגול</span>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-blue-600 block mb-1">24/7</span>
              <span className="text-sm text-gray-600">תמיכה זמינה</span>
            </div>
          </div>
        </div>
        
        {/* יתרונות נוספים (אופציונלי - ניתן להסיר או להשאיר) */}
        <div className="hidden md:block">
          <h3 className="text-xl font-bold text-center mb-6">יתרונות נוספים</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-5 border border-gray-100 hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                </div>
                
                <ul className="text-sm text-gray-600 space-y-2">
                  {feature.items.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;