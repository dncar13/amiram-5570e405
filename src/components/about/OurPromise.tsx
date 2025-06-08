
import { Heart, CheckCircle } from "lucide-react";

const OurPromise = () => {
  return (
    <section className="max-w-4xl mx-auto mb-16">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-10 shadow-lg border-2 border-green-200">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="text-green-600 h-6 w-6" />
          </div>
          <h2 className="font-bold text-2xl text-blue-900">ההתחייבות שלנו אליך</h2>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-blue-800 mb-4">
            אתה מקבל את כל הכלים להצלחה – ואם תתמיד, תראה תוצאות.
          </p>
          <p className="text-lg text-gray-700">המערכת שלנו מבטיחה:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
            <p className="text-gray-700 font-medium">התאמה מושלמת לפורמט האמיתי</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
            <p className="text-gray-700 font-medium">מאגר שאלות שמתעדכן כל הזמן</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
            <p className="text-gray-700 font-medium">מעקב אחר כל תרגול</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
            <p className="text-gray-700 font-medium">מענה מהיר לכל שאלה</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPromise;
