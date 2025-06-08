
import { Target, BookOpen, MessageCircle, User, Smartphone } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section className="mb-16 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-12 shadow-lg mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full opacity-20 -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Target className="text-blue-600 h-8 w-8" />
            <h2 className="font-bold text-3xl text-blue-900 text-center">למה לבחור ב-AMIRAM Academy?</h2>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-2xl font-semibold text-blue-800 mb-4">המסלול הבטוח שלך להצלחה במבחן האמירם!</p>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
              אנחנו כאן כדי להפוך את הלמידה שלך לממוקדת, מדויקת ואפקטיבית.
              במקום לבזבז זמן על חומר לא רלוונטי, אצלנו תמצא כלים שמכוונים בדיוק אל מה שנדרש במבחן – 
              עם תרגולים עדכניים, הסברים בעברית, ומעקב אישי אחרי כל התקדמות.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">התמחות בלעדית</h3>
              </div>
              <p className="text-gray-700">אנחנו עוסקים רק בהכנה לאמירם – לא עוד אתר כללי.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">מאגר שאלות רשמי ומעודכן</h3>
              </div>
              <p className="text-gray-700">תרגולים בפורמט האמיתי של המבחן, כולל שאלות ממועדי עבר, בדיוק כמו שתפגוש בבחינה.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-orange-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">פידבק מיידי</h3>
              </div>
              <p className="text-gray-700">כל שאלה מלווה בהסבר מקצועי, ודוח התקדמות שמבליט עבורך נקודות לשיפור.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">התאמה אישית</h3>
              </div>
              <p className="text-gray-700">המערכת שלנו בונה עבורך מסלול למידה חכם, שמותאם במיוחד לחלשים ולחזקים שלך.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-indigo-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Smartphone className="text-indigo-600 h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-blue-900">נוחות מקסימלית</h3>
              </div>
              <p className="text-gray-700">אפשר לתרגל מכל מקום, בכל זמן, מכל מכשיר, בלי להסתבך.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl font-semibold text-blue-800">
              עם AMIRAM Academy, אתה לא לומד לבד –<br />
              אתה מקבל את כל הכלים כדי להגיע לציון הגבוה ביותר שלך.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
