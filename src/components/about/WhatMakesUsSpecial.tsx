
import { TrendingUp, GraduationCap, MessageCircle } from "lucide-react";

const WhatMakesUsSpecial = () => {
  return (
    <section className="max-w-5xl mx-auto mb-16">
      <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">מה מייחד אותנו באמת?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h3 className="font-bold text-xl text-blue-900 text-center mb-4">תוכן עדכני בלבד</h3>
          <p className="text-gray-700 text-center">
            כל שאלה באתר עברה בקרת איכות מקצועית, נבדקה מול מבחני אמירם רשמיים ומעודכנת באופן קבוע.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <GraduationCap className="text-green-600 h-8 w-8" />
            </div>
          </div>
          <h3 className="font-bold text-xl text-blue-900 text-center mb-4">מערכת מותאמת אישית</h3>
          <p className="text-gray-700 text-center">
            תרגול שמגיב לרמה שלך, המלצות ללמידה ממוקדת, דוחות התקדמות וניתוח טעויות בזמן אמת.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <MessageCircle className="text-orange-600 h-8 w-8" />
            </div>
          </div>
          <h3 className="font-bold text-xl text-blue-900 text-center mb-4">תמיכה מקצועית</h3>
          <p className="text-gray-700 text-center">
            צוות מנוסה שזמין לענות על שאלות, להסביר ולסייע – ממש כמו מורה פרטי, אבל אונליין.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsSpecial;
